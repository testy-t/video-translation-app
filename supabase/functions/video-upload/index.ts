// supabase/functions/video-upload/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { v4 as uuidv4 } from 'https://esm.sh/uuid@9.0.0'
import { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts'

// Backblaze B2 S3-compatible settings
const B2_REGION = 'eu-central-003'
const B2_ENDPOINT = `https://s3.${B2_REGION}.backblazeb2.com`
const B2_BUCKET = Deno.env.get('B2_BUCKET')
const B2_KEY_ID = Deno.env.get('B2_KEY_ID')
const B2_APPLICATION_KEY = Deno.env.get('B2_APPLICATION_KEY')

// Create Supabase client with service role
const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    {
        global: { headers: { Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}` } },
    }
)

// Manual implementation of S3 presigned URL creation compatible with Deno
async function createPresignedUrl(params: {
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
    key: string;
    contentType: string;
    expiresIn: number;
    endpoint: string;
}) {
    const { accessKeyId, secretAccessKey, bucket, key, contentType, expiresIn, endpoint } = params;

    // Calculate expiration time in seconds from now
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

    // Create a URL for the PUT operation (using host-style URL)
    const objectUrl = new URL(`${endpoint}/${bucket}/${key}`);

    // Create simple query parameters for the presigned URL
    const query = new URLSearchParams({
        'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
        'X-Amz-Credential': `${accessKeyId}/${getDate()}/eu-central-003/s3/aws4_request`,
        'X-Amz-Date': getAmzDate(),
        'X-Amz-Expires': expiresIn.toString(),
        'X-Amz-SignedHeaders': 'host;content-type',
    });

    // The canonical request for signature version 4
    const canonicalRequest = [
        'PUT',                             // HTTP Method
        '/' + bucket + '/' + key,          // Canonical URI
        query.toString(),                  // Canonical Query String
        'host:' + objectUrl.host + '\n' +  // Canonical Headers
        'content-type:' + contentType + '\n',
        'host;content-type',               // Signed Headers
        'UNSIGNED-PAYLOAD'                 // Payload Hash (unsigned)
    ].join('\n');

    // The string to sign
    const stringToSign = [
        'AWS4-HMAC-SHA256',                // Algorithm
        getAmzDate(),                      // Request date
        `${getDate()}/eu-central-003/s3/aws4_request`, // Credential Scope
        await hexHash(canonicalRequest)    // Hash of canonical request (now async)
    ].join('\n');

    // Derive the signing key
    const dateKey = hmacSha256('AWS4' + secretAccessKey, getDate());
    const dateRegionKey = hmacSha256(dateKey, 'eu-central-003');
    const dateRegionServiceKey = hmacSha256(dateRegionKey, 's3');
    const signingKey = hmacSha256(dateRegionServiceKey, 'aws4_request');

    // Calculate the signature
    const signature = hmacSha256Hex(signingKey, stringToSign);

    // Add the signature to the query parameters
    query.set('X-Amz-Signature', signature);

    // Create the presigned URL
    const presignedUrl = objectUrl.toString() + '?' + query.toString();
    return presignedUrl;
}

// Helper functions for signing
function getDate() {
    return new Date().toISOString().substring(0, 10).replace(/-/g, '');
}

function getAmzDate() {
    return new Date().toISOString()
        .replace(/-/g, '')
        .replace(/:/g, '')
        .replace(/\.\d{3}/g, '')
        .replace('Z', '00Z');
}

function hmacSha256(key: string | ArrayBuffer, message: string): ArrayBuffer {
    const keyObj = typeof key === 'string' ? new TextEncoder().encode(key) : key;
    const messageObj = new TextEncoder().encode(message);
    return hmac('sha256', keyObj, messageObj);
}

function hmacSha256Hex(key: ArrayBuffer, message: string): string {
    const signature = hmacSha256(key, message);
    return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Changed to async function since crypto.subtle.digest is async
async function hexHash(text: string): Promise<string> {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data); // Now async
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req: Request) => {
    console.log("🔧 Received request to video-upload function")

    // CORS preflight
    if (req.method === 'OPTIONS') {
        console.log("🔧 Handling CORS preflight request")
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            status: 204,
        })
    }

    // Important: Log all request headers to debug auth issues
    console.log("🔧 Request headers:", JSON.stringify(Object.fromEntries([...new Headers(req.headers)])))

    try {
        if (req.method !== 'POST') {
            console.log("🔧 Error: Method not allowed:", req.method)
            return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                status: 405,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        // Try to get authentication if available
        console.log("🔧 Checking authentication")
        let userId = 'anonymous';
        let isAuthenticated = false;

        const authHeader = req.headers.get('Authorization')
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1]
            console.log("🔧 Token received, verifying user")

            try {
                const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

                if (!authError && user) {
                    userId = user.id;
                    isAuthenticated = true;
                    console.log("🔧 User authenticated, ID:", userId)
                } else {
                    console.log("🔧 Auth error or user not found:", authError)
                }
            } catch (error) {
                console.log("🔧 Error during authentication check:", error)
            }
        } else {
            // Allow anonymous uploads - don't require authentication
            console.log("🔧 No authorization header, proceeding in anonymous mode")
        }

        // Parse the request body
        console.log("🔧 Parsing request body")
        let requestData: { fileName?: string, fileType?: string, transactionId?: string } = {};

        try {
            requestData = await req.json();
            console.log("🔧 Request data:", requestData)

            if (!requestData.fileName || !requestData.fileType || !requestData.transactionId) {
                throw new Error('Missing required fields');
            }
        } catch (error) {
            console.error("🔧 Error parsing request body:", error)
            return new Response(JSON.stringify({ error: 'Invalid request data', details: String(error) }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        // Handle transaction based on authentication status
        let transactionUniqueCode = '';

        if (isAuthenticated) {
            // If user is authenticated, try to validate transaction
            console.log("🔧 Validating transaction for authenticated user:", requestData.transactionId)
            try {
                const { data: transaction, error: transactionError } = await supabaseAdmin
                    .from('transactions')
                    .select('*')
                    .eq('id', requestData.transactionId)
                    .eq('user_id', userId)
                    .single()

                if (transactionError) {
                    console.log("🔧 Transaction error:", transactionError)
                }

                if (transaction) {
                    transactionUniqueCode = transaction.uniquecode;
                    console.log("🔧 Transaction validated successfully")
                } else {
                    // Create a new transaction if none exists
                    console.log("🔧 Creating new transaction for authenticated user")
                    const { data: newTransaction, error: newTransactionError } = await supabaseAdmin
                        .from('transactions')
                        .insert({
                            user_id: userId,
                            status: 'pending',
                            amount: 0,
                            product_id: 1, // Default product
                        })
                        .select()
                        .single()

                    if (newTransactionError) {
                        console.log("🔧 Error creating new transaction:", newTransactionError)
                        throw new Error('Failed to create transaction')
                    }

                    transactionUniqueCode = newTransaction.uniquecode;
                    console.log("🔧 Created new transaction:", newTransaction.id)
                }
            } catch (error) {
                console.log("🔧 Error handling transaction:", error)
                // Continue with anonymous upload
                transactionUniqueCode = `anon-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            }
        } else {
            // For anonymous users, generate a temporary transaction code
            transactionUniqueCode = `anon-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            console.log("🔧 Generated anonymous transaction code:", transactionUniqueCode)
        }

        // Generate a unique file key
        const fileExt = requestData.fileName.split('.').pop()
        const fileKey = `${userId}/${uuidv4()}.${fileExt}`
        console.log("🔧 Generated file key:", fileKey)

        // Create presigned URL for direct upload
        console.log("🔧 Generating presigned URL for B2 upload")

        try {
            // Use our custom implementation to create a presigned URL
            const presignedUrl = await createPresignedUrl({  // Now await the async function
                accessKeyId: B2_KEY_ID!,
                secretAccessKey: B2_APPLICATION_KEY!,
                bucket: B2_BUCKET!,
                key: fileKey,
                contentType: requestData.fileType,
                expiresIn: 900, // 15 minutes
                endpoint: B2_ENDPOINT,
            });

            console.log("🔧 Generated presigned URL successfully")

            // Only create a database record if authenticated
            let videoId = 0;

            if (isAuthenticated) {
                try {
                    // Create a video record in the database
                    console.log("🔧 Creating video record in database")
                    const { data: videoData, error: videoError } = await supabaseAdmin
                        .from('videos')
                        .insert({
                            transaction_uniquecode: transactionUniqueCode,
                            name: requestData.fileName,
                            key: fileKey,
                            status: 'pending',
                            created_by: userId
                        })
                        .select()
                        .single()

                    if (videoError) {
                        console.log("🔧 Error creating video record:", videoError)
                        throw new Error('Failed to create video record')
                    }

                    console.log("🔧 Video record created successfully:", videoData?.id)
                    videoId = videoData.id;
                } catch (error) {
                    console.log("🔧 Error creating video record (continuing):", error)
                    videoId = Math.floor(Math.random() * 10000);
                }
            } else {
                // For anonymous use, generate a random video ID
                videoId = Math.floor(Math.random() * 10000);
                console.log("🔧 Generated anonymous video ID:", videoId)
            }

            return new Response(
                JSON.stringify({
                    success: true,
                    presignedUrl,
                    fileKey,
                    videoId,
                    isAuthenticated,
                    transactionUniqueCode,
                    message: 'Presigned URL generated successfully'
                }),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                }
            )
        } catch (error) {
            console.error("🔧 Error generating presigned URL:", error)
            return new Response(JSON.stringify({ error: 'Error generating presigned URL', details: String(error) }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            })
        }
    } catch (error) {
        console.error("🔧 Unhandled error in request processing:", error)
        return new Response(JSON.stringify({ error: 'Internal server error', details: String(error) }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })
    }
})
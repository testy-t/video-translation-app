// supabase/functions/video-upload/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { v4 as uuidv4 } from 'https://esm.sh/uuid@9.0.0'

// Import S3 client that supports presigned URLs
import { S3Client, PutObjectCommand } from "https://esm.sh/@aws-sdk/client-s3@3.477.0";
import { getSignedUrl } from "https://esm.sh/@aws-sdk/s3-request-presigner@3.477.0";

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

// Create S3 client for B2
const s3Client = new S3Client({
    region: B2_REGION,
    endpoint: B2_ENDPOINT,
    credentials: {
        accessKeyId: B2_KEY_ID!,
        secretAccessKey: B2_APPLICATION_KEY!
    },
    forcePathStyle: true // Important for B2 compatibility
});

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
            // Create a command to put an object
            const command = new PutObjectCommand({
                Bucket: B2_BUCKET!,
                Key: fileKey,
                ContentType: requestData.fileType,
            });

            // Generate a presigned URL (valid for 15 minutes)
            const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
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
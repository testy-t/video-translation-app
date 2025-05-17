// supabase/functions/update-video-language/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Создаем supabase клиент с сервисной ролью
const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    {
        global: { headers: { Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}` } },
    }
)

interface VideoLanguageUpdateRequest {
    videoId: number;
    language: {
        id: number;
        iso_code: string;
        original_name: string;
        ru_name: string;
    };
}

serve(async (req: Request) => {
    console.log("🔄 Received request to update-video-language function");

    // CORS preflight
    if (req.method === 'OPTIONS') {
        console.log("🔄 Handling CORS preflight request");
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            status: 204,
        });
    }

    try {
        if (req.method !== 'POST') {
            console.log("🔄 Error: Method not allowed:", req.method);
            return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                status: 405,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Проверяем аутентификацию
        const authHeader = req.headers.get('Authorization');
        let userId = null;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

            if (!authError && user) {
                userId = user.id;
                console.log("🔄 Authenticated user:", userId);
            } else {
                console.log("🔄 Auth error or no user found:", authError);
            }
        } else {
            console.log("🔄 No valid authorization header found");
        }

        // Parse the request body
        console.log("🔄 Parsing request body");
        let updateData: VideoLanguageUpdateRequest;

        try {
            updateData = await req.json();
            console.log("🔄 Update language data:", updateData);

            if (!updateData.videoId || !updateData.language) {
                throw new Error('Missing required fields: videoId or language');
            }
        } catch (error) {
            console.error("🔄 Error parsing request body:", error);
            return new Response(JSON.stringify({ error: 'Invalid request data', details: String(error) }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Получаем видео для обновления
        const { data: videoRecord, error: videoError } = await supabaseAdmin
            .from('videos')
            .select('*')
            .eq('id', updateData.videoId)
            .single();

        if (videoError || !videoRecord) {
            console.error("🔄 Error fetching video record:", videoError);
            return new Response(JSON.stringify({ error: 'Video not found', details: videoError }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        console.log("🔄 Found video record:", videoRecord.id);

        // Если пользователь авторизован, проверяем доступ
        if (userId) {
            // Получаем связанную транзакцию, если есть
            if (videoRecord.transaction_uniquecode && !videoRecord.transaction_uniquecode.startsWith('temp_')) {
                const { data: transactionRecord, error: transactionError } = await supabaseAdmin
                    .from('transactions')
                    .select('user_id')
                    .eq('uniquecode', videoRecord.transaction_uniquecode)
                    .single();

                if (!transactionError && transactionRecord && transactionRecord.user_id !== userId) {
                    console.error("🔄 Access denied: video belongs to another user");
                    return new Response(JSON.stringify({ error: 'Access denied: video belongs to another user' }), {
                        status: 403,
                        headers: { 'Content-Type': 'application/json' },
                    });
                }
            }
        }

        // Обновляем язык видео
        console.log("🔄 Updating video language to:", updateData.language.iso_code);
        const { error: updateError } = await supabaseAdmin
            .from('videos')
            .update({
                output_language: updateData.language.iso_code
                // Удаляем поле language_id, так как оно отсутствует в таблице videos
            })
            .eq('id', updateData.videoId);

        if (updateError) {
            console.error("🔄 Error updating video language:", updateError);
            return new Response(JSON.stringify({ error: 'Failed to update video language', details: updateError }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        console.log("🔄 Video language updated successfully");

        // Успешный ответ
        return new Response(
            JSON.stringify({
                success: true,
                videoId: updateData.videoId,
                language: updateData.language,
                message: 'Video language updated successfully'
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    } catch (error) {
        console.error("🔄 Unhandled error in request processing:", error);
        return new Response(JSON.stringify({ error: 'Internal server error', details: String(error) }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
});
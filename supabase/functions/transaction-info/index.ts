import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Supabase клиент
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

serve(async (req: Request) => {
    // Поддержка CORS для предварительных запросов
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            status: 204,
        });
    }

    // Обработка только GET запросов
    if (req.method !== 'GET') {
        return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            {
                status: 405,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            }
        );
    }

    try {
        // Получаем uniquecode из URL
        const url = new URL(req.url);
        const uniquecode = url.searchParams.get('uniquecode');

        // Проверяем наличие uniquecode
        if (!uniquecode) {
            return new Response(
                JSON.stringify({ error: 'Missing uniquecode parameter' }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            );
        }

        // Запрашиваем данные о транзакции из БД с видео
        const { data: transaction, error: transactionError } = await supabaseClient
            .from('transactions')
            .select('id, uniquecode, is_paid, is_activated, status, video_id')
            .eq('uniquecode', uniquecode)
            .single();

        // Проверяем, была ли найдена транзакция
        if (transactionError) {
            return new Response(
                JSON.stringify({
                    error: 'Transaction not found',
                    uniquecode: uniquecode
                }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            );
        }

        // Инициализируем объект ответа с данными о транзакции
        const response = {
            is_paid: transaction.is_paid === true,
            is_activated: transaction.is_activated === true,
            status: transaction.status,
            video: null
        };

        // Проверяем наличие video_id
        if (transaction.video_id) {
            // Получаем данные о связанном видео по video_id
            const { data: video, error: videoError } = await supabaseClient
                .from('videos')
                .select('id, original_url, translated_url, output_language, heygen_job_id, status')
                .eq('id', transaction.video_id)
                .single();

            // Добавляем данные о видео в ответ, если оно найдено
            if (video && !videoError) {
                response.video = {
                    id: video.id,
                    input_url: video.original_url,
                    output_url: video.translated_url,
                    status: video.status,
                    heygen_job_id: video.heygen_job_id,
                    output_language: video.output_language
                };
            }
        }

        // Возвращаем информацию
        return new Response(
            JSON.stringify(response),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            }
        );
    } catch (error) {
        console.error('Unexpected error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error', details: String(error) }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            }
        );
    }
});
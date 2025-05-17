import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Supabase клиент
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// HeyGen API ключ
const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY') || '';

serve(async (req: Request) => {
    // Поддержка CORS для предварительных запросов
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            status: 204,
        });
    }

    // Обработка только POST запросов
    if (req.method !== 'POST') {
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
        // Получаем параметры из тела запроса
        const { uniquecode } = await req.json();

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

        // Логи для отладки
        console.log(`Starting translation process for uniquecode: ${uniquecode}`);

        // Проверяем статус оплаты транзакции
        const { data: transaction, error: transactionError } = await supabaseClient
            .from('transactions')
            .select('id, uniquecode, is_paid, is_activated')
            .eq('uniquecode', uniquecode)
            .single();

        if (transactionError || !transaction) {
            console.error('Transaction not found:', uniquecode);
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

        // Проверяем, что транзакция оплачена
        if (!transaction.is_paid) {
            return new Response(
                JSON.stringify({
                    error: 'Payment required',
                    uniquecode: uniquecode,
                    message: 'Transaction is not paid'
                }),
                {
                    status: 402,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            );
        }

        // Получаем данные о видео
        const { data: video, error: videoError } = await supabaseClient
            .from('videos')
            .select('id, original_url, output_language, heygen_job_id, status')
            .eq('transaction_uniquecode', uniquecode)
            .single();

        if (videoError || !video) {
            console.error('Video not found for transaction:', uniquecode);
            return new Response(
                JSON.stringify({
                    error: 'Video not found',
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

        // Проверяем, что перевод еще не запущен
        if (video.heygen_job_id) {
            return new Response(
                JSON.stringify({
                    error: 'Translation already started',
                    uniquecode: uniquecode,
                    heygen_job_id: video.heygen_job_id,
                    status: video.status
                }),
                {
                    status: 409,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            );
        }

        // Получаем данные о языке
        const { data: language, error: languageError } = await supabaseClient
            .from('languages')
            .select('id, original_name, ru_name, iso_code')
            .eq('iso_code', video.output_language)
            .single();

        if (languageError || !language) {
            console.error('Language not found:', video.output_language);
            return new Response(
                JSON.stringify({
                    error: 'Language not found',
                    iso_code: video.output_language
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

        console.log(`Calling HeyGen API to translate video to ${language.original_name}`);

        // Вызываем API HeyGen для перевода видео
        const heygenResponse = await fetch('https://api.heygen.com/v2/video_translate', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'x-api-key': HEYGEN_API_KEY
            },
            body: JSON.stringify({
                video_url: video.original_url,
                output_language: language.original_name,
                translate_audio_only: false
            })
        });

        // Проверяем ответ от HeyGen
        if (!heygenResponse.ok) {
            const errorData = await heygenResponse.text();
            console.error('HeyGen API error:', errorData);
            return new Response(
                JSON.stringify({
                    error: 'HeyGen API error',
                    details: errorData
                }),
                {
                    status: 502,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            );
        }

        // Обрабатываем успешный ответ
        const heygenData = await heygenResponse.json();

        if (heygenData.error) {
            console.error('HeyGen API returned error:', heygenData.error);
            return new Response(
                JSON.stringify({
                    error: 'HeyGen API returned error',
                    details: heygenData.error
                }),
                {
                    status: 502,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            );
        }

        const videoTranslateId = heygenData.data?.video_translate_id;

        if (!videoTranslateId) {
            console.error('HeyGen API did not return video_translate_id:', heygenData);
            return new Response(
                JSON.stringify({
                    error: 'HeyGen API did not return video_translate_id',
                    response: heygenData
                }),
                {
                    status: 502,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            );
        }

        console.log(`Received video_translate_id: ${videoTranslateId}`);

        // Обновляем запись о видео
        const { error: updateError } = await supabaseClient
            .from('videos')
            .update({
                heygen_job_id: videoTranslateId,
                status: 'processing',
                updated_at: new Date().toISOString()
            })
            .eq('id', video.id);

        if (updateError) {
            console.error('Error updating video record:', updateError);
            return new Response(
                JSON.stringify({
                    error: 'Error updating video record',
                    details: updateError,
                    videoTranslateId: videoTranslateId
                }),
                {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            );
        }

        // Обновляем транзакцию, отмечая ее как активированную
        if (!transaction.is_activated) {
            await supabaseClient
                .from('transactions')
                .update({
                    is_activated: true
                })
                .eq('id', transaction.id);
        }

        // Добавляем запись в логи
        await supabaseClient
            .from('payment_logs')
            .insert({
                transaction_id: transaction.id,
                event_type: 'heygen_translation_started',
                data: {
                    uniquecode,
                    video_id: video.id,
                    heygen_job_id: videoTranslateId,
                    output_language: language.original_name,
                    heygen_response: heygenData
                }
            });

        // Возвращаем успешный ответ
        return new Response(
            JSON.stringify({
                success: true,
                uniquecode: uniquecode,
                video_id: video.id,
                heygen_job_id: videoTranslateId,
                status: 'processing',
                output_language: language.original_name
            }),
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
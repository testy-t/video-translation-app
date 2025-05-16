// supabase/functions/video-info/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// Import a direct S3-compatible client for Deno instead of the AWS SDK
// This is a much simpler client with fewer dependencies
import { S3Bucket } from "https://deno.land/x/s3@0.5.0/mod.ts";

// Backblaze B2 S3-совместимые настройки
const B2_REGION = 'eu-central-003' // Используйте свой регион из эндпоинта
const B2_ENDPOINT = `https://s3.${B2_REGION}.backblazeb2.com`
const B2_BUCKET = Deno.env.get('B2_BUCKET')
const B2_KEY_ID = Deno.env.get('B2_KEY_ID') // application_key_id
const B2_APPLICATION_KEY = Deno.env.get('B2_APPLICATION_KEY') // application_key

// Создаем supabase клиент с сервисной ролью
const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    {
        global: { headers: { Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}` } },
    }
)

// Create a simpler S3 bucket client for Deno environment
// This client is specifically designed for Deno and avoids Node.js compatibility issues
const s3Bucket = new S3Bucket({
    bucket: B2_BUCKET!,
    accessKeyID: B2_KEY_ID!,
    secretKey: B2_APPLICATION_KEY!,
    region: B2_REGION,
    endpoint: B2_ENDPOINT,
});

interface RequestBody {
    videoId: number;
    fileKey: string;
    outputLanguage: string;
}

// Функция для анализа длительности видео
// Обратите внимание: в реальном использовании потребуется библиотека
// для распознавания метаданных видео, например ffprobe
async function getVideoDuration(fileBuffer: ArrayBuffer): Promise<number> {
    // Здесь будет код для анализа метаданных видео
    // Это упрощенная демо-версия

    // В реальной функции вы бы использовали что-то вроде:
    // const process = Deno.run({
    //   cmd: ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", "pipe:0"],
    //   stdin: "piped",
    //   stdout: "piped"
    // });
    // await process.stdin.write(new Uint8Array(fileBuffer));
    // await process.stdin.close();
    // const output = await process.output();
    // return parseFloat(new TextDecoder().decode(output));

    // Возвращаем тестовое значение для демонстрации
    return 120; // 2 минуты, в реальной функции здесь будет реальная длительность
}

serve(async (req: Request) => {
    // CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            status: 204,
        })
    }

    try {
        if (req.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                status: 405,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        // Проверяем аутентификацию
        const authHeader = req.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        const token = authHeader.split(' ')[1]
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        // Получаем данные из запроса
        const requestData: RequestBody = await req.json()
        const { videoId, fileKey, outputLanguage } = requestData

        if (!videoId || !fileKey || !outputLanguage) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        // Получаем информацию о видео из базы данных
        const { data: videoRecord, error: videoError } = await supabaseAdmin
            .from('videos')
            .select('*, transactions!inner(user_id, product_id, products!inner(duration_seconds, price, is_trial))')
            .eq('id', videoId)
            .single()

        if (videoError || !videoRecord) {
            return new Response(JSON.stringify({ error: 'Video not found', details: videoError }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        // Проверяем доступ пользователя
        if (videoRecord.transactions.user_id !== user.id) {
            return new Response(JSON.stringify({ error: 'Access denied' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        // Получаем файл из хранилища для анализа метаданных
        const getObjectParams = {
            Bucket: B2_BUCKET!,
            Key: fileKey,
        }

        try {
            // Use the Deno-native S3 client instead
            const fileContent = await s3Bucket.getObject(fileKey);
            
            if (!fileContent) {
                return new Response(JSON.stringify({ error: 'File not found in storage' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                })
            }
            
            // Convert to ArrayBuffer if needed
            const fileBuffer = fileContent.arrayBuffer ? 
                await fileContent.arrayBuffer() : 
                fileContent instanceof Uint8Array ? 
                    fileContent.buffer : 
                    new Uint8Array(fileContent).buffer;

            // Анализируем длительность видео
            const duration = await getVideoDuration(fileBuffer)

            // Проверяем, соответствует ли длительность выбранному тарифу
            const allowedDuration = videoRecord.transactions.products.duration_seconds

            if (duration > allowedDuration && videoRecord.transactions.products.is_trial) {
                // Для пробного тарифа проверяем строгое соответствие
                return new Response(JSON.stringify({
                    error: 'Video duration exceeds allowed limit for trial tariff',
                    allowedDuration,
                    actualDuration: duration
                }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                })
            }

            // Для стандартного тарифа просто обновляем длительность и язык
            const { error: updateError } = await supabaseAdmin
                .from('videos')
                .update({
                    status: 'uploaded',
                    duration,
                    output_language: outputLanguage
                })
                .eq('id', videoId)

            if (updateError) {
                return new Response(JSON.stringify({ error: 'Failed to update video info', details: updateError }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                })
            }

            // Рассчитываем полную стоимость для стандартного тарифа
            let finalAmount = videoRecord.transactions.products.price

            if (!videoRecord.transactions.products.is_trial) {
                // Для стандартного тарифа считаем по минутам
                const pricePerMinute = videoRecord.transactions.products.price
                const minutes = Math.ceil(duration / 60)
                finalAmount = pricePerMinute * minutes
            }

            // Обновляем сумму транзакции, если нужно
            if (finalAmount !== videoRecord.transactions.amount) {
                await supabaseAdmin
                    .from('transactions')
                    .update({ amount: finalAmount })
                    .eq('uniquecode', videoRecord.transaction_uniquecode)
            }

            return new Response(
                JSON.stringify({
                    success: true,
                    videoId,
                    duration,
                    outputLanguage,
                    finalAmount
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
            console.error('Error accessing file in B2:', error)
            return new Response(JSON.stringify({ error: 'Error accessing file in B2', details: String(error) }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            })
        }
    } catch (error) {
        console.error('Error processing request:', error)
        return new Response(JSON.stringify({ error: 'Internal server error', details: String(error) }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })
    }
})
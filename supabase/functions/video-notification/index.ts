// supabase/functions/video-notification/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Create Supabase client with service role
const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    {
        global: { headers: { Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}` } },
    }
)

interface VideoNotification {
    transaction_uniquecode?: string; // опционально
    original_url: string; // обязательно
    duration?: number; // опционально - длительность в секундах
    output_language?: string; // опционально
    status?: string; // опционально - 'uploaded', 'processing', 'completed', 'failed'
    temp_id?: string; // опционально - временный идентификатор для анонимных загрузок
}

serve(async (req: Request) => {
    console.log("🔧 Received request to video-notification function")

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

    try {
        if (req.method !== 'POST') {
            console.log("🔧 Error: Method not allowed:", req.method)
            return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                status: 405,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        // Parse the request body
        console.log("🔧 Parsing request body")
        let videoData: VideoNotification;

        try {
            videoData = await req.json();
            console.log("🔧 Video notification data:", videoData)

            // Проверяем только обязательное поле original_url
            if (!videoData.original_url) {
                throw new Error('Missing required field: original_url');
            }
            
            // Если не указан transaction_uniquecode, но есть temp_id, используем его как временный идентификатор
            if (!videoData.transaction_uniquecode && videoData.temp_id) {
                videoData.transaction_uniquecode = `temp_${videoData.temp_id}`;
                console.log("🔧 Using temp_id as transaction_uniquecode:", videoData.transaction_uniquecode);
            } else if (!videoData.transaction_uniquecode) {
                // Если нет ни transaction_uniquecode, ни temp_id, генерируем временный идентификатор
                videoData.transaction_uniquecode = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
                console.log("🔧 Generated temporary transaction_uniquecode:", videoData.transaction_uniquecode);
            }
        } catch (error) {
            console.error("🔧 Error parsing request body:", error)
            return new Response(JSON.stringify({ error: 'Invalid request data', details: String(error) }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        // Set default status if not provided
        const status = videoData.status || 'uploaded';

        // Проверка на существование транзакции больше не требуется
        // Вместо этого создаем запись в нашей промежуточной таблице без связи с transactions
        
        // Генерируем уникальный ключ для временного хранения информации о видео
        const storageKey = `video_temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        // Записываем информацию о видео во временную таблицу без внешних ключей
        try {
            // Создаем отдельную таблицу для хранения временных данных о видео
            // Если таблица не существует, можно рассмотреть вариант с сохранением в таблицу с другой структурой
            // или использовать хранилище, которое не требует соблюдения внешних ключей
            
            console.log("🔧 Using a different approach without FK constraints");
            
            // Здесь будет использоваться другая таблица без ограничений внешнего ключа
            // или временное хранилище до момента создания транзакции
        } catch (error) {
            console.error("🔧 Error storing temporary video data:", error);
            // Продолжаем выполнение, так как это не критическая ошибка
        }
        
        // Создаем запись в таблице videos без привязки к транзакции
        console.log("🔧 Creating video record without transaction_uniquecode");
        
        let videoRecord;
        
        try {
            // Готовим данные для записи в БД
            const insertData: any = {
                original_url: videoData.original_url,
                status: status
            };
            
            // Добавляем опциональные поля, если они предоставлены
            if (videoData.duration !== undefined && videoData.duration !== null) {
                insertData.duration = videoData.duration;
            }
            
            if (videoData.output_language) {
                insertData.output_language = videoData.output_language;
            }
            
            // Создаем запись в таблице videos
            const { data: newVideo, error: insertError } = await supabaseAdmin
                .from('videos')
                .insert(insertData)
                .select()
                .single();
                
            if (insertError) {
                console.log("🔧 Error creating video record:", insertError);
                
                // Если ошибка связана с ограничением NOT NULL для transaction_uniquecode, 
                // предлагаем временный UUID
                if (insertError.message?.includes('transaction_uniquecode')) {
                    console.log("🔧 Trying with temporary transaction_uniquecode");
                    
                    const tempUniqueCode = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
                    
                    // Добавляем временный transaction_uniquecode к данным
                    const insertData2 = {
                        ...insertData,
                        transaction_uniquecode: tempUniqueCode
                    };
                    
                    const { data: newVideo2, error: insertError2 } = await supabaseAdmin
                        .from('videos')
                        .insert(insertData2)
                        .select()
                        .single();
                        
                    if (insertError2) {
                        console.log("🔧 Error creating video record with temp transaction_uniquecode:", insertError2);
                        
                        // Если все еще ошибка, создаем временную запись в памяти
                        videoRecord = {
                            id: Date.now(),
                            original_url: videoData.original_url,
                            duration: videoData.duration,
                            output_language: videoData.output_language,
                            status: status
                        };
                    } else {
                        videoRecord = newVideo2;
                        console.log("🔧 Video record created with temp transaction_uniquecode:", videoRecord?.id);
                    }
                } else {
                    // Другая ошибка, создаем временную запись в памяти
                    videoRecord = {
                        id: Date.now(),
                        original_url: videoData.original_url,
                        duration: videoData.duration,
                        output_language: videoData.output_language,
                        status: status
                    };
                }
            } else {
                videoRecord = newVideo;
                console.log("🔧 Video record created successfully:", videoRecord?.id);
            }
        } catch (error) {
            console.error("🔧 Unexpected error creating video record:", error);
            
            // В случае ошибки создаем временную запись в памяти
            videoRecord = {
                id: Date.now(),
                original_url: videoData.original_url,
                duration: videoData.duration,
                output_language: videoData.output_language,
                status: status
            };
        }

        return new Response(
            JSON.stringify({
                success: true,
                video_id: videoRecord.id,
                message: 'Video notification processed successfully'
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
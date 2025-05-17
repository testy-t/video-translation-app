// supabase/functions/create-transaction/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { v4 as uuidv4 } from 'https://esm.sh/uuid@9.0.0'

// Supabase клиент
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

serve(async (req: Request) => {
    // CORS для предварительных запросов
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
        const {
            user_email,
            product_id,
            video_id,
            instrument_id
        } = await req.json();

        // Проверка обязательных параметров
        if (!user_email || !product_id || !video_id) {
            return new Response(
                JSON.stringify({ error: 'Missing required parameters' }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            );
        }

        // Проверяем существование пользователя или создаем нового
        let user_id;
        const { data: existingUser, error: userError } = await supabaseClient
            .from('users')
            .select('id')
            .eq('email', user_email)
            .single();

        if (userError) {
            // Пользователь не найден, создаем нового
            const { data: newUser, error: createUserError } = await supabaseClient
                .from('users')
                .insert({ email: user_email })
                .select('id')
                .single();

            if (createUserError) {
                return new Response(
                    JSON.stringify({ error: 'Failed to create user' }),
                    {
                        status: 500,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                        }
                    }
                );
            }

            user_id = newUser.id;
        } else {
            user_id = existingUser.id;
        }

        // Получаем данные о продукте
        const { data: product, error: productError } = await supabaseClient
            .from('products')
            .select('id, price')
            .eq('id', product_id)
            .single();

        if (productError || !product) {
            return new Response(
                JSON.stringify({ error: 'Product not found' }),
                {
                    status: 404,
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
            .select('id, duration')
            .eq('id', video_id)
            .single();

        if (videoError || !video) {
            return new Response(
                JSON.stringify({ error: 'Video not found' }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            );
        }

        // Рассчитываем сумму платежа
        // Округляем длительность видео вверх до целых минут
        const durationInSeconds = video.duration || 0;
        const durationInMinutes = Math.ceil(durationInSeconds / 60);

        // Если видео меньше или равно 1 минуте, считаем как 1 минуту
        const minutesToCharge = Math.max(1, durationInMinutes);

        // Рассчитываем сумму к оплате
        const amount = minutesToCharge * product.price;

        // Генерируем уникальный код для транзакции
        const uniquecode = uuidv4();

        // Создаем новую транзакцию
        const { data: transaction, error: transactionError } = await supabaseClient
            .from('transactions')
            .insert({
                user_id,
                product_id,
                amount,
                status: 'pending',
                uniquecode,
                // Дополнительные поля
                video_id,
                instrument_id
            })
            .select()
            .single();

        if (transactionError) {
            console.error('Error creating transaction:', transactionError);
            return new Response(
                JSON.stringify({ error: 'Failed to create transaction' }),
                {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            );
        }

        // Логируем создание транзакции
        await supabaseClient
            .from('payment_logs')
            .insert({
                transaction_id: transaction.id,
                event_type: 'transaction_created',
                data: {
                    user_id,
                    user_email,
                    product_id,
                    video_id,
                    instrument_id,
                    amount,
                    uniquecode,
                    duration_minutes: minutesToCharge
                },
                ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
            });

        // Возвращаем данные о транзакции
        return new Response(
            JSON.stringify({
                success: true,
                transaction_id: transaction.id,
                uniquecode,
                amount,
                duration_minutes: minutesToCharge
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
            JSON.stringify({ error: 'Internal server error' }),
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
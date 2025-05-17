// supabase/functions/initiate-payment/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import md5 from 'https://esm.sh/md5@2.3.0'

// Supabase клиент
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// FreeKassa конфигурация
const MERCHANT_ID = Deno.env.get('FREEKASSA_MERCHANT_ID') || '';
const SECRET_KEY_1 = Deno.env.get('FREEKASSA_SECRET_KEY_1') || '';
const APP_URL = Deno.env.get('APP_URL') || 'https://golosok.app';

// Доступные платежные методы
const PAYMENT_METHODS = {
    36: "CARD",    // Visa/MasterCard/МИР
    35: "QIWI",    // QIWI
    44: "SBP",     // СБП
};

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
        // Получаем uniquecode из тела запроса
        const { uniquecode } = await req.json();

        // Проверка обязательного параметра
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

        // Получаем данные о транзакции
        const { data: transaction, error: transactionError } = await supabaseClient
            .from('transactions')
            .select(`
        id, 
        uniquecode, 
        user_id, 
        product_id, 
        amount, 
        status,
        video_id,
        instrument_id,
        users (
          id,
          email
        )
      `)
            .eq('uniquecode', uniquecode)
            .single();

        if (transactionError || !transaction) {
            return new Response(
                JSON.stringify({ error: 'Transaction not found' }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            );
        }

        // Проверяем, что транзакция в статусе pending
        if (transaction.status !== 'pending') {
            return new Response(
                JSON.stringify({
                    error: 'Transaction is not in pending status',
                    status: transaction.status
                }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            );
        }

        // Формируем подпись для FreeKassa
        // md5(merchant_id:amount:secret_word_1:currency:uniquecode)
        const signString = `${MERCHANT_ID}:${transaction.amount}:${SECRET_KEY_1}:RUB:${uniquecode}`;
        const sign = md5(signString);

        // Формируем URL для оплаты
        const paymentUrl = new URL('https://pay.fk.money/');
        paymentUrl.searchParams.append('m', MERCHANT_ID);
        paymentUrl.searchParams.append('oa', transaction.amount.toString());
        paymentUrl.searchParams.append('o', uniquecode);
        paymentUrl.searchParams.append('s', sign);
        paymentUrl.searchParams.append('currency', 'RUB');
        paymentUrl.searchParams.append('email', transaction.users.email);

        // Если указан метод оплаты, добавляем его в URL
        if (transaction.instrument_id) {
            paymentUrl.searchParams.append('i', transaction.instrument_id.toString());
        }

        // Добавляем параметр для скрытия логотипа FreeKassa
        paymentUrl.searchParams.append('cn', 'KASSA');

        // Опционально - добавляем пользовательские поля
        paymentUrl.searchParams.append('us_user_id', transaction.user_id.toString());
        paymentUrl.searchParams.append('us_product_id', transaction.product_id.toString());
        paymentUrl.searchParams.append('us_video_id', transaction.video_id.toString());

        // Логируем событие инициализации платежа
        await supabaseClient
            .from('payment_logs')
            .insert({
                transaction_id: transaction.id,
                event_type: 'payment_initiated',
                data: {
                    uniquecode,
                    amount: transaction.amount,
                    payment_method: PAYMENT_METHODS[transaction.instrument_id] || 'UNKNOWN',
                    payment_url: paymentUrl.toString()
                },
                ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
            });

        // Возвращаем URL для перенаправления и данные о транзакции
        return new Response(
            JSON.stringify({
                success: true,
                payment_url: paymentUrl.toString(),
                transaction_id: transaction.id,
                uniquecode,
                amount: transaction.amount
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
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { v4 as uuidv4 } from 'https://esm.sh/uuid@9.0.0'

// Supabase клиент
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// CloudPayments конфигурация
const CP_PUBLIC_ID = Deno.env.get('CP_PUBLIC_ID') || '';

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
            uniquecode, // Уникальный код транзакции
            redirect_url // URL для возврата после оплаты (опционально)
        } = await req.json();

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

        // Логируем полученный uniquecode для отладки
        console.log("Searching for transaction with uniquecode:", uniquecode);

        // Сначала получаем основную информацию о транзакции
        const { data: transaction, error: transactionError } = await supabaseClient
            .from('transactions')
            .select(`
        id, 
        uniquecode, 
        user_id, 
        product_id, 
        amount, 
        status,
        video_id
      `)
            .eq('uniquecode', uniquecode)
            .single();

        if (transactionError || !transaction) {
            return new Response(
                JSON.stringify({
                    error: 'Transaction not found',
                    uniquecode: uniquecode,
                    details: transactionError ? transactionError.message : 'No transaction with this uniquecode'
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

        // Теперь получаем информацию о пользователе
        const { data: user } = await supabaseClient
            .from('users')
            .select('id, email')
            .eq('id', transaction.user_id)
            .single();

        // И получаем информацию о видео отдельным запросом по video_id
        let videoDuration = "?";
        if (transaction.video_id) {
            const { data: video } = await supabaseClient
                .from('videos')
                .select('duration')
                .eq('id', transaction.video_id)
                .single();

            if (video) {
                videoDuration = Math.ceil(video.duration / 60);
            }
        }

        // Объединяем данные
        const fullTransaction = {
            ...transaction,
            users: user,
            videos: { duration: videoDuration !== "?" ? videoDuration * 60 : null }
        };

        // Проверяем, что транзакция в статусе pending
        if (fullTransaction.status !== 'pending') {
            return new Response(
                JSON.stringify({
                    error: 'Transaction is not in pending status',
                    status: fullTransaction.status
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

        // Формируем список товаров (в данном случае один товар)
        const items = [
            {
                label: `Перевод видео (${videoDuration} мин.)`, // Название товара/услуги
                price: fullTransaction.amount,
                quantity: 1,
            }
        ];

        // Создаем чек
        const receipt = buildReceipt(items);

        // Собираем данные для виджета
        const paymentData = {
            type: "CLOUDPAYMENTS_WIDGET",
            url: null,
            data: {
                publicId: CP_PUBLIC_ID,
                description: `Перевод видео (${videoDuration} мин.)`,
                amount: fullTransaction.amount,
                currency: "RUB",
                email: user.email,
                invoiceId: uniquecode,
                accountId: fullTransaction.user_id.toString(),
                autoClose: 3,
                data: {
                    CloudPayments: { CustomerReceipt: receipt }
                }
            }
        };

        // Если указан redirect_url, добавляем его
        if (redirect_url) {
            paymentData.data.data.successUrl = redirect_url;
        }

        // Логируем событие инициализации платежа
        await supabaseClient
            .from('payment_logs')
            .insert({
                transaction_id: fullTransaction.id,
                event_type: 'payment_initiated',
                data: {
                    uniquecode,
                    amount: fullTransaction.amount,
                    payment_method: 'CloudPayments',
                    payment_data: paymentData
                },
                ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
            });

        // Возвращаем данные для инициализации платежа через виджет CloudPayments
        return new Response(
            JSON.stringify({
                success: true,
                payment_data: paymentData,
                transaction_id: fullTransaction.id,
                uniquecode,
                amount: fullTransaction.amount
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

// Функция для формирования чека
function buildReceipt(items: Array<{ label: string, price: number, quantity: number }>) {
    // Сумма всех позиций
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Преобразуем товары в нужный формат
    const receiptItems = items.map(item => ({
        label: item.label,
        price: Number(item.price.toFixed(2)),
        quantity: Number(item.quantity.toFixed(3)),
        amount: Number((item.price * item.quantity).toFixed(2)),
        vat: 0, // Ставка НДС 0%
        method: 0, // тег-1214 (полная оплата)
        object: 0, // тег-1212 (товар)
        measurementUnit: "шт",
    }));

    return {
        Items: receiptItems,
        calculationPlace: "golosok.app", // или ваш домен
        customerInfo: "",
        isBso: false,
        AgentSign: null,
        amounts: {
            electronic: Number(totalAmount.toFixed(2)),
            advancePayment: 0.00,
            credit: 0.00,
            provision: 0.00,
        },
    };
}
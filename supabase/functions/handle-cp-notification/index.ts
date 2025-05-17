import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { encode as base64Encode } from 'https://deno.land/std@0.168.0/encoding/base64.ts'

// Supabase клиент
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// CloudPayments секретный ключ
const CP_API_PASSWORD = Deno.env.get('CP_API_PASSWORD') || '';
const CP_PUBLIC_ID = Deno.env.get('CP_PUBLIC_ID') || '';

// Функция для проверки HMAC-подписи от CloudPayments
async function checkCpSignature(rawBody: Uint8Array, receivedSignature: string, secretKey: string): Promise<boolean> {
    try {
        // Создаем ключ из secret
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(secretKey),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );

        // Вычисляем HMAC
        const signature = await crypto.subtle.sign('HMAC', key, rawBody);

        // Кодируем в base64
        const signatureEncoded = base64Encode(new Uint8Array(signature));

        // Сравниваем с полученной подписью
        return signatureEncoded === receivedSignature;
    } catch (error) {
        console.error('Error verifying signature:', error);
        return false;
    }
}

// Функция для разбора данных callback от CloudPayments
function parseCpCallback(body: Uint8Array): Record<string, string> {
    // Декодируем body из Uint8Array в строку
    const decoder = new TextDecoder();
    const decodedStr = decoder.decode(body);

    // Разбираем форм-дату (пары key=value, разделенные &)
    const result: Record<string, string> = {};
    const pairs = decodedStr.split('&');

    for (const pair of pairs) {
        const [key, value] = pair.split('=').map(decodeURIComponent);
        result[key] = value;
    }

    return result;
}

// Основная функция-обработчик
serve(async (req: Request) => {
    // Обрабатываем только POST запросы
    if (req.method !== 'POST') {
        return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            {
                status: 405,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }

    try {
        // Получаем необработанные данные запроса
        const rawBody = new Uint8Array(await req.arrayBuffer());

        // Получаем HMAC-подпись из заголовка
        const cpHmac = req.headers.get('Content-HMAC');
        if (!cpHmac) {
            return new Response(
                JSON.stringify({ code: 13, message: 'HMAC not found' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Проверяем подпись
        const isSignatureValid = await checkCpSignature(rawBody, cpHmac, CP_API_PASSWORD);
        if (!isSignatureValid) {
            return new Response(
                JSON.stringify({ code: 13, message: 'Signature mismatch' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Парсим данные из запроса
        const data = parseCpCallback(rawBody);
        console.log("CloudPayments callback data:", data);

        // Извлекаем нужные поля
        const invoiceId = data.InvoiceId;  // Наш uniquecode транзакции
        const transactionIdCp = data.TransactionId;  // ID транзакции в CP
        const status = data.Status;  // Статус: "Authorized", "Completed", ...
        const reason = data.Reason;  // Причина отказа (при неудаче)
        const operationType = data.OperationType;  // Тип операции: Payment, Refund, ...

        // Проверяем наличие InvoiceId
        if (!invoiceId) {
            return new Response(
                JSON.stringify({ code: 10, message: 'No InvoiceId provided' }),
                {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Находим нашу транзакцию в базе
        const { data: transaction, error: transactionError } = await supabaseClient
            .from('transactions')
            .select('*')
            .eq('uniquecode', invoiceId)
            .single();

        if (transactionError || !transaction) {
            console.error('Transaction not found:', invoiceId);
            return new Response(
                JSON.stringify({ code: 10, message: 'Transaction not found' }),
                {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Логируем событие в payment_logs
        await supabaseClient
            .from('payment_logs')
            .insert({
                transaction_id: transaction.id,
                event_type: `cp_callback_${operationType?.toLowerCase() || 'unknown'}`,
                data: data,
                cp_transaction_id: transactionIdCp
            });

        // Обработка разных типов уведомлений

        // 1. Платеж успешно выполнен (Pay)
        if (status === 'Completed') {
            // Обновляем транзакцию
            const { error: updateError } = await supabaseClient
                .from('transactions')
                .update({
                    is_paid: true,
                    cp_transaction_id: transactionIdCp,
                    recurring_token: data.Token || null,
                    status: 'completed'
                })
                .eq('id', transaction.id);

            if (updateError) {
                console.error('Error updating transaction:', updateError);
            }

            // Если транзакция связана с видео, обновляем статус видео
            if (transaction.video_id) {
                await supabaseClient
                    .from('videos')
                    .update({ status: 'pending_translation' })
                    .eq('id', transaction.video_id);
            }

            return new Response(
                JSON.stringify({ code: 0, message: 'Payment done' }),
                {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // 2. Платеж не прошел (Fail)
        if (reason) {
            // Логируем неудачу платежа
            await supabaseClient
                .from('transactions')
                .update({
                    status: 'failed',
                    fail_reason: reason
                })
                .eq('id', transaction.id);

            return new Response(
                JSON.stringify({ code: 0, message: 'Fail notification accepted' }),
                {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // 3. Возврат средств (Refund)
        if (operationType === 'Refund') {
            await supabaseClient
                .from('transactions')
                .update({
                    status: 'refunded'
                })
                .eq('id', transaction.id);

            return new Response(
                JSON.stringify({ code: 0, message: 'Refund noted' }),
                {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Для всех остальных типов уведомлений отвечаем успехом
        return new Response(
            JSON.stringify({ code: 0, message: 'Notification received' }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        console.error('Unexpected error:', error);
        return new Response(
            JSON.stringify({ code: 500, message: 'Internal server error' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
});
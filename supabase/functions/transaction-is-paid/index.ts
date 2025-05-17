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

        // Запрашиваем статус транзакции из БД
        const { data: transaction, error: transactionError } = await supabaseClient
            .from('transactions')
            .select('id, is_paid, status')
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

        // Возвращаем статус платежа
        return new Response(
            JSON.stringify({
                is_paid: transaction.is_paid === true,
                status: transaction.status
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
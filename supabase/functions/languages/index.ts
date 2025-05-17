// supabase/functions/languages/index.ts
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

serve(async (req: Request) => {
    // CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            status: 204,
        })
    }

    try {
        if (req.method === 'GET') {
            // Получение списка языков
            const { data: languages, error } = await supabaseAdmin
                .from('languages')
                .select('*')
                .eq('is_active', true)
                .order('ru_name')

            if (error) {
                return new Response(JSON.stringify({ error: 'Failed to fetch languages', details: error }), {
                    status: 500,
                    headers: { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                })
            }

            return new Response(
                JSON.stringify({
                    success: true,
                    languages
                }),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                }
            )
        } else if (req.method === 'POST') {
            // Проверяем аутентификацию для обновления языков (доступно только администраторам)
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

            // Проверка прав администратора (должна быть логика проверки роли)
            const { data: userRoles, error: rolesError } = await supabaseAdmin
                .from('user_roles')
                .select('role')
                .eq('user_id', user.id)
                .eq('role', 'admin')
                .single()

            if (rolesError || !userRoles) {
                return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' },
                })
            }

            // Получение данных для обновления языка
            const { language } = await req.json()

            if (!language) {
                return new Response(JSON.stringify({ error: 'Missing language data' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                })
            }

            // Обновление или добавление языка
            let result
            if (language.id) {
                // Обновление существующего языка
                const { data, error: updateError } = await supabaseAdmin
                    .from('languages')
                    .update({
                        original_name: language.original_name,
                        ru_name: language.ru_name,
                        iso_code: language.iso_code,
                        flag_emoji: language.flag_emoji,
                        is_active: language.is_active
                    })
                    .eq('id', language.id)
                    .select()
                    .single()

                if (updateError) {
                    return new Response(JSON.stringify({ error: 'Failed to update language', details: updateError }), {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' },
                    })
                }

                result = data
            } else {
                // Добавление нового языка
                const { data, error: insertError } = await supabaseAdmin
                    .from('languages')
                    .insert({
                        original_name: language.original_name,
                        ru_name: language.ru_name,
                        iso_code: language.iso_code,
                        flag_emoji: language.flag_emoji,
                        is_active: language.is_active !== undefined ? language.is_active : true
                    })
                    .select()
                    .single()

                if (insertError) {
                    return new Response(JSON.stringify({ error: 'Failed to add language', details: insertError }), {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' },
                    })
                }

                result = data
            }

            return new Response(
                JSON.stringify({
                    success: true,
                    language: result
                }),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                }
            )
        } else {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                status: 405,
                headers: { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
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
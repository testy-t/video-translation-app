import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Supabase клиент
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// API ключи
const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY') || '';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';

// Функция для отправки email уведомления через Resend
async function sendCompletionEmail(userEmail: string, videoDetails: any) {
    try {
        console.log(`🚀 Sending email notification to ${userEmail}`);
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'info@golosok.app',
                to: userEmail,
                subject: 'Ваш перевод видео готов',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Ваш перевод видео готов</title>
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                            
                            :root {
                                --primary-color: #0070f3;
                                --text-primary: #1d1d1f;
                                --text-secondary: #6e6e73;
                                --background: #ffffff;
                                --surface: #f5f5f7;
                                --border: #d2d2d7;
                                --button-hover: #0051C2;
                            }
                            
                            body {
                                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                                line-height: 1.5;
                                color: var(--text-primary);
                                background-color: var(--background);
                                margin: 0;
                                padding: 0;
                                -webkit-font-smoothing: antialiased;
                                -moz-osx-font-smoothing: grayscale;
                            }
                            
                            .email-container {
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 40px 20px;
                            }
                            
                            .logo {
                                font-size: 28px;
                                font-weight: 700;
                                letter-spacing: -0.5px;
                                color: var(--text-primary);
                                margin-bottom: 32px;
                                text-align: center;
                            }
                            
                            h1 {
                                font-size: 32px;
                                font-weight: 700;
                                letter-spacing: -0.5px;
                                margin-top: 0;
                                margin-bottom: 24px;
                                color: var(--text-primary);
                            }
                            
                            p {
                                font-size: 17px;
                                line-height: 1.6;
                                margin: 16px 0;
                                color: var(--text-primary);
                            }
                            
                            .button-container {
                                text-align: center;
                                margin: 36px 0;
                            }
                            
                            .button {
                                display: inline-block;
                                background-color: var(--primary-color);
                                color: white !important;
                                text-decoration: none;
                                padding: 16px 32px;
                                border-radius: 50px;
                                font-weight: 600;
                                font-size: 17px;
                                letter-spacing: -0.2px;
                                text-align: center;
                                transition: all 0.2s ease;
                            }
                            
                            .button:hover {
                                background-color: var(--button-hover);
                            }
                            
                            .card {
                                background-color: var(--surface);
                                border-radius: 18px;
                                padding: 24px;
                                margin: 32px 0;
                            }
                            
                            .card p {
                                margin: 0;
                                color: var(--text-secondary);
                                font-size: 15px;
                            }
                            
                            .divider {
                                height: 1px;
                                background-color: var(--border);
                                margin: 32px 0;
                            }
                            
                            .footer {
                                text-align: center;
                                color: var(--text-secondary);
                                font-size: 13px;
                                margin-top: 40px;
                            }
                            
                            .footer p {
                                color: var(--text-secondary);
                                font-size: 13px;
                                margin: 4px 0;
                            }
                            
                            @media (max-width: 480px) {
                                .email-container {
                                    padding: 24px 16px;
                                }
                                
                                h1 {
                                    font-size: 26px;
                                }
                                
                                p {
                                    font-size: 16px;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                            <div class="logo">Golosok.app</div>
                            
                            <h1>Ваш перевод видео готов</h1>
                            
                            <p>Здравствуйте!</p>
                            
                            <p>Мы рады сообщить, что перевод вашего видео успешно завершен. Ваше видео теперь доступно на <strong>${videoDetails.language}</strong>.</p>
                            
                            <div class="button-container">
                                <a href="https://golosok.app/order?step=3&uniquecode=${videoDetails.uniquecode}" class="button">Посмотреть перевод</a>
                            </div>
                            
                            <div class="card">
                                <p>Это письмо сгенерировано автоматически. Пожалуйста, не отвечайте на него. Если у вас возникли вопросы, обратитесь в службу поддержки через сайт.</p>
                            </div>
                            
                            <div class="divider"></div>
                            
                            <p>Благодарим вас за использование нашего сервиса.</p>
                            <p>С уважением,<br>Команда Golosok.app</p>
                            
                            <div class="footer">
                                <p>© 2025 Golosok.app. Все права защищены.</p>
                                <p>Сервис профессионального перевода видео</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            })
        });

        const result = await response.json();
        console.log('✉️ Email sent:', result);
        return result;
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        throw error;
    }
}

// Функция для создания нового перевода через HeyGen API
async function createTranslation(videoUrl: string, outputLanguage: string) {
    try {
        const response = await fetch('https://api.heygen.com/v2/video_translate', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'x-api-key': HEYGEN_API_KEY
            },
            body: JSON.stringify({
                video_url: videoUrl,
                output_language: outputLanguage,
                translate_audio_only: false
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HeyGen API error: ${errorText}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(`HeyGen API returned error: ${JSON.stringify(data.error)}`);
        }

        return data.data?.video_translate_id;
    } catch (error) {
        console.error('Error creating translation:', error);
        return null;
    }
}

// Функция для проверки статуса перевода через HeyGen API
async function checkTranslationStatus(heygenJobId: string) {
    try {
        const response = await fetch(`https://api.heygen.com/v2/video_translate/${heygenJobId}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'x-api-key': HEYGEN_API_KEY
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HeyGen API error: ${errorText}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(`HeyGen API returned error: ${JSON.stringify(data.error)}`);
        }

        return data.data;
    } catch (error) {
        console.error(`Error checking translation status for job ${heygenJobId}:`, error);
        return null;
    }
}

serve(async (req: Request) => {
    // Поддержка CORS для предварительных запросов
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            status: 204,
        });
    }

    try {
        // Инициализируем результаты
        const results = {
            processed: 0,
            translations_started: 0,
            translations_completed: 0,
            emails_sent: 0,
            errors: 0,
            details: [] as any[]
        };

        // 1. Найти все оплаченные, но не активированные транзакции
        const { data: pendingTransactions, error: transactionError } = await supabaseClient
            .from('transactions')
            .select('id, uniquecode, user_id, product_id, amount, video_id')
            .eq('is_paid', true)
            .eq('is_activated', false)
            .order('created_at', { ascending: true });

        if (transactionError) {
            console.error('❌ Error fetching pending transactions:', transactionError);
            return new Response(
                JSON.stringify({
                    error: 'Error fetching pending transactions',
                    details: transactionError
                }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                }
            );
        }

        // Если нет ожидающих транзакций, вернуть успешный пустой результат
        if (!pendingTransactions || pendingTransactions.length === 0) {
            console.log('⏩ No pending transactions found.');
            return new Response(
                JSON.stringify({ message: 'No pending transactions found', results }),
                {
                    status: 200,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                }
            );
        }

        // 2. Обработать каждую транзакцию
        for (const transaction of pendingTransactions) {
            try {
                results.processed++;

                // Проверяем наличие video_id
                if (!transaction.video_id) {
                    console.error(`Transaction ${transaction.uniquecode} has no video_id`);
                    results.errors++;
                    results.details.push({
                        transaction_id: transaction.id,
                        uniquecode: transaction.uniquecode,
                        error: 'Missing video_id in transaction'
                    });
                    continue;
                }

                // Получить связанное видео по video_id вместо transaction_uniquecode
                const { data: video, error: videoError } = await supabaseClient
                    .from('videos')
                    .select('id, original_url, output_language, heygen_job_id, status')
                    .eq('id', transaction.video_id)
                    .single();

                if (videoError) {
                    console.error(`Video with id ${transaction.video_id} not found:`, videoError);
                    results.errors++;
                    results.details.push({
                        transaction_id: transaction.id,
                        uniquecode: transaction.uniquecode,
                        error: 'Video not found',
                        video_id: transaction.video_id,
                        details: videoError
                    });
                    continue;
                }

                // Получить информацию о языке
                let languageName = '';
                let ruLanguageName = '';
                if (video.output_language) {
                    const { data: language } = await supabaseClient
                        .from('languages')
                        .select('original_name, ru_name')
                        .eq('iso_code', video.output_language)
                        .single();

                    if (language) {
                        languageName = language.original_name;
                        ruLanguageName = language.ru_name || language.original_name;
                    }
                }

                // 3. Обработать видео в зависимости от статуса
                let transactionResult: any = {
                    transaction_id: transaction.id,
                    uniquecode: transaction.uniquecode,
                    video_id: video.id,
                    status: 'processed'
                };

                // Если у видео нет heygen_job_id, создаем новый перевод
                if (!video.heygen_job_id) {
                    if (!video.original_url || !languageName) {
                        console.error(`Missing original_url or language for video ${video.id}`);
                        results.errors++;
                        results.details.push({
                            ...transactionResult,
                            error: 'Missing original_url or language',
                            original_url: video.original_url,
                            language: languageName
                        });
                        continue;
                    }

                    // Создать новый перевод
                    const videoTranslateId = await createTranslation(video.original_url, languageName);

                    if (!videoTranslateId) {
                        console.error(`Failed to create translation for video ${video.id}`);
                        results.errors++;
                        results.details.push({
                            ...transactionResult,
                            error: 'Failed to create translation'
                        });
                        continue;
                    }

                    // Обновить запись видео
                    const { error: updateError } = await supabaseClient
                        .from('videos')
                        .update({
                            heygen_job_id: videoTranslateId,
                            status: 'processing',
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', video.id);

                    if (updateError) {
                        console.error(`Error updating video ${video.id}:`, updateError);
                        results.errors++;
                        results.details.push({
                            ...transactionResult,
                            error: 'Error updating video',
                            details: updateError
                        });
                        continue;
                    }

                    results.translations_started++;
                    results.details.push({
                        ...transactionResult,
                        action: 'translation_started',
                        heygen_job_id: videoTranslateId
                    });
                }
                // Если у видео есть heygen_job_id, проверяем статус
                else {
                    const translationStatus = await checkTranslationStatus(video.heygen_job_id);

                    if (!translationStatus) {
                        console.error(`Failed to check translation status for job ${video.heygen_job_id}`);
                        results.errors++;
                        results.details.push({
                            ...transactionResult,
                            error: 'Failed to check translation status',
                            heygen_job_id: video.heygen_job_id
                        });
                        continue;
                    }

                    // Если перевод готов и есть URL, обновляем видео и активируем транзакцию
                    if (translationStatus.status === 'success' && translationStatus.url) {
                        console.log(`🎉 Translation complete for video ${video.id}`);

                        // Обновить запись видео
                        const { error: updateVideoError } = await supabaseClient
                            .from('videos')
                            .update({
                                translated_url: translationStatus.url,
                                status: 'completed',
                                updated_at: new Date().toISOString()
                            })
                            .eq('id', video.id);

                        if (updateVideoError) {
                            console.error(`Error updating video ${video.id} with translated URL:`, updateVideoError);
                            results.errors++;
                            results.details.push({
                                ...transactionResult,
                                error: 'Error updating video with translated URL',
                                details: updateVideoError
                            });
                            continue;
                        }

                        // Пометить транзакцию как активированную
                        const { error: updateTransactionError } = await supabaseClient
                            .from('transactions')
                            .update({ is_activated: true })
                            .eq('id', transaction.id);

                        if (updateTransactionError) {
                            console.error(`Error activating transaction ${transaction.id}:`, updateTransactionError);
                            results.errors++;
                            results.details.push({
                                ...transactionResult,
                                error: 'Error activating transaction',
                                details: updateTransactionError
                            });
                            continue;
                        }

                        // Получение email пользователя для отправки уведомления
                        const { data: user } = await supabaseClient
                            .from('users')
                            .select('email')
                            .eq('id', transaction.user_id)
                            .single();

                        if (user?.email && RESEND_API_KEY) {
                            try {
                                // Отправка уведомления на email
                                await sendCompletionEmail(user.email, {
                                    language: ruLanguageName,
                                    uniquecode: transaction.uniquecode
                                });

                                results.emails_sent++;

                                // Добавляем запись в логи об отправке уведомления
                                await supabaseClient
                                    .from('payment_logs')
                                    .insert({
                                        transaction_id: transaction.id,
                                        event_type: 'email_notification_sent',
                                        data: {
                                            email: user.email,
                                            uniquecode: transaction.uniquecode,
                                            timestamp: new Date().toISOString()
                                        }
                                    });

                                console.log(`✅ Email notification sent to ${user.email}`);
                            } catch (emailError) {
                                console.error(`❌ Error sending email notification:`, emailError);

                                // Логируем ошибку отправки
                                await supabaseClient
                                    .from('payment_logs')
                                    .insert({
                                        transaction_id: transaction.id,
                                        event_type: 'email_notification_error',
                                        data: {
                                            email: user.email,
                                            error: String(emailError),
                                            timestamp: new Date().toISOString()
                                        }
                                    });
                            }
                        } else if (!user?.email) {
                            console.log(`⚠️ No email found for user ${transaction.user_id}`);
                        } else if (!RESEND_API_KEY) {
                            console.log(`⚠️ RESEND_API_KEY not configured, skipping email notification`);
                        }

                        // Добавить запись в логи
                        await supabaseClient
                            .from('payment_logs')
                            .insert({
                                transaction_id: transaction.id,
                                event_type: 'translation_completed',
                                data: {
                                    uniquecode: transaction.uniquecode,
                                    video_id: video.id,
                                    heygen_job_id: video.heygen_job_id,
                                    translated_url: translationStatus.url
                                }
                            });

                        results.translations_completed++;
                        results.details.push({
                            ...transactionResult,
                            action: 'translation_completed',
                            heygen_job_id: video.heygen_job_id,
                            translated_url: translationStatus.url,
                            email_sent: user?.email ? true : false
                        });
                    } else {
                        // Если перевод еще не готов, просто обновляем статус видео
                        if (video.status !== translationStatus.status) {
                            await supabaseClient
                                .from('videos')
                                .update({
                                    status: translationStatus.status,
                                    updated_at: new Date().toISOString()
                                })
                                .eq('id', video.id);
                        }

                        results.details.push({
                            ...transactionResult,
                            action: 'translation_in_progress',
                            heygen_job_id: video.heygen_job_id,
                            heygen_status: translationStatus.status
                        });
                    }
                }
            } catch (error) {
                console.error(`Error processing transaction ${transaction.id}:`, error);
                results.errors++;
                results.details.push({
                    transaction_id: transaction.id,
                    uniquecode: transaction.uniquecode,
                    error: 'Unexpected error',
                    details: String(error)
                });
            }
        }
        const response = JSON.stringify({
            message: '✅ Processing completed',
            results: {
                transactions_processed: results.processed,
                translations_started: results.translations_started,
                translations_completed: results.translations_completed,
                emails_sent: results.emails_sent,
                errors: results.errors,
                details: results.details
            }
        });

        console.log(response);
        // Вернуть результаты обработки
        return new Response(
            response,
            {
                status: 200,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            }
        );
    } catch (error) {
        console.error('Unexpected error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error', details: String(error) }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            }
        );
    }
});
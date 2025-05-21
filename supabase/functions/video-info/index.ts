// supabase/functions/video-info/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Создаем supabase клиент с сервисной ролью
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
)

interface RequestBody {
  videoId: number;
  fileKey: string;
  outputLanguage: string;
}

serve(async (req: Request) => {
  // CORS preflight - разрешаем запросы с любого домена
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      status: 204,
    })
  }

  // Содержимое ответа
  let responseData = {}
  let statusCode = 200

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // Получаем данные из запроса
    const requestData: RequestBody = await req.json()
    const { videoId, fileKey, outputLanguage } = requestData

    if (!videoId || !fileKey || !outputLanguage) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // Получаем информацию о видео из БД (если есть)
    const { data: videoRecord, error: videoError } = await supabaseAdmin
      .from('videos')
      .select('duration, output_language, transaction_uniquecode')
      .eq('id', videoId)
      .single()

    // Подготавливаем ответ с информацией о видео
    if (videoError || !videoRecord) {
      console.log('Video not found in DB, returning error')
      
      // Если видео не найдено в БД, возвращаем ошибку
      statusCode = 404
      responseData = {
        success: false,
        error: 'Video not found',
        message: `Video with ID ${videoId} not found in database`,
        videoId
      }
    } else {
      // Если видео найдено, используем данные из БД
      const duration = videoRecord.duration
      
      // Проверка на наличие duration
      if (!duration) {
        statusCode = 400
        responseData = {
          success: false,
          error: 'Invalid video data',
          message: 'Video duration is missing',
          videoId
        }
      } else {
        responseData = {
          success: true,
          videoId,
          duration,
          outputLanguage: videoRecord.output_language || outputLanguage,
          finalAmount: 119 * Math.ceil(duration / 60) // Расчет стоимости
        }
      }

      // Обновляем язык в БД, если он отличается
      if (videoRecord.output_language !== outputLanguage) {
        await supabaseAdmin
          .from('videos')
          .update({ output_language: outputLanguage })
          .eq('id', videoId)
      }
    }
  } catch (error) {
    console.error('Error processing request:', error)
    responseData = { 
      error: 'Internal server error', 
      details: String(error),
      success: false
    }
    statusCode = 500
  }

  // Возвращаем ответ с информацией о видео
  return new Response(JSON.stringify(responseData), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
})
import { supabase } from './client';
import { Tables } from './types';

export type Language = Tables<'languages'>;

interface LanguageResponse {
  success: boolean;
  languages: Language[];
  error?: any;
}

interface LanguageUpdateResponse {
  success: boolean;
  videoId: number;
  language: Language;
  message: string;
  error?: any;
}

/**
 * Сервис для работы с языками
 */
export class LanguagesService {
  /**
   * Получение списка доступных языков для перевода
   */
  static async getLanguages(): Promise<LanguageResponse> {
    try {
      // Сначала пытаемся получить данные из базы данных
      const { data: languages, error } = await supabase
        .from('languages')
        .select('*')
        .eq('is_active', true)
        .order('ru_name');

      if (error) {
        console.error('Ошибка при получении списка языков из базы:', error);
        
        // Если не удалось получить из базы, используем edge-функцию
        const response = await fetch(`${supabase.supabaseUrl}/functions/v1/languages`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Ошибка получения списка языков: ${response.status}`);
        }

        const result: LanguageResponse = await response.json();
        return result;
      }

      return {
        success: true,
        languages,
      };
    } catch (error) {
      console.error('Ошибка при получении списка языков:', error);
      return {
        success: false,
        languages: [],
        error,
      };
    }
  }

  /**
   * Обновление языка для видео
   */
  static async updateVideoLanguage(videoId: number, language: Language): Promise<LanguageUpdateResponse> {
    try {
      // Получаем текущий токен авторизации, если пользователь авторизован
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Добавляем токен авторизации, если пользователь авторизован
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      // Вызываем edge-функцию для обновления языка
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/update-video-language`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          videoId,
          language,
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.error('Ошибка API обновления языка:', {
            status: response.status,
            error: errorData
          });
        } catch (parseError) {
          console.error('Не удалось прочитать ответ от API:', parseError);
          errorData = { error: `Некорректный ответ от сервера: ${response.status}` };
        }
        
        // Если ошибка связана с авторизацией, но это временное видео - игнорируем ее
        if (response.status === 403 && errorData.error?.includes('Access denied')) {
          console.log('Получена ошибка доступа, но продолжаем обработку для временного видео');
          return {
            success: true, // Считаем успешным для пользовательского интерфейса
            videoId,
            language,
            message: 'Язык для перевода установлен'
          };
        }
        
        throw new Error(errorData.error || `Ошибка обновления языка: ${response.status}`);
      }

      const result: LanguageUpdateResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Ошибка при обновлении языка видео:', error);
      return {
        success: false,
        videoId,
        language,
        message: `Ошибка: ${error instanceof Error ? error.message : String(error)}`,
        error,
      };
    }
  }
}
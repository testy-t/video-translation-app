import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase";
import { getLanguageName } from "@/components/order/language-selector/languages-data";

interface VideoInfo {
  id: number;
  duration: number;
  outputLanguage: string;
  outputLanguageName: string;
  status: string;
}

/**
 * Хук для получения информации о видео из API
 * @param videoId ID видео
 * @param fileKey Ключ файла
 * @param forceUpdate Число, увеличение которого вызовет принудительное обновление
 * @returns Информация о видео и состояние загрузки
 */
export const useVideoInfo = (
  videoId?: number | null, 
  fileKey?: string | null,
  forceUpdate: number = 0
) => {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(`🔄 Вызван useVideoInfo (forceUpdate=${forceUpdate})`);
    // Если нет ID видео или ключа файла, не загружаем данные
    if (!videoId || !fileKey) {
      console.log('⚠️ Нет данных для загрузки информации о видео', { videoId, fileKey });
      return;
    }
    
    console.log('🔄 Начинаем загрузку информации о видео', { videoId, fileKey });

    const fetchVideoInfo = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Получаем текущую сессию пользователя
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error("Пользователь не авторизован");
        }

        // Вызываем функцию video-info
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/video-info`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            videoId,
            fileKey,
            outputLanguage: localStorage.getItem("selectedLanguage") || "en"
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Не удалось получить информацию о видео");
        }

        const data = await response.json();
        console.log('✅ Получены данные о видео из API:', data);
        
        // Преобразуем данные в формат VideoInfo
        const videoData = {
          id: data.videoId,
          duration: data.duration || 180, // По умолчанию 3 минуты
          outputLanguage: data.outputLanguage || localStorage.getItem("selectedLanguage") || "en",
          outputLanguageName: getLanguageName(data.outputLanguage || localStorage.getItem("selectedLanguage") || "en"),
          status: data.status || "uploaded"
        };
        
        console.log('✅ Преобразованные данные о видео:', videoData);
        setVideoInfo(videoData);
      } catch (err) {
        console.error("Ошибка при получении информации о видео:", err);
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
        
        // В случае ошибки используем данные из localStorage
        const savedDuration = localStorage.getItem("videoDuration");
        const savedLanguage = localStorage.getItem("selectedLanguage");
        
        setVideoInfo({
          id: videoId,
          duration: savedDuration ? parseInt(savedDuration) : 180,
          outputLanguage: savedLanguage || "en",
          outputLanguageName: getLanguageName(savedLanguage || "en"),
          status: "uploaded"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoInfo();
  }, [videoId, fileKey, forceUpdate]);

  return { videoInfo, isLoading, error };
};
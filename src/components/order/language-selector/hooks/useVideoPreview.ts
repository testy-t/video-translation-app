
import { useState, useEffect } from 'react';

/**
 * Хук для работы с превью видео
 * @param videoFile Файл видео для предпросмотра
 * @returns Объект с методами и данными для управления превью
 */
export const useVideoPreview = (videoFile: File | null) => {
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Создаем превью видео при изменении файла
  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoPreviewUrl(url);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setVideoPreviewUrl(null);
    }
  }, [videoFile]);

  // Автоматически останавливаем видео после 5 секунд
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        const videoElement = document.getElementById('preview-video') as HTMLVideoElement;
        if (videoElement) {
          videoElement.pause();
          setIsPlaying(false);
        }
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isPlaying]);

  /**
   * Переключает воспроизведение/паузу видео
   */
  const togglePlayback = () => {
    const videoElement = document.getElementById('preview-video') as HTMLVideoElement;
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.currentTime = 0; // Начинаем с начала
        videoElement.play().catch(e => console.error('Ошибка воспроизведения:', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return { 
    videoPreviewUrl, 
    isPlaying, 
    togglePlayback 
  };
};

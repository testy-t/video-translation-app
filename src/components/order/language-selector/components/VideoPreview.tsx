
import React from 'react';
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Language } from '../types';

interface VideoPreviewProps {
  /** URL для предпросмотра видео */
  videoPreviewUrl: string | null;
  /** Флаг воспроизведения видео */
  isPlaying: boolean;
  /** Функция переключения воспроизведения */
  togglePlayback: () => void;
  /** Код выбранного языка */
  selectedLanguage: string;
  /** Список всех языков */
  allLanguages: Language[];
}

/**
 * Компонент предпросмотра видео с переводом
 */
const VideoPreview: React.FC<VideoPreviewProps> = ({ 
  videoPreviewUrl, 
  isPlaying, 
  togglePlayback, 
  selectedLanguage, 
  allLanguages 
}) => {
  // Находим выбранный язык
  const selectedLanguageDetails = allLanguages.find(l => l.code === selectedLanguage);

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-gray-100">
      {videoPreviewUrl ? (
        <>
          <video
            id="preview-video"
            src={videoPreviewUrl}
            className="w-full h-full object-contain"
          />
          <button
            className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/30 transition-opacity hover:bg-black/40"
            onClick={togglePlayback}
            aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
          >
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon 
                name={isPlaying ? "Pause" : "Play"} 
                size={30} 
                className="text-white ml-1" 
              />
            </div>
          </button>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <span>Видео не загружено</span>
        </div>
      )}
      
      {/* Бейдж с информацией о демо-версии */}
      <Badge 
        variant="secondary" 
        className="absolute top-2 right-2 bg-black/70 text-white"
      >
        5-сек. демо
      </Badge>
      
      {/* Отображаем информацию о выбранном языке */}
      {selectedLanguageDetails && (
        <div className="absolute bottom-2 left-2 flex items-center bg-black/70 text-white px-2 py-1 rounded-md text-sm">
          <span className="mr-1">Язык перевода:</span>
          {selectedLanguageDetails.flag}{" "}
          {selectedLanguageDetails.name}
        </div>
      )}
    </div>
  );
};

export default VideoPreview;

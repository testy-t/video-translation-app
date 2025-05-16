import React from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

// Интерфейс для пропсов компонента
interface VideoActionButtonsProps {
  isLoading: boolean;
  isVideoUploaded: boolean;
  uploadProgress: number;
  videoFile: File | null;
  uploadVideo: () => void;
  clearSelection: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

/**
 * Компонент для кнопок действий с видео
 */
const VideoActionButtons: React.FC<VideoActionButtonsProps> = ({
  isLoading, 
  isVideoUploaded, 
  uploadProgress, 
  videoFile,
  uploadVideo,
  clearSelection,
  fileInputRef
}) => {
  return (
    <>
      {/* Кнопка выбора файла при отсутствии файла */}
      {!videoFile && !isVideoUploaded && (
        <div className="mt-4">
          <Button 
            className="w-full" 
            onClick={() => fileInputRef.current?.click()}
          >
            <Icon name="File" className="mr-2 h-4 w-4" />
            Выбрать файл
          </Button>
        </div>
      )}

      {/* Кнопка загрузки если автоматическая загрузка не сработает */}
      {!isLoading && !isVideoUploaded && uploadProgress === 0 && videoFile && (
        <div className="mt-4">
          <Button 
            className="w-full" 
            onClick={uploadVideo}
            disabled={!videoFile || isLoading}
          >
            <Icon name="Upload" className="mr-2 h-4 w-4" />
            Загрузить видео
          </Button>
        </div>
      )}
      
      {/* Сообщение об успешной загрузке */}
      {isVideoUploaded && !isLoading && (
        <div className="mt-4">
          <div className="flex items-center justify-center text-sm text-green-600 bg-green-50 p-2 rounded-md border border-green-200">
            <Icon name="CheckCircle" className="mr-2 h-4 w-4" />
            Видео успешно загружено и готово к обработке
          </div>
        </div>
      )}
      
      {/* Кнопка для выбора другого видео */}
      {isVideoUploaded && !isLoading && (
        <div className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => {
              clearSelection();
              // Даем пользователю выбрать новый файл
              setTimeout(() => fileInputRef.current?.click(), 100);
            }}
            className="w-full"
          >
            <Icon name="RefreshCw" className="mr-2 h-4 w-4" />
            Выбрать другое видео
          </Button>
        </div>
      )}
    </>
  );
};

export default VideoActionButtons;
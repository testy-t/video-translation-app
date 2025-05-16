import React from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

// Интерфейс для пропсов компонента
interface VideoInfoProps {
  videoFile: File | null;
  isVideoUploaded: boolean;
  uploadVideo: () => void;
}

/**
 * Компонент для отображения информации о видео
 */
const VideoInfo: React.FC<VideoInfoProps> = ({ 
  videoFile, 
  isVideoUploaded, 
  uploadVideo 
}) => {
  if (videoFile) {
    return (
      <div className="flex items-center bg-white p-4 rounded-md border">
        <Icon
          name="FileVideo"
          className="text-primary mr-2"
          size={24}
        />
        <div className="flex-grow">
          <div className="font-medium">{videoFile.name}</div>
          <div className="text-gray-500 text-sm">
            Размер: {Math.round((videoFile.size / 1024 / 1024) * 10) / 10} MB
            {isVideoUploaded ? (
              // Если видео загружено успешно
              <span className="text-green-500 ml-2 flex items-center inline-flex">
                <Icon name="Check" size={14} className="mr-1" /> 
                Загружено
              </span>
            ) : (
              // Если видео не загружено или произошла ошибка
              <Button 
                variant="link" 
                size="sm"
                className="text-xs text-primary p-0 ml-2"
                onClick={uploadVideo}
              >
                Повторить загрузку
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  } else if (isVideoUploaded) {
    // Если файла нет, но он был загружен ранее (по данным из localStorage)
    return (
      <div className="flex items-center bg-white p-4 rounded-md border">
        <Icon
          name="FileVideo"
          className="text-primary mr-2"
          size={24}
        />
        <div className="flex-grow">
          <div className="font-medium">Видео успешно загружено</div>
          <div className="text-gray-500 text-sm">
            <span className="text-green-500 flex items-center">
              <Icon name="Check" size={14} className="mr-1" /> 
              Вы можете продолжить
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    // Случай, когда нет файла и нет флага загрузки
    return (
      <div className="flex items-center bg-white p-4 rounded-md border">
        <Icon
          name="AlertCircle"
          className="text-amber-500 mr-2"
          size={24}
        />
        <div className="flex-grow">
          <div className="font-medium">Файл не выбран</div>
          <div className="text-gray-500 text-sm">
            Пожалуйста, выберите видео
          </div>
        </div>
      </div>
    );
  }
};

export default VideoInfo;
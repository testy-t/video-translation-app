import React from "react";
import Icon from "@/components/ui/icon";

// Интерфейс для пропсов компонента
interface UploadProgressProps {
  isPreparingUpload: boolean;
  uploadProgress: number;
}

/**
 * Компонент для отображения прогресса загрузки
 */
const UploadProgress: React.FC<UploadProgressProps> = ({ 
  isPreparingUpload, 
  uploadProgress 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      {isPreparingUpload ? (
        // Показываем только спиннер при подготовке загрузки
        <>
          <Icon
            name="Loader2"
            className="animate-spin text-primary h-10 w-10 mb-4"
          />
          <p className="text-center text-gray-600">Подготовка к загрузке...</p>
        </>
      ) : (
        // Показываем прогресс-бар при активной загрузке
        <>
          <Icon
            name="UploadCloud"
            className="text-primary h-10 w-10 mb-4"
          />
          <p className="text-center text-gray-600">Загрузка видео...</p>
          <div className="w-full max-w-xs mt-4">
            <div className="bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              {uploadProgress}%
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default UploadProgress;
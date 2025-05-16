import React, { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

interface UploadVideoStepProps {
  videoFile: File | null;
  setVideoFile: (file: File | null) => void;
}

const UploadVideoStep: React.FC<UploadVideoStepProps> = ({
  videoFile,
  setVideoFile,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Обработчик выбора файла
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setIsLoading(true);

      // Создаем URL для предпросмотра видео
      const fileUrl = URL.createObjectURL(files[0]);
      setVideoSrc(fileUrl);
      setVideoFile(files[0]);

      // Имитируем загрузку
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  // Обработчики перетаскивания
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setIsLoading(true);

      // Проверяем, является ли файл видео
      if (files[0].type.startsWith("video/")) {
        const fileUrl = URL.createObjectURL(files[0]);
        setVideoSrc(fileUrl);
        setVideoFile(files[0]);
      }

      // Имитируем загрузку
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  // Очистка выбранного файла
  const clearSelection = () => {
    if (videoSrc) {
      URL.revokeObjectURL(videoSrc);
    }
    setVideoSrc(null);
    setVideoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fade-slide-in">
      <h2 className="text-xl font-semibold mb-6">Загрузите ваше видео</h2>

      {!videoFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all
            ${isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/70"}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*"
            className="hidden"
          />

          <div className="flex flex-col items-center">
            <Icon name="Upload" size={48} className="text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">
              Перетащите видео или нажмите для выбора
            </p>
            <p className="text-gray-500 text-sm">
              Поддерживаются форматы: MP4, AVI, MOV, MKV (до 2GB)
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6 bg-gray-50 fade-slide-in">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Icon
                name="Loader2"
                className="animate-spin text-primary h-10 w-10 mb-4"
              />
              <p className="text-center text-gray-600">Загрузка видео...</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-lg">Загруженное видео</h3>
                <button
                  onClick={clearSelection}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <div className="flex items-center bg-white p-4 rounded-md border">
                <Icon
                  name="FileVideo"
                  className="text-primary mr-2"
                  size={24}
                />
                <div className="flex-grow">
                  <div className="font-medium">{videoFile.name}</div>
                  <div className="text-gray-500 text-sm">
                    Размер:{" "}
                    {Math.round((videoFile.size / 1024 / 1024) * 10) / 10} MB
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-medium mb-3">Рекомендации:</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <Icon
              name="Check"
              className="text-green-500 mt-1 mr-2 flex-shrink-0"
              size={16}
            />
            <span>
              Используйте видео хорошего качества для лучших результатов
            </span>
          </li>
          <li className="flex items-start">
            <Icon
              name="Check"
              className="text-green-500 mt-1 mr-2 flex-shrink-0"
              size={16}
            />
            <span>Убедитесь, что речь говорящего четко слышна</span>
          </li>
          <li className="flex items-start">
            <Icon
              name="Check"
              className="text-green-500 mt-1 mr-2 flex-shrink-0"
              size={16}
            />
            <span>Оптимальная длительность видео — до 30 минут</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UploadVideoStep;

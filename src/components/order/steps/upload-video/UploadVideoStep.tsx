import React, { useState, useRef, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import Icon from "@/components/ui/icon";
import { UploadVideoStepProps } from "./types";
import { VideoStorageUtils, uploadFileWithProgress } from "./utils";
import { VideoUploadService } from "./services";
import { 
  DropZone, 
  UploadProgress, 
  VideoInfo, 
  VideoActionButtons, 
  VideoRecommendations 
} from "./components";

/**
 * Компонент для загрузки видео
 */
const UploadVideoStep: React.FC<UploadVideoStepProps> = ({
  videoFile,
  setVideoFile,
  transactionId,
  onUploadSuccess
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreparingUpload, setIsPreparingUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Инициализируем флаг загрузки, проверяя localStorage при загрузке компонента
  const [isVideoUploaded, setIsVideoUploaded] = useState(VideoStorageUtils.getUploadStatus);

  //////////////////////////////////
  // Обработчики событий для файлов
  //////////////////////////////////
  
  // Обработка выбора файла из диалога
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("📊 File selection triggered", e.target.files);
    const files = e.target.files;
    
    // Сбрасываем флаг загруженного видео при выборе нового файла
    if (isVideoUploaded) {
      console.log("📊 Resetting upload state for new file");
      setIsVideoUploaded(false);
      VideoStorageUtils.setUploadStatus(false);
    }
    
    if (files && files[0]) {
      console.log("📊 File selected:", files[0].name);
      // Create URL for video preview
      const fileUrl = URL.createObjectURL(files[0]);
      setVideoSrc(fileUrl);
      setVideoFile(files[0]);
      
      // Start upload automatically
      setTimeout(() => {
        console.log("📊 Starting upload from file selection handler");
        uploadVideo();
      }, 100);
    } else {
      console.log("📊 No file selected in file input");
    }
  };

  // Обработчики Drag & Drop
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
    console.log("📊 File dropped", e.dataTransfer.files);

    // Сбрасываем флаг загруженного видео при перетаскивании нового файла
    if (isVideoUploaded) {
      console.log("📊 Resetting upload state for newly dropped file");
      setIsVideoUploaded(false);
      VideoStorageUtils.setUploadStatus(false);
    }

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      console.log("📊 Checking dropped file:", files[0].name, files[0].type);
      // Check if file is a video
      if (files[0].type.startsWith("video/")) {
        console.log("📊 Video file dropped:", files[0].name);
        const fileUrl = URL.createObjectURL(files[0]);
        setVideoSrc(fileUrl);
        setVideoFile(files[0]);
        
        // Start upload automatically
        setTimeout(() => {
          console.log("📊 Starting upload from drop handler");
          uploadVideo();
        }, 100);
      } else {
        console.log("📊 Dropped file is not a video:", files[0].type);
        toast({
          title: "Недопустимый формат",
          description: "Пожалуйста, выберите видеофайл",
          variant: "destructive",
        });
      }
    } else {
      console.log("📊 No file in drop event");
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
    setUploadProgress(0);
    
    // Сбрасываем флаг загрузки видео и удаляем данные из localStorage
    setIsVideoUploaded(false);
    VideoStorageUtils.clearVideoInfo();
  };

  // Основной метод загрузки видео
  const uploadVideo = async () => {
    console.log("📊 uploadVideo called, videoFile status:", videoFile ? "Selected" : "Not selected");
    
    // Проверяем флаг в localStorage
    const isUploadedInStorage = VideoStorageUtils.getUploadStatus();
    console.log("📊 isVideoUploaded in localStorage:", isUploadedInStorage);
    
    // Если видео уже отмечено как загруженное - не загружаем повторно
    if (isVideoUploaded || isUploadedInStorage) {
      console.log("📊 Video is already marked as uploaded, skipping upload");
      // Синхронизируем состояние с localStorage
      if (!isVideoUploaded && isUploadedInStorage) {
        setIsVideoUploaded(true);
      }
      toast({
        title: "Информация",
        description: "Видео уже загружено и готово к обработке",
      });
      return;
    }
    
    // Получаем сохраненную информацию
    const videoInfo = VideoStorageUtils.getVideoInfo();
    
    // Если есть данные о видео, но нет файла - восстанавливаем состояние
    if (videoInfo.videoId && videoInfo.fileKey && !videoFile) {
      console.log("📊 Found saved video info in localStorage, marking as uploaded");
      setIsVideoUploaded(true);
      VideoStorageUtils.setUploadStatus(true);
      return;
    }
    
    if (!videoFile) {
      console.error("📊 No video file selected when uploadVideo was called!");
      
      // Проверяем наличие файла в input как резервный вариант
      const fileInput = fileInputRef.current;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        console.log("📊 Found file in file input, using it as fallback");
        const file = fileInput.files[0];
        setVideoFile(file);
        
        // Повторяем попытку загрузки
        setTimeout(() => {
          console.log("📊 Retrying upload with file from input:", file.name);
          uploadVideo();
        }, 100);
        return;
      }
      
      // Если есть сохраненные данные о загрузке, но нет файла - не показываем ошибку
      if (isUploadedInStorage || (videoInfo.videoId && videoInfo.fileKey)) {
        console.log("📊 No file, but upload data exists, skipping error");
        setIsVideoUploaded(true);
        return;
      }
      
      toast({
        title: "Ошибка",
        description: "Не выбран файл",
        variant: "destructive",
      });
      return;
    }

    console.log("📊 Starting upload for:", videoFile.name, "Size:", videoFile.size, "Type:", videoFile.type);
    setIsLoading(true);
    setIsPreparingUpload(true);
    setUploadProgress(0);

    try {
      let videoId: number, fileKey: string;
      
      // Демо-режим (отключён)
      const FORCE_DEMO_MODE = false;

      // Загрузка в демо-режиме или для неавторизованных пользователей
      if (FORCE_DEMO_MODE) {
        console.log("📊 Running in demo mode");
        const result = await VideoUploadService.uploadDemoVideo(videoFile);
        videoId = result.videoId;
        fileKey = result.fileKey;
      } else {
        console.log("📊 Running real upload with presigned URL");
        
        // Шаг 1: Получаем presigned URL
        const { presignedUrl, fileKey: key, videoId: id } = await VideoUploadService.getPresignedUrl(
          videoFile, 
          transactionId
        );
        
        fileKey = key;
        videoId = id;
        
        // Шаг 2: Загружаем файл напрямую в хранилище
        console.log("📊 Starting direct upload to storage with presigned URL");
        setIsPreparingUpload(false);
        
        await uploadFileWithProgress(
          videoFile, 
          presignedUrl, 
          (progress) => setUploadProgress(progress)
        );
        
        console.log("📊 Direct upload successful");
      }
      
      // Устанавливаем прогресс 100%
      setUploadProgress(100);
      setIsPreparingUpload(false);
      
      // Отмечаем успешное завершение загрузки
      setIsVideoUploaded(true);
      VideoStorageUtils.saveVideoInfo(videoId, fileKey, transactionId, videoFile.name);
      
      toast({
        title: "Успех",
        description: "Видео успешно загружено",
      });

      // Вызываем callback для перехода к следующему шагу
      setTimeout(() => {
        if (onUploadSuccess) {
          console.log("📊 Calling onUploadSuccess with:", { videoId, fileKey });
          onUploadSuccess(videoId, fileKey);
        }
      }, 500);
    } catch (error) {
      console.error("📊 Upload error:", error);
      setIsVideoUploaded(false);
      VideoStorageUtils.setUploadStatus(false);
      
      toast({
        title: "Ошибка загрузки",
        description: error instanceof Error ? error.message : "Произошла ошибка при загрузке видео",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsPreparingUpload(false);
    }
  };

  ////////////////////
  // Эффекты
  ////////////////////
  
  // Эффект для синхронизации состояния файла и флага загрузки
  useEffect(() => {
    console.log("📊 File state changed:", { 
      videoFile: videoFile?.name, 
      isVideoUploaded
    });
    
    // При получении файла сверяем с флагом загрузки
    if (videoFile && !isVideoUploaded) {
      const videoInfo = VideoStorageUtils.getVideoInfo();
      
      if (videoInfo.fileName === videoFile.name) {
        console.log("📊 Found matching saved file name, setting uploaded state");
        setIsVideoUploaded(true);
        VideoStorageUtils.setUploadStatus(true);
      } else {
        console.log("📊 New or different file, reset upload state");
        setIsVideoUploaded(false);
        VideoStorageUtils.setUploadStatus(false);
      }
    } 
    
    // Если есть файл и флаг загрузки - сохраняем имя файла
    if (videoFile && isVideoUploaded) {
      console.log("📊 File present and upload flag set - all good!");
      localStorage.setItem('uploadedFileName', videoFile.name);
    }
    
    // Если нет файла, но есть флаг загрузки - возврат после успешной загрузки
    if (!videoFile && isVideoUploaded) {
      console.log("📊 No file but upload flag set - returned after successful upload");
    }
  }, [videoFile, isVideoUploaded]);
  
  // Эффект для проверки флага при монтировании компонента
  useEffect(() => {
    console.log("📊 Component mounted, checking flags");
    
    // Проверяем, был ли флаг загрузки установлен в localStorage
    if (!videoFile && VideoStorageUtils.getUploadStatus()) {
      console.log("📊 No file but upload flag set in localStorage");
      setIsVideoUploaded(true);
    }
  }, [videoFile]);

  // Эффект для автоматической загрузки при изменении состояния файла
  useEffect(() => {
    console.log("📊 Auto-upload check:", { 
      videoFile: videoFile?.name, 
      transactionId, 
      isVideoUploaded,
      uploadProgress,
      isLoading
    });
    
    // Если флаг загрузки установлен в localStorage, но нет файла
    if (!videoFile && VideoStorageUtils.getUploadStatus()) {
      console.log("📊 Video was previously uploaded according to localStorage, but no file in state");
      setIsVideoUploaded(true);
      return;
    }
    
    // Автоматическая загрузка только если:
    // 1. Есть файл
    // 2. Не идет загрузка
    // 3. Прогресс = 0
    // 4. Видео еще не загружено
    if (videoFile && !isLoading && uploadProgress === 0 && !isVideoUploaded) {
      const videoInfo = VideoStorageUtils.getVideoInfo();
      
      if (videoInfo.fileName === videoFile.name) {
        console.log("📊 This file has been uploaded before, not uploading again");
        setIsVideoUploaded(true);
      } else {
        console.log("📊 New file detected, starting upload automatically");
        setTimeout(() => {
          uploadVideo();
        }, 300);
      }
    }
  }, [videoFile, transactionId, isLoading, uploadProgress, isVideoUploaded]);

  // Индикаторы состояния для рендера
  const hasVideoFile = !!videoFile;
  const isVideoReady = hasVideoFile || isVideoUploaded;
  
  console.log("📊 Render state:", { 
    hasVideoFile, 
    isVideoUploaded, 
    isVideoReady,
    isLoading 
  });

  return (
    <div className="fade-slide-in">
      <h2 className="text-xl font-semibold mb-6">Загрузите ваше видео</h2>

      {/* Скрытый инпут для файла */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/*"
        className="hidden"
      />

      {/* Основное содержимое компонента */}
      {!isVideoReady ? (
        // Дропзона для загрузки видео
        <DropZone 
          isDragging={isDragging}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        />
      ) : (
        // Информация о видео и прогресс загрузки
        <div className="border rounded-lg p-6 bg-gray-50 fade-slide-in">
          {isLoading ? (
            // Компонент прогресса загрузки
            <UploadProgress 
              isPreparingUpload={isPreparingUpload}
              uploadProgress={uploadProgress}
            />
          ) : (
            <>
              {/* Шапка с заголовком и кнопкой удаления */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-lg">Выбранное видео</h3>
                <button
                  onClick={clearSelection}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              {/* Информация о видео */}
              <VideoInfo 
                videoFile={videoFile} 
                isVideoUploaded={isVideoUploaded}
                uploadVideo={uploadVideo}
              />

              {/* Кнопки действий */}
              <VideoActionButtons 
                isLoading={isLoading}
                isVideoUploaded={isVideoUploaded}
                uploadProgress={uploadProgress}
                videoFile={videoFile}
                uploadVideo={uploadVideo}
                clearSelection={clearSelection}
                fileInputRef={fileInputRef}
              />
            </>
          )}
        </div>
      )}

      {/* Рекомендации */}
      <VideoRecommendations />
    </div>
  );
};

export default UploadVideoStep;
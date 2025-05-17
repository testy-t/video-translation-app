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

// Константы для формирования URL видео
const S3_ENDPOINT = "https://storage.yandexcloud.net"; // URL хранилища, где размещаются файлы
const S3_BUCKET = "golosok"; // Правильное имя бакета

// Константа для максимального размера файла
const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB в байтах

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
  
  // Используется MAX_FILE_SIZE, объявленная выше
  
  // Обработка выбора файла из диалога
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    // Сбрасываем флаг загруженного видео при выборе нового файла
    if (isVideoUploaded) {
      setIsVideoUploaded(false);
      VideoStorageUtils.setUploadStatus(false);
    }
    
    if (files && files[0]) {
      // Проверка размера файла
      if (files[0].size > MAX_FILE_SIZE) {
        console.error("📊 File too large:", files[0].size, "bytes");
        toast({
          title: "Ошибка",
          description: "Размер файла превышает лимит в 5GB",
          variant: "destructive",
        });
        return;
      }
      
      // Create URL for video preview
      const fileUrl = URL.createObjectURL(files[0]);
      setVideoSrc(fileUrl);
      setVideoFile(files[0]);
      
      // Start upload automatically
      setTimeout(() => {
        uploadVideo();
      }, 100);
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

    // Сбрасываем флаг загруженного видео при перетаскивании нового файла
    if (isVideoUploaded) {
      setIsVideoUploaded(false);
      VideoStorageUtils.setUploadStatus(false);
    }

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      // Сначала проверяем тип файла
      if (!files[0].type.startsWith("video/")) {
        toast({
          title: "Недопустимый формат",
          description: "Пожалуйста, выберите видеофайл",
          variant: "destructive",
        });
        return;
      }
      
      // Затем проверяем размер файла
      if (files[0].size > MAX_FILE_SIZE) {
        toast({
          title: "Ошибка",
          description: "Размер файла превышает лимит в 5GB",
          variant: "destructive",
        });
        return;
      }
      
      // Если все проверки пройдены, продолжаем с загрузкой
      const fileUrl = URL.createObjectURL(files[0]);
      setVideoSrc(fileUrl);
      setVideoFile(files[0]);
      
      // Start upload automatically
      setTimeout(() => {
        uploadVideo();
      }, 100);
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
    // Проверяем флаг в localStorage
    const isUploadedInStorage = VideoStorageUtils.getUploadStatus();
    
    // Если видео уже отмечено как загруженное - не загружаем повторно
    if (isVideoUploaded || isUploadedInStorage) {
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
      // Проверяем наличие файла в input как резервный вариант
      const fileInput = fileInputRef.current;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        console.log("📊 Found file in file input, using it as fallback");
        const file = fileInput.files[0];
        setVideoFile(file);
        
        // Устанавливаем флаг для одноразовой повторной попытки
        const retryAttempted = sessionStorage.getItem('upload_retry_attempted');
        if (!retryAttempted) {
          sessionStorage.setItem('upload_retry_attempted', 'true');
          // Повторяем попытку загрузки только один раз
          setTimeout(() => {
            console.log("📊 Retrying upload with file from input:", file.name);
            uploadVideo();
          }, 100);
          return;
        } else {
          console.log("📊 Already attempted retry, not trying again");
          sessionStorage.removeItem('upload_retry_attempted');
        }
      } else {
        console.error("📊 No video file selected when uploadVideo was called!");
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
    
    // Проверка размера файла перед загрузкой
    if (videoFile.size > MAX_FILE_SIZE) {
      console.error("📊 File too large:", videoFile.size, "bytes");
      toast({
        title: "Ошибка",
        description: "Размер файла превышает лимит в 5GB",
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

      // Создаем URL оригинального видео
      const originalUrl = `${S3_ENDPOINT}/${S3_BUCKET}/${fileKey}`;
      console.log("📊 Original video URL:", originalUrl);

      // Сохраняем информацию о загруженном видео и создаем запись в БД
      try {
        // Получаем длительность видео через HTML5 Video API
        console.log("📊 Getting video duration from file");
        let videoDuration = 0;
        
        // Создаем временный видео-элемент для определения длительности
        if (videoFile) {
          const videoElement = document.createElement('video');
          const objectUrl = URL.createObjectURL(videoFile);
          
          // Получаем длительность асинхронно
          videoDuration = await new Promise<number>((resolve) => {
            videoElement.addEventListener('loadedmetadata', () => {
              // Длительность в секундах, округленная до целого числа
              const duration = Math.round(videoElement.duration);
              URL.revokeObjectURL(objectUrl);
              resolve(duration);
            });
            
            // Обработка ошибки загрузки метаданных
            videoElement.addEventListener('error', () => {
              console.error("📊 Error loading video metadata");
              URL.revokeObjectURL(objectUrl);
              resolve(0); // В случае ошибки возвращаем 0
            });
            
            videoElement.src = objectUrl;
            videoElement.load();
          });
          
          console.log("📊 Video duration:", videoDuration, "seconds");
        }
        
        // Отправляем уведомление о загрузке видео для создания записи в БД
        console.log("📊 Sending video notification to create record in database");
        
        const notificationResult = await VideoUploadService.notifyVideoUploaded(
          null, // Не передаем transaction_uniquecode
          originalUrl,
          null, // Не устанавливаем язык на этом этапе
          videoDuration || null // Передаем длительность, если удалось получить
        );
        
        console.log("📊 Notification result:", notificationResult);
        
        // Если уведомление успешно отправлено и создана запись в БД
        if (notificationResult.success && notificationResult.video_id) {
          console.log("📊 Video record created with ID:", notificationResult.video_id);
          
          // Сохраняем ID созданной записи и информацию о видео
          localStorage.setItem('videoDbId', notificationResult.video_id.toString());
          localStorage.setItem('videoDuration', videoDuration.toString());
        }
        
        // Сохраняем информацию о видео локально в любом случае
        localStorage.setItem('videoOriginalUrl', originalUrl);
        
        console.log("📊 Video uploaded successfully, saved details:", { 
          videoId, 
          fileKey, 
          originalUrl,
          videoDuration,
          dbId: notificationResult.video_id
        });
        
        // Переходим к следующему шагу
        if (onUploadSuccess) {
          console.log("📊 Calling onUploadSuccess with:", { videoId, fileKey });
          onUploadSuccess(videoId, fileKey);
        }
      } catch (error) {
        console.error("📊 Error creating video record:", error);
        
        // Вызываем callback для перехода к следующему шагу даже в случае ошибки
        if (onUploadSuccess) {
          console.log("📊 Calling onUploadSuccess after error:", { videoId, fileKey });
          onUploadSuccess(videoId, fileKey);
        }
      }
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
    // При получении файла сверяем с флагом загрузки
    if (videoFile && !isVideoUploaded) {
      const videoInfo = VideoStorageUtils.getVideoInfo();
      
      if (videoInfo.fileName === videoFile.name) {
        setIsVideoUploaded(true);
        VideoStorageUtils.setUploadStatus(true);
      } else {
        setIsVideoUploaded(false);
        VideoStorageUtils.setUploadStatus(false);
      }
    } 
    
    // Если есть файл и флаг загрузки - сохраняем имя файла
    if (videoFile && isVideoUploaded) {
      localStorage.setItem('uploadedFileName', videoFile.name);
    }
  }, [videoFile, isVideoUploaded]);
  
  // Эффект для проверки флага при монтировании компонента
  useEffect(() => {
    // Проверяем, был ли флаг загрузки установлен в localStorage
    if (!videoFile && VideoStorageUtils.getUploadStatus()) {
      setIsVideoUploaded(true);
    }
  }, [videoFile]);

  // Эффект для автоматической загрузки при изменении состояния файла
  useEffect(() => {
    // Если флаг загрузки установлен в localStorage, но нет файла
    if (!videoFile && VideoStorageUtils.getUploadStatus()) {
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
        setIsVideoUploaded(true);
      } else {
        // Для предотвращения множественных загрузок
        sessionStorage.removeItem('upload_retry_attempted');
        setTimeout(() => {
          uploadVideo();
        }, 300);
      }
    }
  }, [videoFile, transactionId, isLoading, uploadProgress, isVideoUploaded]);

  // Индикаторы состояния для рендера
  const hasVideoFile = !!videoFile;
  const isVideoReady = hasVideoFile || isVideoUploaded;

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
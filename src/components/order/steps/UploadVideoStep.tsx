import React, { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { supabase } from "@/integrations/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface UploadVideoStepProps {
  videoFile: File | null;
  setVideoFile: (file: File | null) => void;
  transactionId?: string | null;
  onUploadSuccess?: (videoId: number, fileKey: string) => void;
}

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
  const [isVideoUploaded, setIsVideoUploaded] = useState(() => {
    // Проверяем прямой флаг загрузки
    const flagUploaded = localStorage.getItem('isVideoUploaded') === 'true';
    
    // Как запасной вариант проверяем, есть ли информация о загруженном видео
    const savedVideoId = localStorage.getItem('uploadedVideoId');
    const savedFileKey = localStorage.getItem('uploadedFileKey');
    
    // Возвращаем true, если любая из проверок успешна
    return flagUploaded || !!(savedVideoId && savedFileKey);
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("📊 File selection triggered", e.target.files);
    const files = e.target.files;
    if (files && files[0]) {
      console.log("📊 File selected:", files[0].name);
      // Create URL for video preview
      const fileUrl = URL.createObjectURL(files[0]);
      setVideoSrc(fileUrl);
      setVideoFile(files[0]);
      
      // Start upload automatically
      // Use setTimeout to give UI time to update
      console.log("📊 Scheduling upload...");
      setTimeout(() => {
        console.log("📊 Starting upload from file selection handler");
        uploadVideo();
      }, 100);
    } else {
      console.log("📊 No file selected in file input");
    }
  };

  // Handle drag and drop
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
        // Use setTimeout to give UI time to update
        console.log("📊 Scheduling upload for dropped file...");
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

  // Clear selected file and remove data from localStorage
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
    localStorage.removeItem('isVideoUploaded');
    localStorage.removeItem('uploadedVideoId');
    localStorage.removeItem('uploadedFileKey');
  };

  // Upload video using presigned URL from Supabase Edge Function
  const uploadVideo = async () => {
    console.log("📊 uploadVideo called, videoFile status:", videoFile ? "Selected" : "Not selected");
    
    if (!videoFile) {
      console.error("📊 No video file selected when uploadVideo was called!");
      
      // Try to check if there's a file in the file input as a fallback
      const fileInput = fileInputRef.current;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        console.log("📊 Found file in file input, using it as fallback");
        const file = fileInput.files[0];
        setVideoFile(file);
        
        // Wait a moment and retry
        setTimeout(() => {
          console.log("📊 Retrying upload with file from input:", file.name);
          uploadVideo();
        }, 100);
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
    setIsPreparingUpload(true); // Показываем спиннер на этапе подготовки
    setUploadProgress(0);

    try {
      // Get session and token
      const { data: { session } } = await supabase.auth.getSession();
      console.log("📊 Auth status:", session ? "Authenticated" : "Not authenticated");
      console.log("📊 Transaction ID:", transactionId || "None");
      
      let videoId, fileKey, presignedUrl;
      
      // Demo mode disabled - using real Edge Function for all uploads
      const FORCE_DEMO_MODE = false;

      // For demo mode or unauthenticated users
      if (FORCE_DEMO_MODE || (!session && !transactionId)) {
        console.log("📊 Running in demo mode");
        
        // Delay to show progress
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate dummy video ID and file key
        videoId = Math.floor(Math.random() * 1000);
        fileKey = `demo/${Date.now()}-${videoFile.name}`;
        
        console.log("📊 Demo upload completed:", { videoId, fileKey });
      } else {
        console.log("📊 Running real upload with presigned URL");
        
        // Step 1: Request a presigned URL from the Edge Function
        const effectiveTransactionId = transactionId || `temp-${Date.now()}`;
        
        // Prepare JSON data for requesting presigned URL
        const requestData = {
          fileName: videoFile.name,
          fileType: videoFile.type,
          transactionId: effectiveTransactionId
        };
        
        console.log("📊 Requesting presigned URL:", requestData);

        // Manually construct the URL for the Supabase Edge Function
        const projectRef = 'tbgwudnxjwplqtkjihxc';
        const supabaseUrl = `https://${projectRef}.supabase.co/functions/v1/video-upload`;
        console.log("📊 Edge function URL:", supabaseUrl);
        
        // Create headers for JSON request
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        };
        
        // Add Authorization header if session exists
        if (session) {
          headers.Authorization = `Bearer ${session.access_token}`;
        }
        
        // Request presigned URL
        console.log("📊 Sending request for presigned URL");
        const presignedResponse = await fetch(supabaseUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestData)
        });
        
        console.log("📊 Presigned URL response status:", presignedResponse.status);
        const responseText = await presignedResponse.text();
        console.log("📊 Presigned URL response text:", responseText);
        
        let result;
        try {
          // Try to parse as JSON
          result = JSON.parse(responseText);
        } catch (e) {
          console.error("📊 Failed to parse response as JSON:", e);
          throw new Error("Получен некорректный ответ от сервера");
        }

        if (!presignedResponse.ok) {
          throw new Error(result.error || 'Ошибка получения URL для загрузки');
        }

        // Extract the presigned URL and file key
        presignedUrl = result.presignedUrl;
        fileKey = result.fileKey;
        videoId = result.videoId;
        
        if (!presignedUrl) {
          throw new Error('Не получен URL для загрузки файла');
        }
        
        console.log("📊 Got presigned URL:", presignedUrl);
        console.log("📊 File key:", fileKey);
        
        // Step 2: Upload the file directly to storage using the presigned URL
        console.log("📊 Starting direct upload to storage with presigned URL");
        
        // Переключаемся с подготовки на активную загрузку
        setIsPreparingUpload(false);
        
        // For tracking upload progress with XMLHttpRequest
        const xhr = new XMLHttpRequest();
        
        // Set up promise to track upload completion
        const uploadPromise = new Promise<void>((resolve, reject) => {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 100);
              console.log("📊 Upload progress:", percentComplete, "%");
              setUploadProgress(Math.min(percentComplete, 95)); // Max at 95% until fully confirmed
            }
          });
          
          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              console.log("📊 Upload to storage completed successfully");
              resolve();
            } else {
              console.error("📊 Upload to storage failed:", xhr.status, xhr.statusText);
              reject(new Error(`Ошибка загрузки: ${xhr.status} ${xhr.statusText}`));
            }
          });
          
          xhr.addEventListener('error', () => {
            console.error("📊 Upload to storage failed with network error");
            reject(new Error('Ошибка сети при загрузке файла'));
          });
          
          xhr.addEventListener('abort', () => {
            console.warn("📊 Upload to storage aborted");
            reject(new Error('Загрузка файла отменена'));
          });
        });
        
        // Start the upload
        xhr.open('PUT', presignedUrl);
        xhr.setRequestHeader('Content-Type', videoFile.type);
        xhr.send(videoFile);
        
        // Wait for upload to complete
        await uploadPromise;
        
        console.log("📊 Direct upload successful");
      }
      
      // Set progress to 100%
      setUploadProgress(100);
      setIsPreparingUpload(false); // Загрузка завершена
      
      // Отмечаем, что видео загружено и сохраняем это в localStorage
      setIsVideoUploaded(true);
      localStorage.setItem('isVideoUploaded', 'true');
      
      toast({
        title: "Успех",
        description: "Видео успешно загружено",
      });

      // После полной загрузки и успешного ответа, переходим к следующему шагу через callback
      setTimeout(() => {
        // Call onUploadSuccess callback with the video data
        if (onUploadSuccess) {
          console.log("📊 Calling onUploadSuccess with:", { videoId, fileKey });
          onUploadSuccess(videoId, fileKey);
        }
      }, 500); // Небольшая задержка, чтобы пользователь увидел 100% загрузки
    } catch (error) {
      console.error("📊 Upload error:", error);
      setIsVideoUploaded(false); // Сбрасываем флаг при ошибке
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

  // Восстанавливаем информацию о видео при монтировании компонента
  useEffect(() => {
    // Проверяем, нужно ли загрузить сохраненные данные о видео
    const savedVideoId = localStorage.getItem('uploadedVideoId');
    const savedFileKey = localStorage.getItem('uploadedFileKey');
    
    console.log("📊 Checking for saved video:", { savedVideoId, savedFileKey, videoFile });
    
    // Если в localStorage есть данные о загруженном видео, но нет самого файла
    if (savedVideoId && savedFileKey && !videoFile) {
      console.log("📊 Found saved video data, setting uploaded state", savedVideoId, savedFileKey);
      // Помечаем видео как загруженное, но без отображения самого файла (его нет в памяти)
      setIsVideoUploaded(true);
    }
  }, [videoFile]);

  // Check component props and start upload when videoFile becomes available
  useEffect(() => {
    console.log("📊 UploadVideoStep props changed:", { 
      videoFile: videoFile?.name, 
      transactionId, 
      isVideoUploaded,
      uploadProgress
    });
    
    // Загружаем видео только если:
    // 1. Есть файл видео
    // 2. Не идет загрузка в данный момент
    // 3. Прогресс загрузки 0 (не начата)
    // 4. Видео еще не было загружено ранее
    if (videoFile && !isLoading && uploadProgress === 0 && !isVideoUploaded) {
      console.log("📊 VideoFile detected in component, starting upload automatically");
      // Use setTimeout to avoid immediate upload that might conflict with state updates
      setTimeout(() => {
        uploadVideo();
      }, 300);
    }
  }, [videoFile, transactionId, isLoading, uploadProgress, isVideoUploaded]);

  return (
    <div className="fade-slide-in">
      <h2 className="text-xl font-semibold mb-6">Загрузите ваше видео</h2>

      {!videoFile && !isVideoUploaded ? (
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
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-lg">Выбранное видео</h3>
                <button
                  onClick={clearSelection}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              {/* Если файл есть в состоянии, показываем информацию о нем */}
              {videoFile ? (
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
              ) : (
                /* Если файла нет, но он был загружен ранее (по данным из localStorage) */
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
                        Файл уже обрабатывается на сервере
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Кнопка загрузки в случае, если автоматическая загрузка не сработает */}
              {!isLoading && !isVideoUploaded && uploadProgress === 0 && (
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
              
              {/* Если видео загружено, показываем сообщение об успехе */}
              {isVideoUploaded && !isLoading && (
                <div className="mt-4">
                  <div className="flex items-center justify-center text-sm text-green-600 bg-green-50 p-2 rounded-md border border-green-200">
                    <Icon name="CheckCircle" className="mr-2 h-4 w-4" />
                    Видео успешно загружено и готово к обработке
                  </div>
                </div>
              )}
              
              {/* Кнопка для выбора другого видео, если текущее уже загружено */}
              {isVideoUploaded && !videoFile && (
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      clearSelection();
                      // Давайте пользователю выбрать новый файл
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
import { supabase } from "@/integrations/supabase";

/**
 * Интерфейс для результата получения presigned URL
 */
interface PresignedUrlResult {
  presignedUrl: string;
  fileKey: string;
  videoId: number;
}

/**
 * Интерфейс для результата демо-загрузки
 */
interface DemoUploadResult {
  videoId: number;
  fileKey: string;
}

/**
 * Интерфейс для уведомления о видео
 */
interface VideoNotification {
  transaction_uniquecode?: string; // опционально
  original_url: string; // обязательно
  duration?: number; // опционально
  output_language?: string; // опционально
  status?: string; // опционально
}

/**
 * Сервис для работы с API загрузки видео
 */
const VideoUploadService = {
  /**
   * Получение presigned URL для загрузки файла
   * @param videoFile - видео-файл для загрузки
   * @param transactionId - ID транзакции
   * @returns Объект с presigned URL, ID видео и ключом файла
   */
  getPresignedUrl: async (videoFile: File, transactionId: string | null): Promise<PresignedUrlResult> => {
    const { data: { session } } = await supabase.auth.getSession();
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

    return {
      presignedUrl: result.presignedUrl,
      fileKey: result.fileKey,
      videoId: result.videoId
    };
  },
  
  /**
   * Отправка уведомления о загруженном видео
   * @param transactionUniqueCode - уникальный код транзакции
   * @param originalUrl - URL загруженного видео
   * @param outputLanguage - язык перевода
   * @param duration - длительность видео в секундах (если известна)
   * @returns Promise с результатом API вызова
   */
  notifyVideoUploaded: async (
    transactionUniqueCode: string | null,
    originalUrl: string,
    outputLanguage: string | null = null,
    duration: number | null = null
  ): Promise<{ success: boolean; video_id?: number }> => {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Prepare notification data - включаем только обязательные поля
    const notificationData: VideoNotification = {
      original_url: originalUrl,
      status: 'uploaded'
    };
    
    // Добавляем опциональные поля, только если они предоставлены
    if (transactionUniqueCode) {
      notificationData.transaction_uniquecode = transactionUniqueCode;
    }
    
    if (outputLanguage) {
      notificationData.output_language = outputLanguage;
    }
    
    if (duration !== null && duration !== undefined) {
      notificationData.duration = duration;
    }
    
    console.log("📊 Sending video upload notification:", notificationData);

    // Manually construct the URL for the Supabase Edge Function
    const projectRef = 'tbgwudnxjwplqtkjihxc';
    const notificationUrl = `https://${projectRef}.supabase.co/functions/v1/video-notification`;
    
    // Create headers for JSON request
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    // Add Authorization header if session exists
    if (session) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }
    
    try {
      // Send notification to backend
      const notificationResponse = await fetch(notificationUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(notificationData)
      });
      
      console.log("📊 Notification response status:", notificationResponse.status);
      
      if (!notificationResponse.ok) {
        const errorText = await notificationResponse.text();
        console.error("📊 Notification failed:", errorText);
        return { success: false };
      }
      
      const result = await notificationResponse.json();
      console.log("📊 Notification response:", result);
      
      return { 
        success: result.success, 
        video_id: result.video_id 
      };
    } catch (error) {
      console.error("📊 Error sending notification:", error);
      return { success: false };
    }
  },
  
  /**
   * Метод для загрузки видео в демо-режиме (без сервера)
   * @param videoFile - видео-файл для загрузки
   * @returns Объект с ID видео и ключом файла
   */
  uploadDemoVideo: async (videoFile: File): Promise<DemoUploadResult> => {
    // Delay to show progress
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate dummy video ID and file key
    const videoId = Math.floor(Math.random() * 1000);
    const fileKey = `demo/${Date.now()}-${videoFile.name}`;
    
    console.log("📊 Demo upload completed:", { videoId, fileKey });
    
    return { videoId, fileKey };
  }
};

export default VideoUploadService;
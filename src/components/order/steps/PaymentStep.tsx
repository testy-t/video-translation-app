import React, { useState, useEffect } from "react";

// Импорт типов
import { PaymentStepProps } from "../payment/types";

// Импорт компонентов
import OrderDetails from "../payment/OrderDetails";
import OrderSummary from "../payment/OrderSummary";

// Импорт хуков
import { useOrderPrice } from "../payment/hooks/useOrderPrice";
import { getLanguageName } from "../language-selector/languages-data";

/**
 * Компонент шага оплаты в процессе заказа
 * Отвечает за выбор способа оплаты и подтверждение заказа
 */
const PaymentStep: React.FC<PaymentStepProps> = ({
  videoFile,
  selectedLanguage,
  videoDuration,
  onPayment,
}) => {
  // Состояние процесса оплаты
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Получаем ID видео и ключ файла из localStorage
  const videoId = localStorage.getItem('uploadedVideoId') 
    ? parseInt(localStorage.getItem('uploadedVideoId') || '0') 
    : null;
  const fileKey = localStorage.getItem('uploadedFileKey');
  
  // Состояние для хранения информации о видео
  const [videoInfo, setVideoInfo] = useState<{
    duration: number;
    outputLanguage: string;
    outputLanguageName: string;
  } | null>(null);
  
  // Состояние загрузки данных
  const [isLoading, setIsLoading] = useState(false);
  
  // Функция для загрузки информации о видео из API
  const fetchVideoInfo = async () => {
    if (!videoId || !fileKey) {
      console.log('⚠️ Нет данных для загрузки информации о видео', { videoId, fileKey });
      return;
    }
    
    try {
      console.log('🔄 Начинаем загрузку информации о видео', { videoId, fileKey });
      setIsLoading(true);
      
      // Всегда делаем запрос к video-info
      
      console.log('🔄 Отправляем запрос к API');
      
      // Вызываем функцию video-info по образцу из VideoUploadService
      const projectRef = 'tbgwudnxjwplqtkjihxc';
      const supabaseUrl = `https://${projectRef}.supabase.co/functions/v1/video-info`;
      console.log("📊 Edge function URL:", supabaseUrl);
      
      // Создаем заголовки для JSON запроса
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      const response = await fetch(supabaseUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          videoId,
          fileKey,
          outputLanguage: localStorage.getItem("selectedLanguage") || selectedLanguage || "en"
        })
      });
      
      // По образцу из VideoUploadService
      console.log("📊 API response status:", response.status);
      const responseText = await response.text();
      
      let data;
      try {
        // Пробуем распарсить как JSON
        data = JSON.parse(responseText);
        console.log("📊 Parsed response data:", data);
      } catch (e) {
        console.error("📊 Failed to parse response as JSON:", e, "Response was:", responseText);
        throw new Error("Получен некорректный ответ от сервера");
      }

      if (!response.ok) {
        console.error(`Ошибка API: ${response.status}`);
        throw new Error(data.error || "Не удалось получить информацию о видео");
      }
      console.log('✅ Получены данные о видео из API:', data);
      
      // Преобразуем данные и сохраняем в состояние
      const videoData = {
        duration: data.duration || videoDuration || 180,
        outputLanguage: data.outputLanguage || selectedLanguage || "en",
        outputLanguageName: getLanguageName(data.outputLanguage || selectedLanguage || "en")
      };
      
      console.log('✅ Преобразованные данные о видео:', videoData);
      setVideoInfo(videoData);
      
      // Сохраняем в localStorage
      localStorage.setItem('videoDuration', videoData.duration.toString());
      localStorage.setItem('selectedLanguage', videoData.outputLanguage);
      
    } catch (err) {
      console.error("Ошибка при получении информации о видео:", err);
      
      // В случае ошибки используем данные из props
      setVideoInfo({
        duration: videoDuration || 180,
        outputLanguage: selectedLanguage || "en",
        outputLanguageName: getLanguageName(selectedLanguage || "en")
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Эффект для загрузки данных о видео при монтировании компонента
  useEffect(() => {
    console.log('🔄 Компонент PaymentStep смонтирован');
    
    // Загружаем данные о видео при монтировании
    fetchVideoInfo();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Пустой массив зависимостей - вызывается только при монтировании
  
  // Используем длительность из API, если доступна, иначе из пропсов
  const actualDuration = videoInfo?.duration || videoDuration;
  const actualLanguage = videoInfo?.outputLanguage || selectedLanguage;
  const actualLanguageName = videoInfo?.outputLanguageName;
  
  // Получаем цену заказа из хука
  const price = useOrderPrice(videoFile, actualDuration);

  /**
   * Обработчик отправки платежа
   * Имитирует процесс оплаты и вызывает колбэк onPayment при успехе
   */
  const handleSubmitPayment = () => {
    setIsProcessing(true);

    // Имитация обработки платежа
    setTimeout(() => {
      setIsProcessing(false);
      onPayment();
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      {/* Информация о заказе (3 колонки) */}
      <div className="md:col-span-3">
        <OrderDetails
          videoFile={videoFile}
          selectedLanguage={actualLanguage}
          videoDuration={actualDuration}
          languageName={actualLanguageName}
          isLoading={isLoading}
        />
      </div>

      {/* Итого (2 колонки) */}
      <div className="md:col-span-2">
        <OrderSummary
          price={price}
          isProcessing={isProcessing}
          onPayment={handleSubmitPayment}
          videoDuration={actualDuration}
        />
      </div>
    </div>
  );
};

export default PaymentStep;

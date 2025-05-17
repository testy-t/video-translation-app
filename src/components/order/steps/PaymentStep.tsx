import React, { useState, useEffect } from "react";

// Импорт типов
import { PaymentStepProps } from "../payment/types";

// Импорт компонентов
import OrderDetails from "../payment/OrderDetails";
import OrderSummary from "../payment/OrderSummary";

// Импорт хуков
import { useOrderPrice } from "../payment/hooks/useOrderPrice";
// Больше не импортируем контекст, т.к. используем его в OrderDetails

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
  // Больше не нуждаемся в явном доступе к контексту здесь, 
  // т.к. OrderDetails сам получает данные из контекста
  
  // Состояние процесса оплаты
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Получаем ID видео и ключ файла из localStorage
  // Используем videoDbId, который устанавливается на шаге выбора языка,
  // вместо uploadedVideoId, т.к. он является правильным ID в базе данных
  const videoId = localStorage.getItem('videoDbId') 
    ? parseInt(localStorage.getItem('videoDbId') || '0') 
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
      // Если нет ID видео, показываем ошибку и перенаправляем на шаг загрузки
      toast({
        title: "Ошибка",
        description: "Не найдена информация о загруженном видео. Пожалуйста, загрузите видео заново.",
        variant: "destructive",
      });
      
      // Очищаем данные и перенаправляем
      setTimeout(() => {
        window.location.href = '/order?step=0';
      }, 2000);
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
        const errorMessage = data.error || `Ошибка API: ${response.status}`;
        console.error(errorMessage, data);
        
        // Показываем пользователю информацию об ошибке
        toast({
          title: "Ошибка получения информации о видео",
          description: data.message || errorMessage,
          variant: "destructive",
        });
        
        // Очищаем некорректные данные из localStorage
        if (response.status === 404) {
          localStorage.removeItem('videoDbId');
          localStorage.removeItem('uploadedVideoId');
          localStorage.removeItem('uploadedFileKey');
          localStorage.removeItem('videoDuration');
          
          // Перенаправляем на шаг загрузки, так как видео не найдено
          window.location.href = '/order?step=0';
          throw new Error("Видео не найдено. Перенаправление на шаг загрузки...");
        }
        
        throw new Error(errorMessage);
      }
      
      if (!data.success) {
        console.error('Ошибка данных API:', data);
        throw new Error(data.error || "Некорректные данные от API");
      }
      
      console.log('✅ Получены данные о видео из API:', data);
      
      // Проверяем, что в данных точно есть необходимые поля
      if (!data.duration) {
        throw new Error("В ответе API отсутствует длительность видео");
      }
      
      // Преобразуем данные и сохраняем в состояние
      const languageCode = data.outputLanguage || selectedLanguage || "en";
      const videoData = {
        duration: data.duration,
        outputLanguage: languageCode
      };
      
      console.log(`✅ Получен язык перевода: ${languageCode}`);
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
  
  // Больше не нужно получать имя языка здесь, т.к. это делается в OrderDetails
  // с помощью контекста
  
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
    <div className="flex flex-col max-w-2xl mx-auto">
      {/* Информация о заказе (по центру) */}
      <OrderDetails
        videoFile={videoFile}
        selectedLanguage={actualLanguage}
        videoDuration={actualDuration}
        isLoading={isLoading}
        price={price}
        isProcessing={isProcessing}
        onPayment={handleSubmitPayment}
      />
    </div>
  );
};

export default PaymentStep;

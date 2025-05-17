import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase";
import { toast } from "@/components/ui/use-toast";

/**
 * Hook for managing the order process
 */
export const useOrderProcess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get initial step from URL if available
  const getInitialStep = () => {
    const params = new URLSearchParams(location.search);
    const step = params.get("step");
    return step ? parseInt(step) : 0;
  };
  
  const [currentStep, setCurrentStep] = useState(getInitialStep());
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [transactionId, setTransactionId] = useState<string | null>(null);
  // Initialize state with values from localStorage if available
  const [videoId, setVideoId] = useState<number | null>(() => {
    const savedId = localStorage.getItem('uploadedVideoId');
    return savedId ? parseInt(savedId, 10) : null;
  });
  const [fileKey, setFileKey] = useState<string | null>(() => 
    localStorage.getItem('uploadedFileKey')
  );
  const [isUploading, setIsUploading] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number>(() => {
    const savedDuration = localStorage.getItem('videoDuration');
    return savedDuration ? parseInt(savedDuration) : 180; // По умолчанию 3 минуты
  });
  
  // Process steps
  const steps = [
    { id: "upload", title: "Загрузите видео", icon: "Upload" },
    { id: "language", title: "Выберите язык", icon: "Languages" },
    { id: "payment", title: "Оплатите", icon: "CreditCard" },
    { id: "result", title: "Получите результат", icon: "Download" },
  ];

  // Update URL when step changes
  useEffect(() => {
    navigate(`/order?step=${currentStep}`, { replace: true });
  }, [currentStep, navigate]);
  
  // Create transaction and restore data when component mounts
  useEffect(() => {
    const setupOrderProcess = async () => {
      try {
        // Если мы переходим на шаг 0 (загрузка видео) из шага оплаты (например, "создать еще одно видео"),
        // то очищаем предыдущие данные о видео
        const params = new URLSearchParams(location.search);
        const step = parseInt(params.get("step") || "0");
        const prevStep = parseInt(sessionStorage.getItem("previousStep") || "0");
        
        // Сохраняем текущий шаг для последующего сравнения
        sessionStorage.setItem("previousStep", step.toString());
        
        // Если перешли к шагу загрузки с шага оплаты или результата - сбрасываем старые данные
        if (step === 0 && (prevStep === 2 || prevStep === 3)) {
          console.log("📊 Reset video data when coming back to upload step from payment or result");
          // Импортируем VideoStorageUtils для очистки данных
          const { default: VideoStorageUtils } = await import('@/components/order/steps/upload-video/utils/VideoStorageUtils');
          VideoStorageUtils.clearVideoInfo();
          setVideoFile(null);
          setVideoId(null);
          setFileKey(null);
          // Создаем новую транзакцию
        } else {
          // Пытаемся восстановить данные предыдущего заказа из localStorage
          const savedVideoId = localStorage.getItem('uploadedVideoId');
          const savedFileKey = localStorage.getItem('uploadedFileKey');
          const savedTransactionId = localStorage.getItem('transactionId');
          
          // Если есть данные о предыдущей загрузке, восстанавливаем их
          if (savedVideoId && savedFileKey) {
            setVideoId(parseInt(savedVideoId));
            setFileKey(savedFileKey);
            
            // Если был сохранен ID транзакции, используем его
            if (savedTransactionId) {
              setTransactionId(savedTransactionId);
              return; // Пропускаем создание новой транзакции
            }
          }
        }
        
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // User is authenticated, create regular transaction
          const { data, error } = await supabase
            .from('transactions')
            .insert({
              user_id: session.user.id,
              product_id: 1, // Default product ID, could be changed later
              amount: 0, // Will be updated after video analysis
              status: 'pending'
            })
            .select()
            .single();
  
          if (error) {
            throw error;
          }
  
          if (data) {
            setTransactionId(data.id);
          }
        } else {
          // User is not authenticated, create anonymous transaction
          // This is a simplified version - in a real app you might want to handle this differently
          // For demo purposes, we'll just create a "guest" transaction or use a UUID-based approach
          const guestId = 'guest-' + Math.random().toString(36).substring(2, 15);
          
          // Create a dummy transaction ID for demo purposes
          const tempTransactionId = 'temp-' + Date.now().toString();
          setTransactionId(tempTransactionId);
          
          console.log("Created temporary transaction for guest user", tempTransactionId);
        }
      } catch (error) {
        console.error("Error setting up order process:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось создать заказ. Пожалуйста, попробуйте позже.",
          variant: "destructive",
        });
      }
    };

    setupOrderProcess();
  }, []);
  
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      // Проверка перед переходом со шага загрузки видео на шаг выбора языка
      if (currentStep === 0) {
        const isUploaded = localStorage.getItem('isVideoUploaded') === 'true';
        const hasVideoId = !!localStorage.getItem('uploadedVideoId');
        const hasFileKey = !!localStorage.getItem('uploadedFileKey');
        
        console.log("Navigation: checking video data before proceeding:", { 
          isUploaded, hasVideoId, hasFileKey 
        });
        
        // Если нет данных о загруженном видео, не переходим дальше
        if (!isUploaded && !(hasVideoId && hasFileKey)) {
          console.error("Cannot proceed - no video data available");
          toast({
            title: "Необходимо загрузить видео",
            description: "Пожалуйста, загрузите видео перед тем, как продолжить",
            variant: "destructive",
          });
          return;
        }
      }
      
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0); // Scroll to top when changing steps
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle successful video upload
  const handleUploadSuccess = (videoId: number, fileKey: string, duration?: number) => {
    setVideoId(videoId);
    setFileKey(fileKey);
    
    // Если передана длительность, обновляем ее
    if (duration) {
      setVideoDuration(duration);
    }
    
    // Сохраняем информацию о видео в localStorage для возможности восстановления при навигации
    try {
      localStorage.setItem('uploadedVideoId', videoId.toString());
      localStorage.setItem('uploadedFileKey', fileKey);
      localStorage.setItem('transactionId', transactionId || '');
      localStorage.setItem('isVideoUploaded', 'true'); // Ensure this flag is always set
      
      // Сохраняем длительность видео
      if (duration) {
        localStorage.setItem('videoDuration', duration.toString());
      }
    } catch (e) {
      console.error("Failed to save video info to localStorage:", e);
    }
    
    // Добавляем небольшую задержку перед переходом, чтобы состояние успело обновиться
    setTimeout(() => {
      goToNextStep();
    }, 100);
  };

  // Handle language selection and process video info
  const handleLanguageSelection = async (language: string) => {
    // Пытаемся восстановить ID видео из localStorage, если оно не установлено в состоянии
    const effectiveVideoId = videoId || parseInt(localStorage.getItem('uploadedVideoId') || '0');
    const effectiveFileKey = fileKey || localStorage.getItem('uploadedFileKey');
    const effectiveTransactionId = transactionId || localStorage.getItem('transactionId');
    
    if (!effectiveVideoId || !effectiveFileKey) {
      toast({
        title: "Ошибка",
        description: "Сначала загрузите видео",
        variant: "destructive",
      });
      return;
    }
    
    // Обновляем состояние, если значения были получены из localStorage
    if (!videoId && effectiveVideoId) {
      setVideoId(effectiveVideoId);
    }
    if (!fileKey && effectiveFileKey) {
      setFileKey(effectiveFileKey);
    }

    setIsUploading(true);
    setSelectedLanguage(language);
    
    // Сохраняем выбранный язык в localStorage
    localStorage.setItem('selectedLanguage', language);

    try {
      // Пробуем использовать наш новый метод уведомления для обновления языка перевода
      try {
        // Импортируем сервис для отправки уведомлений
        const { default: VideoUploadService } = await import('@/components/order/steps/upload-video/services/VideoUploadService');
        
        // Создаем URL оригинального видео
        const S3_ENDPOINT = "https://storage.yandexcloud.net";
        const S3_BUCKET = "golosok"; // Правильное имя бакета
        const originalUrl = `${S3_ENDPOINT}/${S3_BUCKET}/${effectiveFileKey}`;
        
        // Используем временный код для анонимного пользователя
        const transactionUniqueCode = `temp_${Date.now()}`;
        
        console.log("📊 Updating video with selected language:", {
          transactionUniqueCode,
          originalUrl,
          language
        });
        
        // Отправляем уведомление с обновленным языком
        const notificationResult = await VideoUploadService.notifyVideoUploaded(
          transactionUniqueCode,
          originalUrl,
          language
        );
        
        console.log("📊 Language update notification result:", notificationResult);
      } catch (error) {
        console.error("📊 Error updating video language:", error);
        // Продолжаем выполнение даже при ошибке
      }
      
      // Move to payment step
      goToNextStep();
    } catch (error) {
      console.error("Error processing video info:", error);
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла ошибка при обработке видео",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Обработчик успешной оплаты
   * Вызывается после успешного завершения оплаты через CloudPayments
   * или после подтверждения статуса оплаты через API
   * @param uniqueCode - Уникальный код транзакции
   */
  const handlePayment = (uniqueCode?: string) => {
    console.log("🔄 Обработка успешной оплаты");
    
    // Получаем uniqueCode из параметра или из localStorage
    const paymentUniqueCode = uniqueCode || localStorage.getItem('paymentUniqueCode');
    
    if (!paymentUniqueCode) {
      console.error("Не найден код транзакции при обработке оплаты");
      toast({
        title: "Ошибка",
        description: "Не удалось идентифицировать платеж. Пожалуйста, свяжитесь с поддержкой.",
        variant: "destructive",
      });
      return;
    }
    
    // Сохраняем текущий uniquecode
    localStorage.setItem('paymentUniqueCode', paymentUniqueCode);
    localStorage.setItem('orderPaid', 'true');
    
    // Добавляем uniquecode в набор завершенных платежей
    // Получаем существующие коды или создаем новый набор
    const existingUniqueCodesStr = localStorage.getItem('completedPaymentCodes') || '[]';
    let completedPaymentCodes = [];
    try {
      completedPaymentCodes = JSON.parse(existingUniqueCodesStr);
      // Проверяем, что это действительно массив
      if (!Array.isArray(completedPaymentCodes)) {
        completedPaymentCodes = [];
      }
    } catch (e) {
      console.error('Ошибка при разборе строки completedPaymentCodes:', e);
      completedPaymentCodes = [];
    }
    
    // Добавляем текущий код, если его еще нет в массиве
    if (!completedPaymentCodes.includes(paymentUniqueCode)) {
      completedPaymentCodes.push(paymentUniqueCode);
      localStorage.setItem('completedPaymentCodes', JSON.stringify(completedPaymentCodes));
    }
    
    // Сохраняем информацию о заказе
    const orderInfo = {
      uniquecode: paymentUniqueCode,
      date: new Date().toISOString(),
      email: localStorage.getItem('userEmail') || '',
      language: localStorage.getItem('selectedLanguage') || '',
      videoDuration: localStorage.getItem('videoDuration') || ''
    };
    
    // Сохраняем информацию о заказе
    localStorage.setItem(`order_${paymentUniqueCode}`, JSON.stringify(orderInfo));
    
    // Генерируем номер заказа
    const randomOrderId = Math.floor(Math.random() * 1000000);
    setOrderNumber(`OR-${randomOrderId}`);
    localStorage.setItem('orderNumber', `OR-${randomOrderId}`);
    
    // Обновляем статус транзакции в БД, если есть transactionId
    if (transactionId) {
      supabase
        .from('transactions')
        .update({ status: 'paid' })
        .eq('id', transactionId)
        .then(({ error }) => {
          if (error) {
            console.error("Error updating transaction:", error);
          } else {
            console.log("Transaction status updated to 'paid'");
          }
        });
    }
    
    // Переходим к следующему шагу с параметром uniquecode
    navigate(`/order?step=3&uniquecode=${paymentUniqueCode}`, { replace: true });
    setCurrentStep(3); // Устанавливаем текущий шаг на результат
    
    // Показываем уведомление об успешной оплате
    toast({
      title: "Оплата выполнена",
      description: "Ваш видеоролик обрабатывается. Результат будет готов в течение 15 минут.",
      variant: "default",
    });
  };
  
  // Получаем uniquecode из URL, если есть
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const uniqueCode = params.get("uniquecode");
    const step = parseInt(params.get("step") || "0");
    
    console.log("🔍 Проверяем URL параметры:", { uniqueCode, step });
    
    // Если есть uniquecode и мы на шаге результата, проверяем статус оплаты
    if (uniqueCode && step === 3) {
      console.log("✅ Найден uniquecode в URL:", uniqueCode);
      
      // Сохраняем для использования позже
      localStorage.setItem('paymentUniqueCode', uniqueCode);
      
      // Проверяем статус оплаты через API
      const checkPaymentStatus = async () => {
        try {
          console.log("🔄 Проверяем статус оплаты для:", uniqueCode);
          const response = await fetch(`https://tbgwudnxjwplqtkjihxc.supabase.co/functions/v1/transaction-info?uniquecode=${uniqueCode}`);
          const data = await response.json();
          
          console.log("📊 Статус оплаты:", data);
          
          if (data.is_paid) {
            // Если оплачено, сохраняем информацию о заказе
            console.log("✅ Оплата подтверждена");
            localStorage.setItem('orderPaid', 'true');
            
            // Сохраняем информацию о видео, если она доступна
            if (data.video) {
              console.log("📊 Информация о видео получена:", data.video);
              localStorage.setItem(`video_info_${uniqueCode}`, JSON.stringify(data.video));
            }
            
            // Сохраняем информацию о заказе
            const orderInfo = {
              uniquecode: uniqueCode,
              date: new Date().toISOString(),
              email: localStorage.getItem('userEmail') || '',
              language: localStorage.getItem('selectedLanguage') || '',
              videoDuration: localStorage.getItem('videoDuration') || '',
              is_activated: data.is_activated || false,
              status: data.status || 'pending',
              videoInfo: data.video || null
            };
            
            // Добавляем uniquecode в список завершенных платежей, если его там еще нет
            try {
              const existingUniqueCodesStr = localStorage.getItem('completedPaymentCodes') || '[]';
              let completedPaymentCodes = [];
              try {
                completedPaymentCodes = JSON.parse(existingUniqueCodesStr);
                if (!Array.isArray(completedPaymentCodes)) {
                  completedPaymentCodes = [];
                }
              } catch (e) {
                completedPaymentCodes = [];
              }
              
              if (!completedPaymentCodes.includes(uniqueCode)) {
                completedPaymentCodes.push(uniqueCode);
                localStorage.setItem('completedPaymentCodes', JSON.stringify(completedPaymentCodes));
              }
              
              localStorage.setItem(`order_${uniqueCode}`, JSON.stringify(orderInfo));
            } catch (e) {
              console.error("Ошибка при сохранении данных заказа:", e);
            }
            
            // Обновляем номер заказа
            if (!orderNumber) {
              const randomOrderId = Math.floor(Math.random() * 1000000);
              const newOrderNumber = `OR-${randomOrderId}`;
              setOrderNumber(newOrderNumber);
              localStorage.setItem('orderNumber', newOrderNumber);
            }
          } else {
            // Если не оплачено, перенаправляем на шаг оплаты
            console.log("⚠️ Оплата не подтверждена, перенаправляем на шаг оплаты");
            navigate(`/order?step=2`, { replace: true });
            setCurrentStep(2);
            toast({
              title: "Платеж не найден",
              description: "Статус оплаты не подтвержден. Пожалуйста, завершите оплату.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Ошибка при проверке статуса оплаты:", error);
          toast({
            title: "Ошибка",
            description: "Не удалось проверить статус оплаты. Пожалуйста, попробуйте еще раз.",
            variant: "destructive",
          });
        }
      };
      
      checkPaymentStatus();
    } else if (step === 3 && !uniqueCode) {
      // Если мы на шаге результата, но нет uniquecode, проверяем в localStorage
      console.log("⚠️ Шаг результата без uniquecode в URL");
      const savedUniqueCode = localStorage.getItem('paymentUniqueCode');
      
      if (savedUniqueCode) {
        // Если есть сохраненный uniquecode, добавляем его в URL
        console.log("✅ Найден сохраненный uniquecode:", savedUniqueCode);
        navigate(`/order?step=3&uniquecode=${savedUniqueCode}`, { replace: true });
      } else {
        // Если нет uniquecode, перенаправляем на шаг оплаты
        console.log("⚠️ Нет uniquecode, перенаправляем на шаг оплаты");
        navigate(`/order?step=2`, { replace: true });
        setCurrentStep(2);
        toast({
          title: "Информация о платеже не найдена",
          description: "Пожалуйста, завершите процесс оплаты.",
          variant: "destructive",
        });
      }
    }
  }, [location.search, navigate, orderNumber]);

  /**
   * Получает историю заказов из localStorage
   * @returns Массив информации о заказах
   */
  const getOrderHistory = () => {
    // Получаем список кодов заказов
    const uniqueCodesStr = localStorage.getItem('completedPaymentCodes') || '[]';
    let uniqueCodes = [];
    
    try {
      uniqueCodes = JSON.parse(uniqueCodesStr);
      // Проверяем, что это действительно массив
      if (!Array.isArray(uniqueCodes)) {
        console.error('completedPaymentCodes не является массивом');
        return [];
      }
    } catch (e) {
      console.error('Ошибка при разборе completedPaymentCodes:', e);
      return [];
    }
    
    // Получаем информацию по каждому заказу
    const orderHistory = uniqueCodes.map(code => {
      const orderInfoStr = localStorage.getItem(`order_${code}`);
      if (!orderInfoStr) return null;
      
      try {
        const orderInfo = JSON.parse(orderInfoStr);
        return {
          ...orderInfo,
          // Преобразуем строку даты в объект Date
          date: new Date(orderInfo.date),
        };
      } catch (e) {
        console.error(`Ошибка при разборе информации о заказе ${code}:`, e);
        return null;
      }
    }).filter(Boolean); // Фильтруем null значения
    
    // Сортируем по дате (от новых к старым)
    return orderHistory.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  return {
    currentStep,
    steps,
    videoFile,
    setVideoFile,
    selectedLanguage,
    setSelectedLanguage,
    handleLanguageSelection,
    orderNumber,
    goToNextStep,
    goToPreviousStep,
    handlePayment,
    transactionId,
    handleUploadSuccess,
    isUploading,
    videoDuration,
    getOrderHistory // Добавляем новую функцию
  };
};
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "react-router-dom";
import { VideoInfo } from "../payment/types";
import PaymentService from "../payment/services/PaymentService";
import { toast } from "@/components/ui/use-toast";

interface ResultStepProps {
  orderNumber: string;
}

const ResultStep: React.FC<ResultStepProps> = ({ orderNumber }) => {
  // Состояние видео и обработки
  const [isComplete, setIsComplete] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [processingStage, setProcessingStage] = useState(0);
  const [pollingTimerId, setPollingTimerId] = useState<number | null>(null);
  const [isPollingActive, setIsPollingActive] = useState(false);
  const [uniqueCode, setUniqueCode] = useState<string | null>(null);
  
  // Получаем uniquecode из URL
  const location = useLocation();
  
  const processingStages = [
    "Инициализация нейросети",
    "Анализ исходного видео",
    "Распознавание речи",
    "Перевод контента",
    "Синхронизация движения губ",
    "Финальная обработка",
  ];
  
  // Обработчик получения готового видео
  const handleVideoReady = (videoData: VideoInfo) => {
    console.log("✅ Получена информация о готовом видео:", videoData);
    setVideoInfo(videoData);
    setIsComplete(true);
    setIsPollingActive(false);
    
    toast({
      title: "Видео готово",
      description: "Ваше переведенное видео готово к скачиванию!",
      variant: "default",
    });
  };

  // Эффект для получения uniquecode из URL и запуска поллинга
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("uniquecode");
    
    if (code) {
      console.log("📋 Найден uniquecode в URL:", code);
      setUniqueCode(code);
      
      // Проверяем, есть ли в localStorage информация о готовом видео
      const savedVideoInfo = localStorage.getItem(`video_info_${code}`);
      if (savedVideoInfo) {
        try {
          const parsedInfo = JSON.parse(savedVideoInfo);
          if (parsedInfo.status === 'completed' && parsedInfo.output_url) {
            console.log("📋 Найдена информация о готовом видео в localStorage");
            setVideoInfo(parsedInfo);
            setIsComplete(true);
            return;
          }
        } catch (e) {
          console.error("Ошибка при разборе данных о видео из localStorage:", e);
        }
      }
      
      // Запускаем поллинг статуса видео, если его еще нет
      if (!isPollingActive && !isComplete && !videoInfo) {
        console.log("🔄 Запуск поллинга статуса видео...");
        setIsPollingActive(true);
        
        const timerId = PaymentService.startVideoActivationPolling(
          code,
          handleVideoReady
        );
        
        setPollingTimerId(timerId);
      }
    } else {
      console.warn("⚠️ uniquecode не найден в URL");
      
      // Пробуем получить uniquecode из localStorage
      const savedUniqueCode = localStorage.getItem('paymentUniqueCode');
      if (savedUniqueCode) {
        console.log("📋 Найден uniquecode в localStorage:", savedUniqueCode);
        setUniqueCode(savedUniqueCode);
        
        // Проверяем, есть ли в localStorage информация о готовом видео
        const savedVideoInfo = localStorage.getItem(`video_info_${savedUniqueCode}`);
        if (savedVideoInfo) {
          try {
            const parsedInfo = JSON.parse(savedVideoInfo);
            if (parsedInfo.status === 'completed' && parsedInfo.output_url) {
              console.log("📋 Найдена информация о готовом видео в localStorage");
              setVideoInfo(parsedInfo);
              setIsComplete(true);
              return;
            }
          } catch (e) {
            console.error("Ошибка при разборе данных о видео из localStorage:", e);
          }
        }
      }
    }
  }, [location.search, isPollingActive, isComplete, videoInfo]);
  
  // Эффект для периодической смены стадии обработки
  useEffect(() => {
    if (isComplete) return;
    
    const stageInterval = setInterval(() => {
      setProcessingStage((prev) => {
        if (prev >= processingStages.length - 1) {
          return 0; // Зацикливаем стадии
        }
        return prev + 1;
      });
    }, 5000);
    
    return () => {
      clearInterval(stageInterval);
    };
  }, [isComplete, processingStages.length]);
  
  // Эффект для очистки таймера поллинга при размонтировании компонента
  useEffect(() => {
    return () => {
      if (pollingTimerId) {
        console.log("🛑 Остановка поллинга при размонтировании компонента");
        window.clearInterval(pollingTimerId);
      }
    };
  }, [pollingTimerId]);

  const formatOrderNumber = (num: string) => {
    // Если номер заказа короткий, возвращаем как есть
    if (num.length < 6) return num;
    
    // Форматируем номер заказа для лучшей читабельности
    return num.replace(/(\w{3})(\w{3})(\w{3})/, "$1-$2-$3");
  };
  
  // Функция для скачивания видео
  const handleDownloadVideo = () => {
    if (videoInfo && videoInfo.output_url) {
      // Создаем ссылку для скачивания
      const link = document.createElement('a');
      link.href = videoInfo.output_url;
      link.target = '_blank';
      link.download = `translated_video.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast({
        title: "Ошибка",
        description: "Ссылка на видео недоступна",
        variant: "destructive",
      });
    }
  };
  
  // Функция для перезапуска поллинга
  const handleRefreshStatus = () => {
    if (!uniqueCode || isComplete || isPollingActive) return;
    
    setIsPollingActive(true);
    
    const timerId = PaymentService.startVideoActivationPolling(
      uniqueCode,
      handleVideoReady
    );
    
    setPollingTimerId(timerId);
    
    toast({
      title: "Обновление статуса",
      description: "Проверяем статус вашего видео...",
      variant: "default",
    });
  };

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      {isComplete && videoInfo ? (
        // Полный экран после завершения обработки
        <div className="w-full">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Icon name="CheckCircle" size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-center mb-2">
              Ваше видео готово!
            </h3>
            <p className="text-muted-foreground text-center">
              Перевод видео успешно завершен. Вы можете скачать результат прямо
              сейчас.
            </p>
          </div>

          <div className="border rounded-lg p-4 mb-8">
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Номер заказа:</span>
                <span className="font-medium">
                  {formatOrderNumber(orderNumber)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Статус:</span>
                <span className="font-medium text-green-600">Готово</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Язык перевода:</span>
                <span className="font-medium">
                  {videoInfo.output_language.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Срок хранения:</span>
                <span className="font-medium">7 дней</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full space-y-4">
            <Button className="w-full py-6" onClick={handleDownloadVideo}>
              <Icon name="Download" className="mr-2" />
              Скачать видео
            </Button>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = '/order?step=0'}
            >
              <Icon name="Plus" className="mr-2" />
              Сделать еще один перевод
            </Button>
          </div>
        </div>
      ) : (
        // Экран в процессе обработки
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-6">
              <Icon
                  name="Loader2"
                  size={60}
                  className="text-primary animate-spin"
              />
            </div>
            <h3 className="text-xl font-medium mb-0">Обрабатываем ваше видео</h3>


            {/* Информация о заказе */}
            {uniqueCode && (
                <div className="border rounded-lg p-4 my-5 w-full max-w-sm">
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Номер заказа:</span>
                      <span className="font-medium">
                    {formatOrderNumber(uniqueCode.slice(0, 12)).toUpperCase()}
                  </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Статус:</span>
                      <span className="font-medium text-amber-600">В обработке</span>
                    </div>


                  </div>
                </div>
            )}
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Перевод видео занимает примерно 15 минут. Вы получите уведомление на почту после завершения перевода.
              Вы можете закрыть это окно.
            </p>

            {/* Кнопка обновления статуса (если поллинг неактивен) */}
            {!isPollingActive && uniqueCode && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshStatus}
                    className="mt-2"
                >
                  <Icon name="RefreshCw" className="mr-2 w-4 h-4"/>
                  Проверить статус
                </Button>
            )}

          </div>
      )}
    </div>
  );
};

export default ResultStep;

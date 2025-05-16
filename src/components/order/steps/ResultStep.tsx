
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Progress } from "@/components/ui/progress";

interface ResultStepProps {
  orderNumber: string;
}

const ResultStep: React.FC<ResultStepProps> = ({ orderNumber }) => {
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const processingStages = [
    "Инициализация нейросети",
    "Анализ исходного видео",
    "Распознавание речи",
    "Перевод контента",
    "Синхронизация движения губ",
    "Финальная обработка"
  ];
  
  // Симулируем процесс обработки
  useEffect(() => {
    if (isComplete) return;
    
    // Увеличиваем прогресс каждые 200мс
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setIsComplete(true);
          return 100;
        }
        return newProgress;
      });
    }, 100);
    
    // Меняем стадию обработки
    const stageInterval = setInterval(() => {
      setProcessingStage(prev => {
        if (prev >= processingStages.length - 1) {
          clearInterval(stageInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 4000);
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(stageInterval);
    };
  }, [isComplete, processingStages.length]);
  
  const formatOrderNumber = (num: string) => {
    // Форматируем номер заказа для лучшей читабельности
    return num.replace(/(\w{3})(\w{3})(\w{3})/, '$1-$2-$3');
  };
  
  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      <div className="w-full mb-10">
        {isComplete ? (
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Icon name="CheckCircle" size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-center mb-2">
              Ваше видео готово!
            </h3>
            <p className="text-muted-foreground text-center">
              Перевод видео успешно завершен. Вы можете скачать результат прямо сейчас.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <div className="relative">
                <Icon name="Loader2" size={32} className="text-blue-600 animate-spin" />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-blue-800">
                  {processingProgress}%
                </span>
              </div>
            </div>
            <h3 className="text-xl font-medium text-center mb-2">
              Обрабатываем ваше видео
            </h3>
            <p className="text-muted-foreground text-center">
              Этот процесс займет 5-10 минут. Пожалуйста, не закрывайте окно.
            </p>
          </div>
        )}
        
        {!isComplete && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Прогресс обработки</span>
              <span>{processingProgress}%</span>
            </div>
            <Progress value={processingProgress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {processingStages[processingStage]}...
            </p>
          </div>
        )}
        
        <div className="border rounded-lg p-4 mb-8">
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Номер заказа:</span>
              <span className="font-medium">{formatOrderNumber(orderNumber)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Статус:</span>
              <span className={`font-medium ${isComplete ? 'text-green-600' : 'text-blue-600'}`}>
                {isComplete ? 'Завершено' : 'Обработка...'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Срок хранения:</span>
              <span className="font-medium">7 дней</span>
            </div>
          </div>
        </div>
      </div>
      
      {isComplete ? (
        <div className="flex flex-col w-full space-y-4">
          <Button className="w-full">
            <Icon name="Download" className="mr-2" />
            Скачать результат
          </Button>
          
          <Button variant="outline" className="w-full">
            <Icon name="Share2" className="mr-2" />
            Поделиться результатом
          </Button>
          
          <Button variant="outline" className="w-full">
            <Icon name="Plus" className="mr-2" />
            Сделать еще один перевод
          </Button>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 w-full">
          <div className="flex items-start">
            <Icon name="Mail" size={20} className="mr-2 mt-0.5 text-blue-600" />
            <div>
              <p className="font-medium">Вы получите уведомление</p>
              <p className="text-sm mt-1">
                Мы отправим вам email, когда ваше видео будет готово. Вы также можете оставить эту страницу открытой.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultStep;

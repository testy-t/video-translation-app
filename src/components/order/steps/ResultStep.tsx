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
    "Финальная обработка",
  ];

  // Симулируем процесс обработки
  useEffect(() => {
    if (isComplete) return;

    // Увеличиваем прогресс каждые 200мс
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
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
      setProcessingStage((prev) => {
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
    return num.replace(/(\w{3})(\w{3})(\w{3})/, "$1-$2-$3");
  };

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      {isComplete ? (
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
                <span className="font-medium text-green-600">Завершено</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Срок хранения:</span>
                <span className="font-medium">7 дней</span>
              </div>
            </div>
          </div>

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
        </div>
      ) : (
        // Упрощенный экран в процессе обработки
        <div className="flex flex-col items-center justify-center py-16 text-center">
          {/* Спиннер без процентов */}
          <div className="mb-6">
            <Icon
              name="Loader2"
              size={48}
              className="text-primary animate-spin"
            />
          </div>
          <h3 className="text-xl font-medium mb-3">Обрабатываем ваше видео</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Этот процесс займет некоторое время. Вы получите уведомление на
            email, когда видео будет готово.
          </p>

          {/* Сообщение о возможности закрыть окно */}
          <p className="text-gray-500 mt-4">Вы можете закрыть это окно</p>
        </div>
      )}
    </div>
  );
};

export default ResultStep;

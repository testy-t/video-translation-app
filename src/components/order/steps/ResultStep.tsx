import React, { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";

interface ResultStepProps {
  orderNumber: string;
}

const ResultStep: React.FC<ResultStepProps> = ({ orderNumber }) => {
  const [isProcessing, setIsProcessing] = useState(true);

  // Симуляция окончания процесса через 2 секунды
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {isProcessing ? (
        <>
          {/* Спиннер-"ромашка" без процентов */}
          <div className="mb-6">
            <Icon
              name="Loader2"
              size={48}
              className="text-primary animate-spin"
            />
          </div>
          <h3 className="text-xl font-medium mb-3">Обрабатываем ваше видео</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-4">
            Процесс займет некоторое время. Вы получите уведомление, когда видео
            будет готово.
          </p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Icon name="CheckCircle" size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-medium mb-3">
            Задание принято в обработку
          </h3>
        </>
      )}

      {/* Текст о возможности закрыть окно */}
      <p className="text-gray-500 mt-6">Вы можете закрыть это окно</p>
    </div>
  );
};

export default ResultStep;

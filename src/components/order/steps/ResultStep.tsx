
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface ResultStepProps {
  orderNumber: string;
}

const ResultStep: React.FC<ResultStepProps> = ({ orderNumber }) => {
  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <Icon name="CheckCircle" size={32} className="text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Ваш заказ принят!</h2>
        <p className="text-gray-600">
          Ваш номер заказа: <strong>{orderNumber}</strong>
        </p>
      </div>

      <Card className="border-dashed border-2 border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-3">
            <div className="flex items-start">
              <div className="shrink-0 mr-3">
                <Icon name="Clock" size={20} className="text-blue-600 mt-0.5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Обработка заказа</h3>
                <p className="text-gray-600 text-sm">
                  Мы приступили к обработке вашего видео. Процесс может занять от 15 минут до нескольких часов в зависимости от длительности видео.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="shrink-0 mr-3">
                <Icon name="Bell" size={20} className="text-blue-600 mt-0.5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Получение результата</h3>
                <p className="text-gray-600 text-sm">
                  Мы отправим вам уведомление на email, когда ваше видео будет готово. Вы также можете проверить статус заказа в личном кабинете.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          Если у вас возникли вопросы, обратитесь в нашу службу поддержки.
        </p>
      </div>
    </div>
  );
};

export default ResultStep;

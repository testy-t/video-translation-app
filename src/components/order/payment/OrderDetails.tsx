
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface OrderDetailsItemProps {
  label: string;
  value: React.ReactNode;
}

export const OrderDetailsItem: React.FC<OrderDetailsItemProps> = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-2">
    <div className="text-muted-foreground">{label}:</div>
    <div className="col-span-2 font-medium truncate">{value}</div>
  </div>
);

interface OrderDetailsProps {
  videoFile: File | null;
  selectedLanguage: string;
}

/**
 * Компонент для отображения деталей заказа
 * @param videoFile - Загруженный файл видео
 * @param selectedLanguage - Код выбранного языка для перевода
 */
const OrderDetails: React.FC<OrderDetailsProps> = ({ videoFile, selectedLanguage }) => {
  // Получаем информацию о языке
  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      "en": "Английский",
      "es": "Испанский",
      "fr": "Французский",
      "de": "Немецкий",
      "it": "Итальянский",
      "pt": "Португальский",
      "ru": "Русский",
      "zh": "Китайский",
      "ja": "Японский",
      "ko": "Корейский",
    };
    return languages[code] || "Неизвестный язык";
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h4 className="text-lg font-medium mb-4">Детали заказа</h4>
        
        <div className="flex flex-col space-y-4">
          <OrderDetailsItem 
            label="Видеофайл" 
            value={videoFile?.name || "Без имени"} 
          />
          
          <OrderDetailsItem 
            label="Размер" 
            value={videoFile ? (videoFile.size / (1024 * 1024)).toFixed(2) + " МБ" : "—"} 
          />
          
          <OrderDetailsItem 
            label="Язык перевода" 
            value={getLanguageName(selectedLanguage)} 
          />
          
          <OrderDetailsItem 
            label="Время обработки" 
            value="~5-10 минут" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetails;

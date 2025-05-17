
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
// Убираем импорт, так как используем локальную функцию
import Icon from "@/components/ui/icon";

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
  videoDuration: number;
  languageName?: string;
  isLoading?: boolean;
}

/**
 * Компонент для отображения деталей заказа
 * @param videoFile - Загруженный файл видео
 * @param selectedLanguage - Код выбранного языка для перевода
 * @param videoDuration - Длительность видео в секундах
 */
const OrderDetails: React.FC<OrderDetailsProps> = ({ 
  videoFile, 
  selectedLanguage,
  videoDuration,
  languageName,
  isLoading = false
}) => {

  // Форматируем длительность видео в формат мм:сс
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Функция для получения имени языка по его коду локально
  const getLanguageNameLocal = (code: string): string => {
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
      "ar": "Арабский",
      "hi": "Хинди",
      "bn": "Бенгальский",
      "id": "Индонезийский",
      "tr": "Турецкий",
      "nl": "Голландский",
      "pl": "Польский",
      "sv": "Шведский",
      "da": "Датский",
    };
    return languages[code] || "Неизвестный язык";
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h4 className="text-lg font-medium mb-4 flex items-center">
          <Icon name="Star" className="text-amber-400 mr-2" size={20} />
          Детали заказа
        </h4>
        
        <div className="flex flex-col space-y-4">
          <OrderDetailsItem 
            label="Видеофайл" 
            value={videoFile?.name || "Без имени"} 
          />
          
          <OrderDetailsItem 
            label="Длительность" 
            value={formatDuration(videoDuration)} 
          />
          
          <OrderDetailsItem 
            label="Язык перевода" 
            value={
              isLoading 
                ? <span className="flex items-center">
                    <Icon name="Loader2" className="mr-2 w-4 h-4 animate-spin" />
                    Загрузка...
                  </span>
                : (languageName || getLanguageNameLocal(selectedLanguage))
            } 
          />
          
          <OrderDetailsItem 
            label="Время обработки" 
            value="до 15 минут" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetails;

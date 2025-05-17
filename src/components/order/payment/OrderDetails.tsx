
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useLanguageContext } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

interface InfoBlockProps {
  icon: string;
  value: React.ReactNode;
  label: string;
  className?: string;
}

// Информационный блок для инфографики
const InfoBlock: React.FC<InfoBlockProps> = ({ icon, value, label, className }) => (
  <div className={`flex flex-col items-center justify-center p-4 rounded-lg bg-muted/30 ${className}`}>
    {icon && <Icon name={icon} className="mb-2 text-primary" size={24} />}
    <div className="text-xl font-bold">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

interface OrderDetailsProps {
  videoFile: File | null;
  selectedLanguage: string;
  videoDuration: number;
  isLoading?: boolean;
  price: number;
  isProcessing: boolean;
  onPayment: () => void;
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
  isLoading = false,
  price,
  isProcessing,
  onPayment
}) => {
  // Получаем функцию для получения имени языка из контекста
  const { getLanguageName, languages, isLoading: isLoadingLanguages } = useLanguageContext();

  // Форматируем длительность видео в формат мм:сс
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Получаем информацию о выбранном языке (включая флаг)
  const getLanguageInfo = () => {
    if (!selectedLanguage || isLoading || isLoadingLanguages) {
      return { name: 'Загрузка...', flag: '🌐' };
    }
    
    const name = getLanguageName(selectedLanguage);
    const langObj = languages.find(l => 
      l.code.toLowerCase() === selectedLanguage.toLowerCase() ||
      l.code.split('-')[0].toLowerCase() === selectedLanguage.split('-')[0].toLowerCase()
    );
    
    return { 
      name, 
      flag: langObj?.flag || '🌐'
    };
  };
  
  const languageInfo = getLanguageInfo();
  const roundedMinutes = Math.ceil(videoDuration / 60);
  const pricePerMinute = 149;
  const totalPrice = roundedMinutes * pricePerMinute;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h4 className="text-lg font-medium mb-4 flex items-center justify-center">
          <Icon name="Star" className="text-amber-400 mr-2" size={20} />
          Детали заказа
        </h4>
        
        {/* Время обработки */}
        <div className="flex items-center justify-center my-6 p-3 rounded-lg bg-primary/10 text-primary">
          <Icon name="Rocket" className="mr-2" />
          <span className="font-medium">Время обработки: до 15 минут</span>
        </div>
        
        {/* Инфографика с тремя блоками */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Все блоки с одинаковой высотой */}
          <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/30 h-[150px]">
            <Icon name="Clock" className="mb-2 text-primary" size={24} />
            <div className="text-xl font-bold">{formatDuration(videoDuration)}</div>
            <div className="text-sm text-muted-foreground">Длительность</div>
          </div>
          
          {/* Блок языка перевода */}
          <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/30 h-[150px]">
            {isLoading || isLoadingLanguages ? (
              <>
                <Icon name="Translate" className="mb-2 text-primary" size={24} />
                <div className="text-xl font-bold flex items-center">
                  <Icon name="Loader2" className="mr-2 w-5 h-5 animate-spin" />
                  <span>Загрузка...</span>
                </div>
              </>
            ) : (
              <>
                <div className="text-3xl mb-1">{languageInfo.flag}</div>
                <div className="text-xl font-bold mb-0">Язык</div>
                <div className="text-sm text-muted-foreground">{languageInfo.name}</div>
              </>
            )}
          </div>
          
          {/* Блок стоимости */}
          <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/30 h-[150px]">
            <Icon name="Wallet" className="mb-2 text-primary" size={24} />
            <div className="text-xl font-bold">{`${totalPrice} ₽`}</div>
            <div className="text-sm text-muted-foreground">{`${roundedMinutes} мин × ${pricePerMinute} ₽`}</div>
          </div>
        </div>
        
        {/* Кнопка оплаты */}
        <Button 
          className="w-full py-6 text-lg"
          onClick={onPayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Icon name="Loader2" className="mr-2 animate-spin" />
              Обработка...
            </>
          ) : (
            <>Оплатить {price} ₽</>
          )}
        </Button>
        
        <div className="mt-4 text-xs text-center text-muted-foreground">
          Нажимая кнопку, вы соглашаетесь с нашими <a href="#" className="underline">условиями</a> и <a href="#" className="underline">политикой конфиденциальности</a>
        </div>
        
        <div className="mt-4 flex items-center justify-center space-x-1 text-muted-foreground">
          <Icon name="Shield" size={16} />
          <span className="text-xs">Безопасная оплата</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetails;


import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  /** Итоговая стоимость заказа */
  price: number;
  /** Флаг обработки платежа */
  isProcessing: boolean;
  /** Функция обратного вызова при нажатии на кнопку оплаты */
  onPayment: () => void;
  /** Длительность видео в секундах (опционально) */
  videoDuration?: number;
}

/**
 * Компонент отображения итоговой стоимости и кнопки оплаты
 */
const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  price, 
  isProcessing, 
  onPayment,
  videoDuration = 120 // По умолчанию используем 2 минуты
}) => (
  <div className="bg-gray-50 border rounded-lg p-6 sticky top-4">
    <h4 className="text-lg font-medium mb-6">Итого</h4>
    
    <div className="space-y-3 mb-6">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Длительность видео</span>
        <span>{Math.ceil(videoDuration / 60)} мин.</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Стоимость минуты</span>
        <span>119 ₽</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Стоимость перевода</span>
        <span>{price} ₽</span>
      </div>
    </div>
    
    <Separator className="my-4" />
    
    <div className="flex justify-between text-lg font-medium mb-6">
      <span>Итого к оплате</span>
      <span>{price} ₽</span>
    </div>
    
    <Button 
      className="w-full"
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
      Нажимая кнопку, вы соглашаетесь с нашими <a href="#" className="underline">условиями обработки данных</a> и <a href="#" className="underline">политикой конфиденциальности</a>
    </div>
    
    <div className="mt-6 flex items-center justify-center space-x-1 text-muted-foreground">
      <Icon name="Shield" size={16} />
      <span className="text-xs">Безопасная оплата</span>
    </div>
  </div>
);

export default OrderSummary;

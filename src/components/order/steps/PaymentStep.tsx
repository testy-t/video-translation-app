
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PaymentStepProps {
  videoFile: File | null;
  selectedLanguage: string;
  onPayment: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ 
  videoFile, 
  selectedLanguage,
  onPayment 
}) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Получаем информацию о языке (в реальном приложении это бы подтягивалось из API)
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
  
  // Рассчитываем стоимость на основе размера файла (просто пример)
  const calculatePrice = () => {
    if (!videoFile) return 0;
    // Основная цена за минуту видео (примерно)
    const basePrice = 299;
    
    // Плюс дополнительная стоимость за размер файла
    const fileSizeInMB = videoFile.size / (1024 * 1024);
    const sizePrice = Math.ceil(fileSizeInMB * 1); // 1 руб за МБ
    
    return basePrice + sizePrice;
  };
  
  const price = calculatePrice();
  
  const handleSubmitPayment = () => {
    setIsProcessing(true);
    
    // Имитация обработки платежа
    setTimeout(() => {
      setIsProcessing(false);
      onPayment();
    }, 2000);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      {/* Информация о заказе (3 колонки) */}
      <div className="md:col-span-3">
        <h3 className="text-xl font-medium mb-4">Подтверждение заказа</h3>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <h4 className="text-lg font-medium mb-4">Детали заказа</h4>
            
            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-muted-foreground">Видеофайл:</div>
                <div className="col-span-2 font-medium truncate">
                  {videoFile?.name || "Без имени"}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="text-muted-foreground">Размер:</div>
                <div className="col-span-2 font-medium">
                  {videoFile ? (videoFile.size / (1024 * 1024)).toFixed(2) + " МБ" : "—"}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="text-muted-foreground">Язык перевода:</div>
                <div className="col-span-2 font-medium">
                  {getLanguageName(selectedLanguage)}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="text-muted-foreground">Время обработки:</div>
                <div className="col-span-2 font-medium">
                  ~5-10 минут
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h4 className="text-lg font-medium mb-4">Выберите способ оплаты</h4>
            
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={setPaymentMethod}
              className="space-y-4"
            >
              <div className={`
                flex items-center space-x-2 rounded-lg border p-4 cursor-pointer
                ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}
              `}
                onClick={() => setPaymentMethod('card')}
              >
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex-grow cursor-pointer">
                  <div className="flex items-center">
                    <Icon name="CreditCard" className="mr-2 text-primary" />
                    <span>Банковская карта</span>
                  </div>
                </Label>
                <div className="flex space-x-1">
                  <div className="w-8 h-5 bg-blue-600 rounded"></div>
                  <div className="w-8 h-5 bg-yellow-500 rounded"></div>
                  <div className="w-8 h-5 bg-green-500 rounded"></div>
                </div>
              </div>
              
              <div className={`
                flex items-center space-x-2 rounded-lg border p-4 cursor-pointer
                ${paymentMethod === 'sbp' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}
              `}
                onClick={() => setPaymentMethod('sbp')}
              >
                <RadioGroupItem value="sbp" id="sbp" />
                <Label htmlFor="sbp" className="flex-grow cursor-pointer">
                  <div className="flex items-center">
                    <Icon name="Smartphone" className="mr-2 text-primary" />
                    <span>Система быстрых платежей (СБП)</span>
                  </div>
                </Label>
                <div className="w-8 h-5 bg-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                  СБП
                </div>
              </div>
              
              <div className={`
                flex items-center space-x-2 rounded-lg border p-4 cursor-pointer
                ${paymentMethod === 'wallet' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}
              `}
                onClick={() => setPaymentMethod('wallet')}
              >
                <RadioGroupItem value="wallet" id="wallet" />
                <Label htmlFor="wallet" className="flex-grow cursor-pointer">
                  <div className="flex items-center">
                    <Icon name="Wallet" className="mr-2 text-primary" />
                    <span>Электронный кошелек</span>
                  </div>
                </Label>
                <div className="flex space-x-1">
                  <div className="w-8 h-5 bg-yellow-400 rounded"></div>
                  <div className="w-8 h-5 bg-blue-400 rounded"></div>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
      
      {/* Итого (2 колонки) */}
      <div className="md:col-span-2">
        <div className="bg-gray-50 border rounded-lg p-6 sticky top-4">
          <h4 className="text-lg font-medium mb-6">Итого</h4>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Стоимость перевода</span>
              <span>{price} ₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Сервисный сбор</span>
              <span>0 ₽</span>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-between text-lg font-medium mb-6">
            <span>Итого к оплате</span>
            <span>{price} ₽</span>
          </div>
          
          <Button 
            className="w-full"
            onClick={handleSubmitPayment}
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
      </div>
    </div>
  );
};

export default PaymentStep;

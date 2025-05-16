import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Типы данных
interface PaymentStepProps {
  videoFile: File | null;
  selectedLanguage: string;
  onPayment: () => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  badges?: React.ReactNode;
}

// Вспомогательные компоненты
const OrderDetailsItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="grid grid-cols-3 gap-2">
    <div className="text-muted-foreground">{label}:</div>
    <div className="col-span-2 font-medium truncate">{value}</div>
  </div>
);

const PaymentMethodOption: React.FC<{
  method: PaymentMethod;
  selected: boolean;
  onSelect: () => void;
}> = ({ method, selected, onSelect }) => (
  <div
    className={`
      flex items-center space-x-2 rounded-lg border p-4 cursor-pointer
      ${selected ? "border-primary bg-primary/5" : "hover:bg-muted"}
    `}
    onClick={onSelect}
  >
    <RadioGroupItem value={method.id} id={method.id} />
    <Label htmlFor={method.id} className="flex-grow cursor-pointer">
      <div className="flex items-center">
        <Icon name={method.icon as any} className="mr-2 text-primary" />
        <span>{method.name}</span>
      </div>
    </Label>
    {method.badges}
  </div>
);

const OrderDetails: React.FC<{
  videoFile: File | null;
  selectedLanguage: string;
}> = ({ videoFile, selectedLanguage }) => {
  // Получаем информацию о языке
  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      en: "Английский",
      es: "Испанский",
      fr: "Французский",
      de: "Немецкий",
      it: "Итальянский",
      pt: "Португальский",
      ru: "Русский",
      zh: "Китайский",
      ja: "Японский",
      ko: "Корейский",
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
            value={
              videoFile
                ? (videoFile.size / (1024 * 1024)).toFixed(2) + " МБ"
                : "—"
            }
          />

          <OrderDetailsItem
            label="Язык перевода"
            value={getLanguageName(selectedLanguage)}
          />

          <OrderDetailsItem label="Время обработки" value="~5-10 минут" />
        </div>
      </CardContent>
    </Card>
  );
};

const PaymentMethods: React.FC<{
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
}> = ({ selectedMethod, onSelectMethod }) => {
  // Данные о методах оплаты
  const paymentMethods: PaymentMethod[] = [
    {
      id: "card",
      name: "Банковская карта",
      icon: "CreditCard",
      badges: (
        <div className="flex space-x-1">
          <div className="w-8 h-5 bg-blue-600 rounded"></div>
          <div className="w-8 h-5 bg-yellow-500 rounded"></div>
          <div className="w-8 h-5 bg-green-500 rounded"></div>
        </div>
      ),
    },
    {
      id: "sbp",
      name: "Система быстрых платежей (СБП)",
      icon: "Smartphone",
      badges: (
        <div className="w-8 h-5 bg-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
          СБП
        </div>
      ),
    },
    {
      id: "wallet",
      name: "Электронный кошелек",
      icon: "Wallet",
      badges: (
        <div className="flex space-x-1">
          <div className="w-8 h-5 bg-yellow-400 rounded"></div>
          <div className="w-8 h-5 bg-blue-400 rounded"></div>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h4 className="text-lg font-medium mb-4">Выберите способ оплаты</h4>

        <RadioGroup
          value={selectedMethod}
          onValueChange={onSelectMethod}
          className="space-y-4"
        >
          {paymentMethods.map((method) => (
            <PaymentMethodOption
              key={method.id}
              method={method}
              selected={selectedMethod === method.id}
              onSelect={() => onSelectMethod(method.id)}
            />
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

const OrderSummary: React.FC<{
  price: number;
  isProcessing: boolean;
  onPayment: () => void;
}> = ({ price, isProcessing, onPayment }) => (
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

    <Button className="w-full" onClick={onPayment} disabled={isProcessing}>
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
      Нажимая кнопку, вы соглашаетесь с нашими{" "}
      <a href="#" className="underline">
        условиями обработки данных
      </a>{" "}
      и{" "}
      <a href="#" className="underline">
        политикой конфиденциальности
      </a>
    </div>

    <div className="mt-6 flex items-center justify-center space-x-1 text-muted-foreground">
      <Icon name="Shield" size={16} />
      <span className="text-xs">Безопасная оплата</span>
    </div>
  </div>
);

// Утилиты и хуки
const useOrderPrice = (videoFile: File | null) => {
  // Рассчитываем стоимость на основе размера файла
  const calculatePrice = () => {
    if (!videoFile) return 0;
    // Основная цена за минуту видео (примерно)
    const basePrice = 299;

    // Плюс дополнительная стоимость за размер файла
    const fileSizeInMB = videoFile.size / (1024 * 1024);
    const sizePrice = Math.ceil(fileSizeInMB * 1); // 1 руб за МБ

    return basePrice + sizePrice;
  };

  return calculatePrice();
};

// Основной компонент
const PaymentStep: React.FC<PaymentStepProps> = ({
  videoFile,
  selectedLanguage,
  onPayment,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  // Получаем цену заказа
  const price = useOrderPrice(videoFile);

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

        <OrderDetails
          videoFile={videoFile}
          selectedLanguage={selectedLanguage}
        />

        <PaymentMethods
          selectedMethod={paymentMethod}
          onSelectMethod={setPaymentMethod}
        />
      </div>

      {/* Итого (2 колонки) */}
      <div className="md:col-span-2">
        <OrderSummary
          price={price}
          isProcessing={isProcessing}
          onPayment={handleSubmitPayment}
        />
      </div>
    </div>
  );
};

export default PaymentStep;

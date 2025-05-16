
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Описывает метод оплаты
 */
export interface PaymentMethod {
  /** Уникальный идентификатор метода оплаты */
  id: string;
  /** Отображаемое название */
  name: string;
  /** Имя иконки из библиотеки Lucide */
  icon: string;
  /** Дополнительные визуальные элементы (логотипы платежных систем и т.д.) */
  badges?: React.ReactNode;
}

interface PaymentMethodOptionProps {
  method: PaymentMethod;
  selected: boolean;
  onSelect: () => void;
}

/**
 * Компонент для отображения одного метода оплаты
 */
export const PaymentMethodOption: React.FC<PaymentMethodOptionProps> = ({ 
  method, 
  selected, 
  onSelect 
}) => (
  <div
    className={`
      flex items-center space-x-2 rounded-lg border p-4 cursor-pointer
      ${selected ? 'border-primary bg-primary/5' : 'hover:bg-muted'}
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

interface PaymentMethodsProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
}

/**
 * Компонент для выбора способа оплаты
 * @param selectedMethod - ID выбранного метода
 * @param onSelectMethod - Функция обратного вызова при выборе метода
 */
const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  selectedMethod, 
  onSelectMethod 
}) => {
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

export default PaymentMethods;

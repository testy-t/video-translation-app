import React, { useState } from "react";

// Импорт типов
import { PaymentStepProps } from "../payment/types";

// Импорт компонентов
import OrderDetails from "../payment/OrderDetails";
import PaymentMethods from "../payment/PaymentMethods";
import OrderSummary from "../payment/OrderSummary";

// Импорт хуков
import { useOrderPrice } from "../payment/hooks/useOrderPrice";

/**
 * Компонент шага оплаты в процессе заказа
 * Отвечает за выбор способа оплаты и подтверждение заказа
 */
const PaymentStep: React.FC<PaymentStepProps> = ({
  videoFile,
  selectedLanguage,
  onPayment,
}) => {
  // Состояние выбранного метода оплаты
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Состояние процесса оплаты
  const [isProcessing, setIsProcessing] = useState(false);

  // Получаем цену заказа из хука
  const price = useOrderPrice(videoFile);

  /**
   * Обработчик отправки платежа
   * Имитирует процесс оплаты и вызывает колбэк onPayment при успехе
   */
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

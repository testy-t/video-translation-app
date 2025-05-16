
import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface OrderNavigationProps {
  currentStep: number;
  totalSteps: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  isNextDisabled: boolean;
  isCompleted: boolean;
  onPayment?: () => void;
}

/**
 * Компонент навигации для переключения между шагами заказа
 */
const OrderNavigation: React.FC<OrderNavigationProps> = ({
  currentStep,
  totalSteps,
  goToNextStep,
  goToPreviousStep,
  isNextDisabled,
  isCompleted,
  onPayment
}) => {
  return (
    <div className="mt-8 flex flex-row justify-between gap-4 w-full">
      {/* Кнопка "Назад" - скрыта на первом и последнем шаге */}
      {currentStep > 0 && !isCompleted && (
        <Button
          variant="outline"
          className="min-w-[180px] px-6 py-4 h-auto text-base font-medium flex items-center justify-center gap-2"
          onClick={goToPreviousStep}
        >
          <Icon name="ArrowLeft" size={18} />
          <span>Вернуться на главную</span>
        </Button>
      )}
      
      {/* Пустое пространство для выравнивания, если нет кнопки "Назад" */}
      {(currentStep === 0 || isCompleted) && <div />}
      
      {/* Кнопка "Продолжить" или "Оплатить" */}
      {!isCompleted ? (
        currentStep === totalSteps - 2 ? (
          // Кнопка "Оплатить" на предпоследнем шаге
          <Button
            className="min-w-[180px] px-6 py-4 h-auto text-base font-medium bg-[#0070F3] hover:bg-[#0060d3] flex items-center justify-center gap-2"
            onClick={onPayment}
          >
            <span>Оплатить</span>
            <Icon name="CreditCard" size={18} />
          </Button>
        ) : (
          // Кнопка "Продолжить" на остальных шагах
          <Button
            className="min-w-[180px] px-6 py-4 h-auto text-base font-medium bg-[#0070F3] hover:bg-[#0060d3] flex items-center justify-center gap-2"
            onClick={goToNextStep}
            disabled={isNextDisabled}
          >
            <span>Продолжить</span>
            <Icon name="ArrowRight" size={18} />
          </Button>
        )
      ) : (
        // Кнопка "Вернуться на главную" на последнем шаге
        <Button
          className="min-w-[180px] px-6 py-4 h-auto text-base font-medium bg-[#0070F3] hover:bg-[#0060d3] flex items-center justify-center gap-2"
          onClick={() => window.location.href = '/'}
        >
          <span>Вернуться на главную</span>
          <Icon name="Home" size={18} />
        </Button>
      )}
    </div>
  );
};

export default OrderNavigation;

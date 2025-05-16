import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface OrderNavigationProps {
  currentStep: number;
  totalSteps: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  isNextDisabled?: boolean;
  isCompleted?: boolean;
  isProcessingPayment?: boolean;
  onPayment?: () => void;
}

/**
 * Компонент навигации между шагами заказа
 */
const OrderNavigation: React.FC<OrderNavigationProps> = ({
  currentStep,
  totalSteps,
  goToNextStep,
  goToPreviousStep,
  isNextDisabled = false,
  isCompleted = false,
  isProcessingPayment = false,
  onPayment,
}) => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-6 flex justify-between z-10">
      <div className="container mx-auto max-w-5xl flex justify-between">
        <Button
          variant="outline"
          onClick={() =>
            currentStep === 0 ? navigate("/") : goToPreviousStep()
          }
        >
          {currentStep === 0 ? (
            <>
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Вернуться на главную
            </>
          ) : (
            "Назад"
          )}
        </Button>

        {currentStep < totalSteps - 2 && (
          <Button onClick={goToNextStep} disabled={isNextDisabled}>
            Продолжить
          </Button>
        )}

        {currentStep === totalSteps - 2 && (
          <Button onClick={onPayment} disabled={isProcessingPayment}>
            {isProcessingPayment ? "Обработка..." : "Оплатить"}
          </Button>
        )}

        {currentStep === totalSteps - 1 && (
          <Button onClick={() => navigate("/")}>На главную</Button>
        )}
      </div>
    </div>
  );
};

export default OrderNavigation;


import React from "react";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";

export type Step = {
  id: string;
  title: string;
  icon: string;
};

interface OrderStepperProps {
  steps: Step[];
  currentStep: number;
}

/**
 * Компонент для отображения прогресса шагов заказа
 */
const OrderStepper: React.FC<OrderStepperProps> = ({ steps, currentStep }) => {
  // Прогресс выполнения заказа в процентах
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Перевести ваше видео
      </h1>
      
      <Progress value={progress} className="h-2 mb-6" />
      
      {/* Шаги процесса */}
      <div className="flex justify-between px-4">
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className={`flex flex-col items-center relative ${
              index <= currentStep ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div 
              className={`
                w-10 h-10 rounded-full flex items-center justify-center mb-2
                transition-colors duration-200
                ${index < currentStep 
                  ? "bg-primary text-primary-foreground" 
                  : index === currentStep 
                    ? "border-2 border-primary text-primary" 
                    : "border-2 border-muted-foreground text-muted-foreground"
                }
              `}
            >
              {index < currentStep ? (
                <Icon name="Check" size={18} />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span className="text-xs font-medium hidden md:block">{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStepper;

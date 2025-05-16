import React from "react";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

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
      {/* Верхняя панель с логотипом и названием */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">Перевод видео</h1>

        <Link to="/" className="flex items-center gap-2">
          <Icon name="Mic2" size={24} className="text-primary" />
          <span className="text-lg font-semibold">ГолосОК</span>
        </Link>
      </div>

      {/* Прогресс бар */}
      <Progress value={progress} className="h-2 mb-6" />

      {/* Современный степпер */}
      <div className="flex justify-between px-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`relative flex-1 ${
              index < steps.length - 1
                ? "after:content-[''] after:absolute after:top-1/2 after:left-[calc(50%+1rem)] after:w-full after:h-[2px] after:-translate-y-1/2 after:bg-gray-200 after:z-0"
                : ""
            }`}
          >
            <div className="flex flex-col items-center relative z-10">
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full 
                  transition-all duration-300 ease-in-out mb-2
                  ${
                    index < currentStep
                      ? "bg-primary text-white shadow-md"
                      : index === currentStep
                        ? "bg-white border-2 border-primary text-primary ring-4 ring-primary/20"
                        : "bg-white border-2 border-gray-200 text-gray-400"
                  }
                `}
              >
                {index < currentStep ? (
                  <Icon name="Check" size={18} />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>

              <span
                className={`
                  text-xs font-medium text-center hidden md:block
                  ${index <= currentStep ? "text-gray-800" : "text-gray-400"}
                `}
              >
                {step.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStepper;

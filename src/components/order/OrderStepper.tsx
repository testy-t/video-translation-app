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
 * Дизайн с прямоугольными контейнерами и шевронами между шагами
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

      {/* Новый степпер с прямоугольниками и шевронами */}
      <div className="flex flex-wrap justify-between items-center px-1 gap-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Карточка шага */}
            <div
              className={`
                flex items-center min-w-24 flex-grow sm:flex-grow-0 py-2 px-3 rounded-md border transition-all duration-200
                ${
                  index < currentStep
                    ? "bg-primary/10 border-primary text-primary"
                    : index === currentStep
                      ? "bg-primary text-white border-primary shadow-md"
                      : "bg-gray-50 border-gray-200 text-gray-400"
                }
              `}
            >
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0">
                  {index < currentStep ? (
                    <Icon name="CheckCircle" size={18} />
                  ) : (
                    <div
                      className={`bg-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium border 
                      ${index === currentStep ? "border-white text-primary" : "border-gray-300 text-gray-500"}`}
                    >
                      {index + 1}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium whitespace-nowrap">
                  {step.title}
                </span>
              </div>
            </div>

            {/* Шеврон между шагами */}
            {index < steps.length - 1 && (
              <div
                className={`hidden sm:block transform transition-all ${index < currentStep ? "text-primary" : "text-gray-300"}`}
              >
                <Icon name="ChevronRight" size={20} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default OrderStepper;


import React, { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

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
 * Адаптивный дизайн: на мобильных показывает только текущий шаг
 */
const OrderStepper: React.FC<OrderStepperProps> = ({ steps, currentStep }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Определяем мобильный вид при загрузке и изменении размера окна
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px - breakpoint для md в Tailwind
    };
    
    // Проверяем при загрузке
    checkIsMobile();
    
    // Слушаем событие изменения размера окна
    window.addEventListener("resize", checkIsMobile);
    
    // Очищаем слушатель при размонтировании
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Рассчитываем прогресс для индикатора
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      {/* Верхняя панель с логотипом и названием */}
      <div className="flex justify-between items-center mb-8">
        <Link to="/" className="flex items-center gap-2">
          <Icon name="Mic2" size={24} className="text-primary" />
          <span className="text-lg md:text-lg font-semibold">ГолосОК</span>
        </Link>

        <h1 className="text-lg md:text-lg font-semibold">Перевод видео</h1>
      </div>

      {/* Мобильная версия - показываем только текущий шаг */}
      {isMobile && (
        <div className="flex flex-col gap-3">
          {/* Индикатор прогресса */}
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Шаг {currentStep + 1} из {steps.length}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          {/* Текущий шаг крупно */}
          <div 
            className="flex items-center py-3 px-4 rounded-md bg-primary text-white border-primary shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                {currentStep + 1}
              </div>
              <span className="text-base font-medium">{steps[currentStep].title}</span>
            </div>
          </div>
        </div>
      )}

      {/* Десктопная версия - полный степпер с шевронами */}
      {!isMobile && (
        <div className="flex flex-wrap justify-between items-center px-1 gap-3">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Карточка шага */}
              <div
                className={`
                  flex items-center flex-grow sm:flex-grow-0 py-3 px-4 rounded-md border transition-all duration-200
                  ${
                    index < currentStep
                      ? "bg-primary/10 border-primary text-primary"
                      : index === currentStep
                        ? "bg-primary text-white border-primary shadow-md"
                        : "bg-gray-50 border-gray-200 text-gray-400"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {index < currentStep ? (
                      <Icon name="CircleCheck" className="text-primary" size={22} />
                    ) : (
                      <div
                        className={`bg-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium border 
                        ${index === currentStep ? "border-white text-primary" : "border-gray-300 text-gray-500"}`}
                      >
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <span className="text-base font-medium whitespace-nowrap">
                    {step.title}
                  </span>
                </div>
              </div>

              {/* Шеврон между шагами */}
              {index < steps.length - 1 && (
                <div
                  className={`hidden sm:block transform transition-all ${index < currentStep ? "text-primary" : "text-gray-300"}`}
                >
                  <Icon name="ChevronRight" size={24} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderStepper;

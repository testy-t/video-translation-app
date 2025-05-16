import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/layout/Header";

import UploadVideoStep from "@/components/order/steps/UploadVideoStep";
import SelectLanguageStep from "@/components/order/steps/SelectLanguageStep";
import PaymentStep from "@/components/order/steps/PaymentStep";
import ResultStep from "@/components/order/steps/ResultStep";

const OrderProcess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Извлекаем текущий шаг из URL, если он есть
  const getInitialStep = () => {
    const params = new URLSearchParams(location.search);
    const step = params.get("step");
    return step ? parseInt(step) : 0;
  };

  const [currentStep, setCurrentStep] = useState(getInitialStep());
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  // Шаги процесса
  const steps = [
    { id: "upload", title: "Загрузите видео", icon: "Upload" },
    { id: "language", title: "Выберите язык", icon: "Languages" },
    { id: "payment", title: "Оплатите", icon: "CreditCard" },
    { id: "result", title: "Получите результат", icon: "Download" },
  ];

  // Обновляем URL при изменении шага
  useEffect(() => {
    navigate(`/order?step=${currentStep}`, { replace: true });
  }, [currentStep, navigate]);

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0); // Прокручиваем страницу вверх при смене шага
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Функция-заглушка для имитации оплаты и генерации номера заказа
  const handlePayment = () => {
    // В реальном приложении здесь был бы API-запрос к платежной системе
    setTimeout(() => {
      const randomOrderId = Math.floor(Math.random() * 1000000);
      setOrderNumber(`OR-${randomOrderId}`);
      goToNextStep();
    }, 1500);
  };

  // Прогресс выполнения заказа в процентах
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen pt-20">
        <div className="container mx-auto max-w-5xl py-8 px-4">
          {/* Заголовок и индикатор прогресса */}
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
                    index <= currentStep
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center mb-2
                      transition-colors duration-200
                      ${
                        index < currentStep
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
                  <span className="text-xs font-medium hidden md:block">
                    {step.title}
                  </span>

                  {/* Соединительная линия между шагами */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-5 w-[calc(100%-2.5rem)] h-[2px] left-[60%] -z-10 ${
                        index < currentStep ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Содержимое текущего шага */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {currentStep === 0 && (
              <UploadVideoStep
                videoFile={videoFile}
                setVideoFile={setVideoFile}
              />
            )}
            {currentStep === 1 && (
              <SelectLanguageStep
                videoFile={videoFile}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
              />
            )}
            {currentStep === 2 && (
              <PaymentStep
                videoFile={videoFile}
                selectedLanguage={selectedLanguage}
                onPayment={handlePayment}
              />
            )}
            {currentStep === 3 && <ResultStep orderNumber={orderNumber} />}
          </div>

          {/* Кнопки навигации */}
          <div className="bg-white rounded-lg shadow-sm p-6 flex justify-between">
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

            {currentStep < 2 && (
              <Button
                onClick={goToNextStep}
                disabled={
                  (currentStep === 0 && !videoFile) ||
                  (currentStep === 1 && !selectedLanguage)
                }
              >
                Продолжить
              </Button>
            )}

            {currentStep === 2 && (
              <Button onClick={handlePayment}>Оплатить</Button>
            )}

            {currentStep === 3 && (
              <Button onClick={() => navigate("/")}>На главную</Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderProcess;

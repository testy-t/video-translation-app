
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import UploadVideoStep from "./steps/UploadVideoStep";
import SelectLanguageStep from "./steps/SelectLanguageStep";
import PaymentStep from "./steps/PaymentStep";
import ResultStep from "./steps/ResultStep";

interface OrderProcessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderProcessDialog: React.FC<OrderProcessDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  
  const steps = [
    { id: "upload", title: "Загрузите видео", icon: "Upload" },
    { id: "language", title: "Выберите язык", icon: "Languages" },
    { id: "payment", title: "Оплатите", icon: "CreditCard" },
    { id: "result", title: "Получите результат", icon: "Download" },
  ];

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Заголовок и индикатор прогресса */}
          <div className="p-6 pb-4 border-b">
            <DialogTitle className="text-2xl font-semibold text-center">
              Перевести ваше видео
            </DialogTitle>
            <Progress value={progress} className="h-2 mt-4" />
            
            {/* Шаги процесса */}
            <div className="flex justify-between mt-4 px-4">
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
          <div className="p-6 flex-grow overflow-auto max-h-[70vh]">
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
            {currentStep === 3 && (
              <ResultStep 
                orderNumber={orderNumber}
              />
            )}
          </div>

          {/* Кнопки навигации */}
          <div className="p-6 border-t flex justify-between">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === 0 || currentStep === 3}
            >
              Назад
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
              <Button onClick={handlePayment}>
                Оплатить
              </Button>
            )}
            
            {currentStep === 3 && (
              <Button onClick={() => onOpenChange(false)}>
                Закрыть
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderProcessDialog;

import React, { useEffect } from "react";
import OrderContainer from "@/components/order/OrderContainer";
import OrderStepper from "@/components/order/OrderStepper";
import StepContent from "@/components/order/StepContent";
import OrderNavigation from "@/components/order/OrderNavigation";
import { useOrderProcess } from "@/hooks/useOrderProcess";

/**
 * Страница процесса заказа
 * Управляет всеми шагами оформления заказа и состоянием процесса
 */
const OrderProcess: React.FC = () => {
  const {
    currentStep,
    steps,
    videoFile,
    setVideoFile,
    selectedLanguage,
    setSelectedLanguage,
    handleLanguageSelection,
    orderNumber,
    goToNextStep,
    goToPreviousStep,
    handlePayment,
    transactionId,
    handleUploadSuccess,
    isUploading
  } = useOrderProcess();
  
  // Эффект анимации при загрузке страницы
  useEffect(() => {
    // Добавляем класс для анимации на body
    document.body.classList.add('page-transition');
    
    // Удаляем класс после завершения анимации
    const timer = setTimeout(() => {
      document.body.classList.remove('page-transition');
    }, 500);
    
    return () => {
      clearTimeout(timer);
      document.body.classList.remove('page-transition');
    };
  }, []);

  return (
    <OrderContainer>
      {/* Степпер для отображения прогресса */}
      <OrderStepper 
        steps={steps} 
        currentStep={currentStep} 
      />

      {/* Содержимое текущего шага */}
      <StepContent
        currentStep={currentStep}
        videoFile={videoFile}
        setVideoFile={setVideoFile}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={handleLanguageSelection}
        onPayment={handlePayment}
        orderNumber={orderNumber}
        transactionId={transactionId}
        onUploadSuccess={handleUploadSuccess}
        isUploading={isUploading}
      />

      {/* Кнопки навигации */}
      <OrderNavigation
        currentStep={currentStep}
        totalSteps={steps.length}
        goToNextStep={goToNextStep}
        goToPreviousStep={goToPreviousStep}
        isNextDisabled={
          (currentStep === 0 && !videoFile) || 
          (currentStep === 1 && !selectedLanguage) ||
          isUploading
        }
        isCompleted={currentStep === steps.length - 1}
        onPayment={handlePayment}
      />
    </OrderContainer>
  );
};

export default OrderProcess;
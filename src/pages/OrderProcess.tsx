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
    handleLanguageSelection,
    orderNumber,
    goToNextStep,
    goToPreviousStep,
    handlePayment,
    transactionId,
    handleUploadSuccess,
    isUploading,
    videoDuration
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
        videoDuration={videoDuration}
      />

      {/* Кнопки навигации */}
      <OrderNavigation
        currentStep={currentStep}
        totalSteps={steps.length}
        goToNextStep={goToNextStep}
        goToPreviousStep={goToPreviousStep}
        isNextDisabled={
          // Для первого шага проверяем либо наличие файла, либо флаг успешной загрузки
          (currentStep === 0 && !videoFile && !localStorage.getItem('isVideoUploaded')) || 
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
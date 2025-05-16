
import React from "react";
import UploadVideoStep from "./steps/UploadVideoStep";
import SelectLanguageStep from "./steps/SelectLanguageStep";
import PaymentStep from "./steps/PaymentStep";
import ResultStep from "./steps/ResultStep";

interface StepContentProps {
  currentStep: number;
  videoFile: File | null;
  setVideoFile: (file: File | null) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  onPayment: () => void;
  orderNumber: string;
}

/**
 * Компонент для отображения содержимого текущего шага
 */
const StepContent: React.FC<StepContentProps> = ({
  currentStep,
  videoFile,
  setVideoFile,
  selectedLanguage,
  setSelectedLanguage,
  onPayment,
  orderNumber
}) => {
  return (
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
          onPayment={onPayment}
        />
      )}
      
      {currentStep === 3 && (
        <ResultStep 
          orderNumber={orderNumber}
        />
      )}
    </div>
  );
};

export default StepContent;


import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Хук для управления процессом заказа
 */
export const useOrderProcess = () => {
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

  return {
    currentStep,
    steps,
    videoFile,
    setVideoFile,
    selectedLanguage,
    setSelectedLanguage,
    orderNumber,
    goToNextStep,
    goToPreviousStep,
    handlePayment
  };
};

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase";
import { toast } from "@/components/ui/use-toast";

/**
 * Hook for managing the order process
 */
export const useOrderProcess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get initial step from URL if available
  const getInitialStep = () => {
    const params = new URLSearchParams(location.search);
    const step = params.get("step");
    return step ? parseInt(step) : 0;
  };
  
  const [currentStep, setCurrentStep] = useState(getInitialStep());
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<number | null>(null);
  const [fileKey, setFileKey] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Process steps
  const steps = [
    { id: "upload", title: "Загрузите видео", icon: "Upload" },
    { id: "language", title: "Выберите язык", icon: "Languages" },
    { id: "payment", title: "Оплатите", icon: "CreditCard" },
    { id: "result", title: "Получите результат", icon: "Download" },
  ];

  // Update URL when step changes
  useEffect(() => {
    navigate(`/order?step=${currentStep}`, { replace: true });
  }, [currentStep, navigate]);
  
  // Create transaction and restore data when component mounts
  useEffect(() => {
    const setupOrderProcess = async () => {
      try {
        // Пытаемся восстановить данные предыдущего заказа из localStorage
        const savedVideoId = localStorage.getItem('uploadedVideoId');
        const savedFileKey = localStorage.getItem('uploadedFileKey');
        const savedTransactionId = localStorage.getItem('transactionId');
        
        // Если есть данные о предыдущей загрузке, восстанавливаем их
        if (savedVideoId && savedFileKey) {
          setVideoId(parseInt(savedVideoId));
          setFileKey(savedFileKey);
          
          // Если был сохранен ID транзакции, используем его
          if (savedTransactionId) {
            setTransactionId(savedTransactionId);
            return; // Пропускаем создание новой транзакции
          }
        }
        
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // User is authenticated, create regular transaction
          const { data, error } = await supabase
            .from('transactions')
            .insert({
              user_id: session.user.id,
              product_id: 1, // Default product ID, could be changed later
              amount: 0, // Will be updated after video analysis
              status: 'pending'
            })
            .select()
            .single();
  
          if (error) {
            throw error;
          }
  
          if (data) {
            setTransactionId(data.id);
          }
        } else {
          // User is not authenticated, create anonymous transaction
          // This is a simplified version - in a real app you might want to handle this differently
          // For demo purposes, we'll just create a "guest" transaction or use a UUID-based approach
          const guestId = 'guest-' + Math.random().toString(36).substring(2, 15);
          
          // Create a dummy transaction ID for demo purposes
          const tempTransactionId = 'temp-' + Date.now().toString();
          setTransactionId(tempTransactionId);
          
          console.log("Created temporary transaction for guest user", tempTransactionId);
        }
      } catch (error) {
        console.error("Error setting up order process:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось создать заказ. Пожалуйста, попробуйте позже.",
          variant: "destructive",
        });
      }
    };

    setupOrderProcess();
  }, []);
  
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0); // Scroll to top when changing steps
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle successful video upload
  const handleUploadSuccess = (videoId: number, fileKey: string) => {
    setVideoId(videoId);
    setFileKey(fileKey);
    
    // Сохраняем информацию о видео в localStorage для возможности восстановления при навигации
    try {
      localStorage.setItem('uploadedVideoId', videoId.toString());
      localStorage.setItem('uploadedFileKey', fileKey);
      localStorage.setItem('transactionId', transactionId || '');
    } catch (e) {
      console.error("Failed to save video info to localStorage:", e);
    }
    
    goToNextStep();
  };

  // Handle language selection and process video info
  const handleLanguageSelection = async (language: string) => {
    if (!videoId || !fileKey) {
      toast({
        title: "Ошибка",
        description: "Сначала загрузите видео",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setSelectedLanguage(language);

    try {
      // Get session and token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Ошибка авторизации",
          description: "Пожалуйста, войдите в систему",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      // Call the video-info Edge Function
      const supabaseUrl = await supabase.functions.getUrl('video-info');
      
      const response = await fetch(supabaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          videoId,
          fileKey,
          outputLanguage: language
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка обработки информации о видео');
      }

      const result = await response.json();
      
      // Move to payment step
      goToNextStep();
    } catch (error) {
      console.error("Error processing video info:", error);
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла ошибка при обработке видео",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Placeholder for payment handling
  const handlePayment = () => {
    // In a real app, this would make API request to payment system
    setTimeout(() => {
      const randomOrderId = Math.floor(Math.random() * 1000000);
      setOrderNumber(`OR-${randomOrderId}`);
      
      // Update transaction status
      if (transactionId) {
        supabase
          .from('transactions')
          .update({ status: 'paid' })
          .eq('id', transactionId)
          .then(({ error }) => {
            if (error) {
              console.error("Error updating transaction:", error);
            }
          });
      }
      
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
    handleLanguageSelection,
    orderNumber,
    goToNextStep,
    goToPreviousStep,
    handlePayment,
    transactionId,
    handleUploadSuccess,
    isUploading
  };
};
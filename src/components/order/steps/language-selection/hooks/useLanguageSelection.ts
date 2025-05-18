
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useLanguages } from "@/components/order/language-selector/hooks";

/**
 * Хук для управления выбором языка
 */
export const useLanguageSelection = (
  initialLanguage: string,
  videoId: number | null,
  onLanguageSelected: (language: string) => void
) => {
  // Локальное состояние для выбранного языка
  const [localSelectedLanguage, setLocalSelectedLanguage] = useState(initialLanguage);
  const [isAnimated, setIsAnimated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Используем хук для работы с языками из API
  const {
    searchTerm,
    setSearchTerm,
    filteredLanguages,
    isLoading: languagesLoading,
    error: languagesError,
    selectedDbLanguage,
    setSelectedLanguage: setApiSelectedLanguage,
    updateVideoLanguage
  } = useLanguages("", videoId || undefined);

  // Эффект для анимации появления компонента
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Синхронизируем локальный выбор языка с API
  useEffect(() => {
    if (localSelectedLanguage) {
      const timer = setTimeout(() => {
        setApiSelectedLanguage(localSelectedLanguage);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [localSelectedLanguage, setApiSelectedLanguage]);

  // Обработчик подтверждения выбора языка
  const handleConfirmLanguage = async () => {
    if (!localSelectedLanguage) {
      toast({
        title: "Предупреждение",
        description: "Пожалуйста, выберите язык для перевода",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Сохраняем выбранный язык в localStorage
      localStorage.setItem('selectedLanguageCode', localSelectedLanguage);
      
      // Если есть данные о языке из БД, сохраняем и их
      if (selectedDbLanguage) {
        localStorage.setItem('selectedLanguageName', selectedDbLanguage.ru_name);
        localStorage.setItem('selectedLanguageFlag', selectedDbLanguage.flag_emoji || '');
      } else {
        // Ищем язык в списке и сохраняем его название
        const selectedLang = filteredLanguages.find(lang => lang.code === localSelectedLanguage);
        if (selectedLang) {
          localStorage.setItem('selectedLanguageName', selectedLang.name);
          localStorage.setItem('selectedLanguageFlag', selectedLang.flag || '');
        }
      }
      
      // Если у нас есть videoId и выбранный язык, обновляем информацию через API
      if (videoId && selectedDbLanguage) {
        try {
          await updateVideoLanguage().catch(err => {
            console.warn("Ошибка API обновления языка, игнорируем:", err);
          });
        } catch (apiError) {
          console.warn("Ошибка API игнорируется:", apiError);
        }
      }
      
      // Отображаем успешное сообщение
      toast({
        title: "Успех",
        description: "Язык для перевода выбран успешно",
      });
      
      // Передаем выбранный язык в родительский компонент
      onLanguageSelected(localSelectedLanguage);
    } catch (error) {
      console.error("Ошибка при обработке выбора языка:", error);
      toast({
        title: "Предупреждение",
        description: "Произошла некритическая ошибка, но вы можете продолжить процесс",
      });
      
      // Даже при ошибке переходим дальше, просто запоминаем выбранный язык
      onLanguageSelected(localSelectedLanguage);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isAnimated,
    localSelectedLanguage,
    setLocalSelectedLanguage,
    isProcessing,
    searchTerm,
    setSearchTerm,
    filteredLanguages,
    languagesLoading,
    languagesError,
    selectedDbLanguage,
    handleConfirmLanguage,
    isLoading: languagesLoading || isProcessing,
    noVideoError: !videoId
  };
};

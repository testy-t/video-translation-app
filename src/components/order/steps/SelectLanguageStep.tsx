import React, { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguages } from "../language-selector/hooks";
import { Language } from "@/integrations/supabase";

interface SelectLanguageStepProps {
  videoFile: File | null;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  isLoading?: boolean;
}

const SelectLanguageStep: React.FC<SelectLanguageStepProps> = ({
  videoFile,
  selectedLanguage,
  setSelectedLanguage,
  isLoading: externalLoading = false,
}) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [videoId, setVideoId] = useState<number | null>(null);
  const [localSelectedLanguage, setLocalSelectedLanguage] = useState(selectedLanguage);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Используем хук для работы с языками
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

  // Синхронизируем локальный выбор языка с API
  useEffect(() => {
    // Добавляем небольшую задержку, чтобы дать время загрузить список языков
    if (localSelectedLanguage) {
      const timer = setTimeout(() => {
        console.log("Установка выбранного языка в API:", localSelectedLanguage);
        setApiSelectedLanguage(localSelectedLanguage);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [localSelectedLanguage, setApiSelectedLanguage]);

  // Анимация появления и проверка данных видео
  useEffect(() => {
    // Анимация
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);
    
    // Проверяем наличие данных о видео
    const isUploaded = localStorage.getItem('isVideoUploaded') === 'true';
    const videoIdFromStorage = localStorage.getItem('videoDbId');
    const fileKey = localStorage.getItem('uploadedFileKey');
    
    console.log("SelectLanguageStep mounted, checking video data:", { isUploaded, videoId: videoIdFromStorage, fileKey });
    
    // Установка ID видео из localStorage, если есть
    if (videoIdFromStorage) {
      setVideoId(parseInt(videoIdFromStorage, 10));
    }
    
    return () => clearTimeout(timer);
  }, []);

  // Обработка подтверждения выбора языка
  const handleConfirmLanguage = async () => {
    console.log("Попытка обновить язык:", {
      videoId,
      localSelectedLanguage,
      selectedDbLanguage
    });
    
    if (!localSelectedLanguage) {
      toast({
        title: "Предупреждение",
        description: "Пожалуйста, выберите язык для перевода",
      });
      return;
    }
    
    if (!videoId) {
      toast({
        title: "Ошибка",
        description: "Не найдено ID видео. Пожалуйста, вернитесь на шаг загрузки видео.",
        variant: "destructive",
      });
      
      // Проверяем все возможные значения
      const isUploaded = localStorage.getItem('isVideoUploaded');
      const videoDbId = localStorage.getItem('videoDbId');
      const videoOriginalUrl = localStorage.getItem('videoOriginalUrl');
      const uploadedFileKey = localStorage.getItem('uploadedFileKey');
      
      console.error("Отсутствует ID видео. Данные localStorage:", {
        isUploaded,
        videoDbId,
        videoOriginalUrl,
        uploadedFileKey
      });
      return;
    }
    
    if (!selectedDbLanguage) {
      toast({
        title: "Ошибка",
        description: "Не найдены данные о выбранном языке. Пожалуйста, выберите язык снова.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Обновление языка видео через API
      const success = await updateVideoLanguage();
      
      if (success) {
        toast({
          title: "Успех",
          description: "Язык для перевода выбран успешно",
        });
        
        // Сохраняем выбранный язык в localStorage для использования на других шагах
        localStorage.setItem('selectedLanguageCode', localSelectedLanguage);
        localStorage.setItem('selectedLanguageName', selectedDbLanguage.ru_name);
        
        // Передаем выбранный язык в родительский компонент
        setSelectedLanguage(localSelectedLanguage);
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить язык видео. Пожалуйста, попробуйте еще раз.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Ошибка при обновлении языка:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при обновлении языка видео",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Определяем, показывать ли индикатор загрузки
  const isLoading = externalLoading || languagesLoading || isProcessing;

  return (
    <div className="fade-slide-in">
      <h2 className="text-xl font-semibold mb-6">Выберите язык для перевода</h2>

      {/* Сообщение об ошибке, если есть */}
      {languagesError && (
        <Alert className="mb-4" variant="destructive">
          <AlertDescription>{languagesError}</AlertDescription>
        </Alert>
      )}

      {/* Проверка наличия видео */}
      {!videoId && (
        <Alert className="mb-4">
          <AlertDescription>
            Не найдено загруженное видео. Пожалуйста, сначала загрузите видео.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Выбор языка */}
        <div
          className={`${isAnimated ? "fade-slide-in delay-100" : "opacity-0"}`}
        >
          {/* Поиск языка */}
          <div className="mb-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Поиск языка..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
              <Icon
                name="Search"
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          {/* Список языков */}
          <div className="max-h-[400px] min-h-[300px] overflow-y-auto pr-2 space-y-1">
            <RadioGroup
              value={localSelectedLanguage}
              onValueChange={setLocalSelectedLanguage}
              disabled={isLoading}
            >
              {filteredLanguages.map((language, index) => {
                // Создаем уникальный ключ, используя комбинацию кода и индекса
                const uniqueKey = `${language.code}-${index}`;
                const uniqueId = `lang-${language.code}-${index}`;
                
                return (
                  <div
                    key={uniqueKey}
                    className={`
                      flex items-center space-x-2 p-2 rounded-md cursor-pointer
                      transition-all duration-200 ease-in-out
                      ${localSelectedLanguage === language.code ? "bg-primary/10" : "hover:bg-gray-100"}
                      ${isAnimated ? "fade-slide-in" : "opacity-0"}
                      ${isLoading ? "opacity-50 pointer-events-none" : ""}
                    `}
                    style={{ animationDelay: `${150 + index * 30}ms` }}
                  >
                    <RadioGroupItem 
                      value={language.code} 
                      id={uniqueId}
                      disabled={isLoading}
                    />
                    <Label
                      htmlFor={uniqueId}
                      className="flex-grow cursor-pointer font-normal text-base"
                    >
                      {language.flag && (
                        <span className="mr-2">{language.flag}</span>
                      )}
                      {language.name}
                    </Label>
                  </div>
                );
              })}

              {filteredLanguages.length === 0 && (
                <div className="flex items-center justify-center h-[200px] text-gray-500">
                  <div className="text-center">
                    <Icon name="Search" size={30} className="mx-auto mb-2 opacity-30" />
                    <p>Языки не найдены</p>
                    <p className="text-sm mt-1 opacity-70">Попробуйте изменить поисковый запрос</p>
                  </div>
                </div>
              )}
            </RadioGroup>
          </div>

          {/* Кнопка подтверждения выбора */}
          <div className="mt-6">
            <Button 
              onClick={handleConfirmLanguage} 
              className="w-full"
              disabled={!localSelectedLanguage || isLoading || !videoId}
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                  Обновление языка...
                </>
              ) : (
                <>
                  <Icon name="Check" className="mr-2 h-4 w-4" />
                  Подтвердить выбор
                </>
              )}
            </Button>
          </div>

          {/* Информация о выбранном языке */}
          {selectedDbLanguage && (
            <div className="mt-4 text-sm text-gray-500 text-center">
              Выбран язык: <span className="font-medium">{selectedDbLanguage.ru_name} {selectedDbLanguage.flag_emoji}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectLanguageStep;
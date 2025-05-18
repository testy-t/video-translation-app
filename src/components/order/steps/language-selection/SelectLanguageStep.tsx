
import React, { useEffect, useState } from "react";
import { 
  SearchInput, 
  LanguageList, 
  ConfirmButton,
  SelectedLanguageInfo,
  AlertMessage
} from "./components";
import { useLanguageSelection } from "./hooks";

interface SelectLanguageStepProps {
  videoFile: File | null;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  isLoading?: boolean;
}

/**
 * Компонент выбора языка для перевода видео
 */
const SelectLanguageStep: React.FC<SelectLanguageStepProps> = ({
  videoFile,
  selectedLanguage,
  setSelectedLanguage,
  isLoading: externalLoading = false,
}) => {
  // Получаем ID видео из localStorage при монтировании компонента
  const [videoId, setVideoId] = useState<number | null>(null);
  
  useEffect(() => {
    const videoIdFromStorage = localStorage.getItem('videoDbId');
    if (videoIdFromStorage) {
      setVideoId(parseInt(videoIdFromStorage, 10));
    }
  }, []);

  // Используем хук для управления выбором языка
  const {
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
    isLoading: internalLoading,
    noVideoError
  } = useLanguageSelection(selectedLanguage, videoId, setSelectedLanguage);

  // Общее состояние загрузки (внешнее + внутреннее)
  const isLoading = externalLoading || internalLoading;

  return (
    <div className="fade-slide-in">
      <h2 className="text-xl font-semibold mb-6">🎙️ На какой язык перевести?</h2>
      <p className="text-muted-foreground mb-4">
        Укажите, <strong>на каком языке</strong> вы хотите получить результат. Оригинальное видео будет переведено именно на этот язык.
      </p>

      {/* Сообщения об ошибках */}
      {languagesError && (
        <AlertMessage type="error" message={languagesError} />
      )}

      {/* Проверка наличия видео */}
      {noVideoError && (
        <AlertMessage 
          type="info" 
          message="Не найдено загруженное видео. Пожалуйста, сначала загрузите видео." 
        />
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Блок выбора языка с анимацией */}
        <div className={`${isAnimated ? "fade-slide-in delay-100" : "opacity-0"}`}>
          
          {/* Поиск языка */}
          <div className="mb-4">
            <SearchInput 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isDisabled={isLoading}
            />
          </div>

          {/* Контейнер для списка языков и кнопки подтверждения */}
          <div className="flex flex-col h-[calc(100vh-570px)] min-h-[100px]">
            {/* Список языков */}
            <LanguageList 
              filteredLanguages={filteredLanguages}
              selectedLanguage={localSelectedLanguage}
              onSelectLanguage={setLocalSelectedLanguage}
              isAnimated={isAnimated}
              isDisabled={isLoading}
            />

            {/* Кнопка подтверждения выбора */}
            <ConfirmButton 
              onConfirm={handleConfirmLanguage}
              isDisabled={!localSelectedLanguage || isLoading || !videoId}
              isLoading={isProcessing}
            />
          </div>

          {/* Информация о выбранном языке */}
          <SelectedLanguageInfo selectedLanguage={selectedDbLanguage} />
        </div>
      </div>
    </div>
  );
};

export default SelectLanguageStep;

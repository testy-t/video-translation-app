
import React from "react";
import { LanguageSelector } from "../language-selector";
import { VideoPreviewPanel } from "../video-preview";

/**
 * Свойства компонента шага выбора языка
 */
interface SelectLanguageStepProps {
  /** Видеофайл для перевода */
  videoFile: File | null;
  /** Выбранный язык перевода */
  selectedLanguage: string;
  /** Функция установки выбранного языка */
  setSelectedLanguage: (language: string) => void;
}

/**
 * Компонент шага выбора языка перевода в процессе заказа
 */
const SelectLanguageStep: React.FC<SelectLanguageStepProps> = ({ 
  videoFile,
  selectedLanguage,
  setSelectedLanguage,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Левая колонка - выбор языка */}
      <LanguageSelector
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
      
      {/* Правая колонка - превью видео */}
      <VideoPreviewPanel 
        videoFile={videoFile} 
        selectedLanguage={selectedLanguage} 
      />
    </div>
  );
};

export default SelectLanguageStep;

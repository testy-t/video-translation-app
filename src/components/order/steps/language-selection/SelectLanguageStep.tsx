import React from "react";
import { useLanguageSelection } from "./hooks";
import {
  SearchInput,
  LanguageList,
  AlertMessage,
  ConfirmButton,
  SelectedLanguageInfo,
} from "./components";
import Icon from "@/components/ui/icon";

interface SelectLanguageStepProps {
  videoFile: File | null;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  isLoading?: boolean;
}

/**
 * Компонент для выбора языка перевода видео
 */
const SelectLanguageStep: React.FC<SelectLanguageStepProps> = ({
  videoFile,
  selectedLanguage,
  setSelectedLanguage,
  isLoading = false,
}) => {
  const {
    searchTerm,
    setSearchTerm,
    languages,
    isPending,
    error,
    allLanguages,
    popularLanguages,
    otherLanguages,
    searchResults,
    confirmLanguageSelection,
  } = useLanguageSelection(selectedLanguage, setSelectedLanguage);

  return (
    <div className="fade-slide-in">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Выберите язык перевода</h2>
        <div className="flex items-center text-sm text-gray-600 gap-2 mt-1">
          <Icon name="ArrowRight" size={16} />
          <p>
            Укажите <strong>целевой язык</strong>, на который нужно перевести
            ваше видео
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg mb-5 border border-gray-100">
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className="flex items-center gap-1.5">
            <Icon name="FileVideo" size={18} className="text-gray-600" />
            <span>Оригинал</span>
          </div>

          <Icon name="ArrowRight" size={14} className="text-primary" />

          <div className="flex items-center gap-1.5">
            <Icon name="Languages" size={18} className="text-primary" />
            <span className="font-medium">
              {selectedLanguage
                ? allLanguages.find((l) => l.code === selectedLanguage)?.name ||
                  "Выбранный язык"
                : "Язык перевода"}
            </span>
          </div>
        </div>
      </div>

      {error && <AlertMessage message={error} />}

      <SearchInput
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Найти язык перевода..."
        helperText="Начните вводить название языка, на который хотите перевести видео"
      />

      {selectedLanguage && (
        <SelectedLanguageInfo
          language={allLanguages.find((l) => l.code === selectedLanguage)}
          onClear={() => setSelectedLanguage("")}
        />
      )}

      <LanguageList
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        popularLanguages={popularLanguages}
        otherLanguages={otherLanguages}
        searchResults={searchResults}
        searchTerm={searchTerm}
      />

      <ConfirmButton
        selectedLanguage={selectedLanguage}
        confirmSelection={confirmLanguageSelection}
        isLoading={isLoading || isPending}
        buttonText="Перевести на выбранный язык"
      />
    </div>
  );
};

export default SelectLanguageStep;

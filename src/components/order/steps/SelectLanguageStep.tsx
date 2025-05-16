import React, { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Список языков для перевода
const languages = [
  { code: "en", name: "Английский" },
  { code: "fr", name: "Французский" },
  { code: "de", name: "Немецкий" },
  { code: "es", name: "Испанский" },
  { code: "it", name: "Итальянский" },
  { code: "pt", name: "Португальский" },
  { code: "zh", name: "Китайский" },
  { code: "ja", name: "Японский" },
  { code: "ar", name: "Арабский" },
  { code: "hi", name: "Хинди" },
  { code: "ko", name: "Корейский" },
  { code: "tr", name: "Турецкий" },
];

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
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleLanguages, setVisibleLanguages] = useState(languages);
  const [isAnimated, setIsAnimated] = useState(false);
  const [localSelectedLanguage, setLocalSelectedLanguage] = useState(selectedLanguage);

  // Анимация появления
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Фильтрация языков при поиске
  useEffect(() => {
    if (searchQuery) {
      const filtered = languages.filter((lang) =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setVisibleLanguages(filtered);
    } else {
      setVisibleLanguages(languages);
    }
  }, [searchQuery]);

  // Обработка подтверждения выбора языка
  const handleConfirmLanguage = () => {
    if (localSelectedLanguage) {
      setSelectedLanguage(localSelectedLanguage);
    }
  };

  return (
    <div className="fade-slide-in">
      <h2 className="text-xl font-semibold mb-6">Выберите язык для перевода</h2>

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
          <div className="max-h-[400px] overflow-y-auto pr-2 space-y-1">
            <RadioGroup
              value={localSelectedLanguage}
              onValueChange={setLocalSelectedLanguage}
              disabled={isLoading}
            >
              {visibleLanguages.map((language, index) => (
                <div
                  key={language.code}
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
                    id={language.code}
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor={language.code}
                    className="flex-grow cursor-pointer font-normal text-base"
                  >
                    {language.name}
                  </Label>
                </div>
              ))}

              {visibleLanguages.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  Языки не найдены
                </div>
              )}
            </RadioGroup>
          </div>

          {/* Кнопка подтверждения выбора */}
          <div className="mt-6">
            <Button 
              onClick={handleConfirmLanguage} 
              className="w-full"
              disabled={!localSelectedLanguage || isLoading}
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                  Обработка видео...
                </>
              ) : (
                <>
                  <Icon name="Check" className="mr-2 h-4 w-4" />
                  Подтвердить выбор
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectLanguageStep;
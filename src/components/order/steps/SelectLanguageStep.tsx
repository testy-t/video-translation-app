import React, { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
}

const SelectLanguageStep: React.FC<SelectLanguageStepProps> = ({
  videoFile,
  selectedLanguage,
  setSelectedLanguage,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleLanguages, setVisibleLanguages] = useState(languages);
  const [isAnimated, setIsAnimated] = useState(false);

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

  return (
    <div className="fade-slide-in">
      <h2 className="text-xl font-semibold mb-6">Выберите язык для перевода</h2>

      <div className="grid grid-cols-1 gap-6">
        {/* Информация о видео */}
        <div className={`${isAnimated ? "fade-slide-in" : "opacity-0"}`}>
          <h3 className="font-medium mb-4">Ваше видео:</h3>

          {/* Заменяем видео превью на простую информацию о файле */}
          <div className="p-4 bg-gray-50 rounded-md border">
            <div className="flex items-center">
              <Icon name="FileVideo" className="text-primary mr-2" size={24} />
              <div className="flex-grow">
                <div className="font-medium">{videoFile?.name}</div>
                <div className="text-gray-500 text-sm">
                  Размер:{" "}
                  {Math.round(((videoFile?.size || 0) / 1024 / 1024) * 10) / 10}{" "}
                  MB
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Выбор языка */}
        <div
          className={`${isAnimated ? "fade-slide-in delay-100" : "opacity-0"}`}
        >
          <h3 className="font-medium mb-4">Целевой язык перевода:</h3>

          {/* Поиск языка */}
          <div className="mb-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Поиск языка..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Icon
                name="Search"
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          {/* Список языков */}
          <div className="max-h-[300px] overflow-y-auto pr-2 space-y-1">
            <RadioGroup
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            >
              {visibleLanguages.map((language, index) => (
                <div
                  key={language.code}
                  className={`
                    flex items-center space-x-2 p-2 rounded-md cursor-pointer
                    transition-all duration-200 ease-in-out
                    ${selectedLanguage === language.code ? "bg-primary/10" : "hover:bg-gray-100"}
                    ${isAnimated ? "fade-slide-in" : "opacity-0"}
                  `}
                  style={{ animationDelay: `${150 + index * 30}ms` }}
                >
                  <RadioGroupItem value={language.code} id={language.code} />
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
        </div>
      </div>
    </div>
  );
};

export default SelectLanguageStep;

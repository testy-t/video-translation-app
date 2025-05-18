
import React from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import LanguageItem from "./LanguageItem";
import Icon from "@/components/ui/icon";

interface LanguageListProps {
  filteredLanguages: Array<{
    code: string;
    name: string;
    flag?: string;
  }>;
  selectedLanguage: string;
  onSelectLanguage: (code: string) => void;
  isAnimated: boolean;
  isDisabled?: boolean;
}

/**
 * Компонент списка языков
 */
const LanguageList: React.FC<LanguageListProps> = ({
  filteredLanguages,
  selectedLanguage,
  onSelectLanguage,
  isAnimated,
  isDisabled = false
}) => {
  return (
    <div className="flex-1 overflow-y-auto pr-2 space-y-1 mb-4">
      <RadioGroup
        value={selectedLanguage}
        onValueChange={onSelectLanguage}
        disabled={isDisabled}
      >
        {filteredLanguages.map((language, index) => (
          <LanguageItem
            key={`${language.code}-${index}`}
            language={language}
            isSelected={selectedLanguage === language.code}
            index={index}
            isAnimated={isAnimated}
            isDisabled={isDisabled}
          />
        ))}

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
  );
};

export default LanguageList;


import React from "react";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Language } from "@/integrations/supabase";

interface LanguageItemProps {
  language: {
    code: string;
    name: string;
    flag?: string;
  };
  isSelected: boolean;
  index: number;
  isAnimated: boolean;
  isDisabled?: boolean;
}

/**
 * Компонент отдельного элемента языка в списке
 */
const LanguageItem: React.FC<LanguageItemProps> = ({
  language,
  isSelected,
  index,
  isAnimated,
  isDisabled = false
}) => {
  // Создаем уникальный идентификатор для радиокнопки
  const uniqueId = `lang-${language.code}-${index}`;
  
  return (
    <div
      className={`
        flex items-center space-x-2 p-2 rounded-md cursor-pointer
        transition-all duration-200 ease-in-out
        ${isSelected ? "bg-primary/10" : "hover:bg-gray-100"}
        ${isAnimated ? "fade-slide-in" : "opacity-0"}
        ${isDisabled ? "opacity-50 pointer-events-none" : ""}
      `}
      style={{ animationDelay: `${150 + index * 30}ms` }}
    >
      <RadioGroupItem 
        value={language.code} 
        id={uniqueId}
        disabled={isDisabled}
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
};

export default LanguageItem;

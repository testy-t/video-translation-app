
import React from 'react';
import { Button } from "@/components/ui/button";

interface Language {
  code: string;
  flag: string;
  name: string;
  isActive?: boolean;
}

interface LanguageSelectorProps {
  languages: Language[];
  onSelectLanguage?: (code: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  languages, 
  onSelectLanguage = () => {} 
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {languages.map((language) => (
        <Button 
          key={language.code}
          variant={language.isActive ? "default" : "outline"}
          className={`
            rounded-full px-6 
            ${language.isActive 
              ? "bg-[#7c4dff] hover:bg-[#6c3ce9]" 
              : "hover:bg-[#7c4dff]/10"
            }
          `}
          onClick={() => onSelectLanguage(language.code)}
        >
          <span className="mr-2">{language.flag}</span> {language.name}
        </Button>
      ))}
    </div>
  );
};

export default LanguageSelector;

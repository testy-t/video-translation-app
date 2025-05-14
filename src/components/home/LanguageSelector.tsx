import React from "react";
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
  isDark?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  onSelectLanguage = () => {},
  isDark = false,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {languages.map((language) => (
        <Button
          key={language.code}
          variant={language.isActive ? "default" : "outline"}
          className={`
            rounded-full px-4 py-1 text-sm
            ${
              isDark
                ? language.isActive
                  ? "glass-dark bg-white/20 text-white"
                  : "glass-dark bg-white/10 text-white hover:bg-white/15"
                : language.isActive
                  ? "glass-button text-[#0070F3]"
                  : "glass-button text-gray-600 hover:text-[#0070F3]"
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

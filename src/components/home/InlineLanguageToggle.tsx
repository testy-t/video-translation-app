import React from "react";

interface Language {
  code: string;
  flag: string;
  name: string;
  isActive?: boolean;
}

interface InlineLanguageToggleProps {
  languages: Language[];
  activeLanguage: string;
  onSelectLanguage: (code: string) => void;
  isDesktop?: boolean;
}

/**
 * Компактный инлайн-переключатель языков для мобильных устройств
 */
const InlineLanguageToggle: React.FC<InlineLanguageToggleProps> = ({
  languages,
  activeLanguage,
  onSelectLanguage,
  isDesktop = false,
}) => {
  // Короткие коды языков для отображения
  const getShortCode = (code: string): string => {
    const shortCodes: Record<string, string> = {
      ru: "RU",
      en: "EN",
      zh: "ZH",
      es: "ES",
      de: "DE",
      fr: "FR",
      it: "IT",
      ja: "JP",
      ar: "AR",
      pt: "PT",
      ko: "KO",
      hi: "HI",
      tr: "TR",
    };

    return shortCodes[code] || code.toUpperCase();
  };

  return (
    <div className={`flex items-center backdrop-blur-sm rounded-full overflow-x-auto ${isDesktop ? 'py-2 px-2 border border-slate-200' : 'py-1 px-1 border border-white/10 bg-white/5'} max-w-fit no-scrollbar`}>
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => onSelectLanguage(language.code)}
          className={`
            flex items-center whitespace-nowrap px-3 py-1 rounded-full ${isDesktop ? 'text-sm' : 'text-xs'} transition-all
            ${
              activeLanguage === language.code
                ? isDesktop ? "bg-[#0070F3] text-white" : "bg-white/20 text-white"
                : isDesktop ? "text-slate-700 hover:text-[#0070F3]" : "text-white/70 hover:text-white"
            }
          `}
        >
          <span className="mr-1.5">{language.flag}</span>
          <span>{getShortCode(language.code)}</span>
        </button>
      ))}
    </div>
  );
};

export default InlineLanguageToggle;

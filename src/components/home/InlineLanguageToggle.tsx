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
    <div className={`flex items-center backdrop-blur-sm rounded-full overflow-x-auto ${isDesktop ? 'py-2 px-2 border border-slate-200' : 'py-2 px-2 border border-slate-200 bg-white/90'} max-w-fit no-scrollbar`}>
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => onSelectLanguage(language.code)}
          className={`
            flex items-center whitespace-nowrap px-4 py-2 rounded-full ${isDesktop ? 'text-sm' : 'text-sm'} font-medium transition-all
            ${
              activeLanguage === language.code
                ? isDesktop ? "bg-[#0070F3] text-white" : "bg-[#0070F3] text-white shadow-md"
                : isDesktop ? "text-slate-700 hover:text-[#0070F3]" : "text-slate-700 hover:text-[#0070F3]"
            }
          `}
        >
          <span className="mr-2">{language.flag}</span>
          <span>{getShortCode(language.code)}</span>
        </button>
      ))}
    </div>
  );
};

export default InlineLanguageToggle;

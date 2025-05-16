
import React from 'react';

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
}

/**
 * Компактный инлайн-переключатель языков для мобильных устройств
 */
const InlineLanguageToggle: React.FC<InlineLanguageToggleProps> = ({
  languages,
  activeLanguage,
  onSelectLanguage,
}) => {
  return (
    <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-full overflow-x-auto py-1 px-1 max-w-full border border-white/10">
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => onSelectLanguage(language.code)}
          className={`
            flex items-center whitespace-nowrap px-3 py-1 rounded-full text-xs transition-all
            ${activeLanguage === language.code
              ? 'bg-white/20 text-white'
              : 'text-white/70 hover:text-white'
            }
          `}
        >
          <span className="mr-1.5">{language.flag}</span>
          <span className="text-xs">{language.name}</span>
        </button>
      ))}
    </div>
  );
};

export default InlineLanguageToggle;

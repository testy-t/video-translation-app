import React from "react";
import Icon from "@/components/ui/icon";

interface SelectedLanguageInfoProps {
  language?: { code: string; name: string; flag?: string };
  onClear: () => void;
}

/**
 * Компонент отображения выбранного языка
 */
const SelectedLanguageInfo: React.FC<SelectedLanguageInfoProps> = ({
  language,
  onClear,
}) => {
  if (!language) return null;

  return (
    <div className="mb-4 flex items-center gap-2 p-3 bg-primary/10 rounded-md border border-primary/20">
      <div className="flex-1 flex items-center gap-2">
        <span className="text-lg mr-1">{language.flag || "🌐"}</span>
        <div>
          <span className="font-medium">{language.name}</span>
          <div className="text-xs text-gray-600 mt-0.5 flex items-center gap-1">
            <Icon name="CheckCircle2" size={12} className="text-primary" />
            <span>Выбран как язык перевода</span>
          </div>
        </div>
      </div>
      <button
        onClick={onClear}
        className="p-1.5 rounded-md hover:bg-gray-200 transition-colors"
        aria-label="Отменить выбор"
      >
        <Icon name="X" size={16} className="text-gray-500" />
      </button>
    </div>
  );
};

export default SelectedLanguageInfo;

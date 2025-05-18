
import React from "react";
import { Language } from "@/integrations/supabase";

interface SelectedLanguageInfoProps {
  selectedLanguage: Language | null;
}

/**
 * Компонент информации о выбранном языке
 */
const SelectedLanguageInfo: React.FC<SelectedLanguageInfoProps> = ({
  selectedLanguage
}) => {
  if (!selectedLanguage) {
    return null;
  }
  
  return (
    <div className="mt-4 text-sm text-gray-500 text-center">
      Видео будет переведено на <span className="font-medium">
        {selectedLanguage.ru_name} {selectedLanguage.flag_emoji}
      </span>

    </div>
  );
};

export default SelectedLanguageInfo;

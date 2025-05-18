import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface ConfirmButtonProps {
  selectedLanguage: string;
  confirmSelection: () => void;
  isLoading?: boolean;
  buttonText?: string;
}

/**
 * Компонент кнопки подтверждения выбора языка
 */
const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  selectedLanguage,
  confirmSelection,
  isLoading = false,
  buttonText = "Подтвердить выбор",
}) => {
  return (
    <div className="mt-6">
      <Button
        onClick={confirmSelection}
        disabled={!selectedLanguage || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Icon name="Loader2" className="animate-spin" size={16} />
            Загрузка...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Icon name="Languages" size={16} />
            {buttonText}
          </span>
        )}
      </Button>
    </div>
  );
};

export default ConfirmButton;

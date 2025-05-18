
import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface ConfirmButtonProps {
  onConfirm: () => void;
  isDisabled: boolean;
  isLoading: boolean;
}

/**
 * Компонент кнопки подтверждения выбора языка
 */
const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  onConfirm,
  isDisabled,
  isLoading
}) => {
  return (
    <div className="sticky bottom-0 pt-2 bg-white border-t">
      <Button 
        onClick={onConfirm} 
        className="w-full"
        disabled={isDisabled}
      >
        {isLoading ? (
          <>
            <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
            Обновление языка...
          </>
        ) : (
          <>
            <Icon name="Check" className="mr-2 h-4 w-4" />
            Подтвердить выбор
          </>
        )}
      </Button>
    </div>
  );
};

export default ConfirmButton;

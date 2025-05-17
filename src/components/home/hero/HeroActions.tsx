
import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface HeroActionsProps {
  onAction: () => void;
  buttonText: string;
  showMobile?: boolean;
  showDesktop?: boolean;
}

/**
 * Компонент с кнопками действий для Hero секции
 */
const HeroActions: React.FC<HeroActionsProps> = ({
  onAction,
  buttonText,
  showMobile = true,
  showDesktop = true,
}) => {
  return (
    <>
      {/* Мобильная версия */}
      {showMobile && (
        <div className="flex justify-center md:hidden mb-4">
          <Button
            className="bg-[#0070F3] hover:bg-[#0060d3] text-white px-6 md:px-8 py-3 md:py-4 text-base font-medium rounded-full h-auto"
            onClick={onAction}
          >
            <Icon name="Play" size={18} className="mr-2" />
            {buttonText}
          </Button>
        </div>
      )}

      {/* Десктопная версия */}
      {showDesktop && (
        <div className="hidden md:flex justify-start mb-4">
          <Button
            className="bg-[#0070F3] hover:bg-[#0060d3] text-white px-6 md:px-8 py-3 md:py-4 text-base font-medium rounded-full h-auto"
            onClick={onAction}
          >
            <Icon name="Play" size={18} className="mr-2" />
            {buttonText}
          </Button>
        </div>
      )}
    </>
  );
};

export default HeroActions;

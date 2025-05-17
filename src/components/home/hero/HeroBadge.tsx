
import React from "react";
import Icon from "@/components/ui/icon";

interface HeroBadgeProps {
  text: string;
  iconName?: string;
}

/**
 * Компонент бейджа для секции Hero
 */
const HeroBadge: React.FC<HeroBadgeProps> = ({ text, iconName = "Sparkles" }) => {
  return (
    <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mb-4 md:mb-6 bg-[#0070F3]/10 text-[#0070F3] backdrop-blur-sm border border-[#0070F3]/20">
      <Icon name={iconName} size={14} className="text-[#0070F3] me-1" />
      {text}
    </span>
  );
};

export default HeroBadge;


import React from "react";

interface HeroDescriptionProps {
  description: string;
}

/**
 * Компонент описания для Hero секции
 */
const HeroDescription: React.FC<HeroDescriptionProps> = ({ description }) => {
  return (
    <p className="text-base md:text-lg text-slate-700 mb-5 max-w-xl mx-auto md:mx-0 leading-relaxed">
      {description}
    </p>
  );
};

export default HeroDescription;

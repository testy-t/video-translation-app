
import React from "react";

interface HeroHeadingProps {
  title: string;
  description: string;
}

/**
 * Компонент с заголовком и описанием Hero секции
 */
const HeroHeading: React.FC<HeroHeadingProps> = ({ title, description }) => {
  return (
    <>
      <h1 className="text-2xl md:text-4xl lg:text-7xl font-bold tracking-tight mt-4 md:mt-0 mb-4 text-slate-900">
        {title}
      </h1>
      <p className="text-base md:text-lg text-slate-700 mb-5 max-w-xl mx-auto md:mx-0 leading-relaxed">
        {description}
      </p>
    </>
  );
};

export default HeroHeading;

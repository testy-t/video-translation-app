import React from "react";

interface HeroHeadingProps {
  title: string;
}

/**
 * Компонент с заголовком Hero секции
 */
const HeroHeading: React.FC<HeroHeadingProps> = ({ title }) => {
  return (
    <h1 className="text-2xl md:text-4xl lg:text-7xl tracking-tight mt-4 md:mt-0 mb-4 text-slate-900 font-bold">
      {title}
    </h1>
  );
};

export default HeroHeading;

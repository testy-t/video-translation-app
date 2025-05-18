import React from "react";
import HeroHeading from "./HeroHeading";
import HeroDescription from "./HeroDescription";
import HeroActions from "./HeroActions";
import HeroBadge from "./HeroBadge";
import VideoPlayer from "./VideoPlayer";
import TestimonialsCounter from "../TestimonialsCounter";

const Hero: React.FC = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1A1F2C] to-[#0b0d13] py-20 md:py-32 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <HeroBadge />
            <HeroHeading />
            <HeroDescription />

            {/* Добавляем компонент отзывов */}
            <TestimonialsCounter />

            <HeroActions />
          </div>

          <div className="lg:col-span-5 flex items-center justify-center mt-8 lg:mt-0">
            <VideoPlayer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

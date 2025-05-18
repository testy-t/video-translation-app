import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../AnimatedBackground";
import HeroBadge from "./HeroBadge";
import HeroHeading from "./HeroHeading";
import HeroDescription from "./HeroDescription";
import HeroActions from "./HeroActions";
import VideoPlayer from "./VideoPlayer";
import { Language } from "./types";
import TestimonialsCounter from "../TestimonialsCounter";

// ===Hero-START===
const Hero: React.FC<HeroProps> = ({
  title = "AI видео перевод на любой язык за минуты",
  description = "Сохраняет исходный голос и эмоции диктора. Убедитесь сами - это просто!",
  videoSrc = "",
  languageSwitcherProps,
  badgeProps,
  actionsProps,
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-background py-8 md:py-12">
      <div className="container mx-auto flex flex-col items-center px-4 md:px-6">
        {/* Title */}
        <HeroHeading title={title} />

        {/* Description */}
        <HeroDescription description={description} />

        {/* Language Switcher */}
        {languageSwitcherProps && (
          <LanguageSwitcher {...languageSwitcherProps} />
        )}

        {/* Badge */}
        {badgeProps && <HeroBadge {...badgeProps} />}

        {/* Video Player */}
        {videoSrc && <VideoPlayer src={videoSrc} />}

        {/* Testimonials Counter - new component */}
        <TestimonialsCounter count="12,000+" />

        {/* Action Buttons */}
        {actionsProps && <HeroActions {...actionsProps} />}
      </div>
    </section>
  );
};
// ===Hero-END===

export default Hero;

import React from "react";
import HeroHeading from "./HeroHeading";
import HeroDescription from "./HeroDescription";
import HeroActions from "./HeroActions";
import HeroBadge from "./HeroBadge";
import VideoPlayer from "./VideoPlayer";
import LanguageSwitcher from "./LanguageSwitcher";
import TestimonialsCounter from "../TestimonialsCounter";
import { HeroProps } from "./types";

/**
 * Главный Hero-компонент для посадочной страницы
 */
const Hero: React.FC<HeroProps> = ({
  title = "Создавайте и переводите видео на 175+ языков",
  description = "Наш сервис позволяет легко перевести видео на любой язык, сохраняя синхронизацию губ и естественность звучания.",
  videoUrl,
  defaultLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="relative bg-background">
      <div className="container px-4 py-10 md:py-20 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Левая колонка - заголовок, описание и CTA */}
          <div className="fade-in flex flex-col justify-center order-2 lg:order-1">
            <div className="flex flex-wrap items-center gap-4">
              <HeroBadge text="ИИ Переводчик видео" />
              {/* Новый компонент с отзывами */}
              <div className="hidden md:block">
                <TestimonialsCounter count="8,000+" stars={5} />
              </div>
            </div>

            <HeroHeading title={title} />

            <HeroDescription description={description} />

            <HeroActions />
          </div>

          {/* Правая колонка - видеоплеер */}
          <div className="flex justify-center order-1 lg:order-2">
            <div className="w-full max-w-lg">
              <VideoPlayer videoUrl={videoUrl} />
              <LanguageSwitcher
                defaultLanguage={defaultLanguage}
                onLanguageChange={onLanguageChange}
              />
            </div>
          </div>

          {/* Мобильная версия блока отзывов */}
          <div className="block md:hidden order-3 lg:hidden">
            <TestimonialsCounter count="8,000+" stars={5} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import AnimatedBackground from "./AnimatedBackground";
import LanguageSelector from "./LanguageSelector";

const Hero: React.FC = () => {
  // Данные языков
  const languages = [
    { code: "ru", flag: "🇷🇺", name: "Русский", isActive: true },
    { code: "en", flag: "🇬🇧", name: "English" },
    { code: "zh", flag: "🇨🇳", name: "中文" },
    { code: "es", flag: "🇪🇸", name: "Español" },
    { code: "de", flag: "🇩🇪", name: "Deutsch" },
  ];

  // Обработчик выбора языка
  const handleLanguageSelect = (code: string) => {
    console.log(`Selected language: ${code}`);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Тёмная секция с минималистичным фоном */}
      <div className="min-h-[90vh] pt-32 pb-20 px-4 relative">
        <AnimatedBackground />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mb-6 bg-white/10 text-white backdrop-blur-sm border border-white/10">
            <Icon name="Video" size={16} className="text-white" />
            ИИ Переводчик Видео
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight mb-6 text-white">
            Ваш голос на любом языке
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Загрузите видео и получите профессиональный перевод на любой язык с
            идеальной синхронизацией губ за считанные минуты.
          </p>

          {/* Компонент выбора языка */}
          <LanguageSelector
            languages={languages}
            onSelectLanguage={handleLanguageSelect}
            isDark={true}
          />

          {/* Кнопка действия */}
          <Button className="bg-white/15 text-white hover:bg-white/25 hover:text-white px-8 py-6 text-base font-medium rounded-full mt-4 backdrop-blur-sm border border-white/10">
            <Icon name="Play" size={20} className="mr-2" />
            Начать Бесплатно
          </Button>
        </div>
      </div>

      {/* Волнистое разделение с корректировкой для устранения зазора */}
      <div className="absolute -bottom-1 left-0 w-full overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full h-auto fill-white"
        >
          <path d="M0,192L48,186.7C96,181,192,171,288,186.7C384,203,480,245,576,266.7C672,288,768,288,864,277.3C960,267,1056,245,1152,218.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;

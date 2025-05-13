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
      <div className="min-h-[100vh] pt-32 pb-20 px-4 relative">
        <AnimatedBackground />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Левая колонка - текст */}
            <div className="text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mb-6 bg-white/10 text-white backdrop-blur-sm border border-white/10">
                <Icon name="Video" size={16} className="text-white" />
                ИИ Переводчик Видео
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight mb-6 text-white">
                Ваш голос на любом языке
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
                Загрузите видео и получите профессиональный перевод на любой
                язык с идеальной синхронизацией губ за считанные минуты.
              </p>

              {/* Кнопка действия - теперь синяя */}
              <Button className="bg-[#0070F3] hover:bg-[#0060d3] text-white px-8 py-6 text-base font-medium rounded-full mt-4">
                <Icon name="Play" size={20} className="mr-2" />
                Начать Бесплатно
              </Button>
            </div>

            {/* Правая колонка - плейсхолдер для видео */}
            <div className="mx-auto w-full max-w-md">
              <div className="aspect-square bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 flex flex-col items-center justify-center relative glass-dark">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <Icon name="Play" size={36} className="text-white ml-1" />
                </div>
                <p className="absolute bottom-4 text-white/70 text-sm">
                  Демонстрация технологии
                </p>
              </div>

              {/* Перемещенный LanguageSelector под видео */}
              <div className="mt-10">
                <LanguageSelector
                  languages={languages}
                  onSelectLanguage={handleLanguageSelect}
                  isDark={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Волнистое разделение с корректировкой для устранения зазора */}
      <div className="absolute -bottom-1 left-0 w-full overflow-hidden">
        <div className="relative w-[200%]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full h-auto fill-white animate-wave"
          >
            <path d="M0,64L48,69.3C96,75,192,85,288,90.7C384,96,480,96,576,85.3C672,75,768,53,864,48C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full h-auto fill-white animate-wave absolute top-0 left-full"
          >
            <path d="M0,64L48,69.3C96,75,192,85,288,90.7C384,96,480,96,576,85.3C672,75,768,53,864,48C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;

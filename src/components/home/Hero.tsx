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

  // Обработчик выбора языка (для будущей функциональности)
  const handleLanguageSelect = (code: string) => {
    console.log(`Selected language: ${code}`);
    // Здесь будет логика смены языка
  };

  return (
    <section className="py-16 md:py-20 px-4 relative overflow-hidden">
      <AnimatedBackground />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <span className="inline-flex items-center gap-1.5 bg-[#7c4dff]/10 text-[#7c4dff] px-3 py-1.5 rounded-full text-sm font-medium mb-6">
          <Icon name="Video" size={18} />
          ИИ Переводчик Видео
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-montserrat">
          Ваш голос на любом языке
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-opensans">
          Загрузите видео и получите профессиональный перевод на любой язык с
          идеальной синхронизацией губ за считанные минуты.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Попробуйте примеры перевода
        </p>

        {/* Компонент выбора языка */}
        <LanguageSelector
          languages={languages}
          onSelectLanguage={handleLanguageSelect}
        />

        {/* Кнопка действия */}
        <Button className="bg-[#7c4dff] hover:bg-[#6c3ce9] rounded-full px-8 py-6 text-lg font-medium animate-pulse">
          <Icon name="Play" size={20} className="mr-2" />
          Начать Бесплатно
        </Button>
      </div>
    </section>
  );
};

export default Hero;

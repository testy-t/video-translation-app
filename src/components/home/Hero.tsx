import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import AnimatedBackground from "./AnimatedBackground";
import LanguageSelector from "./LanguageSelector";

const Hero: React.FC = () => {
  const navigate = useNavigate();

  // Функция для перехода на страницу генерации
  const goToOrderPage = () => {
    navigate("/order");
  };

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
      <div className="min-h-screen flex items-center pt-8 md:pt-16 pb-8 md:pb-16 relative">
        <AnimatedBackground />

        <div className="container mx-auto px-4 w-full max-w-[66rem] relative z-10">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            {/* Левая колонка - текст */}
            <div className="text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mb-4 md:mb-6 bg-white/10 text-white backdrop-blur-sm border border-white/10">
                <Icon name="Video" size={16} className="text-white" />
                ИИ Переводчик Видео
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-7xl font-medium tracking-tight mb-4 md:mb-6 text-white">
                Ваш голос на любом языке
              </h1>
              <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-10 max-w-xl leading-relaxed">
                Загрузите видео и получите профессиональный перевод на любой
                язык с идеальной синхронизацией губ за считанные минуты.
              </p>

              {/* Кнопка действия */}
              <Button
                className="bg-[#0070F3] hover:bg-[#0060d3] text-white px-6 md:px-8 py-5 md:py-6 text-base font-medium rounded-full h-auto"
                onClick={goToOrderPage}
              >
                <Icon name="Play" size={18} className="mr-2" />
                Начать Бесплатно
              </Button>
            </div>

            {/* Правая колонка - плейсхолдер для видео */}
            <div className="w-full flex flex-col items-center md:items-end mt-8 md:mt-0">
              <div className="w-full md:w-[85%] aspect-video md:aspect-square bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 flex flex-col items-center justify-center relative glass-dark">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <Icon name="Play" size={28} className="text-white ml-1" />
                </div>
                <p className="absolute bottom-4 text-white/70 text-sm">
                  Демонстрация технологии
                </p>
              </div>

              {/* Языки */}
              <div className="mt-4 md:mt-5 w-full md:w-[85%] px-0 md:px-2">
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
    </section>
  );
};

export default Hero;

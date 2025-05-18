import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../AnimatedBackground";
import HeroBadge from "./HeroBadge";
import HeroHeading from "./HeroHeading";
import HeroDescription from "./HeroDescription";
import HeroActions from "./HeroActions";
import VideoPlayer from "./VideoPlayer";
import { Language } from "./types";

/**
 * Главный компонент Hero секции
 */
const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [activeLanguage, setActiveLanguage] = useState("ru");
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Определяем мобильный вид при загрузке и изменении размера окна
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px - это breakpoint для md в Tailwind
    };

    // Проверяем при загрузке
    checkIsMobile();

    // Слушаем событие изменения размера окна
    window.addEventListener("resize", checkIsMobile);

    // Очищаем слушатель при размонтировании
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Функция для перехода на страницу генерации
  const goToOrderPage = () => {
    navigate("/order");
  };

  // Данные языков
  const languages: Language[] = [
    {
      code: "ru",
      flag: "🇷🇺",
      name: "Русский",
      isActive: activeLanguage === "ru",
    },
    { code: "zh", flag: "🇨🇳", name: "中文", isActive: activeLanguage === "zh" },
    {
      code: "de",
      flag: "🇩🇪",
      name: "Deutsch",
      isActive: activeLanguage === "de",
    },
    {
      code: "en",
      flag: "🇬🇧",
      name: "English",
      isActive: activeLanguage === "en",
    },
    {
      code: "es",
      flag: "🇪🇸",
      name: "Español",
      isActive: activeLanguage === "es",
    },
  ];

  // Обработчик выбора языка
  const handleLanguageSelect = (code: string) => {
    // Если выбран тот же язык, не делаем ничего
    if (activeLanguage === code) return;

    setActiveLanguage(code);
    console.log(`Selected language: ${code}`);
  };

  // Функция для переключения звука
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const description =
    "Загрузите видео и получите профессиональный перевод на любой язык с идеальной синхронизацией губ за считанные минуты.";

  return (
    <section className="relative overflow-hidden">
      <div className="min-h-screen flex items-center pt-14 md:pt-16 pb-24 md:pb-32 relative">
        {/* Анимированный фон только для десктопа */}
        {!isMobile && <AnimatedBackground />}

        <div className="container mx-auto px-4 md:px-0 w-full max-w-[66rem] relative z-10">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            {/* Левая колонка - текст */}
            <div className="text-center md:text-left w-full mt-8 md:mt-0">
              {/* Бейдж */}
              <HeroBadge text="ИИ Переводчик Видео" />

              {/* Заголовок */}
              <HeroHeading title="Ваш голос на любом языке" />

              {/* Описание - показываем только на десктопе */}
              {!isMobile && <HeroDescription description={description} />}

              {/* Кнопка действия для десктопа - после описания */}
              {!isMobile && (
                <HeroActions
                  onAction={goToOrderPage}
                  buttonText="Перевести видео"
                />
              )}

              {/* Видео плеер для мобильной версии */}
              {isMobile && (
                <VideoPlayer
                  activeLanguage={activeLanguage}
                  isMuted={isMuted}
                  onMuteToggle={toggleMute}
                  onLanguageSelect={handleLanguageSelect}
                  languages={languages}
                  isMobile={true}
                />
              )}

              {/* Кнопка действия после видео - для мобильной версии */}
              {isMobile && (
                <HeroActions
                  onAction={goToOrderPage}
                  buttonText="Перевести видео"
                />
              )}

              {/* Описание - показываем только на мобильных устройствах после кнопки */}
              {isMobile && <HeroDescription description={description} />}
            </div>

            {/* Правая колонка - видео с переключателем языков - только для десктопа */}
            {!isMobile && (
              <VideoPlayer
                activeLanguage={activeLanguage}
                isMuted={isMuted}
                onMuteToggle={toggleMute}
                onLanguageSelect={handleLanguageSelect}
                languages={languages}
                isMobile={false}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

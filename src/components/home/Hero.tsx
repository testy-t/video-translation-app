import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import AnimatedBackground from "./AnimatedBackground";
import LanguageSelector from "./LanguageSelector";
import InlineLanguageToggle from "./InlineLanguageToggle";

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [activeLanguage, setActiveLanguage] = useState("ru");
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);

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

  // При изменении языка останавливаем и перезапускаем видео
  useEffect(() => {
    // Сначала останавливаем все видео
    if (mobileVideoRef.current) {
      mobileVideoRef.current.pause();
    }
    if (desktopVideoRef.current) {
      desktopVideoRef.current.pause();
    }

    // После короткой задержки запускаем нужное видео
    setTimeout(() => {
      if (isMobile && mobileVideoRef.current) {
        mobileVideoRef.current
          .play()
          .catch((e) => console.error("Error playing mobile video:", e));
      } else if (!isMobile && desktopVideoRef.current) {
        desktopVideoRef.current
          .play()
          .catch((e) => console.error("Error playing desktop video:", e));
      }
    }, 50);
  }, [activeLanguage, isMobile]);

  // Функция для перехода на страницу генерации
  const goToOrderPage = () => {
    navigate("/order");
  };

  // Данные языков
  const languages = [
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

  // Функция для переключения звука только на активном видео
  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    // Воспроизводим видео только если оно на паузе и нужно включить звук
    if (!newMutedState) {
      // Воспроизводим только то видео, которое видит пользователь
      if (isMobile) {
        if (mobileVideoRef.current && mobileVideoRef.current.paused) {
          mobileVideoRef.current
            .play()
            .catch((e) => console.error("Error playing mobile video:", e));
        }
      } else {
        if (desktopVideoRef.current && desktopVideoRef.current.paused) {
          desktopVideoRef.current
            .play()
            .catch((e) => console.error("Error playing desktop video:", e));
        }
      }
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Тёмная секция с минималистичным фоном */}
      <div className="min-h-screen flex items-center pt-14 md:pt-16 pb-24 md:pb-32 relative">
        {!isMobile && <AnimatedBackground />}

        <div className="container mx-auto px-4 md:px-0 w-full max-w-[66rem] relative z-10">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            {/* Левая колонка - текст */}
            <div className="text-center md:text-left w-full mt-8 md:mt-0">
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mb-4 md:mb-6 bg-[#0070F3]/10 text-[#0070F3] backdrop-blur-sm border border-[#0070F3]/20">
                <Icon
                  name="Sparkles"
                  size={14}
                  className="text-[#0070F3] me-1"
                />
                ИИ Переводчик Видео
              </span>
              <h1 className="text-2xl md:text-4xl lg:text-7xl font-bold tracking-tight mt-4 md:mt-0 mb-4 text-slate-900">
                Ваш голос на любом языке
              </h1>

              {/* Видео для мобильной версии размещаем сразу после заголовка */}
              <div className="w-full mb-3 flex justify-center md:hidden">
                <div
                  className="w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-slate-200 relative shadow-lg cursor-pointer"
                  onClick={toggleMute}
                >
                  {isMobile && (
                    <video
                      ref={mobileVideoRef}
                      className="w-full h-full object-cover"
                      src={`https://cdn.poehali.dev/golosok/preview/${activeLanguage === "zh" ? "cn" : activeLanguage}.mp4`}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      key={`mobile-${activeLanguage}`}
                    />
                  )}
                  <div className="absolute bottom-4 right-4 bg-black/60 rounded-full p-3 shadow-lg cursor-pointer">
                    <Icon
                      name={isMuted ? "VolumeX" : "Volume2"}
                      size={26}
                      className="text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Инлайн переключатель языков сразу под видео */}
              <div className="mb-5 flex justify-center md:hidden">
                <InlineLanguageToggle
                  languages={languages}
                  activeLanguage={activeLanguage}
                  onSelectLanguage={handleLanguageSelect}
                />
              </div>

              {/* Кнопка действия после выбора языка - только для мобильной версии */}
              <div className="flex justify-center md:hidden mb-4">
                <Button
                  className="bg-[#0070F3] hover:bg-[#0060d3] text-white px-6 md:px-8 py-3 md:py-4 text-base font-medium rounded-full h-auto"
                  onClick={goToOrderPage}
                >
                  <Icon name="Play" size={18} className="mr-2" />
                  Перевести видео
                </Button>
              </div>

              <p className="text-base md:text-lg text-slate-700 mb-5 max-w-xl mx-auto md:mx-0 leading-relaxed">
                Загрузите видео и получите профессиональный перевод на любой
                язык с идеальной синхронизацией губ за считанные минуты.
              </p>

              {/* Кнопка действия для десктопа - после описания */}
              <div className="hidden md:flex justify-start mb-4">
                <Button
                  className="bg-[#0070F3] hover:bg-[#0060d3] text-white px-6 md:px-8 py-3 md:py-4 text-base font-medium rounded-full h-auto"
                  onClick={goToOrderPage}
                >
                  <Icon name="Play" size={18} className="mr-2" />
                  Перевести видео
                </Button>
              </div>
            </div>

            {/* Правая колонка - видео - только для десктопа */}
            <div className="w-full hidden md:flex flex-col items-center md:items-end mt-0">
              <div
                className="w-full md:w-[85%] aspect-video md:aspect-square rounded-2xl overflow-hidden border border-slate-200 relative shadow-lg cursor-pointer"
                onClick={toggleMute}
              >
                {!isMobile && (
                  <video
                    ref={desktopVideoRef}
                    className="w-full h-full object-cover"
                    src={`https://cdn.poehali.dev/golosok/preview/${activeLanguage === "zh" ? "cn" : activeLanguage}.mp4`}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    key={`desktop-${activeLanguage}`}
                  />
                )}
                <div className="absolute bottom-4 right-4 bg-black/60 rounded-full p-3 shadow-lg cursor-pointer">
                  <Icon
                    name={isMuted ? "VolumeX" : "Volume2"}
                    size={26}
                    className="text-white"
                  />
                </div>
              </div>

              {/* Языки - мобильный стиль с увеличенным размером для десктопа */}
              <div className="mt-4 md:mt-5 w-full md:w-[85%] hidden md:flex justify-center">
                <InlineLanguageToggle
                  languages={languages}
                  activeLanguage={activeLanguage}
                  onSelectLanguage={handleLanguageSelect}
                  isDesktop={true}
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

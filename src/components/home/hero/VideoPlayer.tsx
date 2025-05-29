import React, { useRef, useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import LanguageSwitcher from "./LanguageSwitcher";
import { Language } from "./types";

interface VideoPlayerProps {
  activeLanguage: string;
  isMuted: boolean;
  onMuteToggle: () => void;
  onLanguageSelect: (code: string) => void;
  languages: Language[];
  isMobile: boolean;
}

/**
 * Компонент видеоплеера с переключателем языков
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({
  activeLanguage,
  isMuted,
  onMuteToggle,
  onLanguageSelect,
  languages,
  isMobile,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // При изменении языка останавливаем и перезапускаем видео
  useEffect(() => {
    // Сначала останавливаем видео
    if (videoRef.current) {
      videoRef.current.pause();
    }

    // После короткой задержки запускаем видео снова
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current
          .play()
          .catch((e) => console.error("Error playing video:", e));
      }
    }, 50);
  }, [activeLanguage]);

  const getVideoUrl = (lang: string) => {
    // Преобразуем 'zh' в 'cn' для URL
    const langCode = lang === "zh" ? "cn" : lang;
    return `https://cdn.poehali.dev/golosok/preview/${langCode}.mp4`;
  };

  // Условный рендеринг плеера в зависимости от типа устройства
  if (isMobile) {
    return (
      <>
        {/* Мобильный плеер */}
        <div className="w-full mb-3 flex justify-center md:hidden">
          <div
            className="w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-slate-200 relative shadow-lg cursor-pointer"
            onClick={onMuteToggle}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src={getVideoUrl(activeLanguage)}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              key={`mobile-${activeLanguage}`}
            />
            <MuteButton isMuted={isMuted} />
          </div>
        </div>

        {/* Мобильный переключатель языков */}
        <div className="mb-5 flex justify-center md:hidden">
          <LanguageSwitcher
            languages={languages}
            activeLanguage={activeLanguage}
            onLanguageSelect={onLanguageSelect}
            isDesktop={false}
          />
        </div>
      </>
    );
  }

  // Десктопная версия
  return (
    <div className="w-full hidden md:flex flex-col items-center md:items-end mt-0">
      <div
        className="w-full md:w-[85%] aspect-video md:aspect-square rounded-2xl overflow-hidden border border-slate-200 relative shadow-lg cursor-pointer"
        onClick={onMuteToggle}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover rounded-none"
          src={getVideoUrl(activeLanguage)}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          key={`desktop-${activeLanguage}`}
        />
        <MuteButton isMuted={isMuted} />
      </div>

      {/* Десктопный переключатель языков */}
      <div className="mt-4 md:mt-5 w-full md:w-[85%] hidden md:flex justify-center">
        <LanguageSwitcher
          languages={languages}
          activeLanguage={activeLanguage}
          onLanguageSelect={onLanguageSelect}
          isDesktop={true}
        />
      </div>
    </div>
  );
};

// Компонент кнопки включения/выключения звука
const MuteButton: React.FC<{ isMuted: boolean }> = ({ isMuted }) => (
  <div className="absolute bottom-4 right-4 bg-black/60 rounded-full p-3 shadow-lg cursor-pointer">
    <Icon
      name={isMuted ? "VolumeX" : "Volume2"}
      size={26}
      className="text-white"
    />
  </div>
);

export default VideoPlayer;

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
// Удален импорт AdvantageSection

const HomePage: React.FC = () => {
  // Данные для секции "Как это работает"
  const workflowSteps = [
    {
      icon: "Upload",
      title: "Загрузите видео",
      description: "Просто загрузите ваше видео в любом популярном формате",
    },
    {
      icon: "Languages",
      title: "Выберите язык",
      description: "Выберите один из 70+ языков для перевода вашего контента",
    },
    {
      icon: "Download",
      title: "Скачайте результат",
      description:
        "Получите видео с идеальной синхронизацией губ на выбранном языке",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">
        <Hero />
        <HowItWorks steps={workflowSteps} />
        {/* Удалена секция AdvantageSection */}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;

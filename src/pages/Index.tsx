import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import PricingSection from "@/components/home/PricingSection";

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
      description: "Выберите один из 175+ языков для перевода вашего контента",
    },
    {
      icon: "Download",
      title: "Скачайте результат",
      description:
        "Получите видео с идеальной синхронизацией губ на выбранном языке",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0f1c]">
      <Header />

      <main className="flex-grow">
        <section id="home" className="w-full">
          <Hero />
        </section>

        {/* Удаляем отступы сверху в секциях */}
        <section id="how-it-works" className="w-full py-20 bg-gray-100">
          <HowItWorks steps={workflowSteps} />
        </section>

        <section id="pricing" className="w-full py-20 bg-white">
          <PricingSection />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;

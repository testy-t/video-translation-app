import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface DocumentLayoutProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Общий шаблон для страниц с юридическими документами
 */
const DocumentLayout: React.FC<DocumentLayoutProps> = ({ title, children }) => {
  const location = useLocation();

  // При монтировании компонента и изменении маршрута прокручиваем страницу вверх
  useEffect(() => {
    // Используем таймаут для гарантии того, что скролл произойдет после рендеринга
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto max-w-4xl py-24 px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-8">{title}</h1>
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DocumentLayout;

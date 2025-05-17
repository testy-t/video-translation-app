import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation();

  // Функция для прокрутки к секции на главной странице
  const scrollToSection = (id: string) => {
    // Если мы не на главной странице, сначала переходим на неё
    if (location.pathname !== "/") {
      navigate("/");
      // Задержка для загрузки страницы перед скроллом
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // Если уже на главной, просто скроллим
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Обработчик для перехода по ссылкам с возвратом наверх страницы
  const handleNavigate = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full mt-auto pt-10">
      <div className="container mx-auto px-4 md:px-0 w-full max-w-[66rem]">
        <div className="rounded-t-2xl border border-gray-200 shadow-xl backdrop-blur-md bg-gray-100">
          <div className="p-6 pb-10 relative min-h-[140px]">
            <div
              className="flex items-center absolute top-6 left-6 cursor-pointer"
              onClick={() => {
                navigate("/");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <Icon name="Mic2" size={32} className="text-[#0070F3] mr-3" />
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-black leading-tight">
                  ГолосОК
                </span>
                <p className="text-sm text-black/70 leading-tight">
                  © {currentYear}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 md:ml-auto md:w-3/5">
              <div className="flex flex-col mt-20 md:mt-0">
                <h3 className="text-black text-sm font-medium mb-3">
                  Навигация
                </h3>
                <div className="flex flex-col gap-2">
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-sm text-black/70 hover:text-black transition-colors"
                  >
                    Главная
                  </a>
                  <a
                    href="/#pricing"
                    onClick={(e) => scrollToSection("pricing")}
                    className="text-sm text-black/70 hover:text-black transition-colors"
                  >
                    Цена
                  </a>
                  <a
                    href="/order"
                    onClick={handleNavigate("/order")}
                    className="text-sm text-black/70 hover:text-black transition-colors"
                  >
                    Заказать
                  </a>
                </div>
              </div>

              <div className="flex flex-col md:mt-0">
                <h3 className="text-black text-sm font-medium mb-3">
                  Документы
                </h3>
                <div className="flex flex-col gap-2">
                  <a
                    href="/offer"
                    onClick={handleNavigate("/offer")}
                    className="text-sm text-black/70 hover:text-black transition-colors"
                  >
                    Оферта
                  </a>
                  <a
                    href="/privacy"
                    onClick={handleNavigate("/privacy")}
                    className="text-sm text-black/70 hover:text-black transition-colors"
                  >
                    Обработка ПД
                  </a>
                  <a
                    href="/confidentiality"
                    onClick={handleNavigate("/confidentiality")}
                    className="text-sm text-black/70 hover:text-black transition-colors"
                  >
                    Конфиденциальность
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import Icon from "@/components/ui/icon";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto">
      <div className="container mx-auto px-4 md:px-0 w-full max-w-[66rem]">
        <div className="rounded-t-2xl bg-[#4d4d4d] shadow-lg">
          <div className="px-6 py-8 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {/* Колонка с логотипом */}
              <div className="flex items-start">
                <Icon name="Mic2" size={32} className="text-[#0070F3] mr-3" />
                <div className="flex flex-col">
                  <span className="text-xl font-semibold text-white">
                    ГолосОК
                  </span>
                  <p className="text-sm text-gray-300 mt-1">{currentYear} ©</p>
                </div>
              </div>

              {/* Навигация */}
              <div className="flex flex-col">
                <h3 className="text-white text-sm font-medium mb-3">
                  Навигация
                </h3>
                <div className="flex flex-col gap-2">
                  <a
                    href="#home"
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    Главная
                  </a>
                  <a
                    href="#pricing"
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    Цена
                  </a>
                  <a
                    href="#"
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    Документация
                  </a>
                </div>
              </div>

              {/* Документы */}
              <div className="flex flex-col">
                <h3 className="text-white text-sm font-medium mb-3">
                  Документы
                </h3>
                <div className="flex flex-col gap-2">
                  <a
                    href="#"
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    Оферта
                  </a>
                  <a
                    href="#"
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    Обработка ПД
                  </a>
                  <a
                    href="#"
                    className="text-sm text-gray-300 hover:text-white transition-colors"
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

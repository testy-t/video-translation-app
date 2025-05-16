import React from "react";
import Icon from "@/components/ui/icon";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto">
      <div className="w-full max-w-[60rem] mx-auto px-4">
        <div className="rounded-t-2xl bg-[#4d4d4d] shadow-lg">
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
              {/* Колонка с логотипом */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Mic2" size={22} className="text-[#0070F3]" />
                  <span className="text-lg font-medium text-white">
                    ГолосОК
                  </span>
                </div>
                <p className="text-sm text-gray-300 mt-1">{currentYear} ©</p>
              </div>

              {/* Сообщество */}
              <div className="flex flex-col">
                <h3 className="text-white text-sm font-medium mb-3">
                  Сообщество
                </h3>
                <a
                  href="https://t.me/+QgiLIa1gFRY4Y2Iy"
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <Icon name="Send" size={14} />
                  Телеграм
                </a>
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
                    Тарифы
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

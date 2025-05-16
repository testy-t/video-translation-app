import React from "react";
import Icon from "@/components/ui/icon";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full flex justify-center px-4 pb-4 mt-16">
      <footer className="w-full max-w-[60rem] rounded-[20px] bg-[#1a1a1d] glass-dark shadow-lg">
        <div className="px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Колонка с логотипом */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Mic2" size={24} className="text-[#0070F3]" />
                <span className="text-xl font-semibold text-white">
                  ГолосОК
                </span>
              </div>
              <p className="text-sm text-gray-400">{currentYear} ©</p>
            </div>

            {/* Сообщество */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-white font-medium mb-4">Сообщество</h3>
              <a
                href="https://t.me/+QgiLIa1gFRY4Y2Iy"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Icon name="Send" size={16} />
                Телеграм
              </a>
            </div>

            {/* Навигация */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-white font-medium mb-4">Навигация</h3>
              <div className="flex flex-col gap-3">
                <a
                  href="#home"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Главная
                </a>
                <a
                  href="#how-it-works"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Тарифы
                </a>
                <a
                  href="#pricing"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Документация
                </a>
              </div>
            </div>

            {/* Документы */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-white font-medium mb-4">Документы</h3>
              <div className="flex flex-col gap-3">
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Оферта
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Обработка ПД
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Конфиденциальность
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;

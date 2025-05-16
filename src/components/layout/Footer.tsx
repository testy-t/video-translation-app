import React from "react";
import Icon from "@/components/ui/icon";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-4 pb-8 pt-12 mt-auto">
      <div className="max-w-[66rem] mx-auto">
        <div className="rounded-xl bg-[#1a1a1d] glass-dark shadow-lg border border-white/10 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Колонка с логотипом */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Mic2" size={24} className="text-[#0070F3]" />
                <span className="text-xl font-semibold text-white">
                  ГолосОК
                </span>
              </div>
              <p className="text-sm text-gray-400">
                © {currentYear} ГолосОК
                <br />
                Все права защищены
              </p>
            </div>

            {/* Навигация */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-white font-medium mb-4">Навигация</h3>
              <div className="grid grid-cols-1 gap-3">
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
                  Как это работает
                </a>
                <a
                  href="#pricing"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Тарифы
                </a>
              </div>
            </div>

            {/* Контакты */}
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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

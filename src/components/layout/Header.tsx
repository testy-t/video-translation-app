import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="fixed top-4 left-0 right-0 z-50 mx-auto w-full max-w-6xl px-4">
      <div className="rounded-full bg-[#1a1a1d] p-2 glass-dark shadow-lg border border-white/10">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Логотип */}
          <div className="flex items-center gap-2">
            <Icon name="Mic2" size={24} className="text-[#0070F3]" />
            <span className="text-xl font-semibold text-white">ГолосОК</span>
          </div>

          {/* Навигация по центру */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link
              to="/"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Главная
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              О нас
            </Link>
            <Link
              to="/pricing"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Тарифы
            </Link>
          </nav>

          {/* Правая часть */}
          <div className="flex items-center gap-3">
            {/* Информация о стоимости */}
            <div className="hidden lg:block text-gray-300 text-sm">
              <span>1 минута перевода — 500 ₽</span>
            </div>

            {/* Кнопка CTA */}
            <Button className="bg-[#0070F3] hover:bg-[#0060d3] text-white rounded-full px-5">
              Попробовать
            </Button>

            {/* Меню мобильное */}
            <Button
              variant="ghost"
              className="md:hidden p-1 text-white rounded-full"
            >
              <Icon name="Menu" size={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

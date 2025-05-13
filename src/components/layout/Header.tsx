import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-2">
          {/* Лого */}
          <Icon name="Mic2" size={24} className="text-[#0070F3]" />
          <span className="text-xl font-semibold text-white">ГолосОК</span>
        </div>
        <nav className="hidden md:flex gap-6 items-center">
          <a
            href="#"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Главная
          </a>
          <a
            href="#"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            О нас
          </a>
        </nav>
        <div className="flex items-center">
          {/* Синяя кнопка CTA */}
          <Button className="bg-[#0070F3] hover:bg-[#0060d3] text-white">
            Попробовать
          </Button>
          <Button variant="ghost" className="md:hidden p-1 text-white ml-2">
            <Icon name="Menu" size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

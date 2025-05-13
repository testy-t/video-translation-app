
import React from 'react';
import { Button } from "@/components/ui/button";
import Icon from '@/components/ui/icon';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-white">ГолосОК</span>
        </div>
        <nav className="hidden md:flex gap-6 items-center">
          <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Возможности</a>
          <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Как это работает</a>
          <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Цены</a>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden md:inline-flex text-gray-300 hover:text-white transition-colors">
            Войти
          </Button>
          <Button className="glass-dark-button text-white bg-white/10 hover:bg-white/20">
            Попробовать
          </Button>
          <Button variant="ghost" className="md:hidden p-1 text-white">
            <Icon name="Menu" size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

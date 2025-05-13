
import React from 'react';
import { Button } from "@/components/ui/button";
import Icon from '@/components/ui/icon';

const Header: React.FC = () => {
  return (
    <header className="border-b py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#7c4dff]">ГолосОК</span>
        </div>
        <nav className="hidden md:flex gap-6 items-center">
          <a href="#" className="text-sm font-medium text-gray-700 hover:text-[#7c4dff]">Возможности</a>
          <a href="#" className="text-sm font-medium text-gray-700 hover:text-[#7c4dff]">Как это работает</a>
          <a href="#" className="text-sm font-medium text-gray-700 hover:text-[#7c4dff]">Цены</a>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden md:inline-flex">
            Войти
          </Button>
          <Button className="bg-[#7c4dff] hover:bg-[#6c3ce9]">
            Регистрация
          </Button>
          <Button variant="ghost" className="md:hidden p-1">
            <Icon name="Menu" size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

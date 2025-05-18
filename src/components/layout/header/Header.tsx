import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScrollDetection } from "./hooks/useScrollDetection";
import { useOrderHistory } from "./hooks/useOrderHistory";
import Icon from "@/components/ui/icon";
import Logo from "./Logo";
import NavigationLinks from "./NavigationLinks";
import ActionButtons from "./ActionButtons";

const Header: React.FC = () => {
  const location = useLocation();
  const isScrolled = useScrollDetection();
  const { orderCodes, addTestOrder } = useOrderHistory();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Закрываем мобильное меню при изменении маршрута
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Функция открытия чата поддержки
  const openSupportChat = () => {
    if (window.openJivoChat) {
      window.openJivoChat();
    } else if (window.jivo_api) {
      window.jivo_api.open();
    }
  };

  // Определяем, находимся ли мы на главной странице
  const isHomePage = location.pathname === "/";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled ? "bg-white shadow-sm py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Логотип */}
          <Logo />

          {/* Навигационные ссылки (скрыты на мобильных) */}
          <div className="hidden md:block">
            <NavigationLinks />
          </div>

          {/* Кнопки действий (скрыты на мобильных) */}
          <div className="hidden md:flex items-center gap-3">
            <ActionButtons
              orderCodes={orderCodes}
              onAddTestOrder={addTestOrder}
            />

            {/* Добавляем кнопку поддержки в хедер на всех страницах */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600"
              onClick={openSupportChat}
            >
              <Icon name="MessageCircle" className="mr-1" size={16} />
              <span>Поддержка</span>
            </Button>
          </div>

          {/* Мобильные кнопки */}
          <div className="flex items-center md:hidden gap-2">
            {/* На главной показываем кнопку поддержки */}
            {isHomePage && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600"
                onClick={openSupportChat}
              >
                <Icon name="MessageCircle" size={18} />
              </Button>
            )}

            {/* Всегда показываем кнопку заказа */}
            <Link to="/order">
              <Button
                size="sm"
                className="bg-[#0070F3] hover:bg-[#0060d3] text-white"
              >
                Попробовать
              </Button>
            </Link>

            {/* Кнопка мобильного меню */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-1"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <NavigationLinks orientation="vertical" />

            <div className="mt-4 pt-4 border-t">
              {/* Кнопка поддержки в мобильном меню */}
              <Button
                variant="outline"
                size="sm"
                className="w-full mb-2 justify-start"
                onClick={openSupportChat}
              >
                <Icon name="MessageCircle" className="mr-2" size={16} />
                <span>Поддержка</span>
              </Button>

              <Link to="/order" className="block">
                <Button
                  size="sm"
                  className="w-full bg-[#0070F3] hover:bg-[#0060d3]"
                >
                  Попробовать
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

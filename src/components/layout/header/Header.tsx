
import React from "react";
import Logo from "./Logo";
import NavigationLinks from "./NavigationLinks";
import ActionButtons from "./ActionButtons";
import { useScrollDetection } from "./hooks/useScrollDetection";
import { useOrderHistory } from "./hooks/useOrderHistory";

/**
 * Основной компонент хедера приложения
 */
const Header: React.FC = () => {
  // Используем кастомные хуки для логики
  const scrolled = useScrollDetection(10);
  const { orderCodes, addTestOrder } = useOrderHistory();

  return (
    <header className="fixed top-4 left-0 right-0 z-50 mx-auto w-full flex justify-center">
      <div className="w-full max-w-[66rem] px-4 md:px-0">
        <div
          className={`
            rounded-full transition-all duration-300 ease-in-out border backdrop-blur-md
            ${
              scrolled
                ? "bg-[#ffffff1a] border-[#ffffff1a] shadow-md"
                : "bg-transparent border-transparent"
            }
          `}
        >
          <div className="flex items-center justify-between px-4 py-2">
            {/* Логотип */}
            <Logo />

            {/* Навигация по центру */}
            <NavigationLinks />

            {/* Кнопки справа */}
            <ActionButtons 
              orderCodes={orderCodes} 
              onAddTestOrder={addTestOrder} 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

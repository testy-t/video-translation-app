
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavItem {
  id: string;
  label: string;
  action: () => void;
}

interface NavigationLinksProps {
  items?: NavItem[];
}

const NavigationLinks: React.FC<NavigationLinksProps> = ({ items }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Функция для плавной прокрутки к секции
  const scrollToSection = (id: string) => {
    // Если мы не на главной странице, сначала переходим на неё
    if (location.pathname !== "/") {
      navigate("/");
      // Задержка, чтобы дать время для загрузки главной страницы
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // Если мы уже на главной, просто прокручиваем к нужной секции
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };
  
  // Дефолтные пункты навигации, если не переданы извне
  const defaultItems: NavItem[] = [
    {
      id: "home",
      label: "Главная",
      action: () => scrollToSection("home"),
    },
    {
      id: "how-it-works",
      label: "О нас",
      action: () => scrollToSection("how-it-works"),
    },
    {
      id: "pricing",
      label: "Цена",
      action: () => scrollToSection("pricing"),
    },
    {
      id: "support",
      label: "Поддержка",
      action: () => window.jivo_api?.open(),
    },
  ];

  const navItems = items || defaultItems;

  return (
    <nav className="hidden md:flex gap-8 items-center">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={item.action}
          className="text-sm font-medium text-black hover:text-black/80 transition-colors"
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};

export default NavigationLinks;

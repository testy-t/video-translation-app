import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [orderCodes, setOrderCodes] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Отслеживаем скролл страницы
  useEffect(() => {
    const handleScroll = () => {
      // Проверяем, произошла ли прокрутка больше чем на 10px
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Добавляем обработчик события скролла
    window.addEventListener("scroll", handleScroll);

    // Вызываем обработчик при монтировании, чтобы установить начальное состояние
    handleScroll();

    // Убираем обработчик при размонтировании
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Загружаем коды заказов из localStorage
  useEffect(() => {
    const loadOrderCodes = () => {
      try {
        const storedCodes = localStorage.getItem("completedPaymentCodes");
        if (storedCodes) {
          const codes = JSON.parse(storedCodes);
          setOrderCodes(Array.isArray(codes) ? codes : []);
        } else {
          setOrderCodes([]);
        }
      } catch (error) {
        console.error("Ошибка при загрузке истории заказов:", error);
        setOrderCodes([]);
      }
    };

    loadOrderCodes();

    // Обновляем историю заказов при любых изменениях в localStorage
    window.addEventListener("storage", loadOrderCodes);

    return () => {
      window.removeEventListener("storage", loadOrderCodes);
    };
  }, []);

  // Эффект для восстановления скролла страницы при открытии дропдауна
  useEffect(() => {
    if (isOpen) {
      // Маленькая задержка, чтобы дать время Radix UI установить стили
      setTimeout(() => {
        // Находим элемент, который блокирует скролл (добавленный Radix)
        document.body.style.overflow = "";
        // Находим и удаляем padding-right
        document.body.style.paddingRight = "";
      }, 0);
    }
  }, [isOpen]);

  // Функция для открытия заказа по коду
  const openOrder = (code: string) => {
    navigate(`/order?step=3&uniquecode=${code}`);
  };

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

  // Функция для перехода на страницу генерации
  const goToOrderPage = () => {
    navigate("/order");
  };

  // Для отладки - если нет заказов, можно временно добавить тестовый
  const addTestOrder = () => {
    const testCode = "b94e7fd4-5539-4d2c-aba0-993e49891f88";
    const currentCodes = [...orderCodes];
    if (!currentCodes.includes(testCode)) {
      const newCodes = [...currentCodes, testCode];
      localStorage.setItem("completedPaymentCodes", JSON.stringify(newCodes));
      setOrderCodes(newCodes);
    }
  };

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
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <Icon name="Mic2" size={24} className="text-[#0070F3]" />
              <span className="text-base md:text-lg font-semibold text-black">
                ГолосОК
              </span>
            </div>

            {/* Навигация по центру */}
            <nav className="hidden md:flex gap-8 items-center">
              <button
                onClick={() => scrollToSection("home")}
                className="text-sm font-medium text-black hover:text-black/80 transition-colors"
              >
                Главная
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-sm font-medium text-black hover:text-black/80 transition-colors"
              >
                О нас
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-sm font-medium text-black hover:text-black/80 transition-colors"
              >
                Цена
              </button>
              <button
                onClick={() => window.jivo_api?.open()}
                className="text-sm font-medium text-black hover:text-black/80 transition-colors"
              >
                Поддержка
              </button>
            </nav>

            {/* Кнопки справа */}
            <div className="flex items-center gap-2">
              {/* Создаем кастомный дропдаун вместо DropdownMenu */}
              <div className="relative">
                <Button
                  ref={triggerRef}
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-black hover:bg-[#0070F3]/10 focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (orderCodes.length === 0) {
                      addTestOrder();
                    }
                    setIsOpen(!isOpen);
                  }}
                >
                  <Icon name="ShoppingBag" size={20} />
                </Button>

                {isOpen && (
                  <>
                    {/* Клик вне дропдауна для закрытия */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsOpen(false)}
                    />

                    {/* Контент дропдауна */}
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-[200px] rounded-md border bg-popover p-1 text-popover-foreground shadow-md z-50"
                    >
                      {orderCodes.length === 0 ? (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground cursor-not-allowed">
                          Тут будут ваши заказы
                        </div>
                      ) : (
                        [...orderCodes].reverse().map((code) => (
                          <div
                            key={code}
                            onClick={() => {
                              openOrder(code);
                              setIsOpen(false);
                            }}
                            className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground"
                          >
                            Заказ #{code.slice(0, 6).toUpperCase()}
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Кнопка CTA */}
              <Button
                onClick={goToOrderPage}
                className="bg-[#0070F3] hover:bg-[#0060d3] text-white rounded-full px-5 h-8 text-sm"
              >
                Попробовать
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

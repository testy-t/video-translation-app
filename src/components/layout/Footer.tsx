import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // Функция для открытия чата JivoSite
  const openSupportChat = () => {
    // Проверяем, доступна ли функция openJivoChat
    if (window.openJivoChat) {
      window.openJivoChat();
    } else {
      // Запасной вариант, если наша функция недоступна
      // Пытаемся использовать API напрямую
      if (window.jivo_api) {
        window.jivo_api.open();
      } else {
        console.warn("JivoSite API не загружен");
      }
    }
  };

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Колонка с логотипом и описанием */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Mic2" className="text-primary" size={24} />
              <span className="text-xl font-semibold">ГолосОК</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Сервис для перевода видео на любой язык с синхронизацией губ
              благодаря нейросетям.
            </p>

            {/* Кнопка поддержки */}
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={openSupportChat}
            >
              <Icon name="MessageCircle" size={16} />
              <span>Поддержка</span>
            </Button>
          </div>

          {/* Колонка с ссылками на страницы */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Страницы</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  Главная
                </Link>
              </li>
              <li>
                <Link
                  to="/order"
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  Заказать перевод
                </Link>
              </li>
              <li>
                <Link
                  to="/offer"
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  Оферта
                </Link>
              </li>
              <li>
                <Link
                  to="/confidentiality"
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </div>

          {/* Колонка с контактами */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Связаться с нами</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Icon name="Mail" size={16} className="text-gray-600" />
                <a
                  href="mailto:info@golosok.ru"
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  info@golosok.ru
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Icon
                  name="MessageCircle"
                  size={16}
                  className="text-gray-600"
                />
                <button
                  onClick={openSupportChat}
                  className="text-sm text-gray-600 hover:text-primary cursor-pointer"
                >
                  Написать в чат
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Копирайт */}
        <div className="border-t mt-8 pt-4 text-center text-sm text-gray-600">
          <p>© {currentYear} ГолосОК. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

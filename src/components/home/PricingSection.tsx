import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const PricingSection: React.FC = () => {
  const navigate = useNavigate();

  // Функция для перехода на страницу генерации
  const goToOrderPage = () => {
    navigate("/order");
  };

  // Обработчик для кнопки выбора тарифа
  const handleClickPricing = () => {
    // Перенаправляем пользователя на страницу создания заказа
    navigate("/order");
  };

  return (
    <div className="container mx-auto px-4 md:px-0 w-full max-w-[66rem]">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Цена
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Платите только за то, что используете.
        </p>
      </div>

      <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
        <div className="flex flex-col md:flex-row">
          {/* Цена - на мобильных отображается сверху */}
          <div className="w-full md:w-1/3 bg-[#0070F3] text-white p-8 flex flex-col justify-center items-center text-center order-first md:order-last">
            <h3 className="text-5xl md:text-6xl font-bold mb-2">119 ₽</h3>
            <p className="text-xl text-blue-100">
              за 1 минуту видео
            </p>
          </div>
          
          {/* Хайлайты (преимущества) */}
          <div className="w-full md:w-2/3 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl">
                <div className="flex items-start">
                  <Icon
                    name="Globe"
                    size={28}
                    className="text-[#0070F3] mr-3 mt-1 shrink-0"
                  />
                  <div>
                    <h4 className="text-lg font-semibold mb-1">175+ языков</h4>
                    <p className="text-gray-600 text-sm">Широкий выбор языков для перевода вашего контента</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-xl">
                <div className="flex items-start">
                  <Icon
                    name="MessageSquare"
                    size={28}
                    className="text-[#0070F3] mr-3 mt-1 shrink-0"
                  />
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Синхронизация губ</h4>
                    <p className="text-gray-600 text-sm">Идеальная синхронизация движений губ говорящего</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-xl">
                <div className="flex items-start">
                  <Icon
                    name="Mic"
                    size={28}
                    className="text-[#0070F3] mr-3 mt-1 shrink-0"
                  />
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Естественный голос</h4>
                    <p className="text-gray-600 text-sm">Сохранение естественного тембра и интонаций голоса</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-xl">
                <div className="flex items-start">
                  <Icon
                    name="Clock"
                    size={28}
                    className="text-[#0070F3] mr-3 mt-1 shrink-0"
                  />
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Быстрый результат</h4>
                    <p className="text-gray-600 text-sm">Готовое видео в течение 15 минут после загрузки</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              className="bg-[#0070F3] hover:bg-[#0060d3] text-white px-8 py-3 text-base font-medium rounded-full h-auto w-full md:w-2/3 mx-auto block mt-8"
              onClick={goToOrderPage}
            >
              Начать перевод
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PricingSection;

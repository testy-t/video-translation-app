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

  // Added handler for pricing button
  const handleClickPricing = () => {
    // Implement the logic for selecting tariff
    // For example, navigate or open modal
    navigate("/pricing");
  };

  return (
    <div className="container mx-auto px-4 md:px-0 w-full max-w-[66rem]">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Простая и прозрачная стоимость
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Платите только за то, что используете.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="flex flex-col md:flex-row">
          {/* Основная информация о цене */}
          <div className="w-full md:w-2/3 p-10 flex flex-col justify-center">
            <h3 className="text-4xl md:text-5xl font-bold mb-2">500 ₽</h3>
            <p className="text-gray-500 mb-6">за минуту переведенного видео</p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Icon
                  name="CheckCircle"
                  size={20}
                  className="text-green-500 mr-2 mt-1 shrink-0"
                />
                <span>175+ языков</span>
              </li>
              <li className="flex items-start">
                <Icon
                  name="CheckCircle"
                  size={20}
                  className="text-green-500 mr-2 mt-1 shrink-0"
                />
                <span>Идеальная синхронизация губ говорящего</span>
              </li>
              <li className="flex items-start">
                <Icon
                  name="CheckCircle"
                  size={20}
                  className="text-green-500 mr-2 mt-1 shrink-0"
                />
                <span>Сохранение естественного тембра голоса</span>
              </li>
              <li className="flex items-start">
                <Icon
                  name="CheckCircle"
                  size={20}
                  className="text-green-500 mr-2 mt-1 shrink-0"
                />
                <span>Результат в течение 5 минут</span>
              </li>
            </ul>

            <Button
              className="bg-[#0070F3] hover:bg-[#0060d3] text-white px-8 py-3 md:py-4 text-base font-medium rounded-full h-auto w-full mt-6"
              onClick={handleClickPricing}
            >
              Выбрать тариф
            </Button>
          </div>

          {/* Боковая панель */}
          <div className="w-full md:w-1/3 bg-[#0070F3] text-white p-10 flex flex-col justify-center">
            <h4 className="text-xl font-bold mb-4">Корпоративные решения</h4>
            <p className="mb-6 text-blue-100">
              Для компаний с большими объемами видеоконтента предлагаем
              индивидуальные тарифы со скидками.
            </p>
            <Button className="bg-white text-[#0070F3] hover:bg-blue-50 hover:text-[#0070F3] border-none rounded-full">
              Запросить предложение
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-gray-500 text-sm">
        * Минимальный заказ от 1 минуты. Округление до целой минуты в большую
        сторону.
      </div>
    </div>
  );
};

export default PricingSection;

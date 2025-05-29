import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Icon from "@/components/ui/icon";

const Instructions: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Выберите номинал",
      description: "Подберите подходящую сумму для вашего подарка",
    },
    {
      number: "02",
      title: "Оформите заказ",
      description: "Заполните форму и выберите способ оплаты",
    },
    {
      number: "03",
      title: "Получите код",
      description: "Мгновенно получите код карты на email",
    },
    {
      number: "04",
      title: "Активируйте в App Store",
      description: "Введите код в настройках Apple ID",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow pt-20 pb-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <h1 className="text-5xl font-light text-gray-900 mb-6">
              Как использовать
              <br />
              Apple Gift Card
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Простые шаги для получения и активации вашей подарочной карты
            </p>
          </div>

          <div className="grid gap-16 mb-20">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-8">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {step.number}
                  </span>
                </div>
                <div className="pt-2">
                  <h3 className="text-2xl font-medium text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <Icon name="Info" size={24} className="text-blue-500 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Важная информация
                </h4>
                <p className="text-gray-600">
                  Apple Gift Card можно использовать для покупок в App Store,
                  iTunes Store, Apple Books и для оплаты подписок Apple. Карта
                  действительна только в России.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Instructions;

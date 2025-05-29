import React from "react";
import GiftCardItem from "./GiftCardItem";

const GiftCardCatalog: React.FC = () => {
  const cards = [
    {
      amount: 1000,
      popular: false,
      description: "Для небольших покупок и подписок",
    },
    {
      amount: 2500,
      popular: true,
      description: "Самый популярный номинал",
    },
    {
      amount: 5000,
      popular: false,
      description: "Для больших покупок и подарков",
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-gray-900 mb-6">
            Выберите номинал
          </h2>
          <p className="text-xl text-gray-600">
            Доступные варианты подарочных карт Apple
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {cards.map((card, index) => (
            <GiftCardItem
              key={index}
              amount={card.amount}
              popular={card.popular}
              description={card.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GiftCardCatalog;

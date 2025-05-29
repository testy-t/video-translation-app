import React from "react";

const GiftCardHero: React.FC = () => {
  return (
    <section className="relative pt-20 pb-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-8 tracking-tight">
          Apple Gift Card
        </h1>
        <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Идеальный подарок для любителей Apple.
          <br />
          Мгновенная доставка на email.
        </p>

        <div className="relative max-w-lg mx-auto">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-gray-900 rounded"></div>
                <span className="text-gray-600 font-medium">Apple</span>
              </div>
              <div className="text-3xl font-light text-gray-900 mb-2">
                Gift Card
              </div>
              <div className="text-sm text-gray-500">
                Действительна в App Store и iTunes
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiftCardHero;

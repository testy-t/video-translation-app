import React from "react";

interface OrderContainerProps {
  children: React.ReactNode;
}

/**
 * Контейнер для страницы заказа, обеспечивающий единый стиль для всех шагов
 */
const OrderContainer: React.FC<OrderContainerProps> = ({ children }) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-5xl py-8 px-4 pb-24">
        {children}
      </div>
    </div>
  );
};

export default OrderContainer;

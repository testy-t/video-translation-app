
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import OrdersDropdown from "./OrdersDropdown";

interface ActionButtonsProps {
  orderCodes: string[];
  onAddTestOrder?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  orderCodes, 
  onAddTestOrder 
}) => {
  const navigate = useNavigate();

  // Функция для перехода на страницу генерации
  const goToOrderPage = () => {
    navigate("/order");
  };

  return (
    <div className="flex items-center gap-2">
      {/* Дропдаун с заказами */}
      <OrdersDropdown 
        orderCodes={orderCodes} 
        onAddTestOrder={onAddTestOrder} 
      />

      {/* Кнопка CTA */}
      <Button
        onClick={goToOrderPage}
        className="bg-[#0070F3] hover:bg-[#0060d3] text-white rounded-full px-5 h-8 text-sm"
      >
        Попробовать
      </Button>
    </div>
  );
};

export default ActionButtons;

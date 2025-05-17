
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface OrdersDropdownProps {
  orderCodes: string[];
  onAddTestOrder?: () => void;
}

const OrdersDropdown: React.FC<OrdersDropdownProps> = ({ 
  orderCodes,
  onAddTestOrder 
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Функция для открытия заказа по коду
  const openOrder = (code: string) => {
    navigate(`/order?step=3&uniquecode=${code}`);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full text-black hover:bg-[#0070F3]/10 focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        onClick={(e) => {
          e.stopPropagation();
          if (orderCodes.length === 0 && onAddTestOrder) {
            onAddTestOrder();
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
  );
};

export default OrdersDropdown;

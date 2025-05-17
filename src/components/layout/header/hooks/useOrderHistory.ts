
import { useState, useEffect } from "react";

/**
 * Хук для управления историей заказов из localStorage
 * @returns Список кодов заказов и метод для добавления тестового заказа
 */
export function useOrderHistory() {
  const [orderCodes, setOrderCodes] = useState<string[]>([]);

  // Загрузка кодов заказов из localStorage
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

    // Обновляем историю заказов при изменениях в localStorage
    window.addEventListener("storage", loadOrderCodes);

    return () => {
      window.removeEventListener("storage", loadOrderCodes);
    };
  }, []);

  // Метод для добавления тестового заказа (для разработки)
  const addTestOrder = () => {
    const testCode = "b94e7fd4-5539-4d2c-aba0-993e49891f88";
    const currentCodes = [...orderCodes];
    if (!currentCodes.includes(testCode)) {
      const newCodes = [...currentCodes, testCode];
      localStorage.setItem("completedPaymentCodes", JSON.stringify(newCodes));
      setOrderCodes(newCodes);
    }
  };

  return { orderCodes, addTestOrder };
}

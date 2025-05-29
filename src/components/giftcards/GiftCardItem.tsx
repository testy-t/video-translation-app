import React from "react";
import { Button } from "@/components/ui/button";

interface GiftCardItemProps {
  amount: number;
  popular?: boolean;
  description: string;
}

const GiftCardItem: React.FC<GiftCardItemProps> = ({
  amount,
  popular,
  description,
}) => {
  return (
    <div
      className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${popular ? "ring-2 ring-blue-500" : ""}`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            Популярный
          </span>
        </div>
      )}

      <div className="text-center">
        <div className="mb-6">
          <div className="text-5xl font-light text-gray-900 mb-2">
            {amount.toLocaleString("ru-RU")}
          </div>
          <div className="text-2xl text-gray-600">рублей</div>
        </div>

        <p className="text-gray-600 mb-8">{description}</p>

        <Button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full text-lg font-medium transition-colors duration-200"
          size="lg"
        >
          Купить за {amount.toLocaleString("ru-RU")} ₽
        </Button>
      </div>
    </div>
  );
};

export default GiftCardItem;

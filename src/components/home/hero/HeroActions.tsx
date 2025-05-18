import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroActions: React.FC = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/order");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
      <Button
        className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base h-auto"
        onClick={handleStartClick}
      >
        Перевести видео от 149 ₽
      </Button>
      <Button
        className="bg-transparent border border-gray-600 hover:bg-white/5 text-white px-8 py-6 text-base h-auto"
        onClick={() => navigate("/faq")}
      >
        Узнать больше
      </Button>
    </div>
  );
};

export default HeroActions;

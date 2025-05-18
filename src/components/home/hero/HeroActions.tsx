import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroActions: React.FC = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/order");
  };

  return (
    <div className="mt-8">
      <Button
        className="bg-[#0070F3] hover:bg-[#0060d3] text-white px-8 py-2.5 text-base font-medium rounded-full h-auto"
        onClick={handleStartClick}
      >
        Перевести видео от 149 ₽
      </Button>
    </div>
  );
};

export default HeroActions;

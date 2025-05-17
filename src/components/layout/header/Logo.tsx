
import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const Logo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => navigate("/")}
    >
      <Icon name="Mic2" size={24} className="text-[#0070F3]" />
      <span className="text-base md:text-lg font-semibold text-black">
        ГолосОК
      </span>
    </div>
  );
};

export default Logo;

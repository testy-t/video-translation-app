
import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Темный градиентный фон */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111827] via-[#1E293B] to-[#334155]"></div>
      
      {/* Темный оверлей с блюром */}
      <div className="absolute inset-0 backdrop-blur-[120px]"></div>
      
      {/* Анимированные элементы на темном фоне */}
      <div className="circle-animation absolute -top-20 -left-20 w-96 h-96 rounded-full bg-[#0070F3]/30 animate-float-slow"></div>
      <div className="circle-animation absolute top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#5EEAD4]/20 animate-float-medium"></div>
      <div className="circle-animation absolute bottom-20 -left-40 w-[800px] h-[800px] rounded-full bg-[#818CF8]/20 animate-float"></div>
      
      {/* Светящиеся линии */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-[10%] left-0 w-full h-[1px] bg-[#38BDF8] transform -rotate-1"></div>
        <div className="absolute top-[30%] left-0 w-full h-[1px] bg-[#38BDF8] transform rotate-2"></div>
        <div className="absolute top-[70%] left-0 w-full h-[1px] bg-[#38BDF8] transform -rotate-1"></div>
      </div>
      
      {/* Легкий градиентный оверлей внизу */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black/30 to-transparent"></div>
      
      {/* Светящиеся точки */}
      <div className="absolute top-[15%] right-[10%] w-4 h-4 rounded-full bg-[#38BDF8]/70 blur-sm animate-pulse-subtle"></div>
      <div className="absolute top-[60%] left-[15%] w-6 h-6 rounded-full bg-[#7DD3FC]/80 blur-sm animate-pulse-subtle"></div>
      <div className="absolute bottom-[20%] right-[20%] w-5 h-5 rounded-full bg-[#BAE6FD]/70 blur-sm animate-pulse-subtle"></div>
    </div>
  );
};

export default AnimatedBackground;

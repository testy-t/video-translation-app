
import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Простой темный градиентный фон без лишних элементов */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111827] to-[#1E293B]"></div>
      
      {/* Легкий градиентный оверлей внизу для плавного перехода */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  );
};

export default AnimatedBackground;

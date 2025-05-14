
import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Основной темный градиентный фон */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111827] to-[#1E293B]"></div>
      
      {/* Заблюренные градиентные волны */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Первая волна - синеватая */}
        <div 
          className="absolute w-[120%] h-[55%] -left-[10%] top-[20%] rounded-[100%] opacity-20 animate-float-slow"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0, 112, 243, 0.4) 0%, rgba(10, 15, 28, 0) 70%)',
            filter: 'blur(40px)',
          }}
        ></div>
        
        {/* Вторая волна - пурпурная */}
        <div 
          className="absolute w-[100%] h-[45%] left-[20%] top-[35%] rounded-[100%] opacity-15 animate-float-medium"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(124, 58, 237, 0.35) 0%, rgba(10, 15, 28, 0) 70%)',
            filter: 'blur(45px)',
          }}
        ></div>
        
        {/* Третья волна - бирюзовая */}
        <div 
          className="absolute w-[80%] h-[50%] -left-[5%] top-[15%] rounded-[100%] opacity-20 animate-float"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(45, 212, 191, 0.3) 0%, rgba(10, 15, 28, 0) 75%)',
            filter: 'blur(50px)',
          }}
        ></div>
      </div>
      
      {/* Легкий градиентный оверлей внизу для плавного перехода */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  );
};

export default AnimatedBackground;

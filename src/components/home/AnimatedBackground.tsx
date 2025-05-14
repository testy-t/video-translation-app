
import React from 'react';

// Компонент для создания анимированных SVG-путей
const FloatingPaths = ({ position }: { position: number }) => {
  // Создаем 36 путей с разными параметрами
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    opacity: 0.1 + i * 0.02,
    width: 0.5 + i * 0.03,
    // Разные параметры анимации для каждого пути
    animationDuration: `${20 + Math.random() * 10}s`,
    animationDelay: `${Math.random() * 5}s`,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <svg
        className="w-full h-full text-white opacity-50"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            style={{
              animation: `pathAnimation ${path.animationDuration} ${path.animationDelay} linear infinite`,
            }}
            className="path-anim"
          />
        ))}
      </svg>
    </div>
  );
};

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Основной темный градиентный фон */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111827] to-[#1E293B]"></div>
      
      {/* Анимированные SVG пути */}
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
      
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

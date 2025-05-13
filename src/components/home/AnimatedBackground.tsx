
import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8f9ff] to-white"></div>
      
      {/* Анимированные круги */}
      <div className="circle-animation absolute -top-20 -left-20 w-60 h-60 rounded-full bg-[#7c4dff]/5 animate-float-slow"></div>
      <div className="circle-animation absolute top-40 -right-40 w-80 h-80 rounded-full bg-[#7c4dff]/10 animate-float-medium"></div>
      <div className="circle-animation absolute bottom-20 -left-40 w-96 h-96 rounded-full bg-[#6c3ce9]/5 animate-float"></div>
      
      {/* Анимированные волны */}
      <svg className="absolute bottom-0 left-0 w-full opacity-30" 
           viewBox="0 0 1440 320" 
           xmlns="http://www.w3.org/2000/svg">
        <path 
          fill="#7c4dff" 
          fillOpacity="0.2"
          d="M0,192L48,170.7C96,149,192,107,288,112C384,117,480,171,576,197.3C672,224,768,224,864,192C960,160,1056,96,1152,74.7C1248,53,1344,75,1392,85.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          className="animate-wave-slow"
        ></path>
        <path 
          fill="#7c4dff" 
          fillOpacity="0.1"
          d="M0,256L48,261.3C96,267,192,277,288,245.3C384,213,480,139,576,128C672,117,768,171,864,208C960,245,1056,267,1152,240C1248,213,1344,139,1392,101.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          className="animate-wave-medium"
        ></path>
      </svg>
    </div>
  );
};

export default AnimatedBackground;

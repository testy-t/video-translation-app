
import React from "react";
import Icon from "@/components/ui/icon";

interface Step {
  icon: string;
  title: string;
  description: string;
}

interface HowItWorksProps {
  steps: Step[];
}

const HowItWorks: React.FC<HowItWorksProps> = ({ steps }) => {
  return (
    <section className="py-16 px-4 bg-white relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-gray-900 mb-3">
            Как это работает
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Создавайте переводы видео с сохранением вашего голоса и идеальной синхронизацией губ за три простых шага
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              {/* Номер шага в стиле Apple */}
              <div className="relative mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/90 to-blue-600/90 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <Icon name={step.icon} size={32} />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#0070F3] text-white flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="absolute -inset-3 bg-blue-100/50 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>
              </div>
              
              <h3 className="text-xl font-medium text-gray-800 mb-2 tracking-tight">
                {step.title}
              </h3>
              
              <p className="text-gray-500 mb-4 max-w-xs mx-auto">
                {step.description}
              </p>
              
              {/* Кнопка в стиле Apple */}
              <a href="#" className="flex items-center text-sm font-medium text-[#0070F3] mt-auto group-hover:translate-x-0.5 transition-transform">
                Узнать больше
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1 group-hover:translate-x-0.5 transition-transform">
                  <path d="M7.5 1.5L13 7M13 7L7.5 12.5M13 7H1" stroke="#0070F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

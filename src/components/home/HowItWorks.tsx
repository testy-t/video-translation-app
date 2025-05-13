
import React from 'react';
import Icon from '@/components/ui/icon';

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
    <section className="py-24 px-4 bg-[#f5f5f7]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-medium text-center mb-16 tracking-tight text-gray-900">Как это работает</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="glass w-20 h-20 flex items-center justify-center rounded-full mb-6">
                <Icon name={step.icon} size={30} className="text-[#0070F3]" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-gray-900">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

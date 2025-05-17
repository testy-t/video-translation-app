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
    <div className="container mx-auto px-4 md:px-0 w-full max-w-[66rem]">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Как это работает
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          От видео от перевода всего несколько минут.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center apple-step">
            <div className="apple-step-icon">
              <Icon name={step.icon} size={28} className="text-white" />
              <div className="apple-step-number">{index + 1}</div>
            </div>
            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
            <p className="text-center text-gray-600 mb-4">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;

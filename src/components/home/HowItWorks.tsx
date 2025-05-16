import React from "react";
import Icon from "@/components/ui/icon";

interface StepType {
  icon: string;
  title: string;
  description: string;
}

interface HowItWorksProps {
  steps: StepType[];
}

const HowItWorks: React.FC<HowItWorksProps> = ({ steps }) => {
  return (
    <section className="py-24 px-4 bg-white w-full">
      <div className="max-w-[66rem] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Как это работает
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Процесс перевода вашего видео предельно прост и занимает всего
            несколько минут
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center apple-step"
            >
              <div className="apple-step-icon">
                <Icon name={step.icon} size={28} color="white" />
                <span className="apple-step-number">{index + 1}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600 mb-4">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

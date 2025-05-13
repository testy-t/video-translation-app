
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
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
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 font-montserrat">Как это работает</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4 text-[#7c4dff]">
                  <Icon name={step.icon} size={36} />
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

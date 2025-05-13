
import React from 'react';
import FeatureBox from './FeatureBox';
import StatsDisplay from './StatsDisplay';

const AdvantageSection: React.FC = () => {
  // Статистика
  const stats = [
    { value: '70+', label: 'языков' },
    { value: '175+', label: 'диалектов' },
  ];

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-medium text-center mb-16 tracking-tight text-gray-900">Глобальный охват</h2>
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <FeatureBox>
              <h3 className="text-xl font-medium mb-5 text-[#0070F3]">Один контент — множество языков</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Превратите одно видео в контент на <span className="text-[#0070F3] font-medium">более 70+ языков и 175+ диалектов</span> с помощью ИИ - настолько естественно, что кажется, будто вы всегда говорили на них. Без актеров озвучивания, без дубляжа. Ваш голос, идеально синхронизированный с губами для любой аудитории.
              </p>
            
              <div className="mt-8">
                <h4 className="font-medium mb-4 text-gray-800">Почему это важно:</h4>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="text-[#0070F3] text-xl">•</span>
                    <span>Расширьте аудиторию вашего контента в глобальном масштабе</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0070F3] text-xl">•</span>
                    <span>Сэкономьте до 90% бюджета на локализацию</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0070F3] text-xl">•</span>
                    <span>Сократите время производства с недель до часов</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0070F3] text-xl">•</span>
                    <span>Сохраните естественность речи и мимики</span>
                  </li>
                </ul>
              </div>
            </FeatureBox>
          </div>
          
          <div className="glass p-10 rounded-2xl shadow-lg">
            <h3 className="text-xl font-medium mb-8 text-center text-gray-900">Наши возможности</h3>
            <StatsDisplay stats={stats} />
            
            <div className="mt-10 grid grid-cols-2 gap-6">
              <div className="glass text-center p-6 rounded-2xl">
                <p className="text-xl font-medium text-[#0070F3]">99.7%</p>
                <p className="text-sm text-gray-500 mt-1">точность синхронизации</p>
              </div>
              <div className="glass text-center p-6 rounded-2xl">
                <p className="text-xl font-medium text-[#0070F3]">4K</p>
                <p className="text-sm text-gray-500 mt-1">поддержка высокого разрешения</p>
              </div>
              <div className="glass text-center p-6 rounded-2xl">
                <p className="text-xl font-medium text-[#0070F3]">GDPR</p>
                <p className="text-sm text-gray-500 mt-1">соответствие требованиям</p>
              </div>
              <div className="glass text-center p-6 rounded-2xl">
                <p className="text-xl font-medium text-[#0070F3]">24/7</p>
                <p className="text-sm text-gray-500 mt-1">техническая поддержка</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvantageSection;

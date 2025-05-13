
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
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 font-montserrat">Глобальный охват</h2>
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <FeatureBox>
              <h3 className="text-xl font-bold mb-3 text-[#7c4dff]">Один контент — множество языков</h3>
              <p>
                Превратите одно видео в контент на <span className="text-[#7c4dff] font-bold">более 70+ языков и 175+ диалектов</span> с помощью ИИ - настолько естественно, что кажется, будто вы всегда говорили на них. Без актеров озвучивания, без дубляжа. Ваш голос, идеально синхронизированный с губами для любой аудитории.
              </p>
            </FeatureBox>
            
            <div className="mt-6">
              <h4 className="font-medium mb-2">Почему это важно:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Расширьте аудиторию вашего контента в глобальном масштабе</li>
                <li>Сэкономьте до 90% бюджета на локализацию</li>
                <li>Сократите время производства с недель до часов</li>
                <li>Сохраните естественность речи и мимики</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-center">Наши возможности</h3>
            <StatsDisplay stats={stats} />
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-[#7c4dff]/5 rounded-lg">
                <p className="text-lg font-bold">99.7%</p>
                <p className="text-sm text-gray-600">точность синхронизации</p>
              </div>
              <div className="text-center p-4 bg-[#7c4dff]/5 rounded-lg">
                <p className="text-lg font-bold">4K</p>
                <p className="text-sm text-gray-600">поддержка высокого разрешения</p>
              </div>
              <div className="text-center p-4 bg-[#7c4dff]/5 rounded-lg">
                <p className="text-lg font-bold">GDPR</p>
                <p className="text-sm text-gray-600">соответствие требованиям</p>
              </div>
              <div className="text-center p-4 bg-[#7c4dff]/5 rounded-lg">
                <p className="text-lg font-bold">24/7</p>
                <p className="text-sm text-gray-600">техническая поддержка</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvantageSection;

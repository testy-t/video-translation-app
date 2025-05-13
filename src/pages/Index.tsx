
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from '@/components/ui/icon';

const VideoTranslator = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Верхний баннер */}
      <div className="bg-[#7c4dff] text-white py-2 px-4 flex justify-center items-center gap-2 relative">
        <p className="text-sm sm:text-base">2025 Keynote: Новая эра видео с переводом ИИ</p>
        <Button variant="link" className="text-white p-0 flex items-center gap-1 hover:underline">
          Зарегистрироваться
          <Icon name="ArrowRight" size={16} />
        </Button>
        <Button variant="ghost" className="p-1 absolute right-2 top-1/2 -translate-y-1/2 h-auto">
          <Icon name="X" size={16} className="text-white" />
        </Button>
      </div>

      {/* Навигационное меню */}
      <header className="border-b py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">ВидеоПолиглот</span>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-[#7c4dff]">Платформа</a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-[#7c4dff]">Решения</a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-[#7c4dff]">Ресурсы</a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-[#7c4dff]">Цены</a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-[#7c4dff]">Компания</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="hidden md:inline-flex">
              Войти
            </Button>
            <Button className="bg-[#7c4dff] hover:bg-[#6c3ce9]">
              Регистрация
            </Button>
            <Button variant="ghost" className="md:hidden p-1">
              <Icon name="Menu" size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* Основная секция */}
      <main className="flex-grow">
        {/* Герой-секция */}
        <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center z-0 opacity-30" 
               style={{backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80)'}}
          />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-[#7c4dff]/10 text-[#7c4dff] px-3 py-1.5 rounded-full text-sm font-medium mb-6">
              <Icon name="Video" size={18} />
              ИИ Переводчик Видео
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-montserrat">
              Ваш Голос, Понятный Везде
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-opensans">
              Загрузите видео и получите профессиональный перевод на любой язык
              с идеальной синхронизацией губ за считанные минуты.
            </p>
            <p className="text-sm text-gray-500 mb-8">Попробуйте примеры перевода</p>
            
            {/* Кнопки языков */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <Button className="bg-[#7c4dff] hover:bg-[#6c3ce9] rounded-full px-6">
                <span className="mr-2">🇷🇺</span> Русский
              </Button>
              <Button variant="outline" className="rounded-full px-6 hover:bg-[#7c4dff]/10">
                <span className="mr-2">🇬🇧</span> English
              </Button>
              <Button variant="outline" className="rounded-full px-6 hover:bg-[#7c4dff]/10">
                <span className="mr-2">🇨🇳</span> 中文
              </Button>
              <Button variant="outline" className="rounded-full px-6 hover:bg-[#7c4dff]/10">
                <span className="mr-2">🇪🇸</span> Español
              </Button>
              <Button variant="outline" className="rounded-full px-6 hover:bg-[#7c4dff]/10">
                <span className="mr-2">🇩🇪</span> Deutsch
              </Button>
            </div>
            
            {/* Информационный блок */}
            <div className="flex flex-col md:flex-row justify-center gap-6 mb-10">
              <div className="text-left max-w-md">
                <p className="text-gray-700 mb-3">
                  Превратите одно видео в контент на <span className="text-[#7c4dff] font-bold">более 70+ языков и 175+ диалектов</span> с помощью ИИ - настолько естественно, что кажется, будто вы всегда говорили на них. Без актеров озвучивания, без дубляжа. Ваш голос, идеально синхронизированный с губами для любой аудитории.
                </p>
              </div>
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <p className="text-5xl font-bold text-[#7c4dff]">70+</p>
                  <p className="text-sm text-gray-600">языков</p>
                </div>
                <div className="text-center">
                  <p className="text-5xl font-bold text-[#7c4dff]">175+</p>
                  <p className="text-sm text-gray-600">диалектов</p>
                </div>
              </div>
            </div>
            
            {/* Кнопка действия */}
            <Button className="bg-[#7c4dff] hover:bg-[#6c3ce9] rounded-full px-8 py-6 text-lg font-medium">
              <Icon name="Play" size={20} className="mr-2" />
              Начать Бесплатно
            </Button>
          </div>
        </section>

        {/* Функциональные карточки */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 font-montserrat">Как это работает</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 text-[#7c4dff]">
                    <Icon name="Upload" size={36} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Загрузите видео</h3>
                  <p className="text-gray-600">Просто загрузите ваше видео в любом популярном формате</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 text-[#7c4dff]">
                    <Icon name="Languages" size={36} fallback="Globe" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Выберите язык</h3>
                  <p className="text-gray-600">Выберите один из 70+ языков для перевода вашего контента</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 text-[#7c4dff]">
                    <Icon name="Download" size={36} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Скачайте результат</h3>
                  <p className="text-gray-600">Получите видео с идеальной синхронизацией губ на выбранном языке</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Подвал */}
      <footer className="bg-gray-50 py-8 px-4 border-t">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>© 2025 ВидеоПолиглот. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default VideoTranslator;

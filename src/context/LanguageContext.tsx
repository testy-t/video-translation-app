import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { LanguagesService, Language as DbLanguage } from '@/integrations/supabase';

// Упрощенный интерфейс для использования в компонентах
export interface Language {
  code: string;      // iso_code из API
  name: string;      // ru_name из API
  flag?: string;     // flag_emoji из API
}

interface LanguageContextType {
  languages: Language[];
  isLoading: boolean;
  error: string | null;
  getLanguageName: (code: string) => string;
}

// Создаем контекст
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Преобразует объект языка из БД в формат, используемый в приложении
 */
const mapDbLanguageToAppLanguage = (dbLang: DbLanguage): Language => ({
  code: dbLang.iso_code,
  name: dbLang.ru_name,
  flag: dbLang.flag_emoji || '🌐'
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        setIsLoading(true);
        console.log('🌍 Загружаем данные о языках из API...');
        
        // Используем тот же сервис, что и в useLanguages
        const response = await LanguagesService.getLanguages();
        
        if (response.success && response.languages.length > 0) {
          // Преобразуем языки из БД в формат приложения и убеждаемся в уникальности кодов
          const uniqueLanguages = new Map();
          
          // Сначала добавляем все языки в Map для проверки дубликатов
          response.languages.forEach(dbLang => {
            // Если уже есть язык с таким iso_code, используем версию с наивысшим id (самую свежую)
            const existingLang = uniqueLanguages.get(dbLang.iso_code);
            if (!existingLang || dbLang.id > existingLang.id) {
              uniqueLanguages.set(dbLang.iso_code, dbLang);
            }
          });
          
          // Преобразуем уникальные языки из Map в массив
          const appLanguages = Array.from(uniqueLanguages.values())
            .map(mapDbLanguageToAppLanguage);
            
          console.log(`🌍 Загружено ${appLanguages.length} языков`);
          console.log('🌍 Коды языков:', appLanguages.map(l => l.code).join(', '));
          
          setLanguages(appLanguages);
        } else {
          console.error('Не удалось загрузить языки:', response.error);
          setError('Не удалось загрузить актуальный список языков');
        }
      } catch (err) {
        console.error('🚨 Ошибка при загрузке языков:', err);
        setError(err instanceof Error ? err.message : 'Ошибка при получении языков');
      } finally {
        setIsLoading(false);
      }
    };

    // Загружаем языки только если они еще не загружены
    if (languages.length === 0) {
      loadLanguages();
    }
  }, [languages.length]);

  // Функция для получения имени языка по коду
  const getLanguageName = (code: string): string => {
    if (!code) return 'Неизвестный язык';
    
    console.log(`🔍 Ищем язык по коду: "${code}" среди ${languages.length} языков`);
    
    // Сначала ищем точное совпадение (с учетом регистра)
    const exactMatch = languages.find(lang => 
      lang.code.toLowerCase() === code.toLowerCase()
    );
    
    if (exactMatch) {
      console.log(`✅ Найдено точное совпадение для "${code}": ${exactMatch.name}`);
      return exactMatch.name;
    }
    
    // Если код имеет расширенный формат (например, en-US, en-AA), 
    // пробуем получить основную часть кода до дефиса
    const baseLangCode = code.split('-')[0].toLowerCase();
    console.log(`🔍 Проверяем основной код языка: "${baseLangCode}"`);
    
    // Ищем по базовому коду (en из en-IE)
    const baseMatch = languages.find(lang => 
      lang.code.toLowerCase() === baseLangCode || 
      lang.code.split('-')[0].toLowerCase() === baseLangCode
    );
    
    if (baseMatch) {
      console.log(`✅ Найдено совпадение по основному коду: ${baseMatch.name}`);
      return baseMatch.name;
    }
    
    console.log(`❌ Язык не найден для кода: "${code}"`);
    return 'Неизвестный язык';
  };

  const value = {
    languages,
    isLoading,
    error,
    getLanguageName
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Хук для использования контекста языков
export const useLanguageContext = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};
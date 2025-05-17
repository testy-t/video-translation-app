import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Интерфейс для языка из API
interface LanguageFromAPI {
  id: number;
  original_name: string;
  ru_name: string;
  iso_code: string;
  flag_emoji: string;
  is_active: boolean;
}

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

// API для получения языков из Supabase REST API
const fetchLanguages = async (): Promise<Language[]> => {
  try {
    // Используем REST API для получения списка языков
    const response = await fetch('https://tbgwudnxjwplqtkjihxc.supabase.co/rest/v1/languages', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`Ошибка API languages: ${response.status} ${response.statusText}`);
      throw new Error(`Ошибка API: ${response.status}`);
    }
    
    // Получаем данные в формате LanguageFromAPI[]
    const apiLanguages: LanguageFromAPI[] = await response.json();
    console.log('🌍 Получено языков из API:', apiLanguages.length);
    
    // Преобразуем в наш формат
    return apiLanguages
      .filter(lang => lang.is_active) // Только активные языки
      .map(lang => ({
        code: lang.iso_code,
        name: lang.ru_name,
        flag: lang.flag_emoji
      }));
  } catch (error) {
    console.error('Ошибка при получении языков:', error);
    return [];
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        setIsLoading(true);
        console.log('🌍 Загружаем данные о языках из API...');
        const data = await fetchLanguages();
        console.log(`🌍 Загружено ${data.length} языков`);
        setLanguages(data);
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
    
    // Сначала ищем точное совпадение
    const exactMatch = languages.find(lang => lang.code === code);
    if (exactMatch) return exactMatch.name;
    
    // Если код имеет расширенный формат (например, en-US, en-AA), 
    // пробуем получить основную часть кода до дефиса
    const baseLangCode = code.split('-')[0];
    const baseMatch = languages.find(lang => lang.code === baseLangCode);
    
    return baseMatch ? baseMatch.name : 'Неизвестный язык';
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
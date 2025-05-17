
import { useState, useMemo, useEffect } from 'react';
import { UseLanguagesResult, Language as LangType } from '../types';
import { AVAILABLE_LANGUAGES } from '../languages-data';
import { LanguagesService, Language as DbLanguage } from '@/integrations/supabase';

/**
 * Преобразует объект языка из БД в формат, используемый в приложении
 */
const mapDbLanguageToAppLanguage = (dbLang: DbLanguage): LangType => ({
  code: dbLang.iso_code,
  name: dbLang.ru_name,
  flag: dbLang.flag_emoji || '🌐',
  popular: false, // По умолчанию все языки не популярные
});

/**
 * Хук для фильтрации и группировки языков
 * @param initialSearchTerm Начальный поисковый запрос
 * @param videoId ID видео для обновления языка (опционально)
 * @returns Объект с методами и данными для работы с языками
 */
export const useLanguages = (
  initialSearchTerm: string = '',
  videoId?: number
): UseLanguagesResult & {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoading: boolean;
  error: string | null;
  selectedDbLanguage: DbLanguage | null;
  setSelectedLanguage: (languageCode: string) => void;
  updateVideoLanguage: () => Promise<boolean>;
} => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [languages, setLanguages] = useState<LangType[]>(AVAILABLE_LANGUAGES);
  const [dbLanguages, setDbLanguages] = useState<DbLanguage[]>([]);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<string>('');
  const [selectedDbLanguage, setSelectedDbLanguage] = useState<DbLanguage | null>(null);

  // Загружаем список языков из API
  useEffect(() => {
    const fetchLanguages = async () => {
      setIsLoading(true);
      setError(null);

      try {
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
          
          // Отмечаем популярные языки (английский, русский, испанский, китайский)
          const popularCodes = ['en', 'ru', 'es', 'zh'];
          appLanguages.forEach(lang => {
            if (popularCodes.includes(lang.code)) {
              lang.popular = true;
            }
          });
          
          setLanguages(appLanguages);
          // Сохраняем только уникальные языки в dbLanguages
          setDbLanguages(Array.from(uniqueLanguages.values()));
        } else {
          // Если API не вернул данные, используем заглушку
          setLanguages(AVAILABLE_LANGUAGES);
          
          if (response.error) {
            console.warn('Используем заглушку для языков из-за ошибки API:', response.error);
            setError('Не удалось загрузить актуальный список языков');
          }
        }
      } catch (err) {
        console.error('Ошибка при загрузке языков:', err);
        setError('Не удалось загрузить список языков');
        setLanguages(AVAILABLE_LANGUAGES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  // Следим за изменением выбранного языка и обновляем связанный объект из БД
  useEffect(() => {
    if (selectedLanguageCode && dbLanguages.length > 0) {
      const dbLang = dbLanguages.find(lang => lang.iso_code === selectedLanguageCode) || null;
      setSelectedDbLanguage(dbLang);
    } else {
      setSelectedDbLanguage(null);
    }
  }, [selectedLanguageCode, dbLanguages]);

  // Функция для обновления языка видео на сервере
  const updateVideoLanguage = async (): Promise<boolean> => {
    console.log("Вызов updateVideoLanguage с:", { videoId, selectedLanguageCode, selectedDbLanguage });
    
    if (!videoId) {
      setError('Отсутствует ID видео');
      console.error("Ошибка updateVideoLanguage: отсутствует ID видео");
      return false;
    }
    
    if (!selectedDbLanguage) {
      // Если нет объекта языка, но есть код, пробуем найти его в списке
      if (selectedLanguageCode && dbLanguages.length > 0) {
        const dbLang = dbLanguages.find(lang => lang.iso_code === selectedLanguageCode);
        if (dbLang) {
          console.log("Найден язык в dbLanguages для кода:", selectedLanguageCode, dbLang);
          setSelectedDbLanguage(dbLang);
          
          // Используем найденный язык
          try {
            const result = await LanguagesService.updateVideoLanguage(videoId, dbLang);
            if (result.success) {
              console.log('Язык видео успешно обновлен (запасной вариант):', result);
              return true;
            }
          } catch (err) {
            console.error("Ошибка запасного варианта:", err);
          }
        }
      }
      
      setError('Не выбран язык для перевода');
      console.error("Ошибка updateVideoLanguage: отсутствует объект языка, код:", selectedLanguageCode);
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await LanguagesService.updateVideoLanguage(videoId, selectedDbLanguage);
      
      if (result.success) {
        console.log('Язык видео успешно обновлен:', result);
        return true;
      } else {
        console.error('Ошибка при обновлении языка видео:', result.error);
        setError(result.message || 'Не удалось обновить язык видео');
        return false;
      }
    } catch (err) {
      console.error('Ошибка при обновлении языка видео:', err);
      setError('Произошла ошибка при обновлении языка видео');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Вычисляемые данные для фильтрации и группировки языков
  const result = useMemo(() => {
    // Фильтруем языки по поисковому запросу
    const filteredLanguages = languages.filter(
      lang => lang.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Разделяем на популярные и остальные
    const popularLanguages = filteredLanguages.filter(lang => lang.popular);
    const otherLanguages = filteredLanguages.filter(lang => !lang.popular);

    return {
      allLanguages: languages,
      filteredLanguages,
      popularLanguages,
      otherLanguages
    };
  }, [searchTerm, languages]);

  return {
    ...result,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    selectedDbLanguage,
    setSelectedLanguage: setSelectedLanguageCode,
    updateVideoLanguage
  };
};

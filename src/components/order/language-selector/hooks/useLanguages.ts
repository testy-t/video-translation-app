
import { useState, useMemo } from 'react';
import { UseLanguagesResult } from '../types';
import { AVAILABLE_LANGUAGES } from '../languages-data';

/**
 * Хук для фильтрации и группировки языков
 * @param initialSearchTerm Начальный поисковый запрос
 * @returns Объект с методами и данными для работы с языками
 */
export const useLanguages = (initialSearchTerm: string = ''): UseLanguagesResult & {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
} => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  // Вычисляемые данные для фильтрации и группировки языков
  const result = useMemo(() => {
    // Фильтруем языки по поисковому запросу
    const filteredLanguages = AVAILABLE_LANGUAGES.filter(
      lang => lang.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Разделяем на популярные и остальные
    const popularLanguages = filteredLanguages.filter(lang => lang.popular);
    const otherLanguages = filteredLanguages.filter(lang => !lang.popular);

    return {
      allLanguages: AVAILABLE_LANGUAGES,
      filteredLanguages,
      popularLanguages,
      otherLanguages
    };
  }, [searchTerm]);

  return {
    ...result,
    searchTerm,
    setSearchTerm
  };
};


/**
 * Типы данных для компонентов выбора языка
 */

/**
 * Структура данных языка
 */
export interface Language {
  /** Код языка (например, 'en', 'ru') */
  code: string;
  /** Название языка */
  name: string;
  /** Эмодзи флага страны */
  flag: string;
  /** Флаг популярности языка */
  popular: boolean;
}

/**
 * Свойства компонента выбора языка
 */
export interface LanguageSelectorProps {
  /** Выбранный язык (код) */
  selectedLanguage: string;
  /** Функция для установки выбранного языка */
  setSelectedLanguage: (language: string) => void;
}

/**
 * Результат хука фильтрации языков
 */
export interface UseLanguagesResult {
  /** Все языки */
  allLanguages: Language[];
  /** Отфильтрованные языки */
  filteredLanguages: Language[];
  /** Популярные языки */
  popularLanguages: Language[];
  /** Обычные языки */
  otherLanguages: Language[];
}

/**
 * Свойства компонента опции языка
 */
export interface LanguageOptionProps {
  /** Данные языка */
  language: Language;
  /** Выбран ли язык */
  isSelected: boolean;
  /** Обработчик выбора языка */
  onSelect: () => void;
}

/**
 * Свойства компонента поиска языка
 */
export interface LanguageSearchProps {
  /** Текущий поисковый запрос */
  searchTerm: string;
  /** Функция для установки поискового запроса */
  setSearchTerm: (term: string) => void;
}

/**
 * Свойства списка языков
 */
export interface LanguageListProps extends LanguageSelectorProps {
  /** Популярные языки */
  popularLanguages: Language[];
  /** Обычные языки */
  otherLanguages: Language[];
  /** Отфильтрованные языки */
  filteredLanguages: Language[];
  /** Поисковый запрос */
  searchTerm: string;
}

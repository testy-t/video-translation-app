
import { Language } from './types';

/**
 * Данные о доступных языках перевода
 */
export const AVAILABLE_LANGUAGES: Language[] = [
  { code: "en", name: "Английский", flag: "🇬🇧", popular: true },
  { code: "es", name: "Испанский", flag: "🇪🇸", popular: true },
  { code: "fr", name: "Французский", flag: "🇫🇷", popular: true },
  { code: "de", name: "Немецкий", flag: "🇩🇪", popular: true },
  { code: "it", name: "Итальянский", flag: "🇮🇹", popular: true },
  { code: "pt", name: "Португальский", flag: "🇵🇹", popular: true },
  { code: "ru", name: "Русский", flag: "🇷🇺", popular: true },
  { code: "zh", name: "Китайский", flag: "🇨🇳", popular: true },
  { code: "ja", name: "Японский", flag: "🇯🇵", popular: true },
  { code: "ko", name: "Корейский", flag: "🇰🇷", popular: true },
  { code: "ar", name: "Арабский", flag: "🇸🇦", popular: false },
  { code: "hi", name: "Хинди", flag: "🇮🇳", popular: false },
  { code: "bn", name: "Бенгальский", flag: "🇧🇩", popular: false },
  { code: "id", name: "Индонезийский", flag: "🇮🇩", popular: false },
  { code: "tr", name: "Турецкий", flag: "🇹🇷", popular: false },
  { code: "nl", name: "Голландский", flag: "🇳🇱", popular: false },
  { code: "pl", name: "Польский", flag: "🇵🇱", popular: false },
  { code: "sv", name: "Шведский", flag: "🇸🇪", popular: false },
  { code: "da", name: "Датский", flag: "🇩🇰", popular: false },
];

/**
 * Функция для получения данных о языке по его коду
 * @param code Код языка
 * @returns Данные о языке или undefined если язык не найден
 */
export const getLanguageByCode = (code: string): Language | undefined => {
  return AVAILABLE_LANGUAGES.find(lang => lang.code === code);
};

/**
 * Функция для получения имени языка по его коду
 * @param code Код языка
 * @returns Имя языка или "Неизвестный язык" если язык не найден
 */
export const getLanguageName = (code: string): string => {
  return getLanguageByCode(code)?.name || "Неизвестный язык";
};

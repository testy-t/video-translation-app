import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import LanguageItem from "./LanguageItem";
import Icon from "@/components/ui/icon";

interface Language {
  code: string;
  name: string;
  flag?: string;
}

interface LanguageListProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  popularLanguages?: Language[];
  otherLanguages?: Language[];
  searchResults?: Language[];
  searchTerm?: string;
}

/**
 * Компонент для отображения списка языков
 */
const LanguageList: React.FC<LanguageListProps> = ({
  selectedLanguage,
  setSelectedLanguage,
  popularLanguages = [], // Значение по умолчанию - пустой массив
  otherLanguages = [], // Значение по умолчанию - пустой массив
  searchResults = [], // Значение по умолчанию - пустой массив
  searchTerm = "",
}) => {
  // Проверяем, пустые ли все списки языков
  const noLanguagesAvailable =
    (!popularLanguages || popularLanguages.length === 0) &&
    (!otherLanguages || otherLanguages.length === 0) &&
    (!searchTerm || !searchResults || searchResults.length === 0);

  // Если идет поиск, но ничего не найдено
  const noSearchResults =
    searchTerm && (!searchResults || searchResults.length === 0);

  return (
    <div className="mb-6">
      <ScrollArea className="h-[300px] border rounded-md">
        {noLanguagesAvailable ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500">
            <Icon name="Languages" size={32} className="mb-2 opacity-50" />
            <p>Список языков пуст или загружается</p>
          </div>
        ) : (
          <div className="p-4">
            {/* Секция популярных языков (показывается только когда нет поискового запроса) */}
            {popularLanguages && popularLanguages.length > 0 && !searchTerm && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Популярные языки</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {popularLanguages.map((language) => (
                    <LanguageItem
                      key={language.code}
                      language={language}
                      isSelected={selectedLanguage === language.code}
                      onSelect={() => setSelectedLanguage(language.code)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Результаты поиска или другие языки */}
            {searchTerm ? (
              <div>
                <h3 className="text-sm font-medium mb-3">Результаты поиска</h3>
                {noSearchResults ? (
                  <div className="flex flex-col items-center justify-center p-6 text-gray-500">
                    <Icon name="Search" size={24} className="mb-2 opacity-50" />
                    <p>Ничего не найдено</p>
                    <p className="text-sm">Попробуйте изменить запрос</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {searchResults.map((language) => (
                      <LanguageItem
                        key={language.code}
                        language={language}
                        isSelected={selectedLanguage === language.code}
                        onSelect={() => setSelectedLanguage(language.code)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              otherLanguages &&
              otherLanguages.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Все языки</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {otherLanguages.map((language) => (
                      <LanguageItem
                        key={language.code}
                        language={language}
                        isSelected={selectedLanguage === language.code}
                        onSelect={() => setSelectedLanguage(language.code)}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default LanguageList;

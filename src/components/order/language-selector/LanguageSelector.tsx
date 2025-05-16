
import React from 'react';
import { LanguageSelectorProps } from './types';
import { useLanguages } from './hooks';
import { 
  LanguageSearchInput, 
  LanguageList 
} from './components';

/**
 * Компонент выбора языка для перевода
 */
const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  selectedLanguage, 
  setSelectedLanguage 
}) => {
  // Используем хук для обработки языков и поиска
  const { 
    searchTerm, 
    setSearchTerm, 
    popularLanguages, 
    otherLanguages, 
    filteredLanguages 
  } = useLanguages();

  return (
    <div>
      <h3 className="text-xl font-medium mb-2">Выберите язык перевода</h3>
      <p className="text-muted-foreground mb-4">
        Выберите язык, на который хотите перевести ваше видео. Доступно 175 языков.
      </p>
      
      <LanguageSearchInput 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />
      
      <LanguageList
        popularLanguages={popularLanguages}
        otherLanguages={otherLanguages}
        filteredLanguages={filteredLanguages}
        searchTerm={searchTerm}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
    </div>
  );
};

export default LanguageSelector;

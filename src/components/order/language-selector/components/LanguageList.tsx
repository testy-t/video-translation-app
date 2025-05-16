
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import LanguageOption from './LanguageOption';
import { LanguageListProps } from '../types';

/**
 * Компонент для отображения списка языков
 */
const LanguageList: React.FC<LanguageListProps> = ({ 
  popularLanguages, 
  otherLanguages, 
  filteredLanguages, 
  searchTerm, 
  selectedLanguage, 
  setSelectedLanguage 
}) => (
  <ScrollArea className="h-[300px] border rounded-md">
    {/* Секция популярных языков (показывается только когда нет поискового запроса) */}
    {popularLanguages.length > 0 && !searchTerm && (
      <div className="p-4 border-b">
        <h4 className="text-sm font-medium mb-3">Популярные языки</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {popularLanguages.map(lang => (
            <LanguageOption
              key={lang.code}
              language={lang}
              isSelected={selectedLanguage === lang.code}
              onSelect={() => setSelectedLanguage(lang.code)}
            />
          ))}
        </div>
      </div>
    )}
    
    {/* Секция всех или отфильтрованных языков */}
    <div className="p-4">
      {searchTerm ? (
        <h4 className="text-sm font-medium mb-3">Результаты поиска</h4>
      ) : (
        <h4 className="text-sm font-medium mb-3">Все языки</h4>
      )}
      
      {filteredLanguages.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          Языки не найдены
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(searchTerm ? filteredLanguages : otherLanguages).map(lang => (
            <LanguageOption
              key={lang.code}
              language={lang}
              isSelected={selectedLanguage === lang.code}
              onSelect={() => setSelectedLanguage(lang.code)}
            />
          ))}
        </div>
      )}
    </div>
  </ScrollArea>
);

export default LanguageList;

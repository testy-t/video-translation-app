
import React from 'react';
import Icon from "@/components/ui/icon";
import { LanguageOptionProps } from '../types';

/**
 * Компонент для отображения опции выбора языка
 */
const LanguageOption: React.FC<LanguageOptionProps> = ({ 
  language, 
  isSelected, 
  onSelect 
}) => (
  <button
    className={`
      flex items-center p-2 rounded-md hover:bg-muted text-left transition-colors
      ${isSelected ? 'bg-primary/10 text-primary' : ''}
    `}
    onClick={onSelect}
    aria-selected={isSelected}
  >
    <span className="mr-2 text-lg" aria-hidden="true">{language.flag}</span>
    <span>{language.name}</span>
    {isSelected && (
      <Icon name="Check" className="ml-auto text-primary" size={16} />
    )}
  </button>
);

export default LanguageOption;

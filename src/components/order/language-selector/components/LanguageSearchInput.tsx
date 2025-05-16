
import React from 'react';
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { LanguageSearchProps } from '../types';

/**
 * Компонент поиска языка
 */
const LanguageSearchInput: React.FC<LanguageSearchProps> = ({ 
  searchTerm, 
  setSearchTerm 
}) => (
  <div className="relative mb-4">
    <Icon
      name="Search"
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
      size={16}
    />
    <Input
      placeholder="Поиск языка..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-9"
      aria-label="Поиск языка"
    />
  </div>
);

export default LanguageSearchInput;

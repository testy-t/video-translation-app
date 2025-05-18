
import React from "react";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isDisabled?: boolean;
}

/**
 * Компонент для поиска языков
 */
const SearchInput: React.FC<SearchInputProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  isDisabled = false 
}) => {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Поиск языка..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10"
        disabled={isDisabled}
      />
      <Icon
        name="Search"
        size={18}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      />
    </div>
  );
};

export default SearchInput;

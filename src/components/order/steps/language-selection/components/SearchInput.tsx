import React from "react";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  placeholder?: string;
  helperText?: string;
}

/**
 * Компонент поиска языков
 */
const SearchInput: React.FC<SearchInputProps> = ({
  searchTerm,
  setSearchTerm,
  placeholder = "Поиск языка...",
  helperText,
}) => {
  return (
    <div className="mb-5">
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon name="Search" size={16} className="text-gray-400" />
        </div>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <Icon
              name="X"
              size={16}
              className="text-gray-400 hover:text-gray-600"
            />
          </button>
        )}
      </div>
      {helperText && (
        <p className="text-xs text-gray-500 mt-1.5 ml-1">{helperText}</p>
      )}
    </div>
  );
};

export default SearchInput;

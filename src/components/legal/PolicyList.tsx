
import React from "react";

interface PolicyListProps {
  items: string[];
  className?: string;
}

/**
 * Компонент для отображения списка в документе политики
 */
const PolicyList: React.FC<PolicyListProps> = ({ items, className = "mb-4" }) => {
  return (
    <ul className={`list-disc pl-8 ${className}`}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};

export default PolicyList;

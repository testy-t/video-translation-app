
import React from "react";

interface PolicySubsectionProps {
  id?: string;
  title: string;
  children: React.ReactNode;
}

/**
 * Компонент для отображения подраздела политики
 */
const PolicySubsection: React.FC<PolicySubsectionProps> = ({ id, title, children }) => {
  return (
    <div id={id} className="mt-4 mb-2">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      {children}
    </div>
  );
};

export default PolicySubsection;

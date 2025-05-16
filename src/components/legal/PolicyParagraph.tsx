
import React from "react";

interface PolicyParagraphProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Компонент для отображения параграфа текста в документе политики
 */
const PolicyParagraph: React.FC<PolicyParagraphProps> = ({ 
  children, 
  className = "mb-4" 
}) => {
  return (
    <p className={className}>
      {children}
    </p>
  );
};

export default PolicyParagraph;

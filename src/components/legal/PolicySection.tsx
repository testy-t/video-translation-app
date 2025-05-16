
import React from "react";

interface PolicySectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Компонент для отображения раздела политики
 */
const PolicySection: React.FC<PolicySectionProps> = ({ 
  id, 
  title, 
  children, 
  className = "mb-8" 
}) => {
  return (
    <section id={id} className={className}>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </section>
  );
};

export default PolicySection;

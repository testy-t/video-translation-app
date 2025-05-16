
import React from "react";

interface EmailLinkProps {
  email: string;
  className?: string;
}

/**
 * Компонент для отображения ссылки на email
 */
const EmailLink: React.FC<EmailLinkProps> = ({ 
  email,
  className = "text-blue-600 hover:text-blue-800" 
}) => {
  return (
    <a href={`mailto:${email}`} className={className}>
      {email}
    </a>
  );
};

export default EmailLink;

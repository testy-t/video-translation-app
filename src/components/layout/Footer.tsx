
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 py-8 px-4 border-t">
      <div className="max-w-7xl mx-auto text-center text-gray-500">
        <p>© {currentYear} ГолосОК. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;

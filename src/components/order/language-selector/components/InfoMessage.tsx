
import React from 'react';
import Icon from "@/components/ui/icon";

/**
 * Информационное сообщение о демо-версии перевода
 */
const InfoMessage: React.FC = () => (
  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
    <div className="flex items-start">
      <Icon name="Info" size={20} className="mr-2 mt-0.5 text-blue-600" />
      <div>
        <p className="font-medium">Доступна 5-секундная демонстрация</p>
        <p className="text-sm mt-1">
          После выбора языка вы можете просмотреть 5-секундную демонстрацию перевода. 
          После оплаты вы получите полное видео.
        </p>
      </div>
    </div>
  </div>
);

export default InfoMessage;

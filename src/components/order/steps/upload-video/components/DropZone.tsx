import React from "react";
import Icon from "@/components/ui/icon";

// Интерфейс для пропсов DropZone
interface DropZoneProps {
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
}

/**
 * Компонент для отображения области, куда можно перетащить файл
 */
const DropZone: React.FC<DropZoneProps> = ({ 
  isDragging, 
  handleDragOver, 
  handleDragLeave, 
  handleDrop, 
  onClick 
}) => {
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all
        ${isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/70"}`}
      onClick={onClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center">
        <Icon name="Upload" size={48} className="text-gray-400 mb-4" />
        <p className="text-lg font-medium mb-2">
          Перетащите видео или нажмите для выбора
        </p>
        <p className="text-gray-500 text-sm">
          Поддерживаются форматы: MP4, AVI, MOV, MKV (до 2GB)
        </p>
      </div>
    </div>
  );
};

export default DropZone;
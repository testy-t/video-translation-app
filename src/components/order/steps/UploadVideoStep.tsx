
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface UploadVideoStepProps {
  videoFile: File | null;
  setVideoFile: (file: File | null) => void;
}

const UploadVideoStep: React.FC<UploadVideoStepProps> = ({ 
  videoFile, 
  setVideoFile 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateUpload(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUpload(e.dataTransfer.files[0]);
    }
  };

  // Симуляция загрузки файла
  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Проверяем, что это видеофайл
    if (!file.type.startsWith('video/')) {
      alert('Пожалуйста, загрузите видеофайл');
      setIsUploading(false);
      return;
    }
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setVideoFile(file);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-medium mb-2">Загрузите ваше видео</h3>
      <p className="text-muted-foreground mb-6 text-center">
        Загрузите видео, которое хотите перевести на другой язык. Поддерживаются форматы MP4, MOV, AVI и WebM.
      </p>
      
      {!videoFile ? (
        <>
          <div 
            className={`
              w-full p-10 border-2 border-dashed rounded-lg 
              flex flex-col items-center justify-center
              transition-colors duration-200 cursor-pointer
              ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <Icon 
              name="Upload" 
              size={48} 
              className={`mb-4 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} 
            />
            <p className="text-center mb-2">
              Перетащите видеофайл сюда или
            </p>
            <Button 
              variant="secondary" 
              onClick={(e) => {
                e.stopPropagation();
                triggerFileInput();
              }}
            >
              Выберите файл
            </Button>
            <Input 
              ref={fileInputRef}
              type="file" 
              accept="video/*" 
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
          
          <div className="mt-6 w-full">
            <p className="text-sm text-muted-foreground mb-2">Требования к файлу:</p>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>Максимальный размер: 2 ГБ</li>
              <li>Форматы: MP4, MOV, AVI, WebM</li>
              <li>Максимальная длительность: 30 минут</li>
            </ul>
          </div>
        </>
      ) : (
        <div className="w-full">
          <div className="p-4 border rounded-lg mb-4 flex items-center">
            <div className="mr-4 bg-primary/10 p-3 rounded-md">
              <Icon name="Video" size={24} className="text-primary" />
            </div>
            <div className="flex-grow">
              <p className="font-medium truncate">{videoFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(videoFile.size / (1024 * 1024)).toFixed(2)} МБ
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setVideoFile(null)}
            >
              <Icon name="Trash2" size={18} />
            </Button>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 flex items-center">
            <Icon name="CheckCircle" size={20} className="mr-2 text-green-600" />
            Видео успешно загружено. Теперь вы можете перейти к следующему шагу.
          </div>
        </div>
      )}
      
      {isUploading && (
        <div className="mt-6 w-full">
          <div className="flex justify-between mb-2 text-sm">
            <span>Загрузка...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full h-2" />
        </div>
      )}
    </div>
  );
};

export default UploadVideoStep;

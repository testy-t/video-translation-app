/// <reference types="vite/client" />

interface Window {
  jivo_api?: {
    open: () => void;
  };
  
  // Яндекс.Метрика
  ym?: (counterId: number, action: string, goalName: string, params?: any) => void;
}

/**
 * Пропсы для основного компонента UploadVideoStep
 */
export interface UploadVideoStepProps {
  /**
   * Текущий выбранный видео-файл
   */
  videoFile: File | null;
  
  /**
   * Функция для установки выбранного видео-файла
   */
  setVideoFile: (file: File | null) => void;
  
  /**
   * ID транзакции (если доступен)
   */
  transactionId?: string | null;
  
  /**
   * Колбэк, вызываемый при успешной загрузке видео
   */
  onUploadSuccess?: (videoId: number, fileKey: string) => void;
}
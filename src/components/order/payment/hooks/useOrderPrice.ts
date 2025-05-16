
/**
 * Хук для расчёта стоимости заказа на основе видеофайла
 * @param videoFile - Файл видео для анализа
 * @returns Расчитанная стоимость
 */
export const useOrderPrice = (videoFile: File | null): number => {
  // Базовая стоимость перевода минуты видео
  const BASE_PRICE = 299;
  
  // Стоимость за 1 МБ размера файла
  const PRICE_PER_MB = 1;
  
  // Рассчитываем стоимость на основе размера файла
  const calculatePrice = (): number => {
    if (!videoFile) return 0;
    
    // Плюс дополнительная стоимость за размер файла
    const fileSizeInMB = videoFile.size / (1024 * 1024);
    const sizePrice = Math.ceil(fileSizeInMB * PRICE_PER_MB);
    
    return BASE_PRICE + sizePrice;
  };

  return calculatePrice();
};


/**
 * Хук для расчёта стоимости заказа на основе видеофайла и его длительности
 * @param videoFile - Файл видео для анализа
 * @param videoDuration - Длительность видео в секундах
 * @returns Расчитанная стоимость
 */
export const useOrderPrice = (videoFile: File | null, videoDuration: number): number => {
  // Стоимость перевода за минуту видео
  const PRICE_PER_MINUTE = 59;
  
  // Рассчитываем стоимость на основе длительности видео
  const calculatePrice = (): number => {
    if (!videoFile) return 0;
    
    // Округляем в большую сторону до минут
    const minutes = Math.ceil(videoDuration / 60);
    
    // 149 рублей за минуту
    return PRICE_PER_MINUTE * minutes;
  };

  return calculatePrice();
};

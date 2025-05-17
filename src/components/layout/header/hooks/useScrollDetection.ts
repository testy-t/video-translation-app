
import { useState, useEffect } from "react";

/**
 * Хук для отслеживания скролла страницы
 * @param threshold Порог скролла в пикселях, после которого состояние меняется
 * @returns Булево значение, указывающее, прокручена ли страница за пороговое значение
 */
export function useScrollDetection(threshold: number = 10): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > threshold;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Добавляем обработчик события скролла
    window.addEventListener("scroll", handleScroll);

    // Вызываем обработчик при монтировании, чтобы установить начальное состояние
    handleScroll();

    // Убираем обработчик при размонтировании
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled, threshold]);

  return scrolled;
}


/**
 * Свойства компонента PaymentStep
 */
export interface PaymentStepProps {
  /** Загруженный видеофайл */
  videoFile: File | null;
  /** Код выбранного языка перевода */
  selectedLanguage: string;
  /** Длительность видео в секундах */
  videoDuration: number;
  /** Функция обратного вызова после успешного завершения оплаты */
  onPayment: () => void;
}

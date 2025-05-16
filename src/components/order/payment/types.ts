
/**
 * Свойства компонента PaymentStep
 */
export interface PaymentStepProps {
  /** Загруженный видеофайл */
  videoFile: File | null;
  /** Код выбранного языка перевода */
  selectedLanguage: string;
  /** Функция обратного вызова после успешного завершения оплаты */
  onPayment: () => void;
}

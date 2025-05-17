
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

/**
 * Данные платежной транзакции
 */
export interface PaymentTransaction {
  /** Уникальный код транзакции */
  uniquecode: string;
  /** Статус транзакции */
  status: 'pending' | 'processing' | 'paid' | 'failed';
  /** Сумма платежа */
  amount: number;
  /** ID видео */
  videoId: number;
  /** Email пользователя */
  userEmail: string;
  /** Время создания транзакции */
  createdAt: string;
}

/**
 * Параметры виджета CloudPayments
 */
export interface CloudPaymentsParams {
  /** Публичный ID магазина */
  publicId: string;
  /** Описание платежа */
  description: string;
  /** Сумма платежа */
  amount: number;
  /** Валюта платежа */
  currency: string;
  /** ID аккаунта */
  accountId: string;
  /** Email пользователя */
  email: string;
  /** Дополнительные данные */
  data: {
    /** Настройки CloudPayments */
    cloudPayments: {
      /** Флаг рекуррентного платежа */
      recurrent: boolean;
    };
    /** URL для перенаправления после успешной оплаты */
    successUrl?: string;
  };
}

/**
 * Информация о видео из API
 */
export interface VideoInfo {
  /** ID видео */
  id: number;
  /** URL исходного видео */
  input_url: string;
  /** URL переведенного видео */
  output_url: string;
  /** Статус обработки видео */
  status: string;
  /** ID задачи на перевод в HeyGen */
  heygen_job_id: string;
  /** Язык перевода */
  output_language: string;
}

/**
 * Информация о заказе для хранения в localStorage
 */
export interface OrderInfo {
  /** Уникальный код заказа */
  uniquecode: string;
  /** Дата создания заказа */
  date: Date | string;
  /** Email пользователя */
  email: string;
  /** Код языка перевода */
  language: string;
  /** Длительность видео в секундах */
  videoDuration: string;
  /** Номер заказа (опционально) */
  orderNumber?: string;
  /** Статус заказа (опционально) */
  status?: string;
  /** Флаг активации (опционально) */
  is_activated?: boolean;
  /** Информация о видео (опционально) */
  videoInfo?: VideoInfo | null;
}

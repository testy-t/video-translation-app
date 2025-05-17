import { toast } from "@/components/ui/use-toast";

/** Глобальная переменная для обещания загрузки скрипта */
let scriptLoadingPromiseCP: Promise<void> | null = null;

/** Интерфейс данных транзакции */
export interface TransactionData {
  uniquecode: string;
}

/** Интерфейс данных для инициации платежа */
export interface PaymentData {
  payment_data: {
    data: {
      publicId: string;
      description: string;
      amount: number;
      currency: string;
      accountId: string;
      email: string;
      data: {
        cloudPayments: {
          recurrent: boolean;
        };
        successUrl?: string;
      };
    };
  };
}

/**
 * Сервис для работы с платежами
 */
export class PaymentService {
  /**
   * Создает новую транзакцию
   * @param userEmail Email пользователя
   * @param productId ID продукта (всегда 1)
   * @param videoId ID загруженного видео
   * @returns Данные созданной транзакции
   */
  static async createTransaction(
    userEmail: string,
    productId: number,
    videoId: number
  ): Promise<TransactionData> {
    try {
      const response = await fetch(
        "https://tbgwudnxjwplqtkjihxc.supabase.co/functions/v1/create-transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_email: userEmail,
            product_id: productId,
            video_id: videoId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не удалось создать транзакцию");
      }

      return data;
    } catch (error) {
      console.error("Ошибка при создании транзакции:", error);
      throw error;
    }
  }

  /**
   * Инициирует процесс оплаты
   * @param uniquecode Уникальный код транзакции
   * @param redirectUrl URL для перенаправления после успешной оплаты
   * @returns Данные для инициации оплаты
   */
  static async initiatePayment(
    uniquecode: string,
    redirectUrl: string | null = null
  ): Promise<PaymentData> {
    try {
      const response = await fetch(
        "https://tbgwudnxjwplqtkjihxc.supabase.co/functions/v1/initiate-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uniquecode: uniquecode,
            redirect_url: redirectUrl,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не удалось инициировать платеж");
      }

      return data;
    } catch (error) {
      console.error("Ошибка при инициации платежа:", error);
      throw error;
    }
  }

  /**
   * Проверяет статус платежа и получает информацию о видео
   * @param uniquecode Уникальный код транзакции
   * @returns Информация о транзакции и видео
   */
  static async checkPaymentStatus(uniquecode: string): Promise<{
    is_paid: boolean;
    is_activated: boolean;
    status: string;
    video?: {
      id: number;
      input_url: string;
      output_url: string;
      status: string;
      heygen_job_id: string;
      output_language: string;
    }
  }> {
    try {
      const response = await fetch(
        `https://tbgwudnxjwplqtkjihxc.supabase.co/functions/v1/transaction-info?uniquecode=${uniquecode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не удалось получить информацию о платеже");
      }

      // Сохраняем информацию о видео в localStorage, если она доступна
      if (data.video) {
        try {
          localStorage.setItem(`video_info_${uniquecode}`, JSON.stringify(data.video));
        } catch (e) {
          console.error("Ошибка при сохранении информации о видео:", e);
        }
      }

      return {
        is_paid: data.is_paid || false,
        is_activated: data.is_activated || false,
        status: data.status || "pending",
        video: data.video
      };
    } catch (error) {
      console.error("Ошибка при проверке статуса платежа:", error);
      throw error;
    }
  }
  
  /**
   * Запускает поллинг статуса платежа
   * @param uniquecode Уникальный код транзакции
   * @param onPaid Колбэк при успешной оплате
   * @param interval Интервал проверки в миллисекундах (по умолчанию 3000 мс)
   * @param maxAttempts Максимальное количество попыток (по умолчанию 60 - 3 минуты)
   * @returns Идентификатор таймера (для возможной отмены)
   */
  static startPaymentStatusPolling(
    uniquecode: string,
    onPaid: (uniquecode: string) => void,
    interval = 3000,
    maxAttempts = 60
  ): number {
    let attempts = 0;
    
    // Храним ID таймера для возможности остановки
    const timerId = window.setInterval(async () => {
      attempts++;
      
      try {
        console.log(`🔄 Проверка статуса платежа (попытка ${attempts}/${maxAttempts})...`);
        const { is_paid, is_activated, status, video } = await this.checkPaymentStatus(uniquecode);
        
        console.log(`📊 Статус платежа: is_paid=${is_paid}, is_activated=${is_activated}, status=${status}`);
        if (video) {
          console.log(`📊 Информация о видео: id=${video.id}, status=${video.status}, output_url=${video.output_url}`);
        }
        
        // Если платеж подтвержден, останавливаем поллинг и вызываем колбэк
        if (is_paid) {
          console.log("✅ Платеж подтвержден API");
          window.clearInterval(timerId);
          
          // Вызываем колбэк
          onPaid(uniquecode);
          
          // Если мы на экране оплаты, сразу перенаправляем на экран результата
          console.log(`🔄 Перенаправление с uniquecode=${uniquecode}`);
          
          // Важно: сначала сохраняем uniquecode в localStorage
          localStorage.setItem("paymentUniqueCode", uniquecode);
          localStorage.setItem("orderPaid", "true");
          
          // Сохраняем информацию о заказе
          const orderInfo = {
            uniquecode: uniquecode,
            date: new Date().toISOString(),
            email: localStorage.getItem('userEmail') || '',
            language: localStorage.getItem('selectedLanguage') || '',
            videoDuration: localStorage.getItem('videoDuration') || '',
            is_activated: is_activated || false,
            status: status,
            videoInfo: video || null
          };
          
          try {
            // Получаем существующие коды или создаем новый набор
            const existingUniqueCodesStr = localStorage.getItem('completedPaymentCodes') || '[]';
            let completedPaymentCodes = [];
            try {
              completedPaymentCodes = JSON.parse(existingUniqueCodesStr);
              if (!Array.isArray(completedPaymentCodes)) {
                completedPaymentCodes = [];
              }
            } catch (e) {
              completedPaymentCodes = [];
            }
            
            // Добавляем текущий код, если его еще нет в массиве
            if (!completedPaymentCodes.includes(uniquecode)) {
              completedPaymentCodes.push(uniquecode);
              localStorage.setItem('completedPaymentCodes', JSON.stringify(completedPaymentCodes));
            }
            
            // Сохраняем информацию о заказе
            localStorage.setItem(`order_${uniquecode}`, JSON.stringify(orderInfo));
          } catch (e) {
            console.error("Ошибка при сохранении данных заказа:", e);
          }
          
          // Убеждаемся, что uniquecode есть в URL при перенаправлении
          window.location.href = `${window.location.origin}/order?step=3&uniquecode=${encodeURIComponent(uniquecode)}`;
          return;
        }
        
        // Если достигли максимального количества попыток, останавливаем поллинг
        if (attempts >= maxAttempts) {
          console.log("⚠️ Достигнуто максимальное количество попыток проверки статуса");
          window.clearInterval(timerId);
        }
      } catch (error) {
        console.error("Ошибка при проверке статуса платежа:", error);
        
        // При ошибке продолжаем поллинг до максимального количества попыток
        if (attempts >= maxAttempts) {
          console.log("⚠️ Достигнуто максимальное количество попыток проверки статуса");
          window.clearInterval(timerId);
        }
      }
    }, interval);
    
    return timerId;
  }

  /**
   * Загружает скрипт CloudPayments один раз
   */
  static async loadCloudPaymentsScript(): Promise<void> {
    if (scriptLoadingPromiseCP) {
      return scriptLoadingPromiseCP;
    }

    scriptLoadingPromiseCP = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://widget.cloudpayments.ru/bundles/cloudpayments.js";
      script.async = true;

      script.onload = () => resolve();
      script.onerror = () => {
        console.error("Не удалось загрузить скрипт CloudPayments");
        reject(new Error("Не удалось загрузить скрипт CloudPayments"));
      };

      document.body.appendChild(script);
    });

    return scriptLoadingPromiseCP;
  }

  /**
   * Открывает виджет CloudPayments для оплаты
   * @param paymentData Данные для инициации оплаты
   * @param onSuccess Колбэк при успешной оплате
   * @param onFail Колбэк при неудачной оплате
   */
  static async openCloudPaymentsWidget(
    paymentData: PaymentData,
    onSuccess: () => void,
    onFail: (reason: string) => void
  ): Promise<void> {
    try {
      // Загружаем скрипт CloudPayments, если он еще не загружен
      await this.loadCloudPaymentsScript();

      // Проверяем, доступен ли объект CloudPayments
      if (!(window as any).cp || !(window as any).cp.CloudPayments) {
        throw new Error("CloudPayments SDK не загружен");
      }

      const widget = new (window as any).cp.CloudPayments();

      widget.pay(
        "charge", // или 'auth' для двухстадийных платежей
        paymentData.payment_data.data,
        {
          onSuccess: function (options: any) {
            // Платеж успешно завершен
            console.log("Оплата прошла успешно!", options);

            // Вызываем колбэк успеха
            onSuccess();

            // Перенаправляем на страницу успеха, если указан URL
            if (paymentData.payment_data.data.data.successUrl) {
              window.location.href = paymentData.payment_data.data.data.successUrl;
            }
          },
          onFail: function (reason: string, options: any) {
            // Платеж не прошел
            console.error("Ошибка оплаты:", reason);

            // Вызываем колбэк неудачи
            onFail(reason);
          },
          onComplete: function (paymentResult: any, options: any) {
            // Вызывается при завершении оплаты (независимо от результата)
            console.log("Оплата завершена, результат:", paymentResult);
          },
        }
      );
    } catch (error) {
      console.error("Ошибка при открытии виджета оплаты:", error);
      onFail(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }

  /**
   * Полный процесс оплаты
   * @param userEmail Email пользователя
   * @param videoId ID видео
   * @param redirectUrl URL для перенаправления после успешной оплаты
   * @param onSuccess Колбэк при успешной оплате через виджет
   * @param onFail Колбэк при неудачной оплате
   * @param onStatusChange Колбэк для обновления статуса процесса
   */
  static async processPayment(
    userEmail: string,
    videoId: number,
    redirectUrl: string | null,
    onSuccess: () => void,
    onFail: (error: string) => void,
    onStatusChange: (status: string) => void
  ): Promise<void> {
    try {
      // Шаг 1: Создание транзакции
      onStatusChange("Создание транзакции...");
      const transactionData = await this.createTransaction(userEmail, 1, videoId);
      
      // Сохраняем код транзакции в localStorage для использования в поллинге
      const uniquecode = transactionData.uniquecode;
      localStorage.setItem("paymentUniqueCode", uniquecode);

      // Шаг 2: Инициация платежа
      onStatusChange("Инициализация платежа...");
      const paymentData = await this.initiatePayment(
        uniquecode,
        redirectUrl
      );

      // Шаг 3: Отключаем индикатор загрузки перед открытием виджета
      onStatusChange("");
      
      // Шаг 4: Запускаем поллинг статуса платежа (сразу после создания транзакции)
      // Используем простой колбэк для поллинга, так как перенаправление 
      // происходит внутри функции startPaymentStatusPolling
      const pollingTimerId = this.startPaymentStatusPolling(
        uniquecode,
        () => {
          // Этот колбэк фактически не вызывается из-за перенаправления в поллере
          onSuccess();
        }
      );

      // Шаг 5: Открытие виджета CloudPayments
      await this.openCloudPaymentsWidget(
        paymentData,
        onSuccess, // Этот колбэк может быть вызван, если виджет корректно завершает работу
        onFail
      );
      
    } catch (error) {
      console.error("Ошибка в процессе оплаты:", error);
      onFail(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
}

export default PaymentService;
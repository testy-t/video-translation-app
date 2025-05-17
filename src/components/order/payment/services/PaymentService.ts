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
   * Проверяет статус платежа
   * @param uniquecode Уникальный код транзакции
   * @returns Статус оплаты (true если оплачено)
   */
  static async checkPaymentStatus(uniquecode: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://tbgwudnxjwplqtkjihxc.supabase.co/functions/v1/payment-status?uniquecode=${uniquecode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не удалось проверить статус платежа");
      }

      return data.isPaid;
    } catch (error) {
      console.error("Ошибка при проверке статуса платежа:", error);
      throw error;
    }
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
   * @param onSuccess Колбэк при успешной оплате
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

      // Шаг 2: Инициация платежа
      onStatusChange("Инициализация платежа...");
      const paymentData = await this.initiatePayment(
        transactionData.uniquecode,
        redirectUrl
      );

      // Шаг 3: Отключаем индикатор загрузки
      onStatusChange("");

      // Шаг 4: Открытие виджета CloudPayments
      await this.openCloudPaymentsWidget(
        paymentData,
        onSuccess,
        onFail
      );
      
      // Сохраняем код транзакции для возможной проверки статуса позже
      localStorage.setItem("paymentUniqueCode", transactionData.uniquecode);
      
    } catch (error) {
      console.error("Ошибка в процессе оплаты:", error);
      onFail(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
}

export default PaymentService;
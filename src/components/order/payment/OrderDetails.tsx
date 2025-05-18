import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useLanguageContext } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InfoBlockProps {
  icon: string;
  value: React.ReactNode;
  label: string;
  className?: string;
}

// Информационный блок для инфографики
const InfoBlock: React.FC<InfoBlockProps> = ({
  icon,
  value,
  label,
  className,
}) => (
  <div
    className={`flex flex-col items-center justify-center p-4 rounded-lg bg-muted/30 ${className}`}
  >
    {icon && <Icon name={icon} className="mb-2 mt-1 text-primary" size={24} />}
    <div className="text-xl font-bold">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

interface OrderDetailsProps {
  videoFile: File | null;
  selectedLanguage: string;
  videoDuration: number;
  isLoading?: boolean;
  price: number;
  isProcessing: boolean;
  processingStatus?: string;
  onPayment: (email: string) => void;
}

/**
 * Компонент для отображения деталей заказа
 * @param videoFile - Загруженный файл видео
 * @param selectedLanguage - Код выбранного языка для перевода
 * @param videoDuration - Длительность видео в секундах
 */
const OrderDetails: React.FC<OrderDetailsProps> = ({
  videoFile,
  selectedLanguage,
  videoDuration,
  isLoading = false,
  price,
  isProcessing,
  processingStatus = "",
  onPayment,
}) => {
  // Состояние для email
  const [email, setEmail] = useState<string>(
    () => localStorage.getItem("userEmail") || "",
  );
  const [emailError, setEmailError] = useState<string>("");
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Получаем функцию для получения имени языка из контекста
  const {
    getLanguageName,
    languages,
    isLoading: isLoadingLanguages,
  } = useLanguageContext();

  // Определение, является ли устройство мобильным на основе ширины экрана
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Проверяем при монтировании компонента
    checkIsMobile();

    // Добавляем слушатель для изменения размера окна
    window.addEventListener("resize", checkIsMobile);

    // Очищаем слушатель при размонтировании компонента
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  // Форматируем длительность видео в формат мм:сс
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Получаем информацию о выбранном языке (включая флаг)
  const getLanguageInfo = () => {
    if (!selectedLanguage || isLoading || isLoadingLanguages) {
      return { name: "Загрузка...", flag: "🌐" };
    }

    const name = getLanguageName(selectedLanguage);
    const langObj = languages.find(
      (l) =>
        l.code.toLowerCase() === selectedLanguage.toLowerCase() ||
        l.code.split("-")[0].toLowerCase() ===
          selectedLanguage.split("-")[0].toLowerCase(),
    );

    return {
      name,
      flag: langObj?.flag || "🌐",
    };
  };

  const languageInfo = getLanguageInfo();
  const roundedMinutes = Math.ceil(videoDuration / 60);
  const pricePerMinute = 149;
  const totalPrice = roundedMinutes * pricePerMinute;

  // Обработчик изменения email
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Проверяем формат при вводе
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail) && newEmail) {
      setEmailError("Введите корректный email");
    } else {
      setEmailError("");
    }
  };

  // Обработчик клика по кнопке оплаты
  const handlePayButtonClick = () => {
    // Проверяем валидность email перед оплатой
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Введите email для получения результата");
      return;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Введите корректный email");
      return;
    }

    // Если email валидный, сохраняем его в localStorage
    localStorage.setItem("userEmail", email);

    // И продолжаем оплату
    onPayment(email);
  };

  // Текст кнопки в зависимости от статуса
  const getButtonText = () => {
    if (isProcessing) {
      if (processingStatus) {
        return (
          <>
            <Icon name="Loader2" className="mr-2 animate-spin" />
            {processingStatus}
          </>
        );
      }
      return (
        <>
          <Icon name="Loader2" className="mr-2 animate-spin" />
          Обработка...
        </>
      );
    }
    return <>Оплатить {totalPrice} ₽</>;
  };

  // Загружаем сохраненный email при монтировании компонента
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  return (
    <Card className="mb-6 border-0 shadow-none">
      <CardContent className="p-6 px-0">
        <h4 className="text-2xl font-bold mb-6 text-center">Детали заказа</h4>

        {/* Время обработки */}
        <div className="flex items-center justify-center my-6 p-3 rounded-lg bg-primary/10">
          <Icon name="Rocket" className="mr-2 text-primary" />
          <span className="font-medium text-foreground/80">
            Время обработки: до 15 минут
          </span>
        </div>

        {/* Инфографика - для мобильных вертикальная, для десктопа горизонтальная */}
        {isMobile ? (
          /* Мобильная версия - стек блоков вертикально */
          <div className="flex flex-col gap-3 mb-6">
            {/* Блок длительности */}
            <div className="flex items-center p-4 rounded-lg bg-muted/30">
              <Icon name="Clock" className="text-primary mr-3" size={20} />
              <div>
                <div className="text-lg font-bold text-foreground/80">
                  {formatDuration(videoDuration)}
                </div>
                <div className="text-xs text-muted-foreground/90">
                  Длительность
                </div>
              </div>
            </div>

            {/* Блок языка перевода */}
            <div className="flex items-center p-4 rounded-lg bg-muted/30">
              {isLoading || isLoadingLanguages ? (
                <>
                  <Icon
                    name="Translate"
                    className="text-primary mr-3"
                    size={20}
                  />
                  <div>
                    <div className="text-lg font-bold flex items-center text-foreground/80">
                      <Icon
                        name="Loader2"
                        className="mr-2 w-4 h-4 animate-spin text-primary"
                      />
                      <span>Загрузка...</span>
                    </div>
                    <div className="text-xs text-muted-foreground/90">
                      Язык перевода
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-2xl mr-3">{languageInfo.flag}</div>
                  <div>
                    <div className="text-lg font-bold text-foreground/80">
                      {languageInfo.name}
                    </div>
                    <div className="text-xs text-muted-foreground/90">
                      Язык перевода
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Блок стоимости */}
            <div className="flex items-center p-4 rounded-lg bg-muted/30">
              <Icon name="Wallet" className="text-primary mr-3" size={20} />
              <div>
                <div className="text-lg font-bold text-foreground/80">{`${totalPrice} ₽`}</div>
                <div className="text-xs text-muted-foreground/90">{`${roundedMinutes} мин × ${pricePerMinute} ₽`}</div>
              </div>
            </div>
          </div>
        ) : (
          /* Десктопная версия - 3 колонки */
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Блок длительности */}
            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/30 h-[150px]">
              <Icon name="Clock" className="mb-2 mt-1 text-primary" size={24} />
              <div className="text-2xl font-bold text-foreground/80">
                {formatDuration(videoDuration)}
              </div>
              <div className="text-sm text-muted-foreground/90">
                Длительность
              </div>
            </div>

            {/* Блок языка перевода */}
            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/30 h-[150px]">
              {isLoading || isLoadingLanguages ? (
                <>
                  <Icon
                    name="Translate"
                    className="mb-2 text-primary"
                    size={24}
                  />
                  <div className="text-2xl font-bold flex items-center text-foreground/80">
                    <Icon
                      name="Loader2"
                      className="mr-2 w-5 h-5 animate-spin text-primary"
                    />
                    <span>Загрузка...</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-3xl mb-1">{languageInfo.flag}</div>
                  <div className="text-2xl font-bold mb-0 text-foreground/80">
                    Язык
                  </div>
                  <div className="text-sm text-muted-foreground/90 text-center">
                    {languageInfo.name}
                  </div>
                </>
              )}
            </div>

            {/* Блок стоимости */}
            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/30 h-[150px]">
              <Icon
                name="Wallet"
                className="mb-2 mt-1 text-primary"
                size={24}
              />
              <div className="text-2xl font-bold text-foreground/80">{`${totalPrice} ₽`}</div>
              <div className="text-sm text-muted-foreground/90">{`${roundedMinutes} мин × ${pricePerMinute} ₽`}</div>
            </div>
          </div>
        )}

        {/* Ввод почты */}
        <div className="mb-6">
          <div className="h-6 mb-2 flex items-center">
            <Label
              htmlFor="email"
              className={`text-sm font-normal ${emailError ? "text-red-500" : "text-muted-foreground"}`}
            >
              {emailError || "Укажите почту для получения результата"}{" "}
              <span className="text-primary">*</span>
            </Label>
          </div>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="example@mail.ru"
              value={email}
              onChange={handleEmailChange}
              className={`focus-visible:ring-0 focus-visible:ring-offset-0 border-2 
                ${emailError ? "border-red-500" : email && !emailError ? "border-green-500" : "border-primary/30"}`}
            />
          </div>
        </div>

        {/* Кнопка оплаты */}
        <Button
          className="w-full py-6 text-lg"
          onClick={handlePayButtonClick}
          disabled={isProcessing}
        >
          {getButtonText()}
        </Button>

        <div className="mt-4 text-xs text-center text-muted-foreground">
          Нажимая кнопку, вы соглашаетесь с нашей{" "}
          <a href="/offer" className="underline hover:text-primary">
            офертой
          </a>{" "}
          и{" "}
          <a href="/confidentiality" className="underline hover:text-primary">
            политикой конфиденциальности
          </a>
        </div>

        <div className="mt-4 flex items-center justify-center space-x-1 text-muted-foreground">
          <Icon name="Shield" size={16} />
          <span className="text-xs">Безопасная оплата через CloudPayments</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetails;

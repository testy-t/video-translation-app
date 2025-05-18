
// Глобальные типы для сторонних библиотек и внешних API

// Типы для JivoSite API
interface Window {
  jivo_api?: {
    open: () => void;
    close: () => void;
    hide: () => void;
    show: () => void;
    [key: string]: any;
  };
  jivo_config?: {
    widget_id: string;
    start_hidden?: boolean;
    always_online?: boolean;
    [key: string]: any;
  };
  openJivoChat?: () => void;
}

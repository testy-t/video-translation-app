/**
 * Утилита для работы с localStorage для сохранения состояния видео
 */
const VideoStorageUtils = {
  /**
   * Получить статус загрузки видео
   */
  getUploadStatus: (): boolean => {
    const flagUploaded = localStorage.getItem('isVideoUploaded') === 'true';
    const savedVideoId = localStorage.getItem('uploadedVideoId');
    const savedFileKey = localStorage.getItem('uploadedFileKey');
    
    return flagUploaded || !!(savedVideoId && savedFileKey);
  },
  
  /**
   * Установить статус загрузки видео
   */
  setUploadStatus: (status: boolean): void => {
    if (status) {
      localStorage.setItem('isVideoUploaded', 'true');
    } else {
      localStorage.removeItem('isVideoUploaded');
    }
  },
  
  /**
   * Сохранить информацию о загруженном видео
   */
  saveVideoInfo: (videoId: number, fileKey: string, transactionId?: string | null, fileName?: string): void => {
    localStorage.setItem('uploadedVideoId', videoId.toString());
    localStorage.setItem('uploadedFileKey', fileKey);
    
    if (transactionId) {
      localStorage.setItem('transactionId', transactionId);
    }
    
    if (fileName) {
      localStorage.setItem('uploadedFileName', fileName);
    }
    
    VideoStorageUtils.setUploadStatus(true);
  },
  
  /**
   * Очистить всю информацию о видео
   */
  clearVideoInfo: (): void => {
    localStorage.removeItem('isVideoUploaded');
    localStorage.removeItem('uploadedVideoId');
    localStorage.removeItem('uploadedFileKey');
    localStorage.removeItem('uploadedFileName');
  },
  
  /**
   * Получить сохраненную информацию о видео
   */
  getVideoInfo: () => {
    return {
      videoId: Number(localStorage.getItem('uploadedVideoId')),
      fileKey: localStorage.getItem('uploadedFileKey'),
      fileName: localStorage.getItem('uploadedFileName'),
      isUploaded: localStorage.getItem('isVideoUploaded') === 'true'
    };
  }
};

export default VideoStorageUtils;
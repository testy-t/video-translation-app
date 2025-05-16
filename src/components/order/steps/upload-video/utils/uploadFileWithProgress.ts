/**
 * Утилита для загрузки файла с отслеживанием прогресса
 * @param file - файл для загрузки
 * @param presignedUrl - URL для загрузки
 * @param onProgress - колбэк для обновления прогресса загрузки
 * @returns Promise, который разрешается после успешной загрузки
 */
const uploadFileWithProgress = async (
  file: File, 
  presignedUrl: string, 
  onProgress: (percent: number) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        console.log("📊 Upload progress:", percentComplete, "%");
        onProgress(Math.min(percentComplete, 95)); // Max at 95% until fully confirmed
      }
    });
    
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log("📊 Upload to storage completed successfully");
        resolve();
      } else {
        console.error("📊 Upload to storage failed:", xhr.status, xhr.statusText);
        reject(new Error(`Ошибка загрузки: ${xhr.status} ${xhr.statusText}`));
      }
    });
    
    xhr.addEventListener('error', () => {
      console.error("📊 Upload to storage failed with network error");
      reject(new Error('Ошибка сети при загрузке файла'));
    });
    
    xhr.addEventListener('abort', () => {
      console.warn("📊 Upload to storage aborted");
      reject(new Error('Загрузка файла отменена'));
    });
    
    xhr.open('PUT', presignedUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
};

export default uploadFileWithProgress;
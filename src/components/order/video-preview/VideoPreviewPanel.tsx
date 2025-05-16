
import React from 'react';
import { useVideoPreview } from '../language-selector/hooks';
import { VideoPreview, InfoMessage } from '../language-selector/components';
import { AVAILABLE_LANGUAGES } from '../language-selector/languages-data';

interface VideoPreviewPanelProps {
  /** Видеофайл для предпросмотра */
  videoFile: File | null;
  /** Код выбранного языка */
  selectedLanguage: string;
}

/**
 * Панель предпросмотра видео с переводом
 */
const VideoPreviewPanel: React.FC<VideoPreviewPanelProps> = ({ 
  videoFile, 
  selectedLanguage 
}) => {
  // Используем хук для управления предпросмотром
  const { videoPreviewUrl, isPlaying, togglePlayback } = useVideoPreview(videoFile);

  return (
    <div>
      <h3 className="text-xl font-medium mb-2">Превью</h3>
      <p className="text-muted-foreground mb-4">
        Нажмите на видео, чтобы посмотреть 5-секундное превью перевода.
      </p>
      
      <VideoPreview
        videoPreviewUrl={videoPreviewUrl}
        isPlaying={isPlaying}
        togglePlayback={togglePlayback}
        selectedLanguage={selectedLanguage}
        allLanguages={AVAILABLE_LANGUAGES}
      />
      
      <InfoMessage />
    </div>
  );
};

export default VideoPreviewPanel;

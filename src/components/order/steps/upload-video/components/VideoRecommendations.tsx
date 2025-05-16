import React from "react";
import Icon from "@/components/ui/icon";

/**
 * Компонент для отображения рекомендаций по видео
 */
const VideoRecommendations: React.FC = () => (
  <div className="mt-6">
    <h3 className="font-medium mb-3">Рекомендации:</h3>
    <ul className="space-y-2 text-gray-600">
      <li className="flex items-start">
        <Icon name="Check" className="text-green-500 mt-1 mr-2 flex-shrink-0" size={16} />
        <span>Используйте видео хорошего качества для лучших результатов</span>
      </li>
      <li className="flex items-start">
        <Icon name="Check" className="text-green-500 mt-1 mr-2 flex-shrink-0" size={16} />
        <span>Убедитесь, что речь говорящего четко слышна</span>
      </li>
      <li className="flex items-start">
        <Icon name="Check" className="text-green-500 mt-1 mr-2 flex-shrink-0" size={16} />
        <span>Оптимальная длительность видео — до 30 минут</span>
      </li>
    </ul>
  </div>
);

export default VideoRecommendations;
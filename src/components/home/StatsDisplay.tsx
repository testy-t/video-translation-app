
import React from 'react';

interface Stat {
  value: string;
  label: string;
}

interface StatsDisplayProps {
  stats: Stat[];
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
  return (
    <div className="flex items-center justify-center gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <p className="text-5xl font-bold text-[#7c4dff]">{stat.value}</p>
          <p className="text-sm text-gray-600">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsDisplay;

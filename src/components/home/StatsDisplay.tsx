
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
    <div className="flex items-center justify-center gap-10">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <p className="text-5xl font-medium text-[#0070F3]">{stat.value}</p>
          <p className="text-sm text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsDisplay;


import React from 'react';

interface FeatureBoxProps {
  children: React.ReactNode;
}

const FeatureBox: React.FC<FeatureBoxProps> = ({ children }) => {
  return (
    <div className="glass rounded-2xl p-6 shadow-lg">
      <div className="text-gray-700">
        {children}
      </div>
    </div>
  );
};

export default FeatureBox;


import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface FeatureBoxProps {
  children: React.ReactNode;
}

const FeatureBox: React.FC<FeatureBoxProps> = ({ children }) => {
  return (
    <Card className="shadow-md border-l-4 border-l-[#7c4dff] bg-white/70 backdrop-blur-sm">
      <CardContent className="p-5">
        <p className="text-gray-700">{children}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureBox;

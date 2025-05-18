
import React from "react";
import { Star } from "lucide-react";

interface TestimonialsCounterProps {
  count?: string;
  avatars?: string[];
  stars?: number;
}

const TestimonialsCounter: React.FC<TestimonialsCounterProps> = ({
  count = "10,000+",
  avatars = [
    "https://cdn.poehali.dev/intertnal/img/testimonials/1.webp",
    "https://cdn.poehali.dev/intertnal/img/testimonials/2.webp",
    "https://cdn.poehali.dev/intertnal/img/testimonials/3.webp",
    "https://cdn.poehali.dev/intertnal/img/testimonials/4.webp", 
    "https://cdn.poehali.dev/intertnal/img/testimonials/5.webp",
  ],
  stars = 5,
}) => {
  return (
    <div className="w-full max-w-md flex flex-col items-center justify-center p-4 my-4 bg-primary/10 rounded-lg backdrop-blur-sm border border-primary/20 shadow-sm">
      <h3 className="text-base font-semibold text-foreground text-center mb-3">
        <span className="font-bold text-primary">{count}</span> человек создают с
        <span className="text-primary font-bold"> Поехали!</span>
      </h3>

      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center">
          {avatars.map((avatar, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full border-2 border-white relative shadow-sm"
              style={{ marginRight: "-8px", zIndex: avatars.length - index }}
            >
              <img
                src={avatar}
                alt={`Пользователь ${index + 1}`}
                className="w-full h-full rounded-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center">
          {[...Array(stars)].map((_, index) => (
            <Star
              key={index}
              className="text-yellow-400"
              size={16}
              fill="currentColor"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsCounter;

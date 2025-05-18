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
    <div className="w-full flex flex-col items-center justify-center p-4 my-4 bg-primary/20 rounded-lg">
      <h3 className="text-base font-semibold text-white text-center mb-3">
        <span className="font-bold">{count}</span> человек создают с Поехали!
      </h3>

      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center">
          {avatars.map((avatar, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full border border-white relative"
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

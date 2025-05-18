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
    <div className="flex flex-col md:items-start items-center">
      <h3 className="text-sm md:text-base font-semibold text-slate-700 text-center mb-2">
        Перевели <span>{count}</span> видео
      </h3>

      <div className="flex items-center gap-3">
        <div className="flex items-center">
          {avatars.map((avatar, index) => (
            <div
              key={index}
              className="w-[30px] h-[30px] rounded-full -mr-1.5"
              style={{ zIndex: avatars.length - index }}
            >
              <img
                src={avatar}
                alt={`Пользователь ${index + 1}`}
                width={30}
                height={30}
                className="rounded-full"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center">
          {[...Array(stars)].map((_, index) => (
            <Star
              key={index}
              className="text-[#FBB040]"
              size={18}
              fill="#FBB040"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsCounter;
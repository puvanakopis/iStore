import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  className?: string;
  size?: number;
  showCount?: boolean;
  count?: number;
}

export default function StarRating({
  rating,
  className = "",
  size = 16,
  showCount = false,
  count,
}: StarRatingProps) {

    const safeRating = Math.max(0, Math.min(5, rating));

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Stars */}
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {

          const fillLevel = Math.min(Math.max(safeRating - i, 0), 1);
          
          return (
            <div key={i} className="relative" style={{ width: size, height: size }}>
              {/* Background star */}
              <Star
                size={size}
                className="text-gray-200 fill-gray-200"
              />

              <div
                className="absolute top-0 left-0 h-full overflow-hidden"
                style={{ width: `${fillLevel * 100}%` }}
              >
                <Star
                  size={size}
                  className="text-black fill-black"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Rating */}
      {showCount && (
        <span className="text-xs text-foreground-dim font-medium ml-1">
          {safeRating.toFixed(1)} {count !== undefined && `(${count.toLocaleString()})`}
        </span>
      )}
    </div>
  );
}
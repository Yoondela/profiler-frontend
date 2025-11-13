import { Star } from 'lucide-react';

export default function StarDisplay({ rating = 0, max = 5, size = 14 }) {
  return (
    <div className="flex items-center">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const fillType =
          rating >= starValue
            ? 'full'
            : rating >= starValue - 0.5
              ? 'half'
              : 'empty';

        return (
          <div
            key={i}
            className="relative"
            style={{ width: size, height: size }}
          >
            <Star size={size} className="text-gray-300" />
            {fillType !== 'empty' && (
              <Star
                size={size}
                className={`absolute top-0 left-0 text-gray-300 fill-gray-200 ${
                  fillType === 'half' ? 'clip-half' : ''
                }`}
              />
            )}
          </div>
        );
      })}
      <style>{`
        .clip-half {
          clip-path: inset(0 50% 0 0);
        }
      `}</style>
    </div>
  );
}

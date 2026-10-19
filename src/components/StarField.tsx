import React, { useMemo } from 'react';

export const StarField: React.FC = () => {
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, t) => ({
        left: (t * 37.3) % 100,
        top: (t * 61.7) % 100,
        size: (t % 3) + 1,
        delay: (t % 10) * 0.3,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {stars.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-foreground animate-twinkle"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

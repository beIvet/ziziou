import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, Upload } from 'lucide-react';
import { DoodleIllustration } from './DoodleIllustration';

interface PreCakeDoodleProps {
  durationSeconds?: number;
  imageSrc?: string;
  onComplete: () => void;
  onUpdateImage?: (dataUrl: string) => void;
}

export const PreCakeDoodle: React.FC<PreCakeDoodleProps> = ({
  durationSeconds = 7,
  imageSrc = '',
  onComplete,
  onUpdateImage,
}) => {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Soft playful celebratory mini confetti at start
  useEffect(() => {
    try {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.5 },
        colors: ['#ffe066', '#ff9ff3', '#54a0ff', '#5f27cd', '#1dd1a1'],
        scalar: 0.8,
      });
    } catch {
      // ignore
    }
  }, []);

  // 7-second countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsFadingOut(true);
      const timer = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (onUpdateImage) {
        onUpdateImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const progressPercent = ((durationSeconds - timeLeft) / durationSeconds) * 100;

  // Has user provided a custom uploaded PNG/photo?
  const hasCustomUpload = Boolean(imageSrc && imageSrc !== '/assets/cat-frog-birthday.jpg');

  return (
    <div
      className={`fixed inset-0 z-20 flex flex-col items-center justify-center px-4 transition-all duration-700 ${
        isFadingOut ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Top greeting note */}
      <div className="animate-rise text-center mb-6">
        <p className="font-display italic text-2xl sm:text-3xl text-glow text-primary flex items-center justify-center gap-2">
          <Sparkles size={20} className="text-primary animate-pulse" />
          <span>A moment before the cake...</span>
          <Sparkles size={20} className="text-primary animate-pulse" />
        </p>
      </div>

      {/* Main Illustration Floating Directly on Starry Background */}
      <div className="animate-rise relative max-w-2xl w-full flex flex-col items-center justify-center">
        <div className="relative w-full aspect-[16/9] flex items-center justify-center drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]">
          {hasCustomUpload ? (
            <img
              src={imageSrc}
              alt="me and you celebration doodle"
              className="w-full h-full object-contain select-none"
            />
          ) : (
            <DoodleIllustration />
          )}
        </div>

        {/* Caption & Quick File Upload below doodle */}
        <div className="pt-2 px-3 flex items-center justify-between text-muted-foreground text-xs sm:text-sm font-display italic w-full max-w-lg">
          <div className="flex items-center gap-3">
            <span className="text-glow text-white/90">me &amp; you celebrating 🎈</span>
            {onUpdateImage && (
              <label className="text-[11px] font-sans not-italic text-white/50 hover:text-white/90 cursor-pointer flex items-center gap-1 transition">
                <Upload size={12} />
                <span>{hasCustomUpload ? 'Swap image' : 'Attach exact PNG file'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
          <span className="font-sans text-xs bg-white/10 text-white/80 px-2.5 py-0.5 rounded-full font-medium backdrop-blur-sm border border-white/10">
            {timeLeft > 0 ? `Cake in ${timeLeft}s` : 'Here comes the cake!'}
          </span>
        </div>
      </div>

      {/* Progress Bar & Skip Button */}
      <div className="animate-rise mt-8 flex flex-col items-center gap-3 w-full max-w-xs">
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <button
          onClick={handleSkip}
          className="text-xs text-white/60 hover:text-white transition flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/10 cursor-pointer"
        >
          <span>Skip to cake</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};

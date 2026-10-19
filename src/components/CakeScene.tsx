import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CANDLE_POSITIONS } from '../config/defaultData';
import { sounds } from '../utils/audio';
import { DoodleIllustration } from './DoodleIllustration';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CakeSceneProps {
  recipientName: string;
  heading: string;
  subtext: string;
  wishMadeText: string;
  wishSubtext: string;
  onComplete: () => void;
  showPreCakeScene?: boolean;
  preCakeDurationSeconds?: number;
  celebrationSound?: string;
  preCakeImage?: string;
  onUpdatePreCakeImage?: (dataUrl: string) => void;
}

export const CakeScene: React.FC<CakeSceneProps> = ({
  recipientName,
  heading,
  subtext,
  wishMadeText,
  wishSubtext,
  onComplete,
  showPreCakeScene = true,
  preCakeDurationSeconds = 5,
  preCakeImage = '',
  celebrationSound = '',
}) => {
  const [showDoodle, setShowDoodle] = useState<boolean>(showPreCakeScene);
  const [doodleFading, setDoodleFading] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(preCakeDurationSeconds);
  const [blown, setBlown] = useState<boolean[]>([false, false, false]);
  const allBlown = blown.every(Boolean);

  const hasCustomUpload = Boolean(preCakeImage && preCakeImage !== '/assets/cat-frog-birthday.jpg');

  // Trigger fanfare sound effect and gentle confetti on entry when pic and happy birthday appear
  useEffect(() => {
    // Play celebratory sound ("Haaaa / Yaaay! / Tadaaa!")
    sounds.playCelebrationFanfare(celebrationSound);

    try {
      confetti({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.5 },
        colors: ['#ffe066', '#ff9ff3', '#54a0ff', '#1dd1a1'],
        scalar: 0.8,
      });
    } catch {
      // ignore
    }
  }, [celebrationSound]);

  // 5 seconds timer: both "Happy Birthday" and the doodle appear together,
  // then after 5s the doodle fades out and the cake appears in its place
  useEffect(() => {
    if (!showPreCakeScene) {
      setShowDoodle(false);
      return;
    }

    if (timeLeft <= 0) {
      setDoodleFading(true);
      const timer = setTimeout(() => {
        setShowDoodle(false);
      }, 500);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, showPreCakeScene]);

  const handleSkipDoodle = () => {
    setDoodleFading(true);
    setTimeout(() => {
      setShowDoodle(false);
    }, 300);
  };

  const triggerCandlePuff = (event?: React.MouseEvent) => {
    try {
      let x = 0.5;
      let y = 0.55;
      if (event) {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        x = (rect.left + rect.width / 2) / window.innerWidth;
        y = (rect.top + rect.height / 2) / window.innerHeight;
      }
      confetti({
        particleCount: 35,
        spread: 60,
        startVelocity: 25,
        ticks: 80,
        origin: { x, y },
        colors: ['#ffe066', '#ffd43b', '#ff922b', '#ff6b6b', '#ffffff'],
        shapes: ['circle'],
        scalar: 0.8,
      });
    } catch {
      // ignore
    }
  };

  const triggerGrandCelebration = () => {
    try {
      // Center golden explosion
      confetti({
        particleCount: 90,
        spread: 100,
        startVelocity: 35,
        origin: { x: 0.5, y: 0.55 },
        colors: ['#ffd700', '#f39c12', '#e056fd', '#ff7979', '#686de0', '#badc58'],
      });

      // Left cannon
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0.05, y: 0.7 },
          colors: ['#ffd700', '#ff6b6b', '#48dbfb', '#ff9ff3'],
        });
      }, 250);

      // Right cannon
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 0.95, y: 0.7 },
          colors: ['#ffd700', '#1dd1a1', '#54a0ff', '#feca57'],
        });
      }, 450);

      // Shimmering stars and sparkles rain
      setTimeout(() => {
        confetti({
          particleCount: 70,
          spread: 120,
          origin: { x: 0.5, y: 0.3 },
          startVelocity: 20,
          decay: 0.92,
          scalar: 1.2,
          colors: ['#ffd700', '#ffffff', '#f9ca24', '#f0932b'],
        });
      }, 800);
    } catch {
      // ignore
    }
  };

  const handleBlowCandle = (index: number, event?: React.MouseEvent) => {
    if (blown[index]) return;

    sounds.playBlowCandle();
    triggerCandlePuff(event);

    const next = blown.map((b, i) => (i === index ? true : b));
    setBlown(next);

    if (next.every(Boolean)) {
      sounds.playWishChime();
      triggerGrandCelebration();
    }
  };

  useEffect(() => {
    if (allBlown) {
      const timer = setTimeout(() => {
        onComplete();
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [allBlown, onComplete]);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center z-10 py-10">
      {/* 1. Both Happy Birthday and Recipient Name appear immediately */}
      <h1
        className="animate-rise font-display text-5xl italic text-glow sm:text-7xl"
        style={{ animationDelay: '.2s' }}
      >
        {heading}
      </h1>

      <h2
        className="animate-rise animate-floaty mt-2 font-display text-6xl font-bold text-primary text-glow sm:text-8xl tracking-wide"
        style={{ animationDelay: '.6s' }}
      >
        {recipientName}
      </h2>

      {/* 2. For 5 seconds, the doodle appears right below the title */}
      {showDoodle ? (
        <div
          className={`animate-rise relative max-w-xl w-full mx-auto my-4 flex flex-col items-center transition-all duration-500 ${
            doodleFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          style={{ animationDelay: '.8s' }}
        >
          <div className="relative w-full aspect-[16/9] flex items-center justify-center drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            {hasCustomUpload ? (
              <img
                src={preCakeImage}
                alt="me and you celebration doodle"
                className="w-full h-full object-contain select-none"
              />
            ) : (
              <DoodleIllustration />
            )}
          </div>

          <div className="mt-2 flex items-center gap-3 text-xs">
            <span className="font-display italic text-primary text-sm flex items-center gap-1.5 text-glow">
              <Sparkles size={14} className="text-primary animate-pulse" />
              me &amp; you celebrating 🎈
            </span>
            <span className="text-white/30">•</span>
            <button
              onClick={handleSkipDoodle}
              className="text-white/50 hover:text-white transition flex items-center gap-1 text-[11px] underline cursor-pointer"
            >
              <span>Cake in {timeLeft}s (skip)</span>
              <ArrowRight size={11} />
            </button>
          </div>
        </div>
      ) : (
        /* 3. After 5 seconds: the doodle is gone and the birthday cake appears in its place */
        <div className="animate-rise flex flex-col items-center">
          {/* Birthday Cake with Interactive Pixel Candles */}
          <div
            className="animate-rise relative mt-6 w-48 sm:w-64 select-none"
            style={{ animationDelay: '.2s' }}
          >
            <img
              src="/assets/cake-unlit.png"
              alt="Birthday cake"
              width={888}
              height={996}
              className="w-full [image-rendering:pixelated] drop-shadow-[0_0_40px_var(--glow)]"
            />

            {CANDLE_POSITIONS.map((pos, index) => {
              const isBlown = blown[index];
              return (
                <button
                  key={index}
                  aria-label={`Blow out candle ${index + 1}`}
                  disabled={isBlown}
                  onClick={(e) => handleBlowCandle(index, e)}
                  className="absolute cursor-pointer transition-all duration-500 disabled:cursor-default"
                  style={{
                    left: `${pos.left}%`,
                    top: `${pos.top}%`,
                    width: '12.5%',
                    height: '15.8%',
                    opacity: isBlown ? 0 : 1,
                    transform: isBlown ? 'translateY(-30%) scale(0.4)' : undefined,
                  }}
                >
                  <img
                    src="/assets/flame.png"
                    alt=""
                    className="h-full w-full animate-pulse [image-rendering:pixelated] drop-shadow-[0_0_12px_var(--glow)] hover:scale-110 transition-transform"
                  />
                </button>
              );
            })}
          </div>

          <div
            className="animate-rise mt-6 text-muted-foreground min-h-[4rem]"
            style={{ animationDelay: '.6s' }}
          >
            {allBlown ? (
              <>
                <span className="block animate-[rise_2s_ease-out_both] font-display text-2xl italic text-primary text-glow">
                  {wishMadeText}
                </span>
                <span className="mt-2 block animate-[rise_2s_ease-out_both] [animation-delay:1.2s]">
                  {wishSubtext}
                </span>
                <div className="mt-4 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setBlown([false, false, false])}
                    className="text-xs tracking-wider uppercase text-white/60 hover:text-white transition cursor-pointer"
                  >
                    Relight candles 🕯️
                  </button>
                  <span className="text-white/20">•</span>
                  <button
                    onClick={onComplete}
                    className="text-xs tracking-wider uppercase text-primary/80 hover:text-primary underline cursor-pointer transition"
                  >
                    Continue to message →
                  </button>
                </div>
              </>
            ) : (
              <span className="block animate-[rise_1.2s_ease-out_both]">
                {subtext}
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

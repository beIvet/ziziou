import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Calendar as CalendarIcon, Heart, PartyPopper } from 'lucide-react';
import { sounds } from '../utils/audio';

interface CalendarSceneProps {
  recipientName: string;
  targetDay?: number;
  monthName?: string;
  subtitle?: string;
  hasCustomBackground?: boolean;
  onContinue: () => void;
}

export const CalendarScene: React.FC<CalendarSceneProps> = ({
  recipientName,
  targetDay = 26,
  monthName = 'OCTOBER',
  subtitle = 'Can you find your day?',
  hasCustomBackground = false,
  onContinue,
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Calendar dates matrix for October matching the exact image uploaded
  // Row 1: NOTES (Sun), empty (Mon, Tue, Wed), 1 (Thu), 2 (Fri), 3 (Fri?), 4 (Sat)
  // Matching wefwd.png layout:
  // Weekdays: SUN, MON, TUE, WED, THU, FRI, SAT
  const calendarGrid = [
    // Row 1: NOTES box under SUN, empty for MON, TUE, WED, then 1, 2, 3, 4
    [
      { type: 'notes', label: 'NOTES' },
      { type: 'empty' },
      { type: 'empty' },
      { type: 'empty' },
      { type: 'day', day: 1 },
      { type: 'day', day: 2 },
      { type: 'day', day: 3 },
      { type: 'day', day: 4 },
    ],
    // Row 2: 5 to 11
    [
      { type: 'day', day: 5 },
      { type: 'day', day: 6 },
      { type: 'day', day: 7 },
      { type: 'day', day: 8 },
      { type: 'day', day: 9 },
      { type: 'day', day: 10 },
      { type: 'day', day: 11 },
    ],
    // Row 3: 12 to 18
    [
      { type: 'day', day: 12 },
      { type: 'day', day: 13 },
      { type: 'day', day: 14 },
      { type: 'day', day: 15 },
      { type: 'day', day: 16 },
      { type: 'day', day: 17 },
      { type: 'day', day: 18 },
    ],
    // Row 4: 19 to 25
    [
      { type: 'day', day: 19 },
      { type: 'day', day: 20 },
      { type: 'day', day: 21 },
      { type: 'day', day: 22 },
      { type: 'day', day: 23 },
      { type: 'day', day: 24 },
      { type: 'day', day: 25 },
    ],
    // Row 5: 26 to 31
    [
      { type: 'day', day: 26 },
      { type: 'day', day: 27 },
      { type: 'day', day: 28 },
      { type: 'day', day: 29 },
      { type: 'day', day: 30 },
      { type: 'day', day: 31 },
      { type: 'empty' },
    ],
  ];

  const handleDayClick = (day: number) => {
    setSelectedDay(day);

    if (day === targetDay) {
      setIsSuccess(true);
      setFeedback("🎉 You found it! Opening your birthday surprise...");
      sounds.playCelebrationFanfare();

      try {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#fed330', '#ff4757', '#2ed573', '#54a0ff'],
        });
      } catch {
        // ignore
      }

      setTimeout(() => {
        onContinue();
      }, 1400);
    } else {
      setFeedback("Nothing happened... 🤔");
      sounds.playBlowCandle(); // soft subtle tap feedback
    }
  };

  return (
    <section className={`relative flex min-h-screen flex-col items-center justify-center px-4 py-8 z-10 ${hasCustomBackground ? 'bg-transparent' : 'bg-gradient-to-b from-[#e35d37] via-[#d6512b] to-[#b93f1d]'}`}>
      {/* Background subtle noise and warm retro glow */}
      {!hasCustomBackground && (
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      )}

      {/* Top prompt */}
      <div className="animate-rise text-center mb-4 z-10 max-w-md">
        <p className="font-display italic text-lg sm:text-xl text-amber-100 flex items-center justify-center gap-2 drop-shadow-md">
          <Sparkles size={16} className="text-yellow-300 animate-pulse" />
          <span>{subtitle}</span>
          <Sparkles size={16} className="text-yellow-300 animate-pulse" />
        </p>
      </div>

      {/* Retro Wall Calendar Card */}
      <div
        className={`animate-rise relative max-w-sm sm:max-w-md w-full bg-[#f6efe1] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] border-4 border-black overflow-hidden flex flex-col transition-all duration-500 ${
          isSuccess ? 'scale-[1.02] ring-4 ring-yellow-400' : ''
        }`}
        style={{ animationDelay: '.2s' }}
      >
        {/* ================= TOP ORANGE BANNER WITH RETRO "OCTOBER" ================= */}
        <div className="relative bg-[#dc5436] border-b-4 border-black p-4 sm:p-5 flex flex-col items-center justify-between min-h-[170px] sm:min-h-[200px]">
          {/* Inner dark border frame matching the original sketch */}
          <div className="absolute inset-3 border-2 border-black/80 rounded pointer-events-none" />

          {/* Bold Retro Yellow Bubble Typography */}
          <h1
            className="font-display font-black text-5xl sm:text-6xl text-[#fcd73a] tracking-wider select-none text-center drop-shadow-[3px_3px_0px_#000] uppercase"
            style={{ WebkitTextStroke: '2px #000' }}
          >
            {monthName}
          </h1>

          {/* Inscription inside the orange area */}
          <div className="my-auto text-center px-4 z-10">
            <span className="font-display italic text-white/95 text-sm sm:text-base drop-shadow-sm">
              {recipientName ? `A birthday surprise for ${recipientName} 🎂` : 'A very special date awaits ✨'}
            </span>
            <p className="text-[11px] font-mono text-amber-200/80 mt-1 tracking-wider">
              Only someone special knows which day to tap...
            </p>
          </div>

          {/* Skyline sketch silhouette at the bottom of the orange box */}
          <div className="w-full flex items-end justify-center h-4 opacity-75">
            <div className="w-24 h-3 bg-black/60 rounded-t" />
            <div className="w-8 h-4 bg-black/70 rounded-t ml-1" />
            <div className="w-16 h-2 bg-black/50 rounded-t ml-1" />
          </div>
        </div>

        {/* ================= CALENDAR DAYS GRID ================= */}
        <div className="bg-[#f6efe1] p-3 sm:p-4 select-none">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b-2 border-black text-center pb-1 mb-1 font-bold font-mono text-[11px] sm:text-xs text-black">
            <span>SUN</span>
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
          </div>

          {/* Grid rows */}
          <div className="flex flex-col border-2 border-black divide-y-2 divide-black bg-[#f9f4e9]">
            {/* Row 1 */}
            <div className="grid grid-cols-7 divide-x-2 divide-black h-11 sm:h-12">
              {/* NOTES Block under SUN */}
              <div className="bg-black text-white flex items-center justify-center font-black font-mono text-xs tracking-wider">
                NOTES
              </div>
              <div className="bg-[#f0e9d8]/40" />
              <div className="bg-[#f0e9d8]/40" />
              <div className="bg-[#f0e9d8]/40" />
              {[1, 2, 3].map((d) => (
                <button
                  key={d}
                  onClick={() => handleDayClick(d)}
                  className="relative p-1 text-left hover:bg-amber-200/50 transition cursor-pointer flex flex-col justify-between"
                >
                  <span className="text-xs font-bold text-black">{d}</span>
                </button>
              ))}
            </div>

            {/* Row 2: 4 to 10 */}
            <div className="grid grid-cols-7 divide-x-2 divide-black h-11 sm:h-12">
              {[4, 5, 6, 7, 8, 9, 10].map((d) => (
                <button
                  key={d}
                  onClick={() => handleDayClick(d)}
                  className="relative p-1 text-left hover:bg-amber-200/50 transition cursor-pointer flex flex-col justify-between"
                >
                  <span className="text-xs font-bold text-black">{d}</span>
                </button>
              ))}
            </div>

            {/* Row 3: 11 to 17 */}
            <div className="grid grid-cols-7 divide-x-2 divide-black h-11 sm:h-12">
              {[11, 12, 13, 14, 15, 16, 17].map((d) => (
                <button
                  key={d}
                  onClick={() => handleDayClick(d)}
                  className="relative p-1 text-left hover:bg-amber-200/50 transition cursor-pointer flex flex-col justify-between"
                >
                  <span className="text-xs font-bold text-black">{d}</span>
                </button>
              ))}
            </div>

            {/* Row 4: 18 to 24 */}
            <div className="grid grid-cols-7 divide-x-2 divide-black h-11 sm:h-12">
              {[18, 19, 20, 21, 22, 23, 24].map((d) => (
                <button
                  key={d}
                  onClick={() => handleDayClick(d)}
                  className="relative p-1 text-left hover:bg-amber-200/50 transition cursor-pointer flex flex-col justify-between"
                >
                  <span className="text-xs font-bold text-black">{d}</span>
                </button>
              ))}
            </div>

            {/* Row 5: 25, 26 (TARGET!), 27, 28, 29, 30, 31 */}
            <div className="grid grid-cols-7 divide-x-2 divide-black h-12 sm:h-13">
              <button
                onClick={() => handleDayClick(25)}
                className="relative p-1 text-left hover:bg-amber-200/50 transition cursor-pointer"
              >
                <span className="text-xs font-bold text-black">25</span>
              </button>

              {/* TARGET BIRTHDAY DATE: OCTOBER 26 (Looks identical to any normal date until clicked) */}
              <button
                onClick={() => handleDayClick(26)}
                aria-label="Day 26"
                className={`relative p-1 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSuccess
                    ? 'bg-yellow-300 ring-4 ring-amber-500 scale-105 z-20 animate-pulse'
                    : 'hover:bg-amber-200/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-black">26</span>
                  {isSuccess && <span className="text-xs animate-bounce">🎂</span>}
                </div>
                {isSuccess && (
                  <div className="border border-red-500 rounded-full py-0.5 px-1 text-[8px] font-bold text-red-600 text-center leading-none bg-red-100">
                    YOU! ✨
                  </div>
                )}
              </button>

              {[27, 28, 29, 30, 31].map((d) => (
                <button
                  key={d}
                  onClick={() => handleDayClick(d)}
                  className="relative p-1 text-left hover:bg-amber-200/50 transition cursor-pointer flex flex-col justify-between"
                >
                  <span className="text-xs font-bold text-black">{d}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Bar */}
        <div className="p-3 bg-black text-center min-h-[44px] flex items-center justify-center">
          <p
            className={`text-xs font-mono font-medium transition-all ${
              isSuccess ? 'text-yellow-300 font-bold' : feedback ? 'text-amber-200' : 'text-zinc-400'
            }`}
          >
            {feedback || 'Tap a date on the calendar to explore...'}
          </p>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface CalendarSceneProps {
  recipientName: string;
  targetDay?: number;
  monthName?: string;
  subtitle?: string;
  calendarImage?: string;
  hasCustomBackground?: boolean;
  onContinue: () => void;
}

// 5 rows x 7 columns = 35 cells matching the poster grid
interface GridCell {
  row: number;
  col: number;
  day?: number;
  type: 'day' | 'notes' | 'empty' | 'star';
  label?: string;
}

const POSTER_CELLS: GridCell[] = [
  // Row 0
  { row: 0, col: 0, type: 'notes', label: 'NOTES' },
  { row: 0, col: 1, type: 'empty' },
  { row: 0, col: 2, type: 'empty' },
  { row: 0, col: 3, type: 'empty' },
  { row: 0, col: 4, type: 'day', day: 1 },
  { row: 0, col: 5, type: 'day', day: 2 },
  { row: 0, col: 6, type: 'day', day: 3 },

  // Row 1
  { row: 1, col: 0, type: 'day', day: 5 },
  { row: 1, col: 1, type: 'day', day: 6 },
  { row: 1, col: 2, type: 'day', day: 7 },
  { row: 1, col: 3, type: 'day', day: 8 },
  { row: 1, col: 4, type: 'day', day: 9 },
  { row: 1, col: 5, type: 'day', day: 10 },
  { row: 1, col: 6, type: 'day', day: 11 },

  // Row 2
  { row: 2, col: 0, type: 'day', day: 12 },
  { row: 2, col: 1, type: 'day', day: 13 },
  { row: 2, col: 2, type: 'day', day: 14 },
  { row: 2, col: 3, type: 'day', day: 15 },
  { row: 2, col: 4, type: 'day', day: 16 },
  { row: 2, col: 5, type: 'day', day: 17 },
  { row: 2, col: 6, type: 'day', day: 18 },

  // Row 3
  { row: 3, col: 0, type: 'day', day: 19 },
  { row: 3, col: 1, type: 'day', day: 20 },
  { row: 3, col: 2, type: 'day', day: 21 },
  { row: 3, col: 3, type: 'day', day: 22 },
  { row: 3, col: 4, type: 'day', day: 23 },
  { row: 3, col: 5, type: 'day', day: 24 },
  { row: 3, col: 6, type: 'day', day: 25 },

  // Row 4: 26 (TARGET!) to 31 + Star
  { row: 4, col: 0, type: 'day', day: 26 },
  { row: 4, col: 1, type: 'day', day: 27 },
  { row: 4, col: 2, type: 'day', day: 28 },
  { row: 4, col: 3, type: 'day', day: 29 },
  { row: 4, col: 4, type: 'day', day: 30 },
  { row: 4, col: 5, type: 'day', day: 31 },
  { row: 4, col: 6, type: 'star' },
];

export const CalendarScene: React.FC<CalendarSceneProps> = ({
  recipientName,
  targetDay = 26,
  subtitle = 'Can you find your day?',
  calendarImage = '/assets/october-cat-calendar.png',
  hasCustomBackground = false,
  onContinue,
}) => {
  const [clickedCellKey, setClickedCellKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [catWobble, setCatWobble] = useState(false);

  const handleCellClick = (cell: GridCell) => {
    const key = `${cell.row}-${cell.col}`;
    setClickedCellKey(key);

    if (cell.type === 'notes') {
      sounds.playPop();
      setFeedback('Notes: A big celebration is coming up! 📝✨');
      return;
    }

    if (cell.type === 'star') {
      sounds.playCelebrationFanfare();
      setFeedback('A lucky retro star for your new year! 🌟');
      return;
    }

    if (cell.type === 'empty') {
      sounds.playBlowCandle();
      setFeedback('Nothing happened here... 🤔');
      return;
    }

    // Day clicked
    if (cell.day === targetDay) {
      setIsSuccess(true);
      setCatWobble(true);
      setFeedback('🎉 You found it! Opening your birthday surprise...');
      sounds.playCelebrationFanfare();

      try {
        confetti({
          particleCount: 75,
          spread: 90,
          origin: { y: 0.55 },
          colors: ['#fed330', '#ff4757', '#2ed573', '#54a0ff', '#feca57'],
        });
      } catch {
        // ignore
      }

      setTimeout(() => {
        onContinue();
      }, 1500);
    } else {
      sounds.playBlowCandle();
      setFeedback('Nothing happened... 🤔');
    }
  };

  const handleCatClick = () => {
    setCatWobble(true);
    sounds.playPop();
    setFeedback('The screaming cat says: Meow! Look closely at the dates! 🐾');
    setTimeout(() => setCatWobble(false), 600);
  };

  return (
    <section
      className={`relative flex min-h-screen flex-col items-center justify-center px-4 py-8 z-10 ${
        hasCustomBackground
          ? 'bg-transparent'
          : 'bg-gradient-to-b from-[#e35d37] via-[#d6512b] to-[#b93f1d]'
      }`}
    >
      {/* Background subtle retro noise pattern when default */}
      {!hasCustomBackground && (
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      )}

      {/* Top Riddle Prompt */}
      <div className="animate-rise text-center mb-3 z-10 max-w-md">
        <p className="font-display italic text-lg sm:text-xl text-amber-100 flex items-center justify-center gap-2 drop-shadow-md">
          <Sparkles size={16} className="text-yellow-300 animate-pulse" />
          <span>{subtitle}</span>
          <Sparkles size={16} className="text-yellow-300 animate-pulse" />
        </p>
      </div>

      {/* Authentic Illustrated Wall Calendar Poster */}
      <div
        className={`animate-rise relative max-w-[360px] sm:max-w-[420px] w-full rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] border-4 border-black overflow-hidden bg-[#f6efe1] flex flex-col transition-all duration-500 ${
          isSuccess ? 'scale-[1.02] ring-4 ring-yellow-400' : ''
        } ${catWobble ? 'animate-bounce' : ''}`}
        style={{ animationDelay: '.2s' }}
      >
        {/* Poster Image Container */}
        <div className="relative w-full aspect-[600/1024] select-none bg-[#f6efe1]">
          {/* Authentic Artwork */}
          <img
            src={calendarImage || '/assets/october-cat-calendar.png'}
            alt="October Screaming Cat Calendar"
            className="w-full h-full object-contain pointer-events-none"
            loading="eager"
          />

          {/* Interactive Easter Egg: Tap Screaming Cat */}
          <button
            type="button"
            onClick={handleCatClick}
            className="absolute top-[18%] left-[12%] w-[76%] h-[32%] cursor-pointer rounded-full opacity-0 hover:opacity-10 transition-opacity bg-amber-400/20"
            title="Click the cat!"
            aria-label="Cat Illustration"
          />

          {/* ================= EXACT 5x7 INTERACTIVE CALENDAR GRID OVERLAY ================= */}
          <div
            className="absolute grid grid-cols-7 grid-rows-5"
            style={{
              top: '53.5%',
              left: '4%',
              width: '91.7%',
              height: '31.6%',
            }}
          >
            {POSTER_CELLS.map((cell) => {
              const isTarget = cell.day === targetDay;
              const isCellClicked = clickedCellKey === `${cell.row}-${cell.col}`;

              return (
                <button
                  key={`${cell.row}-${cell.col}`}
                  type="button"
                  onClick={() => handleCellClick(cell)}
                  aria-label={cell.day ? `Day ${cell.day}` : cell.label || 'Calendar cell'}
                  className={`relative w-full h-full cursor-pointer transition-all flex items-center justify-center group ${
                    isCellClicked && !isTarget ? 'animate-pulse' : ''
                  }`}
                >
                  {/* Subtle hover indicator without giving away any secret */}
                  <div className="absolute inset-0.5 rounded transition-all group-hover:bg-amber-400/20" />

                  {/* Target Success Reveal (October 26) */}
                  {isTarget && isSuccess && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none animate-bounce">
                      {/* Hand-drawn glowing yellow highlight circle */}
                      <div className="absolute inset-0.5 rounded-full border-2 border-red-500 bg-yellow-300/80 shadow-[0_0_12px_rgba(255,215,0,0.8)]" />
                      <span className="relative text-[9px] sm:text-[10px] font-black text-red-700 tracking-tight leading-none uppercase">
                        YOU! 🎂
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Vintage Comic Feedback Bar */}
        <div className="p-3 bg-black text-center min-h-[46px] flex items-center justify-center border-t-2 border-black">
          <p
            className={`text-xs font-mono font-medium transition-all ${
              isSuccess
                ? 'text-yellow-300 font-bold'
                : feedback
                ? 'text-amber-200'
                : 'text-zinc-400'
            }`}
          >
            {feedback || 'Tap a date on the calendar to explore...'}
          </p>
        </div>
      </div>
    </section>
  );
};

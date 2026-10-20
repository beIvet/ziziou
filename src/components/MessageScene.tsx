import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Feather, RotateCcw, Heart, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { sounds } from '../utils/audio';

import { compressImageFile } from '../utils/imageOptimizer';

interface MessageSceneProps {
  messageText: string;
  buttonText: string;
  recipientName?: string;
  font?: 'lora' | 'fraunces' | 'caveat' | 'outfit';
  fontSize?: 'sm' | 'base' | 'lg' | 'xl';
  cardLeftHeading?: string;
  cardLeftMessage?: string;
  cardLeftImage?: string;
  onUpdateCardLeftImage?: (dataUrl: string) => void;
  backgroundImage?: string;
  onUpdateBackgroundImage?: (dataUrl: string) => void;
  onContinue: () => void;
  onBackToCake?: () => void;
}

export const MessageScene: React.FC<MessageSceneProps> = ({
  messageText,
  buttonText,
  recipientName,
  font = 'lora',
  fontSize = 'base',
  cardLeftHeading = 'For someone truly wonderful.',
  cardLeftMessage = 'May your year ahead be as bright, radiant, and full of joy as you make the lives of everyone around you.',
  cardLeftImage = '',
  onUpdateCardLeftImage,
  onContinue,
  onBackToCake,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Map font prop to corresponding font class
  const getFontClass = () => {
    switch (font) {
      case 'lora':
        return 'font-lora italic leading-relaxed text-[#26221f]';
      case 'caveat':
        return 'font-caveat leading-snug tracking-wide text-[125%] text-[#1a1714] font-semibold';
      case 'outfit':
        return 'font-outfit font-normal leading-relaxed text-[#2a2622]';
      case 'fraunces':
      default:
        return 'font-fraunces italic leading-relaxed text-[#26221f]';
    }
  };

  // Map font size to compact readable scales
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-xs sm:text-sm';
      case 'base':
        return 'text-sm sm:text-base';
      case 'xl':
        return 'text-lg sm:text-xl';
      case 'lg':
      default:
        return 'text-base sm:text-lg';
    }
  };

  const handleOpenCard = () => {
    sounds.playCardOpen();
    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#ffe066', '#ff9ff3', '#54a0ff', '#feca57'],
        scalar: 0.8,
      });
    } catch {
      // ignore
    }
    setIsOpen(true);
  };

  const handleLeftPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const optimizedUrl = await compressImageFile(file);
      if (onUpdateCardLeftImage) {
        onUpdateCardLeftImage(optimizedUrl);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (onUpdateCardLeftImage) {
          onUpdateCardLeftImage(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 text-center z-10 py-8">
      {onBackToCake && (
        <button
          onClick={onBackToCake}
          className="absolute top-4 left-4 text-xs text-muted-foreground/70 hover:text-foreground transition underline underline-offset-4 cursor-pointer z-30"
        >
          ← Back to cake
        </button>
      )}

      {!isOpen ? (
        /* ================= CLOSED BIRTHDAY CARD (CLICK TO OPEN) ================= */
        <div className="animate-rise flex flex-col items-center">
          <p className="font-display italic text-lg sm:text-xl text-primary/80 mb-4 flex items-center gap-2 text-glow">
            <Sparkles size={16} className="text-primary animate-pulse" />
            <span>You have a birthday card</span>
            <Sparkles size={16} className="text-primary animate-pulse" />
          </p>

          {/* The Closed Greeting Card */}
          <div
            onClick={handleOpenCard}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleOpenCard();
            }}
            aria-label="Click to open birthday card"
            className="group relative w-72 sm:w-84 h-[430px] sm:h-[480px] rounded-2xl cursor-pointer select-none transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 shadow-[0_30px_70px_rgba(0,0,0,0.85)] border-2 border-primary/40 bg-gradient-to-br from-[#3d0d26] via-[#250717] to-[#17020e] p-6 sm:p-8 flex flex-col items-center justify-between text-center overflow-hidden"
          >
            {/* Subtle inner gold foil border line */}
            <div className="absolute inset-3 rounded-xl border border-primary/30 pointer-events-none" />
            <div className="absolute inset-4 rounded-lg border border-primary/15 pointer-events-none" />

            {/* Top decorative header */}
            <div className="relative z-10 pt-4 flex flex-col items-center">
              <span className="text-[11px] uppercase tracking-[0.25em] text-primary/70 font-mono">
                Birthday Greeting
              </span>
              <h3 className="font-display text-4xl sm:text-5xl italic font-bold text-primary text-glow mt-3">
                Happy Birthday
              </h3>
              <h4 className="font-display text-2xl sm:text-3xl text-white font-medium mt-1">
                {recipientName || 'You'}
              </h4>
            </div>

            {/* Center Wax Seal / Medallion (Click prompt) */}
            <div className="relative z-10 my-auto flex flex-col items-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-amber-700 p-1 shadow-[0_10px_25px_rgba(212,175,55,0.4)] group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                <div className="w-full h-full rounded-full border-2 border-amber-200/80 flex flex-col items-center justify-center bg-[#5c1328]">
                  <Heart size={24} className="text-primary fill-primary animate-pulse" />
                  <span className="text-[9px] uppercase tracking-wider text-amber-200 font-bold mt-1">
                    Open
                  </span>
                </div>
              </div>

              <span className="inline-block mt-4 text-xs font-semibold tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                ✉️ Click to open card
              </span>
            </div>

            {/* Bottom card footer */}
            <div className="relative z-10 pb-2 text-[11px] text-white/50 font-display italic">
              Made with all my love for your special day ✨
            </div>
          </div>
        </div>
      ) : (
        /* ================= OPEN BIRTHDAY CARD SPREAD ================= */
        <div className="animate-rise relative max-w-4xl w-full mx-auto my-auto flex flex-col items-center">
          {/* Card Spread Container */}
          <div className="relative w-full rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.9)] overflow-hidden border-2 border-primary/30 bg-[#1f0917] flex flex-col sm:flex-row min-h-[500px]">
            {/* Left Page (Customizable Inscription & Photo) */}
            <div className="sm:w-5/12 bg-gradient-to-br from-[#f8f3e6] to-[#f2ecdc] text-zinc-800 p-6 sm:p-8 flex flex-col justify-between text-left border-b sm:border-b-0 sm:border-r border-amber-900/15 relative">
              {/* Gold corner accents */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-amber-600/40" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-amber-600/40" />

              <div>
                <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-amber-800/70 uppercase">
                  <Sparkles size={12} className="text-amber-700" />
                  <span>Celebration</span>
                </div>

                {/* Customizable Heading */}
                <h3 className="font-display italic text-3xl sm:text-4xl text-amber-950 font-bold mt-4 leading-tight">
                  {cardLeftHeading || 'For someone truly wonderful.'}
                </h3>

                {/* Customizable Message */}
                <p className="mt-4 font-lora italic text-sm sm:text-base text-zinc-700 leading-relaxed whitespace-pre-line">
                  {cardLeftMessage || 'May your year ahead be as bright, radiant, and full of joy as you make the lives of everyone around you.'}
                </p>

                {/* Picture Under the Text */}
                {cardLeftImage ? (
                  <div className="mt-4 relative group rounded-xl overflow-hidden shadow-md border-2 border-amber-200/90 bg-white p-1.5 aspect-[4/3] max-h-48 flex items-center justify-center">
                    <img
                      src={cardLeftImage}
                      alt="Special keepsake"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      {onUpdateCardLeftImage && (
                        <>
                          <label className="px-2.5 py-1.5 bg-white text-zinc-900 rounded text-xs font-semibold cursor-pointer shadow hover:bg-zinc-100 transition flex items-center gap-1">
                            <Upload size={12} />
                            <span>Change</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleLeftPhotoUpload}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => onUpdateCardLeftImage('')}
                            className="p-1.5 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition cursor-pointer"
                            title="Remove picture"
                          >
                            <Trash2 size={13} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  onUpdateCardLeftImage && (
                    <label className="mt-4 border-2 border-dashed border-amber-800/30 hover:border-amber-800/60 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer bg-amber-50/50 hover:bg-amber-100/50 transition">
                      <ImageIcon size={18} className="text-amber-700 mb-1" />
                      <span className="text-xs font-semibold text-amber-900">+ Add photo under text</span>
                      <span className="text-[10px] text-amber-800/60">Upload a memory photo or picture</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLeftPhotoUpload}
                      />
                    </label>
                  )
                )}
              </div>

              {/* Decorative mini birthday cake illustration & Fold button */}
              <div className="pt-6 border-t border-amber-800/15 flex items-center justify-between">
                <button
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-900/70 hover:text-amber-950 transition underline cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Fold card closed</span>
                </button>
                <span className="text-xl">🎂</span>
              </div>
            </div>

            {/* Right Page (The Scrollable Personal Letter) */}
            <div className="sm:w-7/12 bg-[#fdfbf7] p-6 sm:p-8 flex flex-col justify-between text-left relative">
              {/* Gold corner accents */}
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-amber-600/40" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-amber-600/40" />

              {/* Top stationery line */}
              <div className="w-full border-b border-zinc-300 pb-2 mb-3 text-[11px] text-zinc-500 font-mono tracking-wider flex items-center justify-between select-none">
                <span>A Letter For {recipientName || 'You'}</span>
                <span>🎈</span>
              </div>

              {/* Scrollable Letter Body - Perfectly contained inside the right page */}
              <div className="flex-1 overflow-y-auto max-h-[44vh] sm:max-h-[50vh] pr-3 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent select-text">
                <p
                  className={`whitespace-pre-line ${getFontClass()} ${getFontSizeClass()} break-words`}
                >
                  {messageText || 'Wishing you the most magical, joyful, and unforgettable birthday!'}
                </p>

                {/* Letter closing signature flourish */}
                <div className="mt-8 pt-4 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-600 font-display italic">
                  <span className="flex items-center gap-1.5">
                    <Feather size={12} className="text-zinc-600" />
                    <span>With all my love</span>
                  </span>
                  <span className="font-bold text-zinc-900">
                    {recipientName ? `For ${recipientName}` : 'Happy Birthday'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Continue to Gallery Button */}
          <div className="animate-rise mt-6" style={{ animationDelay: '.4s' }}>
            <button
              onClick={onContinue}
              className="rounded-full border border-primary/50 bg-primary/10 px-8 py-3 text-primary backdrop-blur transition duration-300 hover:bg-primary hover:text-primary-foreground cursor-pointer shadow-lg hover:shadow-primary/25 text-sm sm:text-base font-medium"
            >
              {buttonText || "Now that's over with, click here"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

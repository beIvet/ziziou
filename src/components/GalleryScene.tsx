import React from 'react';
import { MemoryItem } from '../types';
import { FRAMES } from '../config/defaultData';
import { MuseumCurtains } from './MuseumCurtains';

interface GallerySceneProps {
  title: string;
  subtitle: string;
  footerText: string;
  memories: MemoryItem[];
  showCurtains?: boolean;
  curtainsImage?: string;
  onSelectMemory: (index: number) => void;
  onBackToMessage: () => void;
}

export const GalleryScene: React.FC<GallerySceneProps> = ({
  title,
  subtitle,
  footerText,
  memories,
  showCurtains = true,
  curtainsImage,
  onSelectMemory,
  onBackToMessage,
}) => {
  return (
    <div className="museum-floor min-h-screen text-foreground relative overflow-hidden">
      <div className="relative">
        <div className="museum-wall pointer-events-none absolute inset-0 min-h-full" />

        {/* Grand Velvet Theatrical / Museum Proscenium Curtains */}
        {showCurtains && <MuseumCurtains customImage={curtainsImage} />}

        <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-36 z-10">
          <button
            onClick={onBackToMessage}
            className="sm:absolute left-4 top-4 mb-6 sm:mb-0 inline-flex items-center gap-1 rounded-full border border-primary/50 bg-primary/10 px-4 py-2 text-sm text-primary backdrop-blur transition hover:bg-primary hover:text-primary-foreground cursor-pointer"
          >
            ← Back to message
          </button>

          <h2 className="animate-rise text-center font-display text-4xl italic text-glow sm:text-5xl">
            {title}
          </h2>
          <p className="animate-rise mt-2 text-center font-display text-xl italic text-primary">
            {subtitle}
          </p>
          <p className="animate-rise mt-2 text-center text-muted-foreground text-sm lg:hidden">
            Swipe to see more →
          </p>
          <p className="animate-rise mt-2 hidden text-center text-muted-foreground text-sm lg:block">
            Click a painting to look closer
          </p>

          {/* Desktop Ornate Wall Layout */}
          <div className="mt-14 hidden flex-wrap items-center justify-center gap-x-12 gap-y-14 lg:flex">
            {memories.map((item, t) => {
              const frame = FRAMES[t % FRAMES.length];
              return (
                <button
                  key={item.id || t}
                  onClick={() => onSelectMemory(t)}
                  aria-label={`View ${item.caption}`}
                  className="animate-rise group relative transition duration-500 hover:-translate-y-2 hover:scale-[1.03] drop-shadow-[0_20px_30px_oklch(0_0_0/0.6)] cursor-pointer text-left focus:outline-none"
                  style={{
                    animationDelay: `${0.2 + t * 0.15}s`,
                    marginTop: t % 2 ? '3rem' : 0,
                    width: frame.width,
                    aspectRatio: frame.ratio,
                  }}
                >
                  <div className="absolute inset-0 drop-shadow-[18px_34px_22px_oklch(0_0_0/0.8)]">
                    {/* Picture inside frame hole */}
                    <div
                      className={`absolute overflow-hidden ${frame.round ? 'rounded-full' : ''}`}
                      style={{
                        left: `${frame.hole[0] - 1}%`,
                        top: `${frame.hole[1] - 1}%`,
                        right: `${99 - frame.hole[2]}%`,
                        bottom: `${99 - frame.hole[3]}%`,
                      }}
                    >
                      <img
                        src={item.src}
                        alt={item.caption}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                    </div>
                    {/* Ornate Frame overlay */}
                    <img
                      src={frame.src}
                      alt=""
                      className="pointer-events-none absolute inset-0 h-full w-full"
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile Horizontal Snap Carousel */}
          <div className="mt-10 -mx-6 flex snap-x snap-mandatory items-center gap-8 overflow-x-auto px-[15vw] pb-6 lg:hidden no-scrollbar">
            {memories.map((item, t) => {
              const frame = FRAMES[t % FRAMES.length];
              return (
                <button
                  key={item.id || t}
                  onClick={() => onSelectMemory(t)}
                  aria-label={`View ${item.caption}`}
                  className="animate-rise group relative w-[70vw] max-w-xs shrink-0 snap-center transition focus:outline-none"
                  style={{
                    animationDelay: `${0.2 + t * 0.15}s`,
                    aspectRatio: frame.ratio,
                  }}
                >
                  <div className="absolute inset-0 drop-shadow-[10px_20px_14px_oklch(0_0_0/0.8)]">
                    <div
                      className={`absolute overflow-hidden ${frame.round ? 'rounded-full' : ''}`}
                      style={{
                        left: `${frame.hole[0] - 1}%`,
                        top: `${frame.hole[1] - 1}%`,
                        right: `${99 - frame.hole[2]}%`,
                        bottom: `${99 - frame.hole[3]}%`,
                      }}
                    >
                      <img
                        src={item.src}
                        alt={item.caption}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <img
                      src={frame.src}
                      alt=""
                      className="pointer-events-none absolute inset-0 h-full w-full"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Gallery Epilogue & Return */}
      <section className="relative px-6 pt-12 pb-24 text-center">
        <div className="mx-auto max-w-xl">
          <p className="whitespace-pre-line font-display text-3xl italic leading-relaxed text-glow">
            {footerText}
          </p>
        </div>
        <div className="mt-12">
          <button
            onClick={onBackToMessage}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline hover:text-foreground cursor-pointer transition"
          >
            ← Back to the message
          </button>
        </div>
      </section>
    </div>
  );
};

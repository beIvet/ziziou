import React, { useState } from 'react';
import { sounds } from '../utils/audio';

interface LetterSceneProps {
  recipientName: string;
  subtitle: string;
  teaser: string;
  envelopeImage?: string;
  onOpen: () => void;
}

export const LetterScene: React.FC<LetterSceneProps> = ({
  recipientName,
  subtitle,
  teaser,
  envelopeImage = '/assets/envelope.png',
  onOpen,
}) => {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    sounds.playEnvelopeOpen();
    setTimeout(() => {
      onOpen();
    }, 1600);
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center z-10">
      <p
        className="animate-rise font-display text-3xl italic leading-relaxed text-glow sm:text-4xl"
        style={{ animationDelay: '.3s' }}
      >
        {subtitle}
      </p>

      <p
        className="animate-rise mb-10 font-display text-5xl font-bold text-primary text-glow sm:text-6xl tracking-wide"
        style={{ animationDelay: '.8s' }}
      >
        {recipientName}
      </p>

      <button
        onClick={handleOpen}
        aria-label="Open the letter"
        className="group relative cursor-pointer outline-none focus:outline-none"
      >
        <div
          className={`relative h-48 w-64 transition-transform duration-500 sm:h-56 sm:w-80 ${
            opening ? '' : 'group-hover:-translate-y-2'
          }`}
        >
          {/* Paper Letter Sliding Up */}
          <div
            className={`absolute left-4 right-4 top-2 h-44 rounded-md border border-border bg-card p-4 shadow-lg transition-all duration-700 ${
              opening ? '-translate-y-16 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            <p className="font-display text-lg italic text-foreground">
              For {recipientName}
            </p>
            <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
              {teaser}
            </p>
          </div>

          {/* Envelope Graphic */}
          <img
            src={envelopeImage || '/assets/envelope.png'}
            alt="Birthday envelope"
            className={`absolute inset-x-0 bottom-0 z-10 w-full drop-shadow-[0_10px_30px_oklch(0_0_0/0.5)] transition-all duration-700 ${
              opening ? 'translate-y-6 opacity-60' : ''
            }`}
          />
        </div>
      </button>

      <p
        className="animate-rise mt-10 text-muted-foreground text-sm tracking-wider uppercase font-light"
        style={{ animationDelay: '.6s' }}
      >
        {opening ? 'Opening…' : 'Click to open'}
      </p>
    </section>
  );
};

import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { MemoryItem } from '../types';

interface LightboxModalProps {
  selectedIndex: number;
  memories: MemoryItem[];
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  selectedIndex,
  memories,
  onClose,
  onNavigate,
}) => {
  const current = memories[selectedIndex];
  const total = memories.length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate((selectedIndex + total - 1) % total);
      if (e.key === 'ArrowRight') onNavigate((selectedIndex + 1) % total);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, total, onClose, onNavigate]);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 p-6 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-6 right-6 p-2 rounded-full bg-foreground/10 text-foreground hover:bg-foreground/20 transition cursor-pointer"
      >
        <X size={20} />
      </button>

      {/* Main Image */}
      <div
        className="relative max-h-[70vh] max-w-4xl flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={current.id || selectedIndex}
          src={current.src}
          alt={current.caption}
          className="animate-rise max-h-[70vh] max-w-full rounded-2xl shadow-2xl object-contain border border-white/10"
        />
      </div>

      {/* Caption & Description */}
      <p className="mt-6 font-display text-2xl italic text-primary text-glow text-center">
        {current.caption}
      </p>
      <p className="mt-2 max-w-md text-center text-muted-foreground text-sm leading-relaxed whitespace-pre-line px-4">
        {current.description}
      </p>

      {/* Navigation Controls */}
      <div
        className="mt-6 flex items-center gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="rounded-full border border-foreground/20 px-5 py-2 hover:bg-foreground/10 transition cursor-pointer flex items-center gap-1 text-sm"
          onClick={() => onNavigate((selectedIndex + total - 1) % total)}
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <span className="text-xs text-muted-foreground font-mono">
          {selectedIndex + 1} / {total}
        </span>
        <button
          className="rounded-full border border-foreground/20 px-5 py-2 hover:bg-foreground/10 transition cursor-pointer flex items-center gap-1 text-sm"
          onClick={() => onNavigate((selectedIndex + 1) % total)}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

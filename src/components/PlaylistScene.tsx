import React, { useState } from 'react';
import { Music, Disc3, Sparkles, ExternalLink, Edit3, Check, Heart, Volume2 } from 'lucide-react';

interface PlaylistSceneProps {
  recipientName: string;
  title?: string;
  subtitle?: string;
  spotifyUrl?: string;
  buttonText?: string;
  onUpdateSpotifyUrl?: (url: string) => void;
  onContinue: () => void;
  onBackToCard?: () => void;
}

/**
 * Convert any Spotify URL/URI into a clean official Spotify Embed URL
 */
export function getSpotifyEmbedUrl(url?: string): string {
  if (!url || !url.trim()) {
    // Default Chill Lofi / Warm vibes playlist
    return 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4WYpdgoIcn6?utm_source=generator&theme=0';
  }

  const clean = url.trim();

  // If already an embed URL
  if (clean.includes('/embed/')) {
    return clean;
  }

  // Handle spotify:playlist:ID or spotify:track:ID
  const uriMatch = clean.match(/spotify:(playlist|album|track|artist):([a-zA-Z0-9]+)/);
  if (uriMatch) {
    const [, type, id] = uriMatch;
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
  }

  // Handle https://open.spotify.com/(playlist|album|track)/ID
  const urlMatch = clean.match(/open\.spotify\.com\/(playlist|album|track|artist)\/([a-zA-Z0-9]+)/);
  if (urlMatch) {
    const [, type, id] = urlMatch;
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
  }

  // Fallback default
  return 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4WYpdgoIcn6?utm_source=generator&theme=0';
}

export const PlaylistScene: React.FC<PlaylistSceneProps> = ({
  recipientName,
  title = 'A Soundtrack For You',
  subtitle = 'Songs that remind me of you, and melodies I hope you love ✨',
  spotifyUrl = 'https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6',
  buttonText = 'Continue to the Museum Gallery →',
  onUpdateSpotifyUrl,
  onContinue,
  onBackToCard,
}) => {
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [tempUrl, setTempUrl] = useState(spotifyUrl);
  const embedUrl = getSpotifyEmbedUrl(spotifyUrl);

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSpotifyUrl) {
      onUpdateSpotifyUrl(tempUrl.trim());
    }
    setIsEditingUrl(false);
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 text-center z-10 py-12">
      {onBackToCard && (
        <button
          onClick={onBackToCard}
          className="absolute top-4 left-4 text-xs text-muted-foreground/70 hover:text-foreground transition underline underline-offset-4 cursor-pointer z-30"
        >
          ← Back to birthday card
        </button>
      )}

      {/* Decorative Musical Header */}
      <div className="animate-rise max-w-xl mx-auto mb-6">
        {/* Animated Spinning Vinyl / Cassette Badge */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 via-amber-600 to-amber-700 p-0.5 shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center animate-[spin_6s_linear_infinite]">
            <Disc3 size={32} className="text-black" />
            <div className="absolute w-3.5 h-3.5 rounded-full bg-primary border-2 border-black" />
          </div>
          <span className="text-xs font-mono tracking-widest text-primary uppercase flex items-center gap-1.5">
            <Music size={13} className="text-primary animate-pulse" />
            <span>Dedicated Mixtape</span>
            <Sparkles size={13} className="text-primary animate-pulse" />
          </span>
        </div>

        <h2 className="font-display italic text-3xl sm:text-5xl font-bold text-glow text-foreground">
          {title}
        </h2>

        <p className="font-lora italic text-base sm:text-lg text-primary/90 mt-2 max-w-md mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Spotify Embed Player Container */}
      <div
        className="animate-rise relative max-w-lg w-full mx-auto my-2 rounded-3xl p-3 sm:p-4 bg-black/40 backdrop-blur-xl border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col items-center"
        style={{ animationDelay: '.2s' }}
      >
        {/* Top Player Cassette-Style Bar */}
        <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-white/10 px-2 text-xs text-white/60 font-mono">
          <span className="flex items-center gap-1.5 text-primary">
            <Heart size={12} className="fill-primary" />
            <span>For {recipientName || 'You'}</span>
          </span>

          {/* Change Playlist Button */}
          {onUpdateSpotifyUrl && (
            <button
              onClick={() => setIsEditingUrl(!isEditingUrl)}
              className="flex items-center gap-1 text-[11px] text-white/70 hover:text-white transition hover:underline cursor-pointer"
            >
              <Edit3 size={11} />
              <span>{isEditingUrl ? 'Close editor' : 'Change playlist'}</span>
            </button>
          )}
        </div>

        {/* Inline URL Input (when user clicks change playlist) */}
        {isEditingUrl && onUpdateSpotifyUrl && (
          <form
            onSubmit={handleSaveUrl}
            className="w-full mb-3 p-3 bg-white/5 border border-primary/40 rounded-2xl flex flex-col gap-2 text-left animate-fade-in"
          >
            <label className="text-xs font-semibold text-white">Paste your Spotify Playlist or Album URL:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="https://open.spotify.com/playlist/..."
                className="flex-1 bg-black/60 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white focus:border-primary outline-none font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:opacity-90 transition flex items-center gap-1 cursor-pointer"
              >
                <Check size={13} />
                <span>Save</span>
              </button>
            </div>
            <p className="text-[10px] text-white/50">
              Open Spotify &gt; Click Share on any playlist &gt; Copy Link &gt; Paste here.
            </p>
          </form>
        )}

        {/* Official Spotify Iframe Player */}
        <div className="w-full rounded-2xl overflow-hidden shadow-inner bg-[#121212]">
          <iframe
            src={embedUrl}
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Playlist"
            className="rounded-2xl"
          />
        </div>

        {/* Small sentiment note beneath player */}
        <div className="w-full mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50 px-2 font-display italic">
          <span>🎧 Hit play to listen to the soundtrack</span>
          <span className="text-primary font-medium">Enjoy the tunes ✨</span>
        </div>
      </div>

      {/* Continue to Gallery Button */}
      <div className="animate-rise mt-8" style={{ animationDelay: '.4s' }}>
        <button
          onClick={onContinue}
          className="rounded-full border border-primary/50 bg-primary/10 px-8 py-3.5 text-primary backdrop-blur transition duration-300 hover:bg-primary hover:text-primary-foreground cursor-pointer shadow-lg hover:shadow-primary/25 text-sm sm:text-base font-medium flex items-center gap-2 group"
        >
          <span>{buttonText}</span>
          <Sparkles size={15} className="group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </section>
  );
};

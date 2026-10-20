import React from 'react';
import { Upload, RotateCcw, Image as ImageIcon, Sliders, Palette, Check } from 'lucide-react';
import { SiteConfig, Scene } from '../types';
import { compressImageFile } from '../utils/imageOptimizer';

interface BackgroundCustomizerTabProps {
  config: SiteConfig;
  onUpdateConfig: (newConfig: SiteConfig) => void;
  currentScene: Scene;
  onJumpScene: (scene: Scene) => void;
}

const PRESET_COLORS = [
  { name: 'Midnight Cosmic', value: '#0c0714', preview: '#0c0714' },
  { name: 'Warm Terracotta', value: '#d6512b', preview: '#d6512b' },
  { name: 'Velvet Wine', value: '#2e091d', preview: '#2e091d' },
  { name: 'Starry Navy', value: '#0a192f', preview: '#0a192f' },
  { name: 'Antique Parchment', value: '#29221b', preview: '#29221b' },
  { name: 'Emerald Forest', value: '#092318', preview: '#092318' },
  { name: 'Rose Gold Glow', value: '#381628', preview: '#381628' },
  { name: 'Charcoal Minimal', value: '#141416', preview: '#141416' },
];

export const BackgroundCustomizerTab: React.FC<BackgroundCustomizerTabProps> = ({
  config,
  onUpdateConfig,
  currentScene,
  onJumpScene,
}) => {
  const handleImageUpload = async (key: keyof SiteConfig, file: File) => {
    try {
      const optimizedUrl = await compressImageFile(file, 1600, 1600, 0.85);
      onUpdateConfig({ ...config, [key]: optimizedUrl });
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdateConfig({ ...config, [key]: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const pages: {
    id: Scene;
    name: string;
    key: keyof SiteConfig;
    description: string;
  }[] = [
    {
      id: 'calendar',
      name: '1. Retro Calendar (First Page)',
      key: 'calendarBackground',
      description: 'Defaults to the retro comic orange background',
    },
    {
      id: 'letter',
      name: '2. Envelope & Letter',
      key: 'letterBackground',
      description: 'Defaults to deep celestial starfield',
    },
    {
      id: 'intro',
      name: '3. Birthday Cake & Candles',
      key: 'cakeBackground',
      description: 'Defaults to midnight starfield with glowing candle flames',
    },
    {
      id: 'message',
      name: '4. Birthday Greeting Card',
      key: 'messageBackground',
      description: 'The background behind the interactive birthday card',
    },
    {
      id: 'playlist',
      name: '5. Spotify Mixtape & Playlist',
      key: 'playlistBackground',
      description: 'The musical scene with the embedded Spotify player',
    },
    {
      id: 'gallery',
      name: '6. Museum Art Gallery',
      key: 'galleryBackground',
      description: 'The museum wall behind framed memory paintings and curtains',
    },
  ];

  return (
    <div className="space-y-6 text-sm">
      {/* ================= GLOBAL BACKGROUND SECTION ================= */}
      <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Palette size={13} />
              <span>Global Background (All Pages)</span>
            </h4>
            <p className="text-[11px] text-white/60">
              Apply a single custom wallpaper or color across every page of the site
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
          {/* Current Global Preview */}
          <div className="relative w-24 h-16 rounded-lg border border-white/20 overflow-hidden bg-black/40 shrink-0 flex items-center justify-center">
            {config.globalBackground ? (
              config.globalBackground.startsWith('data:') || config.globalBackground.startsWith('http') || config.globalBackground.startsWith('/') ? (
                <img
                  src={config.globalBackground}
                  alt="Global background"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{ background: config.globalBackground }}
                />
              )
            ) : (
              <span className="text-[10px] text-white/40 text-center px-1">Default Themes</span>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground font-semibold rounded-lg text-xs cursor-pointer hover:opacity-90 shadow transition">
                <Upload size={13} />
                <span>Upload Wallpaper</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImageUpload('globalBackground', f);
                  }}
                />
              </label>

              {config.globalBackground && (
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ ...config, globalBackground: '' })}
                  className="text-xs text-red-400 hover:text-red-300 underline cursor-pointer"
                >
                  Clear Global
                </button>
              )}
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] text-white/50">Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_COLORS.slice(0, 5).map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => onUpdateConfig({ ...config, globalBackground: preset.value })}
                    title={preset.name}
                    className="w-5 h-5 rounded-full border border-white/30 hover:scale-110 transition cursor-pointer"
                    style={{ background: preset.preview }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Darkness Contrast Slider */}
        <div className="pt-3 border-t border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/70 flex items-center gap-1">
              <Sliders size={12} />
              <span>Background Dimming / Contrast Overlay:</span>
            </span>
            <span className="font-mono text-primary font-bold">
              {config.backgroundOverlayOpacity ?? 35}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="85"
            step="5"
            value={config.backgroundOverlayOpacity ?? 35}
            onChange={(e) =>
              onUpdateConfig({
                ...config,
                backgroundOverlayOpacity: parseInt(e.target.value) || 35,
              })
            }
            className="w-full accent-primary cursor-pointer"
          />
          <p className="text-[10px] text-white/50">
            Adjust to keep cards, letters, and candles easy to read over bright photos.
          </p>
        </div>
      </div>

      {/* ================= PAGE-BY-PAGE BACKGROUND CARDS ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">
            Individual Page Backgrounds
          </h4>
          <span className="text-[11px] text-white/50">Overrides global background</span>
        </div>

        {pages.map((p) => {
          const currentBg = config[p.key] as string | undefined;
          const isCurrentScene = currentScene === p.id;

          return (
            <div
              key={p.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isCurrentScene
                  ? 'bg-primary/10 border-primary/40 ring-1 ring-primary/20'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h5 className="text-xs font-bold text-white">{p.name}</h5>
                  {isCurrentScene && (
                    <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-mono">
                      Viewing now
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onJumpScene(p.id)}
                  className="text-[11px] text-primary/80 hover:text-primary transition underline cursor-pointer"
                >
                  Jump here →
                </button>
              </div>

              <p className="text-[11px] text-white/50 mb-3">{p.description}</p>

              {/* Background Picker Row */}
              <div className="flex items-center gap-3">
                {/* Thumbnail Preview */}
                <div className="relative w-20 h-14 rounded-lg border border-white/20 overflow-hidden bg-black/40 shrink-0 flex items-center justify-center">
                  {currentBg ? (
                    currentBg.startsWith('data:') || currentBg.startsWith('http') || currentBg.startsWith('/') ? (
                      <img
                        src={currentBg}
                        alt={`${p.name} background`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{ background: currentBg }}
                      />
                    )
                  ) : (
                    <span className="text-[9px] text-white/40 text-center px-1">Original Theme</span>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Upload Custom Image Button */}
                    <label className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs cursor-pointer transition">
                      <Upload size={12} />
                      <span>{currentBg ? 'Change Image' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleImageUpload(p.key, f);
                        }}
                      />
                    </label>

                    {/* Custom Color Input */}
                    <label className="flex items-center gap-1 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs cursor-pointer transition">
                      <Palette size={12} />
                      <span>Pick Color</span>
                      <input
                        type="color"
                        value={currentBg?.startsWith('#') ? currentBg : '#121212'}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, [p.key]: e.target.value })
                        }
                        className="w-4 h-4 rounded cursor-pointer border-0 bg-transparent ml-1"
                      />
                    </label>

                    {/* Reset Button */}
                    {currentBg && (
                      <button
                        type="button"
                        onClick={() => onUpdateConfig({ ...config, [p.key]: '' })}
                        className="text-[11px] text-red-400 hover:text-red-300 underline cursor-pointer ml-1"
                      >
                        Reset to default
                      </button>
                    )}
                  </div>

                  {/* Preset Swatches */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-white/40 mr-1">Presets:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_COLORS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => onUpdateConfig({ ...config, [p.key]: preset.value })}
                          title={preset.name}
                          className={`w-4 h-4 rounded-full border transition cursor-pointer ${
                            currentBg === preset.value
                              ? 'border-primary ring-2 ring-primary/40 scale-110'
                              : 'border-white/30 hover:scale-110'
                          }`}
                          style={{ background: preset.preview }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

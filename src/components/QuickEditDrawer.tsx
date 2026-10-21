import React, { useState, useRef } from 'react';
import {
  Settings,
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  Upload,
  Copy,
  Check,
  Sparkles,
  ChevronRight,
  Eye,
  Plus,
  Trash2,
  Music,
  Share2,
  Save,
  Smartphone,
  Ticket,
} from 'lucide-react';
import { Scene, SiteConfig } from '../types';
import { sounds } from '../utils/audio';
import { DoodleIllustration } from './DoodleIllustration';
import { compressImageFile } from '../utils/imageOptimizer';
import { BackgroundCustomizerTab } from './BackgroundCustomizerTab';
import { saveConfigToProjectFiles, exportConfigToShareUrl } from '../utils/storage';

interface QuickEditDrawerProps {
  config: SiteConfig;
  onUpdateConfig: (newConfig: SiteConfig) => void;
  onResetDefaults: () => void;
  currentScene: Scene;
  onJumpScene: (scene: Scene) => void;
}

export const QuickEditDrawer: React.FC<QuickEditDrawerProps> = ({
  config,
  onUpdateConfig,
  onResetDefaults,
  currentScene,
  onJumpScene,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'memories' | 'backgrounds'>('content');
  const [copied, setCopied] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(sounds.getIsMusicPlaying());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingMemIndex, setEditingMemIndex] = useState<number | null>(null);

  const [isSavingToFiles, setIsSavingToFiles] = useState(false);
  const [saveToFilesSuccess, setSaveToFilesSuccess] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  const toggleMusic = () => {
    const next = sounds.toggleAmbientMusic((p) => setIsMusicOn(p));
    setIsMusicOn(next);
  };

  const handleSaveToFiles = async () => {
    setIsSavingToFiles(true);
    setSaveToFilesSuccess(false);
    const success = await saveConfigToProjectFiles(config);
    setIsSavingToFiles(false);
    if (success) {
      setSaveToFilesSuccess(true);
      setTimeout(() => setSaveToFilesSuccess(false), 3500);
    }
  };

  const handleCopyShareLink = () => {
    const shareUrl = exportConfigToShareUrl(config);
    navigator.clipboard.writeText(shareUrl);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 3000);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await compressImageFile(file);
      const updated = [...config.memories];
      updated[index] = { ...updated[index], src: dataUrl };
      onUpdateConfig({ ...config, memories: updated });
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const updated = [...config.memories];
        updated[index] = { ...updated[index], src: dataUrl };
        onUpdateConfig({ ...config, memories: updated });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMemory = () => {
    const newId = `mem-${Date.now()}`;
    const newMemory = {
      id: newId,
      src: '/photos/photo1.png',
      caption: `Memory ${config.memories.length + 1}`,
      description: 'Write a special memory note here.',
    };
    onUpdateConfig({
      ...config,
      memories: [...config.memories, newMemory],
    });
  };

  const handleDeleteMemory = (index: number) => {
    if (config.memories.length <= 1) return;
    const updated = config.memories.filter((_, i) => i !== index);
    onUpdateConfig({ ...config, memories: updated });
  };

  return (
    <>
      {/* Floating Fast-Edit Trigger & Quick Scene Bar */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        {/* Quick Scene Pills */}
        <div className="hidden sm:flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs shadow-xl">
          <span className="text-white/40 mr-1 flex items-center gap-1 font-mono">
            <Eye size={12} /> Test:
          </span>
          <button
            onClick={() => onJumpScene('calendar')}
            className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
              currentScene === 'calendar'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => onJumpScene('letter')}
            className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
              currentScene === 'letter'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Letter
          </button>
          <button
            onClick={() => onJumpScene('intro')}
            className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
              currentScene === 'intro'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Cake
          </button>
          <button
            onClick={() => onJumpScene('message')}
            className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
              currentScene === 'message'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Message
          </button>
          <button
            onClick={() => onJumpScene('playlist')}
            className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
              currentScene === 'playlist'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Playlist
          </button>
          <button
            onClick={() => onJumpScene('voucher')}
            className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
              currentScene === 'voucher'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Voucher
          </button>
          <button
            onClick={() => onJumpScene('gallery')}
            className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
              currentScene === 'gallery'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Gallery
          </button>
        </div>

        {/* Ambient Music Button */}
        <button
          onClick={toggleMusic}
          title={isMusicOn ? 'Mute Music' : 'Play Music Box'}
          aria-label="Toggle ambient music"
          className={`p-2.5 rounded-full backdrop-blur-md border shadow-lg transition cursor-pointer ${
            isMusicOn
              ? 'bg-primary text-primary-foreground border-primary/50 ring-2 ring-primary/30'
              : 'bg-black/60 text-white/80 border-white/15 hover:bg-black/80 hover:text-white'
          }`}
        >
          {isMusicOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        {/* Edit Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-primary text-primary-foreground font-medium text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer border border-primary/40"
        >
          <Settings size={15} />
          <span>Edit Site Fast</span>
        </button>
      </div>

      {/* Editor Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg h-full bg-[#161224] text-white flex flex-col border-l border-white/15 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#1f1933]">
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary" size={18} />
                <div>
                  <h3 className="font-display italic text-base sm:text-lg font-bold">Fast Site Customizer</h3>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <Check size={11} /> Saved automatically to device
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Scene Selector at Top of Drawer */}
            <div className="px-6 py-2.5 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs">
              <span className="text-white/60">Jump to scene:</span>
              <div className="flex flex-wrap gap-1">
                {([
                  { id: 'calendar', label: 'Calendar' },
                  { id: 'letter', label: 'Letter' },
                  { id: 'intro', label: 'Cake' },
                  { id: 'message', label: 'Card' },
                  { id: 'playlist', label: 'Playlist' },
                  { id: 'voucher', label: 'Voucher' },
                  { id: 'gallery', label: 'Gallery' },
                ] as { id: Scene; label: string }[]).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onJumpScene(s.id)}
                    className={`px-2 py-0.5 rounded text-[11px] transition cursor-pointer ${
                      currentScene === s.id
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 px-6 pt-2 gap-4 text-xs font-medium">
              <button
                onClick={() => setActiveTab('content')}
                className={`pb-2.5 border-b-2 transition cursor-pointer ${
                  activeTab === 'content'
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                Texts &amp; Flows
              </button>
              <button
                onClick={() => setActiveTab('memories')}
                className={`pb-2.5 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'memories'
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                Museum Photos
                <span className="bg-primary/20 text-primary px-1.5 py-0.2 rounded-full text-[10px]">
                  {config.memories.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('backgrounds')}
                className={`pb-2.5 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'backgrounds'
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                <span>🎨 Backgrounds</span>
              </button>
            </div>

            {/* Scrollable Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
              {activeTab === 'content' && (
                <>
                  {/* First Page: Retro Calendar */}
                  <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">
                      0. First Page: Retro Calendar (October 26)
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-white/70 mb-1">Month Heading</label>
                        <input
                          type="text"
                          value={config.calendarMonthName ?? 'OCTOBER'}
                          onChange={(e) =>
                            onUpdateConfig({ ...config, calendarMonthName: e.target.value })
                          }
                          className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none uppercase font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/70 mb-1">Target Date (Click to continue)</label>
                        <input
                          type="number"
                          min={1}
                          max={31}
                          value={config.calendarTargetDay ?? 26}
                          onChange={(e) =>
                            onUpdateConfig({ ...config, calendarTargetDay: parseInt(e.target.value) || 26 })
                          }
                          className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 mb-1">Top Prompt Hint</label>
                      <input
                        type="text"
                        value={config.calendarSubtitle ?? 'Can you find your day?'}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, calendarSubtitle: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  {/* Recipient info */}
                  <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">
                      1. Recipient & Envelope
                    </h4>
                    <div>
                      <label className="block text-xs text-white/70 mb-1">Recipient Name</label>
                      <input
                        type="text"
                        value={config.recipientName}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, recipientName: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 mb-1">Letter Top Subtitle</label>
                      <input
                        type="text"
                        value={config.letterSubtitle}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, letterSubtitle: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 mb-1">
                        Inside Envelope Teaser
                      </label>
                      <input
                        type="text"
                        value={config.letterTeaser}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, letterTeaser: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none"
                      />
                    </div>

                    {/* Envelope Graphic / Picture Customization */}
                    <div className="pt-2 border-t border-white/10">
                      <label className="block text-xs text-white/70 mb-1.5">Envelope Graphic / Picture</label>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 rounded border border-white/20 overflow-hidden bg-black/40 shrink-0 flex items-center justify-center p-1">
                          <img
                            src={config.envelopeImage || '/assets/envelope.png'}
                            alt="Envelope preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs cursor-pointer transition">
                            <Upload size={13} />
                            <span>{config.envelopeImage && config.envelopeImage !== '/assets/envelope.png' ? 'Change Envelope' : 'Upload Custom Envelope'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  const dataUrl = await compressImageFile(file);
                                  onUpdateConfig({ ...config, envelopeImage: dataUrl });
                                } catch {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    const dataUrl = event.target?.result as string;
                                    onUpdateConfig({ ...config, envelopeImage: dataUrl });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          {config.envelopeImage && config.envelopeImage !== '/assets/envelope.png' && (
                            <button
                              type="button"
                              onClick={() => onUpdateConfig({ ...config, envelopeImage: '/assets/envelope.png' })}
                              className="text-[10px] text-white/50 hover:text-white transition text-left underline cursor-pointer"
                            >
                              Reset to lace envelope
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cake & Candles */}
                  <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">
                      2. Cake & Candle Wishes
                    </h4>
                    <div>
                      <label className="block text-xs text-white/70 mb-1">Heading</label>
                      <input
                        type="text"
                        value={config.cakeHeading}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, cakeHeading: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 mb-1">Candle Prompt</label>
                      <input
                        type="text"
                        value={config.cakeSubtext}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, cakeSubtext: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-white/70 mb-1">Wish Made Text</label>
                        <input
                          type="text"
                          value={config.cakeWishMadeText}
                          onChange={(e) =>
                            onUpdateConfig({ ...config, cakeWishMadeText: e.target.value })
                          }
                          className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/70 mb-1">Wish Subtext</label>
                        <input
                          type="text"
                          value={config.cakeWishSubtext}
                          onChange={(e) =>
                            onUpdateConfig({ ...config, cakeWishSubtext: e.target.value })
                          }
                          className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none"
                        />
                      </div>
                    </div>

                    {/* Pre-cake 7s Intermission Settings */}
                    <div className="pt-3 border-t border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-white">Pre-Cake Intermission Doodle</p>
                          <p className="text-[11px] text-white/60">Shows the 'me &amp; you' doodle before the cake appears</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.showPreCakeScene ?? true}
                            onChange={(e) =>
                              onUpdateConfig({ ...config, showPreCakeScene: e.target.checked })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      {(config.showPreCakeScene ?? true) && (
                        <div className="space-y-3 bg-black/30 p-3 rounded-lg border border-white/10">
                          <div className="flex items-center justify-between">
                            <label className="text-xs text-white/80">Wait duration (seconds):</label>
                            <input
                              type="number"
                              min={1}
                              max={30}
                              value={config.preCakeDurationSeconds ?? 5}
                              onChange={(e) =>
                                onUpdateConfig({
                                  ...config,
                                  preCakeDurationSeconds: Math.max(1, parseInt(e.target.value) || 5),
                                })
                              }
                              className="w-20 bg-black/50 border border-white/20 rounded px-2 py-1 text-xs text-white text-center focus:border-primary outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-white/70 mb-1.5">
                              Doodle Illustration:
                            </label>
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-10 rounded border border-white/20 overflow-hidden bg-white shrink-0 flex items-center justify-center">
                                {config.preCakeImage ? (
                                  <img
                                    src={config.preCakeImage}
                                    alt="doodle preview"
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <DoodleIllustration className="w-full h-full scale-125" />
                                )}
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs cursor-pointer transition">
                                  <Upload size={13} />
                                  <span>{config.preCakeImage ? 'Replace PNG' : 'Upload PNG'}</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      try {
                                        const dataUrl = await compressImageFile(file);
                                        onUpdateConfig({ ...config, preCakeImage: dataUrl });
                                      } catch {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                          const dataUrl = event.target?.result as string;
                                          onUpdateConfig({ ...config, preCakeImage: dataUrl });
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </label>
                                {config.preCakeImage && (
                                  <button
                                    onClick={() => onUpdateConfig({ ...config, preCakeImage: '' })}
                                    className="text-[10px] text-white/50 hover:text-white transition text-left underline"
                                  >
                                    Use original doodle
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] text-white/70 mb-1.5">
                              Entrance Sound Effect:
                            </label>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => sounds.playCelebrationFanfare(config.celebrationSound)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground rounded text-xs transition cursor-pointer font-medium"
                              >
                                <Volume2 size={13} />
                                <span>▶ Test Sound</span>
                              </button>

                              <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs cursor-pointer transition">
                                <Upload size={13} />
                                <span>{config.celebrationSound ? 'Swap Audio' : 'Upload Audio (.mp3/.wav)'}</span>
                                <input
                                  type="file"
                                  accept="audio/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const dataUrl = event.target?.result as string;
                                      onUpdateConfig({ ...config, celebrationSound: dataUrl });
                                      sounds.playCelebrationFanfare(dataUrl);
                                    };
                                    reader.readAsDataURL(file);
                                  }}
                                />
                              </label>

                              {config.celebrationSound && (
                                <button
                                  type="button"
                                  onClick={() => onUpdateConfig({ ...config, celebrationSound: '' })}
                                  className="text-[10px] text-white/50 hover:text-white underline cursor-pointer"
                                >
                                  Reset
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Birthday Message */}
                  <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">
                      3. Birthday Greeting Card (Inside Spread)
                    </h4>

                    {/* Left Page Inscription & Photo */}
                    <div className="space-y-3 bg-black/30 p-3 rounded-lg border border-white/10">
                      <p className="text-xs font-semibold text-white">Left Page Inscription &amp; Photo</p>
                      
                      <div>
                        <label className="block text-[11px] text-white/70 mb-1">Left Page Heading</label>
                        <input
                          type="text"
                          value={config.cardLeftHeading ?? 'For someone truly wonderful.'}
                          onChange={(e) =>
                            onUpdateConfig({ ...config, cardLeftHeading: e.target.value })
                          }
                          className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-white text-xs focus:border-primary outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-white/70 mb-1">Left Page Message</label>
                        <textarea
                          rows={2}
                          value={config.cardLeftMessage ?? 'May your year ahead be as bright, radiant, and full of joy as you make the lives of everyone around you.'}
                          onChange={(e) =>
                            onUpdateConfig({ ...config, cardLeftMessage: e.target.value })
                          }
                          className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-white text-xs focus:border-primary outline-none font-lora italic"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-white/70 mb-1.5">Photo Under Text</label>
                        <div className="flex items-center gap-3">
                          {config.cardLeftImage ? (
                            <div className="relative w-16 h-12 rounded border border-white/20 overflow-hidden bg-black/40 shrink-0">
                              <img
                                src={config.cardLeftImage}
                                alt="Left page preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-12 rounded border border-dashed border-white/20 bg-black/20 shrink-0 flex items-center justify-center text-[10px] text-white/40">
                              No photo
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs cursor-pointer transition">
                              <Upload size={13} />
                              <span>{config.cardLeftImage ? 'Change Photo' : 'Upload Photo'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  try {
                                    const optimized = await compressImageFile(file);
                                    onUpdateConfig({ ...config, cardLeftImage: optimized });
                                  } catch {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const dataUrl = event.target?.result as string;
                                      onUpdateConfig({ ...config, cardLeftImage: dataUrl });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                            {config.cardLeftImage && (
                              <button
                                type="button"
                                onClick={() => onUpdateConfig({ ...config, cardLeftImage: '' })}
                                className="text-[11px] text-red-400 hover:text-red-300 underline cursor-pointer"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Page Main Personal Letter */}
                    <div>
                      <label className="block text-xs text-white/70 mb-1">Right Page Written Letter</label>
                      <textarea
                        rows={4}
                        value={config.messageText}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, messageText: e.target.value })
                        }
                        placeholder="Write your personal birthday wishes and note here..."
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none font-lora italic"
                      />
                    </div>

                    {/* Font & Typography Settings to prevent excessive scrolling */}
                    <div className="space-y-3 pt-2 border-t border-white/10">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs text-white/80 font-medium">Font Style</label>
                          <span className="text-[10px] text-primary/80">Lora &amp; Outfit prevent scrolling</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'lora', label: 'Lora (Romantic Serif)', desc: 'Elegant & literary' },
                            { id: 'caveat', label: 'Caveat (Handwritten)', desc: 'Personal note ink' },
                            { id: 'outfit', label: 'Outfit (Clean Sans)', desc: 'Modern & minimal' },
                            { id: 'fraunces', label: 'Fraunces (Classic)', desc: 'Original bold display' },
                          ].map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => onUpdateConfig({ ...config, messageFont: f.id as any })}
                              className={`p-2 rounded-lg border text-left text-xs transition cursor-pointer ${
                                (config.messageFont || 'lora') === f.id
                                  ? 'border-primary bg-primary/20 text-white font-medium ring-1 ring-primary/40'
                                  : 'border-white/10 bg-black/30 text-white/70 hover:border-white/20'
                              }`}
                            >
                              <div className="font-semibold">{f.label}</div>
                              <div className="text-[10px] text-white/40">{f.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-white/70 mb-1">Reading Size</label>
                          <select
                            value={config.messageFontSize || 'lg'}
                            onChange={(e) =>
                              onUpdateConfig({ ...config, messageFontSize: e.target.value as any })
                            }
                            className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-primary outline-none cursor-pointer"
                          >
                            <option value="sm">Compact (Small)</option>
                            <option value="base">Comfortable (Standard)</option>
                            <option value="lg">Elegant (Large)</option>
                            <option value="xl">Display (Extra Large)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-white/70 mb-1">Letter Card Style</label>
                          <select
                            value={config.messageCardStyle || 'typewriter'}
                            onChange={(e) =>
                              onUpdateConfig({ ...config, messageCardStyle: e.target.value as any })
                            }
                            className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-primary outline-none cursor-pointer"
                          >
                            <option value="typewriter">Vintage Typewriter (refe.png)</option>
                            <option value="frosted">Frosted Glass (Contained)</option>
                            <option value="stationery">Stationery Parchment</option>
                            <option value="minimal">Minimal Floating</option>
                          </select>
                        </div>
                      </div>

                      {/* Typewriter Custom Background Image Uploader */}
                      {(config.messageCardStyle || 'typewriter') === 'typewriter' && (
                        <div className="mt-3 p-3 bg-primary/10 border border-primary/30 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                                <Upload size={13} className="text-primary" />
                                <span>Typewriter Background Image</span>
                              </p>
                              <p className="text-[11px] text-white/60">Attach your exact refe.png image here</p>
                            </div>
                            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground font-semibold rounded-lg text-xs cursor-pointer hover:opacity-90 shadow transition">
                              <Upload size={13} />
                              <span>Upload refe.png</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    const dataUrl = event.target?.result as string;
                                    onUpdateConfig({ ...config, messageBackgroundImage: dataUrl });
                                  };
                                  reader.readAsDataURL(file);
                                }}
                              />
                            </label>
                          </div>
                          {config.messageBackgroundImage && config.messageBackgroundImage !== '/assets/typewriter-letter.jpg' && (
                            <div className="flex items-center justify-between text-[11px] text-white/50 pt-1 border-t border-white/10">
                              <span className="text-emerald-400">✓ Custom refe.png image loaded</span>
                              <button
                                type="button"
                                onClick={() => onUpdateConfig({ ...config, messageBackgroundImage: '/assets/typewriter-letter.jpg' })}
                                className="text-white/60 hover:text-white underline cursor-pointer"
                              >
                                Reset to default
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs text-white/70 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={config.messageButtonText}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, messageButtonText: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  {/* 4. Spotify Mixtape & Playlist */}
                  <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                        <Music size={13} />
                        <span>4. Spotify Playlist (After Birthday Card)</span>
                      </h4>
                    </div>

                    <div>
                      <label className="block text-xs text-white/70 mb-1">Playlist Title</label>
                      <input
                        type="text"
                        value={config.playlistTitle ?? 'A Soundtrack For You'}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, playlistTitle: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-white/70 mb-1">Sentimental Subtitle</label>
                      <textarea
                        rows={2}
                        value={config.playlistSubtitle ?? 'Songs that remind me of you, and melodies I hope you love ✨'}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, playlistSubtitle: e.target.value })
                        }
                        placeholder="Write a sweet note about why these songs remind you of him..."
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-white text-xs focus:border-primary outline-none font-lora italic"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-white/70 mb-1">Spotify Playlist or Track Link</label>
                      <input
                        type="text"
                        value={config.playlistSpotifyUrl ?? 'https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6'}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, playlistSpotifyUrl: e.target.value })
                        }
                        placeholder="https://open.spotify.com/playlist/..."
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-xs font-mono focus:border-primary outline-none"
                      />
                      <p className="mt-1 text-[11px] text-white/50">
                        Copy any playlist, album, or song link from Spotify and paste it here. It will embed automatically!
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs text-white/70 mb-1">Button to Next Page</label>
                      <input
                        type="text"
                        value={config.playlistButtonText ?? 'Continue to Birthday Voucher →'}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, playlistButtonText: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  {/* 5. Roblox VIP Birthday Voucher */}
                  <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                        <Ticket size={13} />
                        <span>5. Roblox VIP Birthday Voucher (After Playlist)</span>
                      </h4>
                      {config.voucherClaimed && (
                        <button
                          type="button"
                          onClick={() => onUpdateConfig({ ...config, voucherClaimed: false })}
                          className="text-[11px] text-amber-400 hover:text-amber-300 underline cursor-pointer"
                        >
                          Reset Claimed Status
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs text-white/70 mb-1">Voucher Main Title</label>
                      <input
                        type="text"
                        value={config.voucherTitle ?? 'One Amazing Roblox Session'}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, voucherTitle: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-white/70 mb-1">Subtitle / Conditions</label>
                      <textarea
                        rows={2}
                        value={config.voucherSubtitle ?? 'With No Losing Connection Voucher\nredeemable anytime'}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, voucherSubtitle: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-white text-xs focus:border-primary outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-white/70 mb-1">Ticket Main Text</label>
                      <textarea
                        rows={2}
                        value={config.voucherMainText ?? "this voucher let's you play roblox with\nthe most amazing and talented dalal!"}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, voucherMainText: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-white text-xs focus:border-primary outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-white/70 mb-1">Game Choice &amp; Rules Note</label>
                      <textarea
                        rows={3}
                        value={config.voucherGameText ?? 'game: of your choosing\n(cuz I made this whole ass voucher\nYOU LOOK FOR THE DAMN GAME)'}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, voucherGameText: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-white text-xs focus:border-primary outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-white/70 mb-1">Extra Rewards Line</label>
                      <input
                        type="text"
                        value={config.voucherExtraRewardsText ?? 'extra rewards: unlimited compliant\nand'}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, voucherExtraRewardsText: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-xs focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  {/* Museum Gallery Titles */}
                  <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">
                      6. Museum Gallery Titles & Epilogue
                    </h4>
                    <div>
                      <label className="block text-xs text-white/70 mb-1">Gallery Main Title</label>
                      <input
                        type="text"
                        value={config.galleryTitle}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, galleryTitle: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 mb-1">Gallery Subtitle</label>
                      <input
                        type="text"
                        value={config.gallerySubtitle}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, gallerySubtitle: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 mb-1">Closing Footer Message</label>
                      <input
                        type="text"
                        value={config.galleryFooterText}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, galleryFooterText: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none"
                      />
                    </div>

                    {/* Museum Velvet Curtains Setting */}
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-white">Velvet Wall Curtains</p>
                          <p className="text-[11px] text-white/60">Draped velvet theater curtains framing the gallery wall</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.showGalleryCurtains ?? true}
                            onChange={(e) =>
                              onUpdateConfig({ ...config, showGalleryCurtains: e.target.checked })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      {(config.showGalleryCurtains ?? true) && (
                        <div className="flex items-center gap-2 pt-1">
                          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs cursor-pointer transition">
                            <Upload size={13} />
                            <span>{config.galleryCurtainsImage ? 'Swap Curtains PNG' : 'Upload Custom Curtains PNG'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  const dataUrl = await compressImageFile(file);
                                  onUpdateConfig({ ...config, galleryCurtainsImage: dataUrl });
                                } catch {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    const dataUrl = event.target?.result as string;
                                    onUpdateConfig({ ...config, galleryCurtainsImage: dataUrl });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          {config.galleryCurtainsImage && (
                            <button
                              type="button"
                              onClick={() => onUpdateConfig({ ...config, galleryCurtainsImage: '' })}
                              className="text-[10px] text-white/50 hover:text-white underline cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'memories' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/70">
                      Edit photos, captions, and descriptions for the museum wall:
                    </p>
                    <button
                      onClick={handleAddMemory}
                      className="flex items-center gap-1 text-xs bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground px-3 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      <Plus size={14} /> Add Painting
                    </button>
                  </div>

                  {config.memories.map((mem, idx) => (
                    <div
                      key={mem.id || idx}
                      className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        {/* Thumbnail */}
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/20 shrink-0 bg-black/40">
                          <img
                            src={mem.src}
                            alt={mem.caption}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Title and file replacement */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-primary">Painting #{idx + 1}</span>
                            {config.memories.length > 1 && (
                              <button
                                onClick={() => handleDeleteMemory(idx)}
                                className="text-white/40 hover:text-red-400 p-1 transition cursor-pointer"
                                title="Delete painting"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            value={mem.caption}
                            onChange={(e) => {
                              const updated = [...config.memories];
                              updated[idx] = { ...updated[idx], caption: e.target.value };
                              onUpdateConfig({ ...config, memories: updated });
                            }}
                            className="mt-1 w-full bg-black/40 border border-white/15 rounded px-2 py-1 text-xs text-white focus:border-primary outline-none"
                            placeholder="Caption (e.g. Memory 1)"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-[11px] text-white/60 mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={mem.description}
                          onChange={(e) => {
                            const updated = [...config.memories];
                            updated[idx] = { ...updated[idx], description: e.target.value };
                            onUpdateConfig({ ...config, memories: updated });
                          }}
                          className="w-full bg-black/40 border border-white/15 rounded px-2.5 py-1.5 text-xs text-white focus:border-primary outline-none"
                          placeholder="What makes this memory special?"
                        />
                      </div>

                      {/* Photo source: URL or upload */}
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={mem.src.startsWith('data:') ? '[Uploaded Image]' : mem.src}
                          onChange={(e) => {
                            const updated = [...config.memories];
                            updated[idx] = { ...updated[idx], src: e.target.value };
                            onUpdateConfig({ ...config, memories: updated });
                          }}
                          placeholder="Image URL (/photos/photo1.png or https://...)"
                          className="flex-1 bg-black/40 border border-white/15 rounded px-2 py-1 text-[11px] text-white/80 focus:border-primary outline-none font-mono"
                        />
                        <label className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs cursor-pointer transition shrink-0">
                          <Upload size={12} />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, idx)}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Backgrounds Tab Content */}
              {activeTab === 'backgrounds' && (
                <BackgroundCustomizerTab
                  config={config}
                  onUpdateConfig={onUpdateConfig}
                  currentScene={currentScene}
                  onJumpScene={onJumpScene}
                />
              )}
            </div>

            {/* Sync Across Devices & GitHub */}
            <div className="px-6 py-3 bg-[#130f21] border-t border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-semibold text-white">
                <span className="flex items-center gap-1.5 text-primary">
                  <Share2 size={13} />
                  <span>Sync Across Devices &amp; GitHub</span>
                </span>
                {saveToFilesSuccess && (
                  <span className="text-[11px] text-emerald-400 font-mono animate-fade-in">
                    ✓ Saved to project source!
                  </span>
                )}
                {copiedShareLink && (
                  <span className="text-[11px] text-emerald-400 font-mono animate-fade-in">
                    ✓ Mobile link copied!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleSaveToFiles}
                  disabled={isSavingToFiles}
                  className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                  title="Writes your current edits into defaultData.ts so GitHub, InfinityFree, and all visitors see them"
                >
                  <Save size={13} />
                  <span>{isSavingToFiles ? 'Saving...' : 'Save to Project Files'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="px-3 py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
                  title="Copy a special link to open on your phone with all your edits"
                >
                  <Smartphone size={13} />
                  <span>Copy Link for Phone</span>
                </button>
              </div>
              <p className="text-[10px] text-white/50 leading-relaxed">
                <strong className="text-white/80">Save to Project Files:</strong> permanently commits your edits into the code so GitHub, your phone, and InfinityFree load them automatically.
              </p>
            </div>

            {/* Footer with Copy JSON and Reset */}
            <div className="px-6 py-4 border-t border-white/10 bg-[#1f1933] flex items-center justify-between text-xs">
              <button
                onClick={onResetDefaults}
                className="flex items-center gap-1.5 text-white/60 hover:text-red-300 transition cursor-pointer"
                title="Reset all settings to default Lovable clone"
              >
                <RotateCcw size={14} />
                <span>Reset to Original</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJSON}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied JSON!' : 'Copy Config'}</span>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

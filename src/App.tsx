/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Scene, SiteConfig } from './types';
import { DEFAULT_SITE_CONFIG } from './config/defaultData';
import { StarField } from './components/StarField';
import { CalendarScene } from './components/CalendarScene';
import { LetterScene } from './components/LetterScene';
import { CakeScene } from './components/CakeScene';
import { MessageScene } from './components/MessageScene';
import { PlaylistScene } from './components/PlaylistScene';
import { VoucherScene } from './components/VoucherScene';
import { GalleryScene } from './components/GalleryScene';
import { LightboxModal } from './components/LightboxModal';
import { QuickEditDrawer } from './components/QuickEditDrawer';

import { Check } from 'lucide-react';
import {
  saveSiteConfig,
  loadSiteConfig,
  getInitialLocalConfig,
  clearSiteConfig,
  importConfigFromUrl,
} from './utils/storage';

export default function App() {
  const [scene, setScene] = useState<Scene>('calendar');
  const [selectedMemoryIndex, setSelectedMemoryIndex] = useState<number | null>(null);
  const [showSyncBanner, setShowSyncBanner] = useState(false);

  // Initialize config with instant cache from localStorage + background hydrate from IndexedDB
  const [config, setConfig] = useState<SiteConfig>(() => {
    const saved = getInitialLocalConfig();
    if (saved) {
      return {
        ...DEFAULT_SITE_CONFIG,
        ...saved,
      };
    }
    return DEFAULT_SITE_CONFIG;
  });

  // Reconcile and hydrate data on startup
  useEffect(() => {
    // 1. Check if a mobile sync URL was opened
    const urlConfig = importConfigFromUrl();
    if (urlConfig) {
      const merged = { ...DEFAULT_SITE_CONFIG, ...urlConfig };
      setConfig(merged);
      saveSiteConfig(merged);
      setShowSyncBanner(true);
      setTimeout(() => setShowSyncBanner(false), 4500);
      return;
    }

    // 2. Otherwise hydrate from IndexedDB
    loadSiteConfig().then((stored) => {
      if (stored) {
        setConfig((prev) => ({
          ...DEFAULT_SITE_CONFIG,
          ...prev,
          ...stored,
        }));
      }
    });
  }, []);

  // Sync title with recipient
  useEffect(() => {
    document.title = `Happy Birthday ${config.recipientName || 'Zizou'}`;
  }, [config.recipientName]);

  const handleUpdateConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
    saveSiteConfig(newConfig);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all texts, wishes, and photos back to the original template?')) {
      setConfig(DEFAULT_SITE_CONFIG);
      clearSiteConfig();
    }
  };

  // Determine active background for the current scene (page-specific or global)
  const getSceneBackground = (currentScene: Scene): string => {
    switch (currentScene) {
      case 'calendar':
        return config.calendarBackground || config.globalBackground || '';
      case 'letter':
        return config.letterBackground || config.globalBackground || '';
      case 'intro':
        return config.cakeBackground || config.globalBackground || '';
      case 'message':
        return config.messageBackground || config.globalBackground || '';
      case 'playlist':
        return config.playlistBackground || config.globalBackground || '';
      case 'voucher':
        return config.voucherBackground || config.globalBackground || '';
      case 'gallery':
        return config.galleryBackground || config.globalBackground || '';
      default:
        return config.globalBackground || '';
    }
  };

  const activeBg = getSceneBackground(scene);
  const isImageBg = Boolean(
    activeBg &&
      (activeBg.startsWith('data:image') ||
        activeBg.startsWith('http://') ||
        activeBg.startsWith('https://') ||
        activeBg.startsWith('/') ||
        activeBg.includes('.png') ||
        activeBg.includes('.jpg') ||
        activeBg.includes('.webp') ||
        activeBg.includes('.svg'))
  );

  return (
    <main className="relative min-h-screen overflow-hidden text-foreground selection:bg-primary/30 selection:text-white">
      {/* Mobile / URL Sync Toast Notification */}
      {showSyncBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-2.5 rounded-full shadow-2xl text-xs sm:text-sm font-medium flex items-center gap-2 animate-bounce border border-emerald-400">
          <Check size={16} />
          <span>Settings successfully imported &amp; saved to this device!</span>
        </div>
      )}

      {/* Dynamic Background Layer */}
      {activeBg ? (
        <div className="fixed inset-0 z-0 pointer-events-none transition-all duration-700">
          {isImageBg ? (
            <img
              src={activeBg}
              alt="Custom background"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          ) : (
            <div
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ background: activeBg }}
            />
          )}
          {/* Subtle dimming overlay so text and UI are always 100% readable */}
          <div
            className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
            style={{ opacity: (config.backgroundOverlayOpacity ?? 35) / 100 }}
          />
        </div>
      ) : null}

      {/* Twinkling starfield for space/sky scenes (if no custom background or as subtle layer) */}
      {!activeBg && scene !== 'gallery' && scene !== 'calendar' && <StarField />}
      {activeBg && scene !== 'gallery' && (
        <div className="opacity-30 pointer-events-none fixed inset-0 z-0">
          <StarField />
        </div>
      )}

      {/* 0. First Page: Retro October Calendar Scene */}
      {scene === 'calendar' && (
        <CalendarScene
          recipientName={config.recipientName}
          targetDay={config.calendarTargetDay ?? 26}
          monthName={config.calendarMonthName ?? 'OCTOBER'}
          subtitle={config.calendarSubtitle ?? 'Can you find your day?'}
          calendarImage={config.calendarImage || '/assets/october-cat-calendar.png'}
          hasCustomBackground={Boolean(activeBg)}
          onContinue={() => setScene('letter')}
        />
      )}

      {/* 1. Letter / Envelope Scene */}
      {scene === 'letter' && (
        <LetterScene
          recipientName={config.recipientName}
          subtitle={config.letterSubtitle}
          teaser={config.letterTeaser}
          envelopeImage={config.envelopeImage || '/assets/envelope.png'}
          onOpen={() => setScene('intro')}
        />
      )}

      {/* 2. Birthday Cake with Interactive Candle Flames Scene */}
      {scene === 'intro' && (
        <CakeScene
          recipientName={config.recipientName}
          heading={config.cakeHeading}
          subtext={config.cakeSubtext}
          wishMadeText={config.cakeWishMadeText}
          wishSubtext={config.cakeWishSubtext}
          showPreCakeScene={config.showPreCakeScene ?? true}
          preCakeDurationSeconds={config.preCakeDurationSeconds ?? 5}
          preCakeImage={config.preCakeImage || ''}
          celebrationSound={config.celebrationSound || ''}
          onUpdatePreCakeImage={(img) => handleUpdateConfig({ ...config, preCakeImage: img })}
          onComplete={() => setScene('message')}
        />
      )}

      {/* 3. Birthday Note / Letter Scene */}
      {scene === 'message' && (
        <MessageScene
          messageText={config.messageText}
          buttonText={config.messageButtonText}
          recipientName={config.recipientName}
          font={config.messageFont || 'lora'}
          fontSize={config.messageFontSize || 'base'}
          cardLeftHeading={config.cardLeftHeading || 'For someone truly wonderful.'}
          cardLeftMessage={config.cardLeftMessage || 'May your year ahead be as bright, radiant, and full of joy as you make the lives of everyone around you.'}
          cardLeftImage={config.cardLeftImage || ''}
          onUpdateCardLeftImage={(img) => handleUpdateConfig({ ...config, cardLeftImage: img })}
          onContinue={() => setScene('playlist')}
          onBackToCake={() => setScene('intro')}
        />
      )}

      {/* 4. Spotify Playlist Scene (Right after the message) */}
      {scene === 'playlist' && (
        <PlaylistScene
          recipientName={config.recipientName}
          title={config.playlistTitle || 'A Soundtrack For You'}
          subtitle={config.playlistSubtitle || 'Songs that remind me of you, and melodies I hope you love ✨'}
          spotifyUrl={config.playlistSpotifyUrl || 'https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6'}
          buttonText={config.playlistButtonText || 'Continue to Birthday Voucher →'}
          onUpdateSpotifyUrl={(url) => handleUpdateConfig({ ...config, playlistSpotifyUrl: url })}
          onContinue={() => setScene('voucher')}
          onBackToCard={() => setScene('message')}
        />
      )}

      {/* 5. Roblox VIP Birthday Voucher Scene (After Playlist) */}
      {scene === 'voucher' && (
        <VoucherScene
          recipientName={config.recipientName}
          title={config.voucherTitle || 'One Amazing Roblox Session'}
          subtitle={config.voucherSubtitle || 'With No Losing Connection Voucher\nredeemable anytime'}
          badgeText={config.voucherBadgeText || 'VIP BIRTHDAY\nPASS'}
          validityText={config.voucherValidityText || 'valid\nforever'}
          mainText={config.voucherMainText || "this voucher let's you play roblox with\nthe most amazing and talented dalal!"}
          gameText={config.voucherGameText || 'game: of your choosing\n(cuz I made this whole ass voucher\nYOU LOOK FOR THE DAMN GAME)'}
          extraRewardsText={config.voucherExtraRewardsText || 'extra rewards: unlimited compliant\nand'}
          claimed={config.voucherClaimed ?? false}
          backgroundImage={config.voucherBackground || '/assets/voucher-page-bg.png'}
          hasCustomBackground={Boolean(activeBg)}
          onClaim={() => handleUpdateConfig({ ...config, voucherClaimed: true })}
          onContinue={() => setScene('gallery')}
          onReturn={() => setScene('playlist')}
        />
      )}

      {/* 6. Ornate Museum Art Gallery Scene */}
      {scene === 'gallery' && (
        <GalleryScene
          title={config.galleryTitle}
          subtitle={config.gallerySubtitle}
          footerText={config.galleryFooterText}
          memories={config.memories}
          showCurtains={config.showGalleryCurtains ?? true}
          curtainsImage={config.galleryCurtainsImage || ''}
          onSelectMemory={(index) => setSelectedMemoryIndex(index)}
          onBackToMessage={() => setScene('voucher')}
        />
      )}

      {/* Lightbox inspection modal for museum paintings */}
      {selectedMemoryIndex !== null && (
        <LightboxModal
          selectedIndex={selectedMemoryIndex}
          memories={config.memories}
          onClose={() => setSelectedMemoryIndex(null)}
          onNavigate={(newIndex) => setSelectedMemoryIndex(newIndex)}
        />
      )}

      {/* Fast Customizer & Quick Switcher floating controls */}
      <QuickEditDrawer
        config={config}
        onUpdateConfig={handleUpdateConfig}
        onResetDefaults={handleResetDefaults}
        currentScene={scene}
        onJumpScene={(s) => {
          setSelectedMemoryIndex(null);
          setScene(s);
        }}
      />
    </main>
  );
}

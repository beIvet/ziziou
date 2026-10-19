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
import { GalleryScene } from './components/GalleryScene';
import { LightboxModal } from './components/LightboxModal';
import { QuickEditDrawer } from './components/QuickEditDrawer';

const STORAGE_KEY = 'birthday_memory_bloom_config_v4';

export default function App() {
  const [scene, setScene] = useState<Scene>('calendar');
  const [selectedMemoryIndex, setSelectedMemoryIndex] = useState<number | null>(null);

  // Initialize config with localStorage persistence so the user's edits are never lost
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('birthday_memory_bloom_config_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SITE_CONFIG,
          ...parsed,
          messageCardStyle: 'typewriter',
          messageBackgroundImage: parsed.messageBackgroundImage || '/assets/typewriter-letter.jpg',
        };
      }
    } catch {
      // ignore
    }
    return {
      ...DEFAULT_SITE_CONFIG,
      messageCardStyle: 'typewriter',
      messageBackgroundImage: '/assets/typewriter-letter.jpg',
    };
  });

  // Sync title with recipient
  useEffect(() => {
    document.title = `Happy Birthday ${config.recipientName || 'Zizou'}`;
  }, [config.recipientName]);

  const handleUpdateConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    } catch {
      // ignore quota exceeded if huge images
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all texts, wishes, and photos back to the original template?')) {
      setConfig(DEFAULT_SITE_CONFIG);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden text-foreground selection:bg-primary/30 selection:text-white">
      {/* Twinkling starfield for space/sky scenes */}
      {scene !== 'gallery' && scene !== 'calendar' && <StarField />}

      {/* 0. First Page: Retro October Calendar Scene */}
      {scene === 'calendar' && (
        <CalendarScene
          recipientName={config.recipientName}
          targetDay={config.calendarTargetDay ?? 26}
          monthName={config.calendarMonthName ?? 'OCTOBER'}
          subtitle={config.calendarSubtitle ?? 'Find and tap the special birthday date to unlock your surprise'}
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
          onContinue={() => setScene('gallery')}
          onBackToCake={() => setScene('intro')}
        />
      )}

      {/* 4. Ornate Museum Art Gallery Scene */}
      {scene === 'gallery' && (
        <GalleryScene
          title={config.galleryTitle}
          subtitle={config.gallerySubtitle}
          footerText={config.galleryFooterText}
          memories={config.memories}
          showCurtains={config.showGalleryCurtains ?? true}
          curtainsImage={config.galleryCurtainsImage || ''}
          onSelectMemory={(index) => setSelectedMemoryIndex(index)}
          onBackToMessage={() => setScene('message')}
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

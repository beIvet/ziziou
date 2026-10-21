export type Scene = 'calendar' | 'letter' | 'intro' | 'message' | 'playlist' | 'voucher' | 'gallery';

export interface MemoryItem {
  id: string;
  src: string;
  caption: string;
  description: string;
}

export interface FrameConfig {
  src: string;
  width: string;
  ratio: string;
  hole: [number, number, number, number]; // [left, top, right, bottom] percentages
  round: boolean;
}

export interface SiteConfig {
  recipientName: string;
  letterSubtitle: string;
  letterTeaser: string;
  cakeHeading: string;
  cakeSubtext: string;
  cakeWishMadeText: string;
  cakeWishSubtext: string;
  messageText: string;
  messageButtonText: string;
  galleryTitle: string;
  gallerySubtitle: string;
  galleryFooterText: string;
  memories: MemoryItem[];
  // Pre-cake intermission
  showPreCakeScene?: boolean;
  preCakeDurationSeconds?: number;
  preCakeImage?: string;
  celebrationSound?: string;
  // Envelope & Letter customization
  envelopeImage?: string;
  envelopeStyle?: 'lace' | 'vintage' | 'minimal' | 'custom';
  // Message scene typography & layout
  messageFont?: 'lora' | 'fraunces' | 'caveat' | 'outfit';
  messageFontSize?: 'sm' | 'base' | 'lg' | 'xl';
  messageCardStyle?: 'typewriter' | 'stationery' | 'frosted' | 'minimal';
  messageBackgroundImage?: string;
  // Gallery museum curtains
  showGalleryCurtains?: boolean;
  galleryCurtainsImage?: string;
  // Birthday card left page customization
  cardLeftHeading?: string;
  cardLeftMessage?: string;
  cardLeftImage?: string;
  // First Page Calendar Scene
  calendarTargetDay?: number;
  calendarMonthName?: string;
  calendarSubtitle?: string;
  calendarImage?: string;
  // Spotify Playlist Scene
  playlistTitle?: string;
  playlistSubtitle?: string;
  playlistSpotifyUrl?: string;
  playlistButtonText?: string;
  // Custom Page Backgrounds (image dataUrl or CSS color/gradient)
  calendarBackground?: string;
  letterBackground?: string;
  cakeBackground?: string;
  messageBackground?: string;
  playlistBackground?: string;
  voucherBackground?: string;
  galleryBackground?: string;
  globalBackground?: string;
  backgroundOverlayOpacity?: number;
  // Voucher Scene (Roblox VIP Birthday Pass)
  voucherTitle?: string;
  voucherSubtitle?: string;
  voucherBadgeText?: string;
  voucherValidityText?: string;
  voucherMainText?: string;
  voucherGameText?: string;
  voucherExtraRewardsText?: string;
  voucherClaimed?: boolean;
}

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/audio';

interface VoucherSceneProps {
  recipientName: string;
  title?: string;
  subtitle?: string;
  badgeText?: string;
  validityText?: string;
  mainText?: string;
  gameText?: string;
  extraRewardsText?: string;
  claimed?: boolean;
  backgroundImage?: string;
  hasCustomBackground?: boolean;
  onClaim?: () => void;
  onContinue: () => void;
  onReturn: () => void;
}

export const VoucherScene: React.FC<VoucherSceneProps> = ({
  recipientName,
  title = 'One Amazing Roblox Session',
  subtitle = 'With No Losing Connection Voucher\nredeemable anytime',
  badgeText = 'VIP BIRTHDAY\nPASS',
  validityText = 'valid\nforever',
  mainText = "this voucher let's you play roblox with\nthe most amazing and talented dalal!",
  gameText = 'game: of your choosing\n(cuz I made this whole ass voucher\nYOU LOOK FOR THE DAMN GAME)',
  extraRewardsText = 'extra rewards: unlimited compliant\nand',
  claimed = false,
  backgroundImage = '/assets/voucher-page-bg.png',
  hasCustomBackground = false,
  onClaim,
  onContinue,
  onReturn,
}) => {
  const [isClaimed, setIsClaimed] = useState(claimed);

  const handleClaim = () => {
    if (isClaimed) return;
    setIsClaimed(true);
    sounds.playWishChime();
    sounds.playCelebrationFanfare();

    try {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ff4757', '#2ed573', '#ffa502', '#1e90ff', '#9b59b6'],
      });
    } catch {
      // ignore
    }

    if (onClaim) {
      onClaim();
    }
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none">
      {/* Background: Nyan Cat with Rainbow in Space */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={backgroundImage || '/assets/voucher-page-bg.png'}
          alt="Nyan Cat Rainbow Space"
          className="w-full h-full object-cover"
        />
        {/* Subtle dimming to ensure the card pops */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />
      </div>

      {/* Top Left Return Button (matching the original screenshot) */}
      <button
        onClick={onReturn}
        type="button"
        className="fixed top-6 left-6 z-30 px-5 py-2 rounded-xl bg-[#141d33]/90 hover:bg-[#1f2d4e] text-white/90 text-sm font-medium tracking-wide shadow-xl border border-white/15 backdrop-blur-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
      >
        <span>return</span>
      </button>

      {/* Floating Centered Voucher Container */}
      <div className="relative z-10 max-w-[430px] sm:max-w-[470px] w-full bg-[#c9c4d6]/95 backdrop-blur-sm rounded-[32px] p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/30 flex flex-col gap-4 text-[#2d1b4e] animate-rise">
        {/* Top Header: VIP Birthday Pass Badge & Valid Forever */}
        <div className="flex items-start justify-between">
          <div className="bg-[#aca1c4] px-4 py-2 rounded-xl shadow-sm border border-black/10">
            <p className="text-xs sm:text-sm font-black tracking-wider uppercase leading-tight text-[#2d1b4e]">
              {badgeText.split('\n').map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs sm:text-sm font-medium text-[#463665] leading-tight">
              {validityText.split('\n').map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Title and Subtitle */}
        <div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-[#2a1747] leading-snug">
            {title}
          </h2>
          <div className="text-xs sm:text-sm text-[#463665] font-medium mt-1 leading-snug">
            {subtitle.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>

        {/* ================= TICKET STUB GRAPHIC ================= */}
        <div className="relative w-full my-1 rounded-2xl overflow-hidden border-2 border-[#2b1848] bg-[#f9f7fc] shadow-md flex items-stretch">
          {/* Left Stub with textured hatched pattern */}
          <div className="w-[28%] bg-[#8b7ba8] border-r-2 border-dashed border-[#2b1848] flex flex-col items-center justify-center p-2 relative bg-[radial-gradient(#2b1848_1.5px,transparent_1.5px)] [background-size:6px_6px]">
            {/* Cutout notch top */}
            <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#c9c4d6] border-2 border-[#2b1848]" />
            {/* Cutout notch bottom */}
            <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-[#c9c4d6] border-2 border-[#2b1848]" />

            {/* Stub content */}
            <span className="font-mono text-[9px] font-bold text-white uppercase tracking-widest -rotate-90">
              NO. 1026
            </span>
          </div>

          {/* Right Ticket Body with text content */}
          <div className="flex-1 p-3.5 sm:p-4 text-left flex flex-col justify-between text-[#2b1848] relative">
            <div>
              <p className="text-xs sm:text-sm font-black leading-snug">
                {mainText}
              </p>

              <div className="mt-2 text-[10px] sm:text-[11px] leading-tight font-medium text-[#463665] space-y-1">
                {gameText.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>

            <p className="mt-2 text-[10px] sm:text-[11px] font-medium text-[#5a4c77] italic">
              {extraRewardsText}
            </p>

            {/* STAMP WHEN CLAIMED */}
            {isClaimed && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="rotate-[-12deg] border-4 border-red-600 text-red-600 bg-red-100/90 px-4 py-1.5 rounded-lg shadow-xl text-center uppercase tracking-widest font-black animate-scale-up">
                  <p className="text-base sm:text-lg leading-none font-display">✓ REDEEMED</p>
                  <p className="text-[9px] font-mono tracking-normal leading-tight mt-0.5 text-red-700">
                    NON-EXPIRING • VIP PASS
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Subtle Horizontal Divider */}
        <div className="w-full h-1.5 bg-[#b8b0c8] rounded-full my-0.5" />

        {/* Footer: Issued to + Claim Voucher Button */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="block text-[11px] text-[#5a4c77] font-medium leading-none mb-1">
              issued to:
            </span>
            <span className="font-display font-black text-xl sm:text-2xl text-[#2a1747] capitalize leading-none">
              {recipientName || 'zizou'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleClaim}
            disabled={isClaimed}
            className={`px-5 sm:px-6 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 shadow-md ${
              isClaimed
                ? 'bg-emerald-700 text-white cursor-default'
                : 'bg-[#676f82] hover:bg-[#525a6c] active:scale-95 text-white cursor-pointer hover:shadow-lg'
            }`}
          >
            {isClaimed ? '✓ claimed' : 'claim voucher'}
          </button>
        </div>

        {/* Continue Button to Museum Gallery after claiming */}
        {isClaimed && (
          <div className="pt-2 animate-fade-in flex justify-center">
            <button
              type="button"
              onClick={onContinue}
              className="w-full py-3 px-6 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl hover:opacity-95 transition-all cursor-pointer"
            >
              <span>Continue to the Museum Gallery</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Floating Continue to Gallery pill if not yet claimed but user wants to proceed */}
      {!isClaimed && (
        <button
          onClick={onContinue}
          className="mt-6 z-20 text-xs text-white/80 hover:text-white transition underline underline-offset-4 cursor-pointer drop-shadow-md"
        >
          Skip to Museum Gallery →
        </button>
      )}
    </section>
  );
};

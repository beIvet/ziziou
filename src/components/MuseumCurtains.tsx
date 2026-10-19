import React from 'react';

interface MuseumCurtainsProps {
  customImage?: string;
  className?: string;
}

export const MuseumCurtains: React.FC<MuseumCurtainsProps> = ({
  customImage,
  className = '',
}) => {
  // If user provided a custom uploaded curtain PNG (e.g. dwqsd.png)
  if (customImage) {
    return (
      <div
        className={`pointer-events-none absolute inset-0 w-full h-full z-10 overflow-hidden select-none ${className}`}
      >
        <img
          src={customImage}
          alt="Grand museum velvet curtains"
          className="w-full h-auto max-h-[85vh] object-cover sm:object-fill object-top drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
        />
      </div>
    );
  }

  // Pure SVG representation matching the user's uploaded velvet theatrical curtains
  return (
    <div
      className={`pointer-events-none absolute inset-0 w-full h-full z-10 overflow-hidden select-none ${className}`}
    >
      <svg
        viewBox="0 0 1600 700"
        preserveAspectRatio="xMidYMin slice"
        className="w-full h-auto min-h-[350px] max-h-[85vh] drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]"
        fill="none"
      >
        <defs>
          {/* Velvet Burgundy Gradients */}
          <linearGradient id="velvetLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a0e1c" />
            <stop offset="30%" stopColor="#781d34" />
            <stop offset="65%" stopColor="#551122" />
            <stop offset="100%" stopColor="#2b050d" />
          </linearGradient>

          <linearGradient id="velvetRight" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4a0e1c" />
            <stop offset="30%" stopColor="#781d34" />
            <stop offset="65%" stopColor="#551122" />
            <stop offset="100%" stopColor="#2b050d" />
          </linearGradient>

          <linearGradient id="velvetHighlight" x1="0%" y1="0%" x2="80%" y2="80%">
            <stop offset="0%" stopColor="#8d233e" />
            <stop offset="50%" stopColor="#5c1325" />
            <stop offset="100%" stopColor="#320610" />
          </linearGradient>

          {/* Gold Trim Gradient */}
          <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="30%" stopColor="#f7e089" />
            <stop offset="60%" stopColor="#c59b27" />
            <stop offset="100%" stopColor="#8a6b18" />
          </linearGradient>

          {/* Shadow Filter */}
          <filter id="curtainShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="10" dy="15" stdDeviation="12" floodColor="#000000" floodOpacity="0.85" />
          </filter>
        </defs>

        {/* ================= LEFT CORNER CURTAIN ================= */}
        <g id="left-curtain" filter="url(#curtainShadow)">
          {/* Main vertical curtain fold cascading down left edge */}
          <path
            d="M 0 0
               L 180 0
               C 160 120 120 280 80 420
               C 60 490 35 580 0 680
               Z"
            fill="url(#velvetLeft)"
          />
          <path
            d="M 30 0
               C 80 150 110 320 60 480
               C 40 540 20 600 0 670
               L 0 0 Z"
            fill="url(#velvetHighlight)"
            opacity="0.8"
          />

          {/* Top Swag 1 (Deepest drape) */}
          <path
            d="M 0 0
               C 60 120 150 220 280 180
               C 220 260 100 240 0 160
               Z"
            fill="url(#velvetLeft)"
          />

          {/* Top Swag 2 (Front dramatic curve toward center) */}
          <path
            d="M 20 10
               C 80 140 180 240 320 170
               C 250 250 120 220 30 110
               Z"
            fill="url(#velvetHighlight)"
          />

          {/* Upper Corner Swag (Main valance curve) */}
          <path
            d="M 0 0
               L 340 0
               C 310 90 240 160 150 140
               C 70 120 20 60 0 0
               Z"
            fill="url(#velvetLeft)"
          />

          {/* Inner Swag folds */}
          <path
            d="M 40 0
               C 100 80 220 140 330 30
               C 280 120 160 150 50 40
               Z"
            fill="url(#velvetHighlight)"
            opacity="0.9"
          />

          {/* Gold Hemming & Trim on Left Curtains */}
          <path
            d="M 0 160
               C 100 240 220 260 280 180
               C 285 186 280 192 270 198
               C 210 270 90 250 0 170
               Z"
            fill="url(#goldTrim)"
          />
          <path
            d="M 30 110
               C 120 220 250 250 320 170
               C 325 176 320 182 310 188
               C 240 260 110 230 25 120
               Z"
            fill="url(#goldTrim)"
          />

          {/* Gold Rope and Tassels on Left */}
          {/* Tassel 1 (Hanging near swag center) */}
          <g transform="translate(270, 180)">
            <line x1="0" y1="0" x2="0" y2="25" stroke="url(#goldTrim)" strokeWidth="3" />
            <circle cx="0" cy="27" r="5" fill="url(#goldTrim)" />
            <polygon points="-7,30 7,30 5,65 -5,65" fill="url(#goldTrim)" />
            <line x1="-5" y1="65" x2="5" y2="65" stroke="#997316" strokeWidth="2" />
          </g>

          {/* Tassel 2 (Hanging near corner) */}
          <g transform="translate(45, 120)">
            <line x1="0" y1="0" x2="0" y2="35" stroke="url(#goldTrim)" strokeWidth="3" />
            <circle cx="0" cy="37" r="6" fill="url(#goldTrim)" />
            <polygon points="-8,40 8,40 6,85 -6,85" fill="url(#goldTrim)" />
            <line x1="-6" y1="85" x2="6" y2="85" stroke="#997316" strokeWidth="2" />
          </g>

          {/* Tassel 3 (Lower vertical cascade) */}
          <g transform="translate(30, 240)">
            <line x1="0" y1="0" x2="0" y2="30" stroke="url(#goldTrim)" strokeWidth="2.5" />
            <circle cx="0" cy="32" r="4.5" fill="url(#goldTrim)" />
            <polygon points="-6,35 6,35 4,70 -4,70" fill="url(#goldTrim)" />
          </g>
        </g>

        {/* ================= RIGHT CORNER CURTAIN ================= */}
        <g id="right-curtain" filter="url(#curtainShadow)">
          {/* Main vertical curtain fold cascading down right edge */}
          <path
            d="M 1600 0
               L 1420 0
               C 1440 120 1480 280 1520 420
               C 1540 490 1565 580 1600 680
               Z"
            fill="url(#velvetRight)"
          />
          <path
            d="M 1570 0
               C 1520 150 1490 320 1540 480
               C 1560 540 1580 600 1600 670
               L 1600 0 Z"
            fill="url(#velvetHighlight)"
            opacity="0.8"
          />

          {/* Top Swag 1 (Deepest drape) */}
          <path
            d="M 1600 0
               C 1540 120 1450 220 1320 180
               C 1380 260 1500 240 1600 160
               Z"
            fill="url(#velvetRight)"
          />

          {/* Top Swag 2 (Front dramatic curve toward center) */}
          <path
            d="M 1580 10
               C 1520 140 1420 240 1280 170
               C 1350 250 1480 220 1570 110
               Z"
            fill="url(#velvetHighlight)"
          />

          {/* Upper Corner Swag (Main valance curve) */}
          <path
            d="M 1600 0
               L 1260 0
               C 1290 90 1360 160 1450 140
               C 1530 120 1580 60 1600 0
               Z"
            fill="url(#velvetRight)"
          />

          {/* Inner Swag folds */}
          <path
            d="M 1560 0
               C 1500 80 1380 140 1270 30
               C 1320 120 1440 150 1550 40
               Z"
            fill="url(#velvetHighlight)"
            opacity="0.9"
          />

          {/* Gold Hemming & Trim on Right Curtains */}
          <path
            d="M 1600 160
               C 1500 240 1380 260 1320 180
               C 1315 186 1320 192 1330 198
               C 1390 270 1510 250 1600 170
               Z"
            fill="url(#goldTrim)"
          />
          <path
            d="M 1570 110
               C 1480 220 1350 250 1280 170
               C 1275 176 1280 182 1290 188
               C 1360 260 1490 230 1575 120
               Z"
            fill="url(#goldTrim)"
          />

          {/* Gold Rope and Tassels on Right */}
          {/* Tassel 1 (Hanging near swag center) */}
          <g transform="translate(1330, 180)">
            <line x1="0" y1="0" x2="0" y2="25" stroke="url(#goldTrim)" strokeWidth="3" />
            <circle cx="0" cy="27" r="5" fill="url(#goldTrim)" />
            <polygon points="-7,30 7,30 5,65 -5,65" fill="url(#goldTrim)" />
            <line x1="-5" y1="65" x2="5" y2="65" stroke="#997316" strokeWidth="2" />
          </g>

          {/* Tassel 2 (Hanging near corner) */}
          <g transform="translate(1555, 120)">
            <line x1="0" y1="0" x2="0" y2="35" stroke="url(#goldTrim)" strokeWidth="3" />
            <circle cx="0" cy="37" r="6" fill="url(#goldTrim)" />
            <polygon points="-8,40 8,40 6,85 -6,85" fill="url(#goldTrim)" />
            <line x1="-6" y1="85" x2="6" y2="85" stroke="#997316" strokeWidth="2" />
          </g>

          {/* Tassel 3 (Lower vertical cascade) */}
          <g transform="translate(1570, 240)">
            <line x1="0" y1="0" x2="0" y2="30" stroke="url(#goldTrim)" strokeWidth="2.5" />
            <circle cx="0" cy="32" r="4.5" fill="url(#goldTrim)" />
            <polygon points="-6,35 6,35 4,70 -4,70" fill="url(#goldTrim)" />
          </g>
        </g>
      </svg>
    </div>
  );
};

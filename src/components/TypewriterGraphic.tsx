import React from 'react';

interface TypewriterGraphicProps {
  className?: string;
}

export const TypewriterGraphic: React.FC<TypewriterGraphicProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 800 1200"
      className={`w-full h-full select-none ${className}`}
      fill="none"
    >
      <defs>
        {/* Typewriter Sage Olive Gradients */}
        <linearGradient id="sageBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#b4bc94" />
          <stop offset="40%" stopColor="#969e77" />
          <stop offset="100%" stopColor="#788059" />
        </linearGradient>

        <linearGradient id="sageShadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#69704c" />
          <stop offset="100%" stopColor="#4f5538" />
        </linearGradient>

        <linearGradient id="paperGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f7f3e8" />
          <stop offset="50%" stopColor="#fdfbf5" />
          <stop offset="100%" stopColor="#f5f0e4" />
        </linearGradient>

        <linearGradient id="silverBar" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#cccccc" />
          <stop offset="100%" stopColor="#888888" />
        </linearGradient>

        <linearGradient id="keyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#e8e4d8" />
          <stop offset="100%" stopColor="#c5c0b0" />
        </linearGradient>

        <filter id="typewriterDropShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="15" stdDeviation="20" floodColor="#000000" floodOpacity="0.75" />
        </filter>
      </defs>

      {/* ================= TALL CREAM PAPER SHEET ================= */}
      <g id="paper-sheet" filter="url(#typewriterDropShadow)">
        {/* Main paper sheet */}
        <path
          d="M 135 120
             C 135 100 150 90 180 85
             L 660 85
             L 660 820
             L 135 820
             Z"
          fill="url(#paperGrad)"
          stroke="#dcd6c5"
          strokeWidth="1.5"
        />

        {/* Top ruled line */}
        <line x1="160" y1="170" x2="640" y2="170" stroke="#444444" strokeWidth="1.5" />

        {/* Lower dashed line */}
        <line
          x1="165"
          y1="690"
          x2="635"
          y2="690"
          stroke="#555555"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
      </g>

      {/* ================= TYPEWRITER CHASSIS (OMONT) ================= */}
      <g id="typewriter-body" filter="url(#typewriterDropShadow)">
        {/* Background Roller Platen Cylinder */}
        <rect x="70" y="740" width="660" height="70" rx="8" fill="#1e1e1e" />
        <rect x="15" y="755" width="55" height="40" rx="6" fill="#888f6b" stroke="#333" strokeWidth="2" />
        <rect x="730" y="755" width="55" height="40" rx="6" fill="#888f6b" stroke="#333" strokeWidth="2" />

        {/* Carriage Silver Bar with paper clamps */}
        <rect x="80" y="760" width="640" height="12" rx="3" fill="url(#silverBar)" />
        <rect x="210" y="756" width="40" height="20" rx="3" fill="#222222" />
        <rect x="540" y="756" width="40" height="20" rx="3" fill="#222222" />

        {/* Typebar Segment (metal hammers fan) */}
        <path
          d="M 230 840
             C 270 790 530 790 570 840
             L 530 840
             C 500 810 300 810 270 840
             Z"
          fill="#1a1a1a"
        />
        {/* Metal hammers radiate */}
        {[...Array(19)].map((_, i) => {
          const angle = -50 + i * 5.5;
          const rad = (angle * Math.PI) / 180;
          const x1 = 400 + Math.sin(rad) * 45;
          const y1 = 865 - Math.cos(rad) * 45;
          const x2 = 400 + Math.sin(rad) * 80;
          const y2 = 865 - Math.cos(rad) * 80;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#555555"
              strokeWidth="2.5"
            />
          );
        })}

        {/* Ribbon Spool covers (Left & Right) */}
        <circle cx="150" cy="815" r="42" fill="url(#sageShadow)" stroke="#444" strokeWidth="2" />
        <circle cx="150" cy="815" r="28" fill="#b0b890" />
        <circle cx="650" cy="815" r="42" fill="url(#sageShadow)" stroke="#444" strokeWidth="2" />
        <circle cx="650" cy="815" r="28" fill="#b0b890" />

        {/* Main Olive Body Shell */}
        <path
          d="M 25 810
             L 60 760
             L 740 760
             L 775 810
             L 785 1060
             C 785 1100 760 1130 710 1130
             L 90 1130
             C 40 1130 15 1100 15 1060
             Z"
          fill="url(#sageBody)"
          stroke="#4b5233"
          strokeWidth="3"
        />

        {/* Side carriage horns */}
        <path d="M 25 760 L 60 660 L 80 660 L 65 760 Z" fill="url(#sageBody)" stroke="#4b5233" strokeWidth="2" />
        <path d="M 775 760 L 740 660 L 720 660 L 735 760 Z" fill="url(#sageBody)" stroke="#4b5233" strokeWidth="2" />

        {/* OMONT Logo stamped on front */}
        <g transform="translate(400, 855)">
          <text
            textAnchor="middle"
            fontFamily="'Impact', 'Arial Black', sans-serif"
            fontSize="32"
            letterSpacing="6"
            fill="#dcd8c8"
            stroke="#5c6340"
            strokeWidth="1"
          >
            OMONT
          </text>
        </g>

        {/* Keyboard Cutout Well */}
        <rect
          x="70"
          y="930"
          width="660"
          height="165"
          rx="12"
          fill="#181818"
          stroke="#383d25"
          strokeWidth="3"
        />

        {/* Key Rows */}
        {/* Row 1 (10 keys) */}
        {[...Array(10)].map((_, i) => (
          <g key={`r1-${i}`} transform={`translate(${105 + i * 62}, 965)`}>
            <circle cx="0" cy="0" r="20" fill="url(#keyGrad)" stroke="#333" strokeWidth="2" />
            <circle cx="0" cy="0" r="14" fill="#fdfbf5" />
          </g>
        ))}

        {/* Row 2 (10 keys) */}
        {[...Array(10)].map((_, i) => (
          <g key={`r2-${i}`} transform={`translate(${115 + i * 62}, 1015)`}>
            <circle cx="0" cy="0" r="20" fill="url(#keyGrad)" stroke="#333" strokeWidth="2" />
            <circle cx="0" cy="0" r="14" fill="#fdfbf5" />
          </g>
        ))}

        {/* Row 3 (Spacebar & lower keys) */}
        <g transform="translate(140, 1065)">
          <circle cx="0" cy="0" r="18" fill="url(#keyGrad)" stroke="#333" strokeWidth="2" />
        </g>
        {/* Spacebar */}
        <rect x="200" y="1050" width="400" height="28" rx="6" fill="url(#keyGrad)" stroke="#333" strokeWidth="2" />
        <g transform="translate(660, 1065)">
          <circle cx="0" cy="0" r="18" fill="url(#keyGrad)" stroke="#333" strokeWidth="2" />
        </g>
      </g>
    </svg>
  );
};

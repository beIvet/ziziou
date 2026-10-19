import React from 'react';

interface DoodleIllustrationProps {
  className?: string;
}

export const DoodleIllustration: React.FC<DoodleIllustrationProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 1000 562"
      className={`w-full h-full select-none ${className}`}
      fill="none"
    >
      <defs>
        {/* Candle flame glow */}
        <filter id="flameGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Soft text glow */}
        <filter id="doodleGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ffffff" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Confetti sprinkles around the cat */}
      <g strokeWidth="3.5" strokeLinecap="round">
        <line x1="390" y1="285" x2="390" y2="295" stroke="#ffd32a" />
        <line x1="405" y1="260" x2="408" y2="272" stroke="#2ed573" />
        <line x1="445" y1="245" x2="445" y2="258" stroke="#2ed573" />
        <line x1="475" y1="260" x2="480" y2="272" stroke="#ff4757" />
        <line x1="495" y1="290" x2="505" y2="295" stroke="#ffd32a" />
        <line x1="420" y1="280" x2="425" y2="290" stroke="#70a1ff" />
        <line x1="465" y1="285" x2="475" y2="280" stroke="#ffa502" />
      </g>

      {/* Confetti and party sparks around the frog */}
      <g strokeWidth="3.5" strokeLinecap="round">
        <line x1="535" y1="280" x2="540" y2="288" stroke="#ffd32a" />
        <line x1="545" y1="275" x2="550" y2="282" stroke="#ff4757" />
        <line x1="620" y1="310" x2="630" y2="315" stroke="#70a1ff" />
        <line x1="635" y1="315" x2="640" y2="322" stroke="#ff4757" />
        <line x1="625" y1="325" x2="635" y2="330" stroke="#ffd32a" />
        {/* Tiny stars from party horn */}
        <polygon points="545,302 548,309 555,309 550,314 552,321 545,317 538,321 540,314 535,309 542,309" fill="#ffd32a" />
      </g>

      {/* "me - " handwritten doodle text */}
      <g transform="translate(265, 388)">
        <text
          fontFamily="'Comic Sans MS', 'Caveat', 'Marker Felt', 'Architects Daughter', cursive, sans-serif"
          fontSize="48"
          fill="#ffffff"
          fontWeight="bold"
          letterSpacing="4"
          filter="url(#doodleGlow)"
        >
          me -
        </text>
      </g>

      {/* " - you" handwritten doodle text */}
      <g transform="translate(635, 388)">
        <text
          fontFamily="'Comic Sans MS', 'Caveat', 'Marker Felt', 'Architects Daughter', cursive, sans-serif"
          fontSize="48"
          fill="#ffffff"
          fontWeight="bold"
          letterSpacing="4"
          filter="url(#doodleGlow)"
        >
          - you
        </text>
      </g>

      {/* GROUND LINE */}
      <line x1="380" y1="438" x2="465" y2="438" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />
      <line x1="525" y1="438" x2="635" y2="438" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />

      {/* === BLACK CAT === */}
      <g id="black-cat">
        {/* Cat tail curving up with clean white outline */}
        <path
          d="M 388 385 C 375 375 372 340 380 320 C 386 312 393 318 390 326 C 385 342 388 368 398 380 Z"
          fill="#000000"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Cat Body & Legs with clean white outline */}
        <path
          d="M 388 380
             C 388 360 405 348 425 345
             L 440 345
             C 455 345 468 355 468 375
             L 468 435
             L 458 435
             L 458 410
             L 450 410
             L 450 435
             L 440 435
             L 440 415
             L 405 415
             L 405 435
             L 392 435
             L 392 410
             C 385 400 388 388 388 380 Z"
          fill="#000000"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Cat Head with pointy ears */}
        <path
          d="M 416 345
             L 421 318
             L 433 335
             L 448 335
             L 460 318
             L 466 345
             C 472 360 472 375 465 388
             C 455 395 425 395 416 388
             C 410 375 410 360 416 345 Z"
          fill="#000000"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Cat round white eyes */}
        <ellipse cx="433" cy="362" rx="4.5" ry="5.5" fill="#ffffff" />
        <ellipse cx="452" cy="362" rx="4.5" ry="5.5" fill="#ffffff" />
        <circle cx="433" cy="362" r="1.8" fill="#000000" />
        <circle cx="452" cy="362" r="1.8" fill="#000000" />

        {/* Party Hat on Cat (Blue and White Stripes) */}
        <g id="cat-party-hat">
          {/* Hat Cone */}
          <polygon
            points="432,328 448,328 440,285"
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth="2"
          />
          {/* Blue Stripes */}
          <polygon points="433,322 447,322 445,314 435,314" fill="#54a0ff" />
          <polygon points="436,306 444,306 442,298 438,298" fill="#54a0ff" />
          <polygon points="439,291 441,291 440,285" fill="#54a0ff" />

          {/* White Pom-Pom */}
          <circle
            cx="440"
            cy="283"
            r="6"
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        </g>
      </g>

      {/* === MINI CUPCAKE WITH CANDLE === */}
      <g id="mini-cupcake">
        {/* Cupcake Base / Liner */}
        <path
          d="M 478 424 L 480 438 L 504 438 L 506 424 Z"
          fill="#f5cd79"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <line x1="486" y1="424" x2="487" y2="438" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="492" y1="424" x2="492" y2="438" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="498" y1="424" x2="497" y2="438" stroke="#ffffff" strokeWidth="1.5" />

        {/* White Frosting Dome */}
        <path
          d="M 475 424
             C 472 416 480 410 488 412
             C 492 407 500 407 504 412
             C 512 410 514 418 510 424
             Z"
          fill="#ffffff"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Sprinkles on frosting */}
        <circle cx="484" cy="416" r="1.5" fill="#ff4757" />
        <circle cx="493" cy="414" r="1.5" fill="#2ed573" />
        <circle cx="502" cy="417" r="1.5" fill="#ffa502" />

        {/* Blue Candle */}
        <rect
          x="490.5"
          y="392"
          width="4"
          height="16"
          rx="1"
          fill="#70a1ff"
          stroke="#ffffff"
          strokeWidth="1.5"
        />
        <line x1="492.5" y1="392" x2="492.5" y2="389" stroke="#ffffff" strokeWidth="1.5" />

        {/* Burning Flame with gentle glow */}
        <path
          d="M 492.5 376
             C 496 381 497 386 492.5 389
             C 488 386 489 381 492.5 376 Z"
          fill="#ff7f50"
          filter="url(#flameGlow)"
        />
        <path
          d="M 492.5 378
             C 494.5 382 495 385 492.5 388
             C 490 385 490.5 382 492.5 378 Z"
          fill="#fed330"
        />
      </g>

      {/* === GREEN FROG === */}
      <g id="green-frog">
        {/* Frog Arms raised celebrating */}
        {/* Left arm waving horn/blower */}
        <path
          d="M 545 380 C 540 368 545 352 550 350 C 555 352 555 365 550 380 Z"
          fill="#78b856"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Right arm waving party horn */}
        <path
          d="M 618 380 C 625 368 632 355 636 358 C 638 365 628 375 622 388 Z"
          fill="#78b856"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <polygon points="633,354 639,348 642,356" fill="#70a1ff" stroke="#ffffff" strokeWidth="1.5" />

        {/* Main Pear-shaped Green Body with white outline */}
        <path
          d="M 552 355
             C 555 330 580 326 592 338
             C 605 326 625 330 626 355
             C 628 370 638 395 634 425
             C 630 438 615 440 590 440
             C 565 440 548 438 544 425
             C 540 395 548 370 552 355 Z"
          fill="#78b856"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* White / Cream Belly */}
        <path
          d="M 565 385
             C 570 375 605 375 612 385
             C 620 405 622 430 610 436
             C 595 440 580 440 568 436
             C 556 430 558 405 565 385 Z"
          fill="#f5faed"
        />

        {/* Black Little Bow Tie under chin */}
        <polygon points="586,378 578,374 578,382" fill="#111111" stroke="#ffffff" strokeWidth="1" />
        <polygon points="588,378 596,374 596,382" fill="#111111" stroke="#ffffff" strokeWidth="1" />
        <circle cx="587" cy="378" r="2.5" fill="#111111" stroke="#ffffff" strokeWidth="1" />

        {/* Frog Eyes */}
        <circle cx="568" cy="342" r="3.5" fill="#111111" stroke="#ffffff" strokeWidth="1" />
        <circle cx="606" cy="342" r="3.5" fill="#111111" stroke="#ffffff" strokeWidth="1" />

        {/* Frog Party Hat (Red with yellow polka dots) */}
        <polygon
          points="580,332 596,332 588,300"
          fill="#ff4757"
          stroke="#ffffff"
          strokeWidth="2"
        />
        <circle cx="586" cy="325" r="2" fill="#ffd32a" />
        <circle cx="591" cy="318" r="1.5" fill="#ffd32a" />
        <circle cx="588" cy="310" r="1.5" fill="#ffd32a" />

        {/* Pink Party Blower Horn extending from mouth towards left */}
        <path
          d="M 574 362
             C 560 360 540 358 530 352
             C 525 348 532 342 538 346
             C 544 350 560 355 574 356 Z"
          fill="#ff6b81"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M 533 348 C 530 345 536 343 538 346"
          stroke="#ffffff"
          strokeWidth="1.5"
          fill="none"
        />
      </g>
    </svg>
  );
};

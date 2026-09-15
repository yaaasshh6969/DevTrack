// ── Aria – AI Learning Architect ───────────────────────────────────────────────

interface CharProps {
  mood?: 'happy' | 'thinking' | 'excited';
}

// Full character illustration — mature tall anime proportions (220×440 viewport)
export function HanaCharacterSVG({ mood = 'happy' }: CharProps) {
  const upperLip =
    mood === 'excited'
      ? 'M93 152 Q103 145 110 146 Q117 145 127 152 Q117 156 110 157 Q103 156 93 152Z'
      : mood === 'thinking'
      ? 'M95 153 Q104 148 110 149 Q116 148 125 153 Q116 156 110 157 Q104 156 95 153Z'
      : 'M93 152 Q103 146 110 147 Q117 146 127 152 Q117 156 110 156 Q103 156 93 152Z';

  const lowerLip =
    mood === 'excited'
      ? 'M93 152 Q103 163 110 165 Q117 163 127 152 Q117 156 110 157 Q103 156 93 152Z'
      : mood === 'thinking'
      ? 'M95 153 Q104 160 110 161 Q116 160 125 153 Q116 156 110 157 Q104 156 95 153Z'
      : 'M93 152 Q104 161 110 162 Q116 161 127 152 Q117 156 110 156 Q103 156 93 152Z';

  const mouthLine =
    mood === 'thinking' ? 'M95 153 Q110 155 125 153' : 'M93 152 Q110 154 127 152';

  return (
    <svg viewBox="0 0 220 440" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="a-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0618" />
          <stop offset="40%" stopColor="#16083a" />
          <stop offset="100%" stopColor="#0c0620" />
        </linearGradient>
        <linearGradient id="a-hair-hi" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(100,56,200,0)" />
          <stop offset="50%" stopColor="rgba(100,56,200,0.14)" />
          <stop offset="100%" stopColor="rgba(100,56,200,0)" />
        </linearGradient>
        <linearGradient id="a-skin" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fbe8d5" />
          <stop offset="62%" stopColor="#f0cead" />
          <stop offset="100%" stopColor="#d4a078" />
        </linearGradient>
        <linearGradient id="a-eye-l" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d42255" />
          <stop offset="45%" stopColor="#921038" />
          <stop offset="100%" stopColor="#480818" />
        </linearGradient>
        <linearGradient id="a-eye-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b47f3" />
          <stop offset="50%" stopColor="#6418c8" />
          <stop offset="100%" stopColor="#360a80" />
        </linearGradient>
        <linearGradient id="a-coat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e0e24" />
          <stop offset="100%" stopColor="#060610" />
        </linearGradient>
        <linearGradient id="a-coat-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(139,71,243,0.2)" />
          <stop offset="100%" stopColor="rgba(139,71,243,0)" />
        </linearGradient>
        <linearGradient id="a-coat-r" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="rgba(204,34,85,0.15)" />
          <stop offset="100%" stopColor="rgba(204,34,85,0)" />
        </linearGradient>
        <radialGradient id="a-eg-l" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(212,34,85,0.22)" />
          <stop offset="100%" stopColor="rgba(212,34,85,0)" />
        </radialGradient>
        <radialGradient id="a-eg-r" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(139,71,243,0.18)" />
          <stop offset="100%" stopColor="rgba(139,71,243,0)" />
        </radialGradient>
        <radialGradient id="a-face-shad" cx="68%" cy="44%" r="54%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(70,30,12,0.2)" />
        </radialGradient>
        <radialGradient id="a-ambient" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgba(90,30,160,0.05)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* Ambient atmosphere */}
      <ellipse cx="110" cy="240" rx="110" ry="220" fill="url(#a-ambient)" />
      <ellipse cx="75" cy="130" rx="75" ry="105" fill="rgba(180,30,70,0.025)" />

      {/* ── HAIR BACK — main volume ── */}
      <path
        d="M52 145 Q46 96 60 62 Q76 24 110 18 Q144 24 160 62 Q174 96 168 145 Q162 180 148 206 Q132 228 110 233 Q88 228 72 206 Q58 180 52 145Z"
        fill="url(#a-hair)"
      />

      {/* Long left strands */}
      <path
        d="M52 145 Q38 192 35 250 Q32 308 42 364 Q50 410 62 440 L84 440 Q72 410 64 364 Q54 308 58 250 Q62 192 76 152Z"
        fill="url(#a-hair)"
      />
      <path
        d="M55 154 Q44 200 42 255 Q40 310 50 365 Q56 410 68 440 L76 440 Q66 410 60 365 Q50 310 52 255 Q54 200 66 158Z"
        fill="#1a0840" opacity="0.55"
      />

      {/* Long right strands */}
      <path
        d="M168 145 Q182 192 185 250 Q188 308 178 364 Q170 410 158 440 L136 440 Q148 410 156 364 Q166 308 162 250 Q158 192 144 152Z"
        fill="url(#a-hair)"
      />
      <path
        d="M165 154 Q176 200 178 255 Q180 310 170 365 Q164 410 152 440 L144 440 Q154 410 160 365 Q170 310 168 255 Q166 200 154 158Z"
        fill="#1a0840" opacity="0.55"
      />

      {/* Hair highlight sheen */}
      <path
        d="M60 56 Q82 30 110 22 Q138 30 160 56 Q146 36 110 28 Q74 36 60 56Z"
        fill="rgba(120,70,220,0.11)"
      />
      <path d="M54 140 Q50 108 60 84 Q72 58 94 48" stroke="rgba(100,55,200,0.08)" strokeWidth="3.5" fill="none" strokeLinecap="round" />

      {/* ── COAT / BODY ── */}
      <path
        d="M15 440 L8 354 Q4 314 12 290 L34 265 Q66 248 110 244 Q154 248 186 265 L208 290 Q216 314 212 354 L205 440Z"
        fill="url(#a-coat)"
      />
      {/* Left coat edge — purple glow */}
      <path
        d="M15 440 L8 354 Q4 314 12 290 L34 265 Q52 256 70 252 L72 280 Q54 286 38 300 Q24 320 28 356 L36 440Z"
        fill="url(#a-coat-l)"
      />
      {/* Right coat edge — crimson hint */}
      <path
        d="M205 440 L212 354 Q216 314 208 290 L186 265 Q168 256 150 252 L148 280 Q166 286 182 300 Q196 320 192 356 L184 440Z"
        fill="url(#a-coat-r)"
      />
      {/* Subtle coat seam */}
      <path d="M110 244 Q118 246 126 250 Q140 256 152 264" stroke="rgba(100,70,180,0.1)" strokeWidth="1.5" fill="none" />
      <path d="M110 244 Q102 246 94 250 Q80 256 68 264" stroke="rgba(100,70,180,0.08)" strokeWidth="1.5" fill="none" />

      {/* High collar */}
      <path
        d="M86 252 Q98 262 110 264 Q122 262 134 252 L130 237 Q120 248 110 250 Q100 248 90 237Z"
        fill="#12102c"
      />
      <path
        d="M86 252 L92 241 Q101 252 110 254 Q119 252 128 241 L134 252"
        stroke="rgba(139,71,243,0.18)" strokeWidth="1.3" fill="none"
      />
      {/* Collar crimson accent */}
      <path
        d="M94 244 Q102 250 110 251 Q118 250 126 244"
        stroke="rgba(204,34,85,0.28)" strokeWidth="2" fill="none" strokeLinecap="round"
      />
      <circle cx="110" cy="248" r="2.8" fill="#cc1144" opacity="0.5" />
      <circle cx="110" cy="248" r="1.3" fill="rgba(255,140,140,0.55)" />

      {/* ── NECK ── */}
      <path
        d="M100 178 Q106 187 110 188 Q114 187 120 178 L118 152 Q114 161 110 162 Q106 161 102 152Z"
        fill="url(#a-skin)"
      />
      <path d="M115 153 L119 176 Q117 168 116 158Z" fill="rgba(90,50,20,0.13)" />

      {/* ── FACE — angular mature shape ── */}
      <path
        d="M68 100 Q70 56 110 44 Q150 56 152 100 Q155 138 145 162 Q134 182 118 187 Q110 190 102 187 Q86 182 75 162 Q65 138 68 100Z"
        fill="url(#a-skin)"
      />
      {/* Right-side dramatic shadow */}
      <path
        d="M132 65 Q154 84 155 110 Q155 140 145 163 Q134 182 118 187 L120 184 Q138 175 146 154 Q154 130 153 104 Q151 78 132 65Z"
        fill="rgba(70,28,10,0.18)"
      />
      <path
        d="M68 100 Q70 56 110 44 Q150 56 152 100 Q155 138 145 162 Q134 182 118 187 Q110 190 102 187 Q86 182 75 162 Q65 138 68 100Z"
        fill="url(#a-face-shad)"
      />

      {/* ── EYEBROWS — sharp, powerful ── */}
      <path d="M76 88 Q90 77 109 83" stroke="#09071e" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M76 88 Q90 77 109 83" stroke="#1c0a44" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M111 83 Q130 77 144 88" stroke="#09071e" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M111 83 Q130 77 144 88" stroke="#1c0a44" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5" />

      {/* ── LEFT EYE — crimson ── */}
      {/* Eye socket depth */}
      <path d="M76 104 Q78 90 92 87 Q106 90 108 104 Q106 118 92 121 Q78 118 76 104Z" fill="#06041a" />
      {/* Sclera */}
      <path d="M78 104 Q80 93 92 91 Q104 93 106 104 Q104 115 92 117 Q80 115 78 104Z" fill="white" opacity="0.9" />
      {/* Iris */}
      <ellipse cx="92" cy="104" rx="10" ry="11" fill="url(#a-eye-l)" />
      {/* Pupil */}
      <ellipse cx="92" cy="104" rx="6" ry="6.5" fill="#030110" />
      {/* Upper shading (heavy lid effect) */}
      <path d="M82 98 Q92 91 102 98" fill="#030110" opacity="0.32" />
      {/* Primary highlight */}
      <ellipse cx="97" cy="96" rx="2.8" ry="3.2" fill="white" opacity="0.92" />
      {/* Small highlight */}
      <circle cx="84" cy="110" r="1.8" fill="white" opacity="0.32" />
      {/* Eye ambient glow */}
      <ellipse cx="92" cy="104" rx="15" ry="14" fill="url(#a-eg-l)" opacity="0.65" />
      {/* Sharp upper lash line */}
      <path d="M76 101 Q83 88 92 87 Q101 88 108 101" stroke="#030116" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Dramatic lashes */}
      <line x1="79" y1="98" x2="75" y2="88" stroke="#030116" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="84" y1="93" x2="82" y2="82" stroke="#030116" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="92" y1="89" x2="92" y2="78" stroke="#030116" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="100" y1="92" x2="102" y2="82" stroke="#030116" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="106" y1="97" x2="110" y2="88" stroke="#030116" strokeWidth="2.2" strokeLinecap="round" />
      {/* Lower lash */}
      <path d="M78 109 Q85 118 92 119 Q99 118 106 109" stroke="#0c061e" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />

      {/* ── RIGHT EYE — violet ── */}
      <path d="M112 104 Q114 90 128 87 Q142 90 144 104 Q142 118 128 121 Q114 118 112 104Z" fill="#06041a" />
      <path d="M114 104 Q116 93 128 91 Q140 93 142 104 Q140 115 128 117 Q116 115 114 104Z" fill="white" opacity="0.9" />
      <ellipse cx="128" cy="104" rx="10" ry="11" fill="url(#a-eye-r)" />
      <ellipse cx="128" cy="104" rx="6" ry="6.5" fill="#030110" />
      <path d="M118 98 Q128 91 138 98" fill="#030110" opacity="0.32" />
      <ellipse cx="133" cy="96" rx="2.8" ry="3.2" fill="white" opacity="0.92" />
      <circle cx="120" cy="110" r="1.8" fill="white" opacity="0.32" />
      <ellipse cx="128" cy="104" rx="15" ry="14" fill="url(#a-eg-r)" opacity="0.55" />
      <path d="M112 101 Q119 88 128 87 Q137 88 144 101" stroke="#030116" strokeWidth="3" fill="none" strokeLinecap="round" />
      <line x1="115" y1="98" x2="111" y2="88" stroke="#030116" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="120" y1="93" x2="118" y2="82" stroke="#030116" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="128" y1="89" x2="128" y2="78" stroke="#030116" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="136" y1="92" x2="138" y2="82" stroke="#030116" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="142" y1="97" x2="146" y2="88" stroke="#030116" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M114 109 Q121 118 128 119 Q135 118 142 109" stroke="#0c061e" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />

      {/* ── NOSE — defined, mature ── */}
      <path d="M106 132 Q110 137 114 132" stroke="rgba(145,85,50,0.42)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M105 123 Q107 130 110 132 Q113 130 115 123" stroke="rgba(145,85,50,0.18)" strokeWidth="1.3" strokeLinecap="round" fill="none" />

      {/* ── LIPS — full, confident ── */}
      <path d={upperLip} fill="#c25578" opacity="0.88" />
      <path d={lowerLip} fill="#aa3c62" opacity="0.82" />
      <path d={mouthLine} stroke="#8a2a4a" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Lip shine */}
      <ellipse cx="110" cy="159" rx="7" ry="2.2" fill="rgba(255,190,190,0.1)" />
      {/* Slight smirk — right corner up */}
      {mood !== 'thinking' && (
        <path d="M127 152 Q130 150 131 152" stroke="#8a2a4a" strokeWidth="0.9" fill="none" strokeLinecap="round" />
      )}

      {/* ── FRONT HAIR — asymmetric, dramatic ── */}
      {/* Main top fringe */}
      <path
        d="M66 108 Q64 70 72 52 Q84 28 110 22 Q136 28 148 52 Q156 70 154 108 L148 110 Q146 72 138 56 Q126 36 110 30 Q94 36 82 56 Q74 72 72 110Z"
        fill="url(#a-hair)"
      />
      {/* Left side framing piece */}
      <path
        d="M66 108 Q60 86 66 70 Q72 56 82 52 Q76 60 74 75 Q72 90 78 112Z"
        fill="#160840"
      />
      {/* Strand dipping toward left eye (mysterious) */}
      <path
        d="M66 92 Q70 108 74 122 Q77 134 80 148 Q76 132 72 116 Q68 100 67 90Z"
        fill="#0e0632" opacity="0.82"
      />
      {/* Left side long strand — in front of body */}
      <path
        d="M62 116 Q55 140 53 170 Q51 198 57 224 Q62 246 68 264 Q70 246 66 224 Q60 198 62 170 Q64 142 72 122Z"
        fill="url(#a-hair)"
      />
      {/* Right side long strand */}
      <path
        d="M158 116 Q165 140 167 170 Q169 198 163 224 Q158 246 152 264 Q150 246 157 224 Q163 198 158 170 Q156 142 148 122Z"
        fill="url(#a-hair)"
      />

      {/* Front hair sheen */}
      <path
        d="M76 32 Q94 22 110 20 Q126 22 144 32 Q130 26 110 24 Q90 26 76 32Z"
        fill="rgba(110,68,210,0.1)"
      />
      <path d="M68 108 Q70 84 76 68 Q84 50 96 44" stroke="rgba(90,50,190,0.1)" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* ── ATMOSPHERIC ELEMENTS ── */}
      {/* Subtle eye particle glows */}
      <circle cx="108" cy="103" r="8" fill="rgba(204,34,85,0.06)" />
      <circle cx="112" cy="103" r="8" fill="rgba(139,71,243,0.05)" />

      {/* Floating particles */}
      <circle cx="172" cy="58" r="1.6" fill="#8b47f3" opacity="0.45" />
      <circle cx="176" cy="74" r="1" fill="#cc1144" opacity="0.5" />
      <circle cx="48" cy="208" r="1.3" fill="#8b47f3" opacity="0.4" />
      <circle cx="172" cy="228" r="1.1" fill="#cc1144" opacity="0.55" />
      <circle cx="44" cy="320" r="1" fill="#8b47f3" opacity="0.3" />

      {/* Diamond sparkle — top right */}
      <g transform="translate(172, 40)" opacity="0.32">
        <line x1="5" y1="0" x2="5" y2="11" stroke="#8b47f3" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="0" y1="5.5" x2="10" y2="5.5" stroke="#8b47f3" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="1.5" y1="1.5" x2="8.5" y2="9.5" stroke="#8b47f3" strokeWidth="0.9" strokeLinecap="round" />
        <line x1="8.5" y1="1.5" x2="1.5" y2="9.5" stroke="#8b47f3" strokeWidth="0.9" strokeLinecap="round" />
      </g>
      {/* Small crimson sparkle — left */}
      <g transform="translate(36, 155)" opacity="0.28">
        <line x1="4" y1="0" x2="4" y2="8" stroke="#cc1144" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="0" y1="4" x2="8" y2="4" stroke="#cc1144" strokeWidth="1.3" strokeLinecap="round" />
      </g>
      {/* Coat subtle trim line */}
      <path d="M14 294 Q12 318 18 348 L26 380" stroke="rgba(139,71,243,0.1)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ── Aria Mini Avatar (for sidebar) ──────────────────────────────────────────────

export function HanaMiniSVG() {
  return (
    <svg viewBox="60 80 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="ms-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0618" />
          <stop offset="100%" stopColor="#18083a" />
        </linearGradient>
        <linearGradient id="ms-skin" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fbe8d5" />
          <stop offset="70%" stopColor="#f0cead" />
          <stop offset="100%" stopColor="#d4a078" />
        </linearGradient>
        <linearGradient id="ms-eye-l" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d42255" />
          <stop offset="100%" stopColor="#480818" />
        </linearGradient>
        <linearGradient id="ms-eye-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b47f3" />
          <stop offset="100%" stopColor="#360a80" />
        </linearGradient>
      </defs>

      {/* Hair back */}
      <path d="M65 120 Q67 92 110 84 Q153 92 155 120 Q152 148 130 156 Q110 160 90 156 Q68 148 65 120Z" fill="url(#ms-hair)" />
      {/* Face */}
      <path d="M70 108 Q72 88 110 82 Q148 88 150 108 Q152 128 140 140 Q132 152 118 157 Q110 160 102 157 Q88 152 80 140 Q68 128 70 108Z" fill="url(#ms-skin)" />
      {/* Right shadow */}
      <path d="M130 88 Q148 100 150 116 Q150 134 140 144 Q132 153 118 157 L120 155 Q136 147 142 134 Q148 120 147 106 Q145 96 130 88Z" fill="rgba(70,28,10,0.14)" />
      {/* Left brow */}
      <path d="M78 100 Q89 93 105 97" stroke="#09071e" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      {/* Right brow */}
      <path d="M115 97 Q131 93 142 100" stroke="#09071e" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      {/* Left eye socket */}
      <ellipse cx="94" cy="112" rx="12" ry="10.5" fill="#06041a" />
      {/* Left sclera */}
      <path d="M83 112 Q85 103 94 101 Q103 103 105 112 Q103 121 94 123 Q85 121 83 112Z" fill="white" opacity="0.9" />
      {/* Left iris */}
      <ellipse cx="94" cy="112" rx="8.5" ry="9" fill="url(#ms-eye-l)" />
      <ellipse cx="94" cy="112" rx="5" ry="5.5" fill="#030110" />
      <ellipse cx="98" cy="105" rx="2.5" ry="3" fill="white" opacity="0.9" />
      <path d="M83 108 Q88 100 94 99 Q100 100 105 108" stroke="#030116" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      {/* Right eye socket */}
      <ellipse cx="126" cy="112" rx="12" ry="10.5" fill="#06041a" />
      {/* Right sclera */}
      <path d="M115 112 Q117 103 126 101 Q135 103 137 112 Q135 121 126 123 Q117 121 115 112Z" fill="white" opacity="0.9" />
      {/* Right iris */}
      <ellipse cx="126" cy="112" rx="8.5" ry="9" fill="url(#ms-eye-r)" />
      <ellipse cx="126" cy="112" rx="5" ry="5.5" fill="#030110" />
      <ellipse cx="130" cy="105" rx="2.5" ry="3" fill="white" opacity="0.9" />
      <path d="M115 108 Q120 100 126 99 Q132 100 137 108" stroke="#030116" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      {/* Subtle lips */}
      <path d="M104 148 Q110 145 116 148" stroke="#c25578" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* Front hair top and sides */}
      <path d="M70 108 Q72 90 80 86 Q74 94 73 110Z" fill="#140838" />
      <path d="M150 108 Q148 90 140 86 Q146 94 147 110Z" fill="#140838" />
      <path d="M72 96 Q80 86 110 82 Q140 86 148 96 L142 98 Q132 88 110 86 Q88 88 78 98Z" fill="url(#ms-hair)" />
    </svg>
  );
}

// ── Companion Card (Dashboard) ────────────────────────────────────────────────

interface CompanionCardProps {
  userName?: string;
  message?: string;
  streak?: number;
  xp?: number;
  xpToNext?: number;
  level?: number;
  levelName?: string;
  badges?: { emoji: string; name: string; earned: boolean }[];
}

export function CompanionCard({
  message = "47 days straight, Alex. That's not motivation — that's a system. Now let's close the JavaScript gaps and push into Node.js.",
  xp = 2847,
  xpToNext = 3500,
  level = 14,
  levelName = 'Full Stack Learner',
  badges = [],
}: CompanionCardProps) {
  const xpPct = Math.round((xp / xpToNext) * 100);
  const earnedBadges = badges.filter((b) => b.earned);

  return (
    <div
      className="card overflow-hidden relative"
      style={{
        borderColor: 'rgba(139,71,243,0.14)',
        background:
          'radial-gradient(ellipse at 78% 45%, rgba(139,71,243,0.07) 0%, transparent 55%), radial-gradient(ellipse at 25% 85%, rgba(204,34,85,0.05) 0%, transparent 50%), #0b0b20',
      }}
    >
      <div className="flex flex-col sm:flex-row">
        {/* ── Left: content ── */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-5 min-w-0" style={{ paddingRight: 0 }}>
          <div>
            {/* Title */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest"
                style={{ background: 'rgba(204,34,85,0.1)', color: '#cc1144', border: '1px solid rgba(204,34,85,0.18)' }}
              >
                AI Coach
              </span>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#4dd0a1', boxShadow: '0 0 5px rgba(77,208,161,0.55)' }} />
              <span className="text-[10px]" style={{ color: '#4040888' }}>online</span>
            </div>
            <h3 className="text-[18px] font-semibold tracking-tight" style={{ color: '#f0ecff' }}>Aria</h3>
            <p className="text-[11px] mt-0.5" style={{ color: '#50508a' }}>Learning Architect · AI</p>

            {/* Message */}
            <p
              className="mt-4 text-[13.5px] leading-relaxed"
              style={{ color: '#c4c0e0', maxWidth: 300, borderLeft: '2px solid rgba(204,34,85,0.25)', paddingLeft: 12 }}
            >
              {message}
            </p>
          </div>

          {/* XP + badges */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(139,71,243,0.14)', color: '#8b47f3' }}
              >
                LVL {level}
              </span>
              <span className="text-[11.5px]" style={{ color: '#60608a' }}>{levelName}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                className="h-full rounded-full xp-bar-fill"
                style={{ width: `${xpPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] font-mono" style={{ color: '#404080' }}>{xp.toLocaleString()} XP</span>
              <span className="text-[10px] font-mono" style={{ color: '#404080' }}>/ {xpToNext.toLocaleString()}</span>
            </div>

            {earnedBadges.length > 0 && (
              <div className="flex items-center gap-1.5 mt-3">
                {earnedBadges.map((b) => (
                  <span
                    key={b.name}
                    title={b.name}
                    className="text-[13px] px-1.5 py-0.5 rounded-[5px]"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      filter: 'saturate(0.75) brightness(0.88)',
                    }}
                  >
                    {b.emoji}
                  </span>
                ))}
                <span className="text-[10.5px] ml-0.5" style={{ color: '#404080' }}>
                  {earnedBadges.length} earned
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: character ── */}
        <div
          className="relative shrink-0 flex items-end justify-center overflow-hidden"
          style={{
            width: 148,
            minHeight: 220,
            background: 'linear-gradient(to left, rgba(6,6,16,0.55), transparent)',
          }}
        >
          {/* Subtle vertical rule */}
          <div
            className="absolute left-0 top-4 bottom-4 w-px"
            style={{ background: 'rgba(139,71,243,0.08)' }}
          />
          <div className="w-[148px] h-[230px] -mb-2">
            <HanaCharacterSVG mood="happy" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Aria Quote (small coaching bar) ──────────────────────────────────────────

export function HanaQuote({ text, subtitle }: { text: string; subtitle?: string }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-[8px]"
      style={{ background: 'rgba(139,71,243,0.05)', border: '1px solid rgba(139,71,243,0.1)' }}
    >
      {/* Avatar orb */}
      <div
        className="w-8 h-8 rounded-full shrink-0 overflow-hidden flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #360a80 0%, #8b47f3 50%, #cc1144 100%)' }}
      >
        <svg viewBox="78 86 64 68" fill="none" className="w-full h-full">
          <defs>
            <linearGradient id="qq-s" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fbe8d5" />
              <stop offset="100%" stopColor="#d4a078" />
            </linearGradient>
          </defs>
          <path d="M80 108 Q82 90 110 86 Q138 90 140 108 Q140 126 128 134 Q110 140 92 134 Q80 126 80 108Z" fill="url(#qq-s)" />
          {/* left eye minimal */}
          <ellipse cx="96" cy="108" rx="6" ry="5" fill="#030110" />
          <ellipse cx="98" cy="104" rx="1.8" ry="2" fill="white" opacity="0.85" />
          {/* right eye minimal */}
          <ellipse cx="124" cy="108" rx="6" ry="5" fill="#030110" />
          <ellipse cx="126" cy="104" rx="1.8" ry="2" fill="white" opacity="0.85" />
          {/* hair top */}
          <path d="M80 108 Q82 90 110 85 Q138 90 140 108 L136 106 Q128 92 110 88 Q92 92 84 106Z" fill="#0a0618" />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-[13px] leading-snug" style={{ color: '#c4c0e0' }}>
          {text}
        </p>
        {subtitle && (
          <p className="mt-0.5 text-[11px]" style={{ color: '#40407a' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Atmospheric Particles ─────────────────────────────────────────────────────

interface PetalDef {
  left: string;
  delay: string;
  duration: string;
  drift: string;
  spin: string;
  size: number;
}

const PETALS: PetalDef[] = [
  { left: '7%',  delay: '0s',   duration: '24s', drift: '40px',  spin: '360deg', size: 5 },
  { left: '19%', delay: '5s',   duration: '28s', drift: '-30px', spin: '280deg', size: 4 },
  { left: '34%', delay: '9s',   duration: '22s', drift: '55px',  spin: '440deg', size: 6 },
  { left: '52%', delay: '2s',   duration: '31s', drift: '-45px', spin: '320deg', size: 4 },
  { left: '68%', delay: '7s',   duration: '25s', drift: '35px',  spin: '400deg', size: 5 },
  { left: '80%', delay: '12s',  duration: '27s', drift: '-38px', spin: '260deg', size: 4 },
  { left: '92%', delay: '15s',  duration: '23s', drift: '28px',  spin: '380deg', size: 5 },
  { left: '45%', delay: '19s',  duration: '20s', drift: '-20px', spin: '300deg', size: 3 },
];

export function SakuraPetals() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }} aria-hidden>
      {PETALS.map((p, i) => (
        <div
          key={i}
          className="sakura-petal absolute"
          style={{
            left: p.left,
            top: '-8px',
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            ['--petal-drift' as string]: p.drift,
            ['--petal-spin' as string]: p.spin,
          }}
        />
      ))}
    </div>
  );
}

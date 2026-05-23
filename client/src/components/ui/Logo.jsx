

export const Logo = ({ className = "w-8 h-8" }) => {
  return (
    <div className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <defs>
          <filter id="neonGlowPurple" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur1" />
            <feGaussianBlur stdDeviation="8" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="neonGlowCyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur1" />
            <feGaussianBlur stdDeviation="6" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a0845" />
            <stop offset="100%" stopColor="#0f0c29" />
          </linearGradient>
        </defs>

        {/* Hexagon Background */}
        <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="url(#hexGrad)" stroke="#b026ff" strokeWidth="4" filter="url(#neonGlowPurple)"/>

        {/* Inner glowing accent */}
        <polygon points="50,14 80,31 80,69 50,86 20,69 20,31" fill="none" stroke="#ff00a0" strokeWidth="2" opacity="0.8" />

        {/* Energetic Upward Arrow / Code Bracket */}
        <path d="M 32 68 L 50 46 L 68 68" fill="none" stroke="#00f0ff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" filter="url(#neonGlowCyan)"/>
        <path d="M 32 50 L 50 28 L 68 50" fill="none" stroke="#00f0ff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" filter="url(#neonGlowCyan)"/>
      </svg>
    </div>
  );
};

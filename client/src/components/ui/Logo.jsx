import React from 'react';

export const Logo = ({ className = "w-8 h-8" }) => {
  return (
    <div className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="url(#purpleGrad)" />
        <path d="M14 28L24 18L34 28" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 36L24 26L34 36" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" />
        <defs>
          <linearGradient id="purpleGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a855f7" />
            <stop offset="1" stopColor="#7e22ce" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

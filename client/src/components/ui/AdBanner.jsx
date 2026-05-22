import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Pages where ads should NOT show
const NO_ADS_PAGES = ['/login', '/signup', '/auth', '/onboarding', '/admin'];

// All 3 ad keys with their dimensions
export const AD_SLOTS = {
  side:   { key: 'd49b256a7a2ff2c7389db3fce167efe6', width: 160, height: 300 },
  banner: { key: '6d7779116b168574b3e5a6dae21d0222', width: 468, height: 60  },
  pop:    { key: '5ed712a5ab4df37ccd06f8988eaf95a0', width: null, height: null }, // popunder — no iframe
};

function useAdsAllowed() {
  const location = useLocation();
  return !NO_ADS_PAGES.some(p => location.pathname.startsWith(p));
}

/**
 * AdBanner — renders a single iframe ad into a div via script injection.
 */
export const AdBanner = ({ adKey, width, height, className = '' }) => {
  const containerRef = useRef(null);
  const allowed = useAdsAllowed();

  useEffect(() => {
    if (!allowed || !containerRef.current) return;
    containerRef.current.innerHTML = '';

    const optScript = document.createElement('script');
    optScript.text = `atOptions={'key':'${adKey}','format':'iframe','height':${height},'width':${width},'params':{}};`;
    containerRef.current.appendChild(optScript);

    const invokeScript = document.createElement('script');
    invokeScript.src = `https://intermediatenormalconfederate.com/${adKey}/invoke.js`;
    invokeScript.async = true;
    containerRef.current.appendChild(invokeScript);
  }, [adKey, width, height, allowed]);

  if (!allowed) return null;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width, minHeight: height, overflow: 'hidden', flexShrink: 0 }}
    />
  );
};

/**
 * SideAdColumns — two 160x300 columns fixed to the far left and right.
 * Only renders when viewport >= 1440px so they never overlap content.
 * Uses pointer-events-none on the wrapper so they can't block clicks.
 */
export const SideAdColumns = () => {
  const allowed = useAdsAllowed();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => setVisible(window.innerWidth >= 1440);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!allowed || !visible) return null;

  return (
    <>
      {/* Left column */}
      <div
        className="fixed top-1/2 -translate-y-1/2 z-20 pointer-events-none"
        style={{ left: 4 }}
      >
        <div className="pointer-events-auto opacity-80 hover:opacity-100 transition-opacity">
          <AdBanner
            adKey={AD_SLOTS.side.key}
            width={AD_SLOTS.side.width}
            height={AD_SLOTS.side.height}
          />
        </div>
      </div>

      {/* Right column */}
      <div
        className="fixed top-1/2 -translate-y-1/2 z-20 pointer-events-none"
        style={{ right: 4 }}
      >
        <div className="pointer-events-auto opacity-80 hover:opacity-100 transition-opacity">
          <AdBanner
            adKey={AD_SLOTS.side.key}
            width={AD_SLOTS.side.width}
            height={AD_SLOTS.side.height}
          />
        </div>
      </div>
    </>
  );
};

/**
 * BottomAdBar — sticky 468x60 banner pinned to the bottom.
 * Has a dismiss button so it never permanently blocks content.
 */
export const BottomAdBar = () => {
  const allowed = useAdsAllowed();
  const [dismissed, setDismissed] = useState(false);

  if (!allowed || dismissed) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center items-center gap-2
                 bg-black/90 backdrop-blur-sm border-t border-white/10 py-1.5"
      style={{ minHeight: 68 }}
    >
      <AdBanner
        adKey={AD_SLOTS.banner.key}
        width={AD_SLOTS.banner.width}
        height={AD_SLOTS.banner.height}
      />
      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white
                   text-xs leading-none w-5 h-5 flex items-center justify-center
                   rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        aria-label="Close ad"
      >
        ✕
      </button>
    </div>
  );
};

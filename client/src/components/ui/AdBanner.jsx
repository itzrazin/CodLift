import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Pages where ads should NOT show (too cramped or irrelevant)
const NO_ADS_PAGES = ['/login', '/signup', '/auth', '/onboarding', '/admin'];

/**
 * AdBanner — renders an ad network iframe ad.
 * adKey: the key from atOptions
 * width / height: ad dimensions
 */
export const AdBanner = ({ adKey, width, height, className = '' }) => {
  const containerRef = useRef(null);
  const location = useLocation();

  const shouldShow = !NO_ADS_PAGES.some(p => location.pathname.startsWith(p));

  useEffect(() => {
    if (!shouldShow || !containerRef.current) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    // Set atOptions then load the invoke script
    const optScript = document.createElement('script');
    optScript.text = `
      atOptions = {
        'key': '${adKey}',
        'format': 'iframe',
        'height': ${height},
        'width': ${width},
        'params': {}
      };
    `;
    containerRef.current.appendChild(optScript);

    const invokeScript = document.createElement('script');
    invokeScript.src = `https://intermediatenormalconfederate.com/${adKey}/invoke.js`;
    invokeScript.async = true;
    containerRef.current.appendChild(invokeScript);
  }, [adKey, width, height, shouldShow, location.pathname]);

  if (!shouldShow) return null;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width, minHeight: height, overflow: 'hidden' }}
    />
  );
};

/**
 * SideAdColumn — sticky 160x300 ad column for desktop sidebars
 */
export const SideAdColumn = ({ side = 'left' }) => {
  const location = useLocation();
  const shouldShow = !NO_ADS_PAGES.some(p => location.pathname.startsWith(p));
  if (!shouldShow) return null;

  return (
    <div
      className={`hidden xl:flex flex-col items-center gap-4 fixed top-1/2 -translate-y-1/2 z-10
        ${side === 'left' ? 'left-2' : 'right-2'}`}
      style={{ width: 160 }}
    >
      <AdBanner
        adKey="d49b256a7a2ff2c7389db3fce167efe6"
        width={160}
        height={300}
      />
    </div>
  );
};

/**
 * BottomAdBar — sticky 468x60 banner at the bottom of the screen
 */
export const BottomAdBar = () => {
  const location = useLocation();
  const shouldShow = !NO_ADS_PAGES.some(p => location.pathname.startsWith(p));
  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center items-center
                    bg-black/80 backdrop-blur-sm border-t border-white/5 py-1">
      <AdBanner
        adKey="6d7779116b168574b3e5a6dae21d0222"
        width={468}
        height={60}
      />
    </div>
  );
};

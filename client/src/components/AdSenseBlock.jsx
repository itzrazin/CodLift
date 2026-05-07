import React, { useEffect } from 'react';

/**
 * AdSenseBlock Component
 * 
 * A reusable wrapper for Google AdSense units.
 * Supports different formats (auto, horizontal, vertical).
 */
export const AdSenseBlock = ({ slot, format = 'auto', responsive = 'true', className = '' }) => {
  useEffect(() => {
    try {
      // Trigger AdSense push once component is mounted
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className={`adsense-container my-8 overflow-hidden rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center p-4 min-h-[100px] ${className}`}>
      <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-4">Sponsored Content</div>
      
      {/* Actual AdSense Code Block */}
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-5220417269872964"
           data-ad-slot={slot || "7823491023"} // Placeholder slot ID
           data-ad-format={format}
           data-full-width-responsive={responsive}>
      </ins>

      {/* Development Placeholder UI */}
      {process.env.NODE_ENV === 'development' && (
        <div className="w-full py-12 border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center text-gray-500 text-xs italic">
          Google AdSense Placeholder (ID: {slot || 'default'})
        </div>
      )}
    </div>
  );
};

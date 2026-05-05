import React from 'react';

export const AdComponent = ({ type = 'horizontal', className }) => {
  const styles = {
    horizontal: 'w-full h-24',
    vertical: 'w-64 h-[600px]',
    square: 'w-full aspect-square max-w-[300px]'
  };

  return (
    <div className={`bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center p-4 relative overflow-hidden group ${styles[type]} ${className}`}>
      <div className="absolute top-0 right-0 p-1">
        <span className="text-[8px] text-gray-600 font-bold tracking-widest border border-white/10 px-1 rounded uppercase bg-navy/50">Sponsored</span>
      </div>
      
      {/* Mock Ad Content */}
      <div className="text-center space-y-2 opacity-50 group-hover:opacity-100 transition-opacity">
        <div className="w-12 h-12 bg-gray-800 rounded-lg mx-auto flex items-center justify-center">
          <div className="w-6 h-6 bg-cyan/20 rounded rotate-45"></div>
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Build Apps Faster</p>
        <p className="text-[8px] text-gray-600">The #1 Platform for Scale</p>
      </div>
      
      {/* Real AdSense logic would go here:
      <ins className="adsbygoogle"
           style={{display: 'block'}}
           data-ad-client="ca-pub-XXXX"
           data-ad-slot="XXXX"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      */}
    </div>
  );
};

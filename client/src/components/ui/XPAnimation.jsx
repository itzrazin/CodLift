import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

/**
 * XPAnimation — floating "+N XP" toast that auto-dismisses.
 * Enhancement: pulsing glow ring + staggered star particles.
 */
export const XPAnimation = ({ amount }) => {
  const stars = Array.from({ length: 8 });

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
      {/* Staggered star / sparkle particles */}
      {stars.map((_, i) => {
        const angle   = (i / stars.length) * 360;
        const radians = (angle * Math.PI) / 180;
        const tx      = Math.cos(radians) * 90;
        const ty      = Math.sin(radians) * 90;
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-purple"
            style={{ boxShadow: '0 0 6px 2px rgba(168,85,247,0.8)' }}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale:   [0, 1, 0],
              x:       [0, tx],
              y:       [0, ty]
            }}
            transition={{ duration: 0.9, delay: 0.2 + i * 0.04, ease: 'easeOut' }}
          />
        );
      })}

      {/* Main badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.4, y: 60 }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale:   [0.4, 1.15, 1.05, 0.9],
          y:       [60, -10, -20, -100]
        }}
        transition={{ duration: 2.6, times: [0, 0.2, 0.75, 1], ease: 'easeOut' }}
        className="relative"
      >
        {/* Pulsing glow ring */}
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.2, repeat: 2, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-purple/40 blur-[30px]"
        />

        <div className="relative bg-[#0d0f1a] border border-purple/60 px-8 py-4 rounded-full flex items-center gap-3 shadow-[0_0_40px_rgba(168,85,247,0.5)]">
          <div className="w-10 h-10 rounded-full bg-purple/20 flex items-center justify-center">
            <Zap className="w-6 h-6 text-purple drop-shadow-[0_0_8px_rgba(168,85,247,0.9)]" />
          </div>
          <span className="text-3xl font-syne font-extrabold text-white">
            +{amount} <span className="text-purple text-xl">XP</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
};

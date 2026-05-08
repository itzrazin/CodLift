import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export const XPAnimation = ({ amount }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ 
          opacity: [0, 1, 1, 0], 
          scale: [0.5, 1.2, 1, 0.8],
          y: [50, -20, -30, -100]
        }}
        transition={{ duration: 2.5, times: [0, 0.2, 0.8, 1], ease: "easeOut" }}
        className="relative"
      >
        <div className="absolute inset-0 bg-purple blur-[40px] opacity-30 rounded-full" />
        <div className="relative bg-navy border border-purple/50 px-8 py-4 rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
          <div className="w-10 h-10 rounded-full bg-purple/20 flex items-center justify-center">
            <Zap className="w-6 h-6 text-purple drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
          </div>
          <span className="text-3xl font-syne font-extrabold text-white">
            +{amount} <span className="text-purple text-xl">XP</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
};

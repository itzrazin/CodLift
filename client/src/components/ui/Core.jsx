import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-purple text-black hover:bg-purple-light shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]',
    secondary: 'bg-yellow text-black hover:bg-yellow-light shadow-[0_0_20px_rgba(255,214,10,0.3)] hover:shadow-[0_0_30px_rgba(255,214,10,0.5)]',
    ghost: 'bg-transparent border border-white/20 hover:bg-white/10 text-white',
    purpleGhost: 'bg-transparent border border-purple/30 hover:bg-purple/10 text-purple',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base font-semibold',
    lg: 'px-8 py-4 text-lg font-bold',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'relative rounded-full transition-all duration-300 flex items-center justify-center gap-2 group overflow-hidden',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      <div className="relative z-10 flex items-center gap-2">
        {children}
      </div>
    </motion.button>
  );
};

export const GlassCard = ({ children, className, hover = true }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, borderColor: 'rgba(168,85,247,0.3)' } : {}}
      className={cn(
        'glass rounded-2xl p-6 transition-all duration-300',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

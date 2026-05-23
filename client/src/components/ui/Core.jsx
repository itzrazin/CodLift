
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
    primary: 'bg-cyber-pink text-black border-2 border-white hover:bg-white hover:text-black shadow-neo hover:shadow-neo-cyan hover:-translate-y-1',
    secondary: 'bg-cyber-green text-black border-2 border-white hover:bg-white hover:text-black shadow-neo-green hover:shadow-neo hover:-translate-y-1',
    ghost: 'bg-transparent border-2 border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-black shadow-neo-cyan hover:-translate-y-1',
    purpleGhost: 'bg-transparent border-2 border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-black shadow-neo hover:-translate-y-1',
    danger: 'bg-red-500 text-white border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,0,0,1)] hover:bg-red-400 hover:-translate-y-1'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm uppercase tracking-widest font-black',
    md: 'px-6 py-3 text-base uppercase tracking-widest font-black',
    lg: 'px-8 py-4 text-lg uppercase tracking-widest font-black',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95, y: 2, boxShadow: '0px 0px 0px 0px rgba(0,0,0,0)' }}
      className={cn(
        'relative transition-all duration-200 flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      <div className="relative z-10 flex items-center gap-2">
        {children}
      </div>
    </motion.button>
  );
};

export const GlassCard = ({ children, className, hover = true }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, boxShadow: '4px 4px 0px 0px rgba(0,255,255,1)' } : {}}
      className={cn(
        'bg-cyber-dark border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,0,255,0.5)] p-6 transition-all duration-300',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

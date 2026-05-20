import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, Trophy, X } from 'lucide-react';

// ─── Confetti Particle ─────────────────────────────────────────────────────────
const COLORS  = ['#a855f7', '#ffd60a', '#22d3ee', '#f472b6', '#4ade80', '#fb923c'];
const SHAPES  = ['circle', 'square', 'triangle'];
const PARTICLE_COUNT = 60;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function ConfettiParticle({ index }) {
  const color  = COLORS[index % COLORS.length];
  const shape  = SHAPES[index % SHAPES.length];
  const startX = randomBetween(20, 80); // vw %
  const delay  = randomBetween(0, 0.6);
  const dur    = randomBetween(1.4, 2.2);
  const rotate = randomBetween(-360, 360);
  const size   = randomBetween(6, 14);

  const shapeStyle = shape === 'circle'
    ? { borderRadius: '50%' }
    : shape === 'triangle'
    ? {
        width:           0,
        height:          0,
        background:      'transparent',
        borderLeft:      `${size / 2}px solid transparent`,
        borderRight:     `${size / 2}px solid transparent`,
        borderBottom:    `${size}px solid ${color}`
      }
    : { borderRadius: '2px' };

  return (
    <motion.div
      style={{
        position:  'absolute',
        left:      `${startX}%`,
        top:       '-5%',
        width:     shape === 'triangle' ? 0      : size,
        height:    shape === 'triangle' ? 0      : size,
        background: shape === 'triangle' ? 'transparent' : color,
        ...shapeStyle,
        zIndex:    200
      }}
      initial={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
      animate={{
        y:       ['0vh', '110vh'],
        opacity: [1, 1, 0],
        rotate:  [0, rotate],
        scale:   [1, randomBetween(0.5, 1.5), 0.3]
      }}
      transition={{ duration: dur, delay, ease: 'easeIn' }}
    />
  );
}

// ─── Main Modal ────────────────────────────────────────────────────────────────
/**
 * SuccessModal — displayed when a user passes all tests for the first time.
 *
 * Props:
 *   isOpen         boolean
 *   xpEarned       number
 *   breakdown      { speedBonus, streakMultiplier, difficultyMultiplier, ... }
 *   exerciseTitle  string
 *   isLastExercise boolean
 *   onNext         () => void
 *   onClose        () => void
 */
export function SuccessModal({
  isOpen,
  xpEarned = 0,
  breakdown = {},
  exerciseTitle = '',
  isLastExercise = false,
  onNext,
  onClose
}) {
  // Trap focus inside modal for accessibility
  const modalRef = useRef(null);
  useEffect(() => {
    if (isOpen) modalRef.current?.focus();
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Confetti layer */}
          <div className="fixed inset-0 z-[160] pointer-events-none overflow-hidden">
            {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
              <ConfettiParticle key={i} index={i} />
            ))}
          </div>

          {/* Modal card */}
          <motion.div
            key="modal"
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Challenge Complete"
            initial={{ opacity: 0, scale: 0.7, y: 40 }}
            animate={{ opacity: 1, scale: 1,   y: 0  }}
            exit={{   opacity: 0, scale: 0.8,  y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="fixed inset-0 z-[170] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-md bg-[#0d0f1a] border border-purple/30 rounded-3xl p-8 shadow-[0_0_60px_rgba(168,85,247,0.25)] relative overflow-hidden">

              {/* Glow ring behind icon */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-purple/20 blur-3xl pointer-events-none" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Check icon */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0   }}
                transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.15 }}
                className="flex justify-center mb-5"
              >
                <div className="w-20 h-20 rounded-full bg-purple/15 border-2 border-purple/50 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                  <CheckCircle2 className="w-10 h-10 text-purple" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0   }}
                transition={{ delay: 0.25 }}
                className="text-center mb-6"
              >
                <p className="text-[11px] font-black text-purple uppercase tracking-[0.2em] mb-2">
                  🏆 Challenge Complete
                </p>
                <h2 className="text-2xl font-syne font-extrabold text-white mb-1">
                  {exerciseTitle}
                </h2>
                <p className="text-gray-400 text-sm">Proof of correctness verified ✅</p>
              </motion.div>

              {/* Premium XP Breakdown Card */}
              {xpEarned > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10 text-center"
                >
                  <div className="flex items-center justify-center gap-1 text-purple mb-1">
                    <span className="text-4xl font-extrabold text-gradient-purple">+{xpEarned}</span>
                    <span className="text-xl font-bold uppercase tracking-wider">XP</span>
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">Loot Earned</p>

                  <div className="text-xs text-gray-400 space-y-2 text-left border-t border-white/5 pt-3">
                    <div className="flex justify-between">
                      <span>Base XP:</span>
                      <span className="font-bold text-white">+{breakdown.baseXP || 10} XP</span>
                    </div>
                    {breakdown.difficultyMultiplier && breakdown.difficultyMultiplier > 1 && (
                      <div className="flex justify-between">
                        <span>Difficulty Multiplier ({breakdown.difficulty}):</span>
                        <span className="font-bold text-purple">x{breakdown.difficultyMultiplier}</span>
                      </div>
                    )}
                    {breakdown.streakMultiplier && breakdown.streakMultiplier > 1 && (
                      <div className="flex justify-between">
                        <span>Streak Multiplier ({breakdown.streakDays}d streak):</span>
                        <span className="font-bold text-yellow">x{breakdown.streakMultiplier}</span>
                      </div>
                    )}
                    {breakdown.speedBonus && breakdown.speedBonus > 0 ? (
                      <div className="flex justify-between text-cyber-cyan">
                        <span>⚡ Speed Bonus:</span>
                        <span className="font-bold font-mono">+{breakdown.speedBonus} XP</span>
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              )}



              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0  }}
                transition={{ delay: 0.5 }}
                onClick={onNext}
                id="success-modal-next-btn"
                className="w-full py-3.5 rounded-xl bg-purple text-black font-syne font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-purple/90 active:scale-95 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]"
              >
                <Trophy className="w-4 h-4" />
                {isLastExercise ? 'Finish Lesson' : 'Next Challenge'}
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

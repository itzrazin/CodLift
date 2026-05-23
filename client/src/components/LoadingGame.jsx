import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Shield, Heart } from 'lucide-react';

export const LoadingGame = ({ isOpen, onClose, message = "Waking up the backend..." }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameState, setGameState] = useState('playing'); // playing, gameover
  const [highScore, setHighScore] = useState(0);

  // Game constants
  const PLAYER_SIZE = 30;
  const OBSTACLE_SIZE = 20;
  const OBSTACLE_SPEED = 4;
  const SPAWN_RATE = 0.02;

  const gameData = useRef({
    player: { x: 0, y: 0 },
    obstacles: [],
    keys: {},
    frameId: null
  });

  useEffect(() => {
    if (isOpen) {
      setScore(0);
      setLives(3);
      setTimeLeft(45);
      setGameState('playing');
      const savedHighScore = localStorage.getItem('code_rush_highscore') || 0;
      setHighScore(parseInt(savedHighScore));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || gameState === 'gameover') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 400;
      gameData.current.player.x = canvas.width / 2 - PLAYER_SIZE / 2;
      gameData.current.player.y = canvas.height - PLAYER_SIZE - 20;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleKeyDown = (e) => gameData.current.keys[e.key] = true;
    const handleKeyUp = (e) => gameData.current.keys[e.key] = false;
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const gameLoop = () => {
      // Guard clause for null canvas/context
      if (!gameData.current?.frameId || !canvas || !ctx) {
        return; // Safe exit if unmounted
      }

      try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Move player
        if (gameData.current.keys['ArrowLeft'] || gameData.current.keys['a']) {
          gameData.current.player.x = Math.max(0, gameData.current.player.x - 7);
        }
        if (gameData.current.keys['ArrowRight'] || gameData.current.keys['d']) {
          gameData.current.player.x = Math.min(canvas.width - PLAYER_SIZE, gameData.current.player.x + 7);
        }

        // Draw player (Emoji box)
        ctx.fillStyle = '#a855f7'; // purple
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#a855f7';
        ctx.beginPath();
        ctx.roundRect(gameData.current.player.x, gameData.current.player.y, PLAYER_SIZE, PLAYER_SIZE, 8);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Spawn obstacles
        if (Math.random() < SPAWN_RATE + (score / 5000)) {
          gameData.current.obstacles.push({
            x: Math.random() * (canvas.width - OBSTACLE_SIZE),
            y: -OBSTACLE_SIZE,
            speed: OBSTACLE_SPEED + (score / 1000)
          });
        }

        // Update and draw obstacles
        ctx.fillStyle = '#FF2E63'; // Red
        gameData.current.obstacles = gameData.current.obstacles.filter(obs => {
          obs.y += obs.speed;
          
          // Draw obstacle
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, OBSTACLE_SIZE, OBSTACLE_SIZE, 4);
          ctx.fill();

          // Collision check
          const player = gameData.current.player;
          if (
            obs.x < player.x + PLAYER_SIZE &&
            obs.x + OBSTACLE_SIZE > player.x &&
            obs.y < player.y + PLAYER_SIZE &&
            obs.y + OBSTACLE_SIZE > player.y
          ) {
            setLives(l => {
              if (l <= 1) setGameState('gameover');
              return l - 1;
            });
            return false;
          }

          // Score update
          if (obs.y > canvas.height) {
            setScore(s => {
              const newScore = s + 10;
              if (newScore > highScore) {
                setHighScore(newScore);
                localStorage.setItem('code_rush_highscore', newScore);
              }
              return newScore;
            });
            return false;
          }

          return true;
        });

        gameData.current.frameId = requestAnimationFrame(gameLoop);
      } catch (error) {
        console.error('Game loop error:', error);
      }
    };

    gameLoop();

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) return 0;
        return t - 1;
      });
    }, 1000);

    return () => {
      cancelAnimationFrame(gameData.current.frameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', resize);
      clearInterval(timer);
    };
  }, [isOpen, gameState, score, highScore]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#080b10]/95 backdrop-blur-xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-2xl bg-navy/50 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-2xl font-syne font-extrabold tracking-tight flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple" /> CODE RUSH
              </h2>
              <p className="text-gray-500 text-sm">{message}</p>
            </div>
            <div className="flex gap-6 items-center">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Time Left</span>
                <span className={`text-xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                  {timeLeft}s
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Best</span>
                <span className="text-xl font-mono font-bold text-yellow">{highScore}</span>
              </div>
            </div>
          </div>

          {/* Game Body */}
          <div className="p-4 relative">
            <div className="absolute top-8 left-8 z-10 flex gap-4">
              <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 border-white/5">
                <Trophy className="w-4 h-4 text-purple" />
                <span className="font-mono font-bold text-xl">{score}</span>
              </div>
              <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 border-white/5">
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Heart key={i} className={`w-4 h-4 ${i < lives ? 'text-red-500 fill-red-500' : 'text-white/10'}`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#0c121a] rounded-[1.5rem] border border-white/5 overflow-hidden">
              <canvas ref={canvasRef} className="w-full block" />
              
              {gameState === 'gameover' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-[1.5rem] m-4">
                  <div className="text-center p-8 glass border-purple/20">
                    <h3 className="text-3xl font-syne font-extrabold mb-2 text-gradient-purple">GAME OVER</h3>
                    <p className="text-gray-400 mb-6 text-sm">Score: {score}</p>
                    <Button onClick={() => setGameState('playing')} size="sm">Try Again</Button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between px-4">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Controls: WASD or Arrow Keys to move
              </p>
              {timeLeft === 0 && (
                <p className="text-xs text-yellow animate-pulse font-bold">
                  Backend is taking longer than usual...
                </p>
              )}
            </div>
          </div>

          {/* Footer Info */}
          <div className="p-6 bg-purple/5 border-t border-white/5 text-center">
            <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-purple uppercase tracking-widest">
              <span className="animate-pulse">● System Booting</span>
              <span className="text-white/10">|</span>
              <span>Loading Modules</span>
              <span className="text-white/10">|</span>
              <span>Almost Ready</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Internal Button component helper
const Button = ({ children, onClick, size = "md" }) => (
  <button 
    onClick={onClick}
    className={`bg-purple text-black font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.3)]
      ${size === 'sm' ? 'px-6 py-2 text-xs' : 'px-8 py-3 text-sm'}`}
  >
    {children}
  </button>
);

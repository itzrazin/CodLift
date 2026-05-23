import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw,
  Gamepad2, Key, ShieldAlert, Cpu, 
  ShieldCheck, ChevronRight, Zap
} from 'lucide-react';

export default function ArenaPlayground({ challengeId, code }) {
  const [gameState, setGameState] = useState(null);

  const resetGame = useCallback(() => {
    if (challengeId === 'fix-the-counter') {
      setGameState({ count: 0, lastIncrement: null, isError: false, message: 'Arcade Ready.' });
    } else if (challengeId === 'array-compressor') {
      setGameState({
        inputArray: [4, 1, 3, 3, 2, 9, 4, 1],
        outputArray: null,
        animating: false,
        message: 'Compressor idle.'
      });
    } else if (challengeId === 'auth-logic-101') {
      setGameState({
        selectedUser: 'unverified-admin',
        requiredRole: 'editor',
        scanResult: null, // 'granted' | 'denied'
        scanning: false,
        message: 'Scan card to authenticate.'
      });
    } else if (challengeId === 'algorithm-duel') {
      setGameState({
        array: [1, 1, 2, 3, 3, 4, 4, 8, 8],
        left: 0,
        right: 8,
        mid: null,
        history: [],
        step: 0,
        foundIndex: null,
        autoPlaying: false,
        message: 'Ready to search.'
      });
    }
  }, [challengeId]);

  // Initialize or reset game states based on the challengeId
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    resetGame();
  }, [resetGame]);

  // Safe executor of user code
  const executeUserCode = (funcName, args) => {
    try {
      // Create a function constructor scope from the user editor code
      // Shadowing globals to provide a basic sandbox
      const blockedGlobals = ['window', 'document', 'localStorage', 'fetch', 'XMLHttpRequest'];
      const fn = new Function(...blockedGlobals, ...args.names, `
        "use strict";
        ${code}
        if (typeof ${funcName} === 'function') {
          return ${funcName}(${args.names.join(', ')});
        }
        throw new Error("Function ${funcName} is not defined.");
      `);
      return { success: true, value: fn(undefined, undefined, undefined, undefined, undefined, ...args.values) };
    } catch (err) {
      console.warn("User execution failed:", err);
      return { success: false, error: err.message };
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // GAME 1: Fix the Counter
  // ──────────────────────────────────────────────────────────────────────────
  const handleCounterIncrement = () => {
    if (!gameState) return;
    if (challengeId !== 'fix-the-counter') return;

    let currentVal = gameState.count;
    let incrementedVal = currentVal;

    // We pass count and a updater callback to simulate the increment
    const runResult = executeUserCode('increment', {
      names: ['count', 'setCount'],
      values: [currentVal, (val) => { incrementedVal = val; }]
    });

    if (!runResult.success) {
      // Fallback in case user code has syntactic error
      incrementedVal = currentVal + 10; 
      setGameState(prev => ({
        ...prev,
        count: incrementedVal,
        lastIncrement: 10,
        isError: true,
        message: `Syntax Error! Fallback (+10) 🚨`
      }));
      return;
    }

    const diff = incrementedVal - currentVal;
    const isError = diff !== 1;

    setGameState(prev => ({
      ...prev,
      count: incrementedVal,
      lastIncrement: diff,
      isError: isError,
      message: isError 
        ? `FAULT DETECTED: Added +${diff} instead of +1! 🚨`
        : `COUNTER STABLE: Added +1! Perfect! ✅`
    }));
  };

  // ──────────────────────────────────────────────────────────────────────────
  // GAME 2: Array Compressor
  // ──────────────────────────────────────────────────────────────────────────
  const runArrayCompressor = () => {
    if (!gameState) return;
    if (challengeId !== 'array-compressor' || gameState.animating) return;

    setGameState(prev => ({ ...prev, animating: true, message: 'Processing array... ⚡' }));

    setTimeout(() => {
      const runResult = executeUserCode('compress', {
        names: ['arr'],
        values: [[...gameState.inputArray]]
      });

      if (!runResult.success) {
        setGameState(prev => ({
          ...prev,
          outputArray: [],
          animating: false,
          message: `Execution Error: ${runResult.error} ❌`
        }));
        return;
      }

      const out = runResult.value;
      const expected = [1, 3, 9]; // For [4,1,3,3,2,9,4,1]
      
      const isCorrect = Array.isArray(out) && 
        out.length === expected.length && 
        out.every((val, i) => val === expected[i]);

      setGameState(prev => ({
        ...prev,
        outputArray: out,
        animating: false,
        message: isCorrect
          ? 'COMPRESSION PERFECT! Sorted unique odd integers generated! 🏆'
          : 'COMPRESSION FAULTY: Output mismatch. Keep debugging! ⚠️'
      }));
    }, 1200);
  };



  // ──────────────────────────────────────────────────────────────────────────
  // GAME 3: Auth Logic 101
  // ──────────────────────────────────────────────────────────────────────────
  const runAuthScan = () => {
    if (!gameState) return;
    if (challengeId !== 'auth-logic-101' || gameState.scanning) return;

    setGameState(prev => ({ ...prev, scanning: true, scanResult: null, message: 'Decrypting credentials...' }));

    setTimeout(() => {
      // Define the mock user object based on selection
      let testUser = {};
      if (gameState.selectedUser === 'unverified-admin') {
        testUser = { role: 'admin', is_verified: false };
      } else if (gameState.selectedUser === 'verified-admin') {
        testUser = { role: 'admin', is_verified: true };
      } else if (gameState.selectedUser === 'verified-editor') {
        testUser = { role: 'editor', is_verified: true };
      } else if (gameState.selectedUser === 'unverified-editor') {
        testUser = { role: 'editor', is_verified: false };
      }

      const runResult = executeUserCode('authorize', {
        names: ['user', 'requiredRole'],
        values: [testUser, gameState.requiredRole]
      });

      if (!runResult.success) {
        setGameState(prev => ({
          ...prev,
          scanning: false,
          scanResult: 'denied',
          message: `Auth Code Error: ${runResult.error} ❌`
        }));
        return;
      }

      const granted = runResult.value === true;

      setGameState(prev => ({
        ...prev,
        scanning: false,
        scanResult: granted ? 'granted' : 'denied',
        message: granted
          ? 'ACCESS GRANTED: Authorization validation verified! 🔓'
          : 'ACCESS DENIED: Insufficient credentials or unverified profile! 🔒'
      }));
    }, 1000);
  };

  // ──────────────────────────────────────────────────────────────────────────
  // GAME 4: Algorithm Duel (O(log n) Single Non-Duplicate Search)
  // ──────────────────────────────────────────────────────────────────────────
  const stepBinarySearch = () => {
    if (!gameState) return;
    if (challengeId !== 'algorithm-duel') return;

    setGameState(prev => {
      if (!prev) return prev;
      let { left, right, array, step, history } = prev;
      
      if (left >= right) {
        return {
          ...prev,
          foundIndex: left,
          autoPlaying: false,
          message: `Binary Search complete. Element found at index ${left}: ${array[left]} 🎯`
        };
      }

      let mid = Math.floor((left + right) / 2);
      const startMid = mid;
      if (mid % 2 === 1) mid--;

      let nextLeft = left;
      let nextRight = right;

      if (array[mid] === array[mid + 1]) {
        nextLeft = mid + 2;
      } else {
        nextRight = mid;
      }

      const newHistory = [...history, { step: step + 1, left, right, mid: startMid, nextLeft, nextRight }];

      return {
        ...prev,
        left: nextLeft,
        right: nextRight,
        mid: startMid,
        step: step + 1,
        history: newHistory,
        message: `Step ${step + 1}: Split array at index ${startMid}. New bounds [${nextLeft}, ${nextRight}].`
      };
    });
  };

  useEffect(() => {
    if (challengeId === 'algorithm-duel' && gameState?.autoPlaying) {
      const timer = setInterval(() => {
        stepBinarySearch();
      }, 1000);
      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengeId, gameState?.autoPlaying]);


  return (
    <div className="w-full h-full bg-[#0d0f17] border border-white/5 rounded-2xl flex flex-col overflow-hidden select-none">
      {/* Game Frame Header */}
      <div className="px-5 py-3.5 bg-navy-dark border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-purple animate-pulse" />
          <span className="text-xs font-syne font-black uppercase tracking-wider text-purple">Playable Game Simulator</span>
        </div>
        <button 
          onClick={resetGame}
          className="p-1 text-gray-500 hover:text-white hover:bg-white/5 rounded transition-all"
          title="Reset Game"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Game Screen */}
      <div className="flex-1 p-5 flex flex-col justify-between overflow-y-auto custom-scrollbar">

        {/* ─── SCENARIO 1: FIX THE COUNTER ─── */}
        {challengeId === 'fix-the-counter' && gameState && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 my-auto">
            {/* Arcade Cabinet Style Counter */}
            <div className="relative w-full max-w-[240px] bg-black border-4 border-purple/40 rounded-3xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.15)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-purple/5 to-transparent pointer-events-none" />
              
              {/* LED digital screen */}
              <div className={`w-full py-4 px-2 bg-purple/5 border border-purple/20 rounded-xl mb-6 flex flex-col items-center justify-center font-mono transition-all ${gameState.isError ? 'shadow-[0_0_15px_rgba(239,68,68,0.2)] border-red-500/30' : 'shadow-[0_0_15px_rgba(168,85,247,0.2)]'}`}>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Clicks</span>
                <span className={`text-4xl font-extrabold tracking-tighter ${gameState.isError ? 'text-red-400' : 'text-purple'}`}>
                  {gameState.count}
                </span>
                {gameState.lastIncrement !== null && (
                  <motion.span 
                    key={gameState.count}
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-xs font-bold mt-1 ${gameState.isError ? 'text-red-400' : 'text-emerald-400'}`}
                  >
                    {gameState.lastIncrement > 0 ? `+${gameState.lastIncrement}` : gameState.lastIncrement}
                  </motion.span>
                )}
              </div>

              {/* Push Button */}
              <button 
                onClick={handleCounterIncrement}
                className="w-24 h-24 mx-auto rounded-full bg-gradient-to-b from-red-500 to-red-700 active:from-red-600 active:to-red-800 border-b-[6px] border-red-900 active:border-b-[2px] active:translate-y-[4px] shadow-[0_6px_20px_rgba(239,68,68,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full border border-white/20 bg-red-400/10 flex items-center justify-center font-syne font-black text-xs text-white uppercase tracking-tighter">
                  CLICK!
                </div>
              </button>
            </div>
            
            {/* Status Panel */}
            <div className={`w-full max-w-[280px] p-3 text-center border rounded-xl font-mono text-xs ${gameState.isError ? 'bg-red-500/5 border-red-500/20 text-red-400' : gameState.lastIncrement === 1 ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>
              {gameState.message}
            </div>
          </div>
        )}

        {/* ─── SCENARIO 2: ARRAY COMPRESSOR ─── */}
        {challengeId === 'array-compressor' && gameState && (
          <div className="flex-1 flex flex-col justify-center gap-6 my-auto">
            {/* Input list display */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Unsorted Raw Input Array</span>
              <div className="flex flex-wrap gap-1.5 p-3.5 bg-navy-light rounded-xl border border-white/5 min-h-[50px] items-center">
                {gameState.inputArray.map((val, idx) => (
                  <motion.span 
                    key={`${val}-${idx}`} 
                    layout
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm ${val % 2 === 0 ? 'bg-gray-800 text-gray-500' : 'bg-purple/15 text-purple border border-purple/30'}`}
                  >
                    {val}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Compressor Animation Furnace */}
            <div className="relative h-24 border border-white/5 rounded-2xl bg-black overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-purple/10 via-transparent to-purple/10 pointer-events-none" />
              {gameState.animating ? (
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex gap-1 animate-pulse">
                    <Cpu className="w-5 h-5 text-purple animate-spin" />
                  </div>
                  <span className="text-[9px] font-mono text-purple animate-pulse uppercase tracking-widest">Running uniqueOddCompress()...</span>
                </div>
              ) : (
                <button
                  onClick={runArrayCompressor}
                  className="px-5 py-2.5 rounded-xl bg-purple text-black font-syne font-black text-xs uppercase tracking-wider hover:bg-purple/90 active:scale-95 transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" /> Pull handle to Compress
                </button>
              )}
            </div>

            {/* Output display */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Sorted Compressed Output</span>
              <div className="flex flex-wrap gap-1.5 p-3.5 bg-navy-light rounded-xl border border-white/5 min-h-[50px] items-center">
                {gameState.outputArray ? (
                  gameState.outputArray.length > 0 ? (
                    gameState.outputArray.map((val, idx) => (
                      <motion.span 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        key={`out-${val}-${idx}`}
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm bg-yellow/15 text-yellow border border-yellow/30 shadow-[0_0_8px_rgba(234,179,8,0.2)]"
                      >
                        {val}
                      </motion.span>
                    ))
                  ) : (
                    <span className="text-xs text-red-400 italic">Empty output. Fix your compress() return array.</span>
                  )
                ) : (
                  <span className="text-xs text-gray-600 italic">Outputs will generate here after compression.</span>
                )}
              </div>
            </div>

            {/* Status Panel */}
            <div className="p-3 text-center border border-white/10 bg-white/5 rounded-xl font-mono text-xs text-gray-400">
              {gameState.message}
            </div>
          </div>
        )}

        {/* ─── SCENARIO 3: AUTH LOGIC 101 ─── */}
        {challengeId === 'auth-logic-101' && gameState && (
          <div className="flex-1 flex flex-col justify-center gap-5 my-auto">
            {/* Identity Profile Cards Selector */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'verified-admin', role: 'admin', verified: true, label: 'Admin (Verified)' },
                { id: 'unverified-admin', role: 'admin', verified: false, label: 'Admin (Unverified)' },
                { id: 'verified-editor', role: 'editor', verified: true, label: 'Editor (Verified)' },
                { id: 'unverified-editor', role: 'editor', verified: false, label: 'Editor (Unverified)' }
              ].map(card => (
                <button
                  key={card.id}
                  onClick={() => setGameState(prev => ({ ...prev, selectedUser: card.id, scanResult: null, message: `Loaded user: ${card.label}.` }))}
                  className={`p-3 text-left border rounded-xl flex flex-col gap-1 transition-all ${gameState.selectedUser === card.id ? 'bg-purple/10 border-purple/50 shadow-[0_0_10px_rgba(168,85,247,0.15)]' : 'bg-navy-light/40 border-white/5 hover:border-white/20'}`}
                >
                  <span className="text-[11px] font-bold text-white block">{card.label}</span>
                  <div className="flex gap-1.5 items-center">
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 font-mono text-gray-400 uppercase tracking-widest">{card.role}</span>
                    <span className={`text-[8px] font-bold ${card.verified ? 'text-emerald-400' : 'text-red-400'}`}>{card.verified ? 'VERIFIED' : 'UNVERIFIED'}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Decryptor Gate Scanner */}
            <div className="relative border border-white/5 rounded-2xl bg-black p-4 flex flex-col items-center justify-center min-h-[140px] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-navy-dark to-transparent pointer-events-none" />

              {/* Scanning laser line */}
              {gameState.scanning && (
                <motion.div 
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 1.0, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple to-transparent z-10"
                />
              )}

              {/* Display Result Badge */}
              <AnimatePresence mode="wait">
                {gameState.scanResult === 'granted' ? (
                  <motion.div 
                    initial={{ scale: 0, rotate: -10 }} 
                    animate={{ scale: 1, rotate: 0 }} 
                    className="flex flex-col items-center gap-1 text-center"
                  >
                    <ShieldCheck className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                    <span className="text-xs font-mono font-black text-emerald-400 uppercase tracking-widest">ACCESS GRANTED 🔓</span>
                  </motion.div>
                ) : gameState.scanResult === 'denied' ? (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="flex flex-col items-center gap-1 text-center"
                  >
                    <ShieldAlert className="w-10 h-10 text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]" />
                    <span className="text-xs font-mono font-black text-red-400 uppercase tracking-widest">ACCESS DENIED 🔒</span>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center text-gray-500">
                    <Key className="w-8 h-8 opacity-30" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Gatekeeper Lock: Required Role = "{gameState.requiredRole}"</span>
                  </div>
                )}
              </AnimatePresence>

              {!gameState.scanning && !gameState.scanResult && (
                <button
                  onClick={runAuthScan}
                  className="mt-4 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-purple/30 text-white font-syne font-bold text-xs uppercase tracking-wider hover:bg-purple/5 transition-all"
                >
                  Scan ID Card ⚡
                </button>
              )}
            </div>

            {/* Status Panel */}
            <div className="p-3 text-center border border-white/10 bg-white/5 rounded-xl font-mono text-xs text-gray-400">
              {gameState.message}
            </div>
          </div>
        )}

        {/* ─── SCENARIO 4: ALGORITHM DUEL ─── */}
        {challengeId === 'algorithm-duel' && gameState && (
          <div className="flex-1 flex flex-col justify-center gap-4 my-auto">
            {/* Sorted Array Bridge */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Sorted Array Space</span>
              <div className="grid grid-cols-9 gap-1 p-2 bg-black rounded-xl border border-white/5 relative">
                {gameState.array.map((val, idx) => {
                  const isLeft = idx === gameState.left;
                  const isRight = idx === gameState.right;
                  const isMid = idx === gameState.mid;
                  const isFound = idx === gameState.foundIndex;
                  const isInactive = idx < gameState.left || idx > gameState.right;

                  let cardStyle = 'bg-navy-light text-gray-300 border-white/5';
                  if (isInactive) cardStyle = 'bg-gray-900/40 text-gray-700 border-transparent';
                  if (isMid) cardStyle = 'bg-yellow/15 text-yellow border-yellow/50 shadow-[0_0_8px_rgba(234,179,8,0.2)]';
                  if (isFound) cardStyle = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/50 shadow-[0_0_12px_rgba(52,211,153,0.3)]';

                  return (
                    <div 
                      key={idx}
                      className={`relative aspect-square rounded-lg flex flex-col items-center justify-center font-mono font-bold text-xs border ${cardStyle} transition-all duration-300`}
                    >
                      <span>{val}</span>
                      
                      {/* Pointers display */}
                      <div className="absolute -bottom-5 flex flex-wrap gap-0.5 justify-center z-10">
                        {isLeft && <span className="text-[7px] font-black text-purple bg-purple/10 border border-purple/30 px-0.5 rounded">L</span>}
                        {isRight && <span className="text-[7px] font-black text-cyan-400 bg-cyan-400/10 border border-cyan-400/30 px-0.5 rounded">R</span>}
                        {isMid && <span className="text-[7px] font-black text-yellow bg-yellow/10 border border-yellow/30 px-0.5 rounded">M</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stepper controls */}
            <div className="flex gap-2 justify-center mt-5">
              <button
                onClick={stepBinarySearch}
                disabled={gameState.left >= gameState.right || gameState.autoPlaying}
                className="px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-purple/30 text-white font-syne font-bold text-xs uppercase tracking-wider hover:bg-purple/5 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1"
              >
                Step Search <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setGameState(prev => ({ ...prev, autoPlaying: !prev.autoPlaying }))}
                disabled={gameState.left >= gameState.right}
                className={`px-3.5 py-2 rounded-lg font-syne font-bold text-xs uppercase tracking-wider active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1 ${gameState.autoPlaying ? 'bg-purple text-black' : 'bg-white/5 border border-white/10 hover:border-purple/30 text-white'}`}
              >
                {gameState.autoPlaying ? 'Pause' : 'Auto Run ⚡'}
              </button>
            </div>

            {/* Status Panel */}
            <div className="p-3 text-center border border-white/10 bg-white/5 rounded-xl font-mono text-xs text-gray-400 min-h-[50px] flex items-center justify-center">
              {gameState.message}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

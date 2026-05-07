import React from 'react';
import { motion } from 'framer-motion';
import { Button, GlassCard } from '../components/ui/Core';
import { 
  Gamepad2, Trophy, Clock, Zap, 
  Search, Filter, ChevronRight, Star,
  Bug, Scissors, Rocket, Sword
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChallengeCard = ({ title, type, difficulty, xp, icon: Icon, color }) => (
  <GlassCard className="p-6 group cursor-pointer border-white/5 hover:border-cyan/30">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-opacity-100 group-hover:scale-110 transition-transform`}>
        <Icon className="w-8 h-8" />
      </div>
      <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
        <Star className="w-3 h-3 text-yellow" />
        <span className="text-[10px] font-bold text-gray-400">{difficulty}</span>
      </div>
    </div>
    
    <h3 className="text-xl font-bold mb-2 group-hover:text-cyan transition-colors">{title}</h3>
    <p className="text-sm text-gray-500 mb-6 uppercase tracking-widest font-bold">{type}</p>
    
    <div className="flex items-center justify-between pt-6 border-t border-white/5">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-cyan" />
        <span className="text-sm font-bold text-cyan">+{xp} XP</span>
      </div>
      <Button size="sm" variant="ghost" className="group-hover:bg-cyan group-hover:text-black group-hover:border-cyan">
        Battle <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  </GlassCard>
);

const Arena = () => {
  const challenges = [
    {
      title: "Fix the Counter",
      type: "Fix the Bug",
      difficulty: "BEGINNER",
      xp: 250,
      icon: Bug,
      color: "text-red-400 bg-red-400"
    },
    {
      title: "Array Compressor",
      type: "Code Golf",
      difficulty: "PRO",
      xp: 500,
      icon: Scissors,
      color: "text-yellow bg-yellow"
    },
    {
      title: "Auth Logic 101",
      type: "Build in 15",
      difficulty: "MASTER",
      xp: 750,
      icon: Rocket,
      color: "text-cyan bg-cyan"
    },
    {
      title: "Algorithm Duel",
      type: "Coding Battle",
      difficulty: "MASTER",
      xp: 1000,
      icon: Sword,
      color: "text-purple-400 bg-purple-400"
    }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Reusing Sidebar Logic or just Layout */}
      {/* For brevity, I'll assume the Dashboard layout is a wrapper, but for this file I'll make it standalone or use components */}
      
      <main className="flex-1 p-10 max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow/10 rounded-lg">
                <Gamepad2 className="w-6 h-6 text-yellow" />
              </div>
              <h1 className="text-4xl font-syne font-extrabold tracking-tight">Challenge <span className="text-gradient-yellow">Arena</span></h1>
            </div>
            <p className="text-gray-400 max-w-xl">
              Battle against the clock or other users. Prove your skills through 
              practical coding challenges and climb the global leaderboard.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search challenges..." 
                className="bg-navy border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-yellow/50 transition-colors w-64"
              />
            </div>
            <Button variant="ghost">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {challenges.map((c, i) => (
            <ChallengeCard key={i} {...c} />
          ))}
          
          {/* Locked Challenges */}
          <GlassCard className="p-6 border-white/5 opacity-50 relative overflow-hidden group">
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy/60 backdrop-blur-[2px] z-10">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2">
                <Trophy className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Unlock at Level 10</p>
            </div>
            <div className="mb-6 p-4 rounded-2xl bg-gray-800 w-fit">
              <Rocket className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Master Architecture</h3>
            <p className="text-sm text-gray-700 mb-6 uppercase tracking-widest font-bold">Build in 30</p>
          </GlassCard>
        </section>

        {/* Global Leaderboard Snapshot */}
        <section className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-syne font-extrabold">Top <span className="text-cyan">Gladiators</span></h2>
            <Button variant="ghost" size="sm">View Full Leaderboard</Button>
          </div>
          
          <div className="glass rounded-[2rem] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-gray-500">
                  <th className="px-8 py-4 font-bold">Rank</th>
                  <th className="px-8 py-4 font-bold">User</th>
                  <th className="px-8 py-4 font-bold">Challenges Won</th>
                  <th className="px-8 py-4 font-bold">Win Rate</th>
                  <th className="px-8 py-4 font-bold">XP</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { rank: 1, user: "ByteBandit", won: 142, rate: "94%", xp: "45,200", color: "text-yellow" },
                  { rank: 2, user: "ReactRacer", won: 128, rate: "89%", xp: "38,150", color: "text-gray-300" },
                  { rank: 3, user: "NodeNinja", won: 115, rate: "82%", xp: "32,900", color: "text-orange-400" },
                  { rank: 4, user: "CodeKing", won: 98, rate: "78%", xp: "28,400", color: "text-white" },
                ].map((row, i) => (
                  <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors group">
                    <td className={`px-8 py-6 font-bold ${row.color}`}>#{row.rank}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-800"></div>
                        <span className="font-bold group-hover:text-cyan transition-colors">{row.user}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-gray-400">{row.won}</td>
                    <td className="px-8 py-6 text-gray-400">{row.rate}</td>
                    <td className="px-8 py-6 font-bold text-white">{row.xp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};
export default Arena;

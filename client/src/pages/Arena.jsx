import React, { useState } from 'react';

import { Button, GlassCard } from '../components/ui/Core';
import { 
  Search, Filter, ChevronRight, Star,
  Rocket, Trophy, Gamepad2, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { arenaChallenges } from '../data/challenges';
import { useLesson } from '../context/LessonContext';

const ChallengeCard = ({ id, title, type, difficulty, icon: Icon, color, isCompleted }) => {
  const navigate = useNavigate();
  return (
    <GlassCard 
      onClick={() => navigate(`/learn/arena/${id}/1`)}
      className="p-6 group cursor-pointer border-white/5 hover:border-purple/30"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-opacity-100 group-hover:scale-110 transition-transform`}>
          <Icon className="w-8 h-8" />
        </div>
        <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          <Star className="w-3 h-3 text-yellow" />
          <span className="text-[10px] font-bold text-gray-400">{difficulty}</span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-2 group-hover:text-purple transition-colors">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 uppercase tracking-widest font-bold">{type}</p>
      
      <div className="flex items-center justify-between pt-6 border-t border-white/5">
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-xs font-bold uppercase tracking-wider">Solved</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Unsolved</span>
            </div>
          )}
        </div>
        <Button size="sm" variant="ghost" className="group-hover:bg-purple group-hover:text-black group-hover:border-purple">
          {isCompleted ? 'Replay' : 'Battle'} <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </GlassCard>
  );
};

const Arena = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { completedLessons, loadingProgress } = useLesson();

  if (loadingProgress) return null;

  const filteredChallenges = arenaChallenges.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background text-white">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-navy border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-yellow/50 transition-colors w-64"
              />
            </div>
            <Button variant="ghost">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredChallenges.map((c) => {
            const isCompleted = c.exercises.every((exercise) => 
              !!completedLessons[c.id]?.[exercise.id]?.completed || false
            );
            return (
              <ChallengeCard 
                key={c.id} 
                {...c} 
                isCompleted={isCompleted} 
              />
            );
          })}
          
          {/* Locked Challenges */}
          <GlassCard className="p-6 border-white/5 opacity-50 relative overflow-hidden group">
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy/60 backdrop-blur-[2px] z-10">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2">
                <Trophy className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Coming Soon</p>
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
            <h2 className="text-2xl font-syne font-extrabold">Top <span className="text-purple">Gladiators</span></h2>
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
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { rank: 1, user: "ByteBandit", won: 142, rate: "94%", color: "text-yellow" },
                  { rank: 2, user: "ReactRacer", won: 128, rate: "89%", color: "text-gray-300" },
                  { rank: 3, user: "NodeNinja", won: 115, rate: "82%", color: "text-orange-400" },
                  { rank: 4, user: "CodeKing", won: 98, rate: "78%", color: "text-white" },
                ].map((row, i) => (
                  <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors group">
                    <td className={`px-8 py-6 font-bold ${row.color}`}>#{row.rank}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-800"></div>
                        <span className="font-bold group-hover:text-purple transition-colors">{row.user}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-gray-400">{row.won}</td>
                    <td className="px-8 py-6 text-gray-400">{row.rate}</td>
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

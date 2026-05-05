import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, GlassCard } from './ui/Core';
import { 
  Trophy, Medal, Crown, Search, 
  ArrowUpRight, Users, Globe, Filter,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RankRow = ({ rank, user, xp, level, streak, trend }) => (
  <tr className="border-t border-white/5 hover:bg-white/5 transition-all group">
    <td className="px-8 py-6">
      <div className="flex items-center gap-4">
        <span className={`text-lg font-black ${
          rank === 1 ? 'text-yellow' : rank === 2 ? 'text-gray-300' : rank === 3 ? 'text-orange-400' : 'text-gray-600'
        }`}>
          {rank === 1 ? <Crown className="w-5 h-5 inline mr-2" /> : rank === 2 || rank === 3 ? <Medal className="w-5 h-5 inline mr-2" /> : null}
          {rank.toString().padStart(2, '0')}
        </span>
      </div>
    </td>
    <td className="px-8 py-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center">
          <User className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <p className="font-bold group-hover:text-cyan transition-colors">{user}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Level {level}</p>
        </div>
      </div>
    </td>
    <td className="px-8 py-6">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan"></div>
        <span className="font-bold text-white">{xp} XP</span>
      </div>
    </td>
    <td className="px-8 py-6">
      <span className="text-gray-400 font-medium">{streak} Days</span>
    </td>
    <td className="px-8 py-6">
      {trend === 'up' ? (
        <span className="text-green-400 flex items-center gap-1 text-xs">
          <ArrowUpRight className="w-3 h-3" /> +4
        </span>
      ) : (
        <span className="text-gray-600 text-xs">—</span>
      )}
    </td>
  </tr>
);

export const LeaderboardPage = () => {
  const [filter, setFilter] = useState('all-time');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-cyan/10 rounded-2xl">
                <Trophy className="w-8 h-8 text-cyan" />
              </div>
              <h1 className="text-4xl font-syne font-extrabold tracking-tight">Global <span className="text-gradient-cyan">Leaderboard</span></h1>
            </div>
            <p className="text-gray-400">The top coders from around the world. Keep building to climb the ranks!</p>
          </div>

          <div className="flex gap-4">
            <div className="flex bg-navy p-1 rounded-xl border border-white/5">
              {['weekly', 'all-time'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${
                    filter === f ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { rank: 2, user: "ReactRacer", xp: "38,150", level: 12, streak: 24, color: "border-gray-400/20" },
            { rank: 1, user: "ByteBandit", xp: "45,200", level: 15, streak: 42, color: "border-yellow/30", highlight: true },
            { rank: 3, user: "NodeNinja", xp: "32,900", level: 10, streak: 18, color: "border-orange-400/20" }
          ].sort((a, b) => (a.rank === 1 ? -1 : b.rank === 1 ? 1 : a.rank - b.rank)).map((p, i) => (
            <GlassCard key={i} className={`p-8 text-center relative overflow-hidden ${p.color} ${p.highlight ? 'scale-105 shadow-[0_0_50px_rgba(255,214,10,0.1)]' : ''}`}>
              {p.highlight && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow to-transparent"></div>
              )}
              <div className="relative mb-6 mx-auto w-24 h-24">
                <div className="w-full h-full rounded-full bg-gray-800 border-2 border-white/10 overflow-hidden flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-600" />
                </div>
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-black text-black text-sm ${
                  p.rank === 1 ? 'bg-yellow' : p.rank === 2 ? 'bg-gray-300' : 'bg-orange-400'
                }`}>
                  {p.rank}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1">{p.user}</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 font-bold">Level {p.level}</p>
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">XP</p>
                  <p className="text-cyan font-bold">{p.xp}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Streak</p>
                  <p className="text-yellow font-bold">{p.streak}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Main Table */}
        <GlassCard className="p-0 overflow-hidden border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <th className="px-8 py-5">Rank</th>
                <th className="px-8 py-5">Learner</th>
                <th className="px-8 py-5">Total XP</th>
                <th className="px-8 py-5">Streak</th>
                <th className="px-8 py-5">Trend</th>
              </tr>
            </thead>
            <tbody>
              {[
                { rank: 4, user: "CodeKing", xp: "28,400", level: 9, streak: 12, trend: 'up' },
                { rank: 5, user: "SyntaxSam", xp: "25,100", level: 8, streak: 8, trend: 'none' },
                { rank: 6, user: "PythonPete", xp: "22,950", level: 8, streak: 31, trend: 'up' },
                { rank: 7, user: "AlgoAlice", xp: "21,400", level: 7, streak: 5, trend: 'none' },
                { rank: 8, user: "DockerDave", xp: "19,800", level: 7, streak: 14, trend: 'up' },
                { rank: 9, user: "VimVictory", xp: "18,200", level: 6, streak: 2, trend: 'none' },
                { rank: 10, user: "GitGud", xp: "17,500", level: 6, streak: 10, trend: 'none' },
              ].map((row, i) => (
                <RankRow key={i} {...row} />
              ))}
            </tbody>
          </table>
          <div className="p-6 bg-white/5 text-center">
            <Button variant="ghost" className="text-xs">Load More</Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/Core';
import { Trophy, Medal, Crown, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { SEO } from '../utils/SEO';

const PLACEHOLDER = [
  { rank: 1, username: 'ByteBandit',   level: 'master',       lessons_completed: 87 },
  { rank: 2, username: 'ReactRacer',   level: 'pro',          lessons_completed: 71 },
  { rank: 3, username: 'NodeNinja',    level: 'pro',          lessons_completed: 63 },
  { rank: 4, username: 'CodeKing',     level: 'pro',          lessons_completed: 55 },
  { rank: 5, username: 'AlgoAlice',    level: 'intermediate', lessons_completed: 44 },
  { rank: 6, username: 'PythonPete',   level: 'intermediate', lessons_completed: 38 },
  { rank: 7, username: 'CSSChampion', level: 'beginner',     lessons_completed: 29 },
  { rank: 8, username: 'GitGud',       level: 'beginner',     lessons_completed: 22 },
];

const levelColors = {
  master: 'text-purple-400', pro: 'text-blue-400',
  intermediate: 'text-yellow', beginner: 'text-green-400',
};

const RankBadge = ({ rank }) => {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-orange-400" />;
  return <span className="text-gray-600 font-black text-sm">{String(rank).padStart(2, '0')}</span>;
};

const LeaderboardPage = () => {
  const [filter, setFilter] = useState('all-time');
  const [data, setData] = useState(PLACEHOLDER);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/leaderboard?period=${filter}`);
        if (res.data.leaderboard?.length > 0) setData(res.data.leaderboard);
      } catch {
        // Use placeholder on error
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [filter]);

  const top3 = data.slice(0, 3);
  const rest  = data.slice(3);

  // Podium order: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  return (
    <div className="min-h-screen bg-background text-white">
      <SEO title="Global Leaderboard | CodLift" description="See the top coders on CodLift." url="/leaderboard" />

      {/* Top bar */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center gap-4 sticky top-0 bg-navy/80 backdrop-blur-md z-10">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-purple" />
          <span className="font-syne font-extrabold">Global Leaderboard</span>
        </div>
        <div className="ml-auto flex bg-navy p-1 rounded-xl border border-white/5 gap-1">
          {['weekly', 'all-time'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                filter === f ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Podium */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {podiumOrder.map((p, i) => (
            <motion.div
              key={p?.username}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className={`p-6 text-center relative overflow-hidden ${
                p?.rank === 1 ? 'border-yellow/30 shadow-[0_0_40px_rgba(255,214,10,0.08)] scale-105' :
                p?.rank === 2 ? 'border-gray-400/20' : 'border-orange-400/20'
              }`}>
                {p?.rank === 1 && (
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow to-transparent" />
                )}
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="w-full h-full rounded-full bg-gray-800 border-2 border-white/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-black font-black text-xs ${
                    p?.rank === 1 ? 'bg-yellow' : p?.rank === 2 ? 'bg-gray-300' : 'bg-orange-400'
                  }`}>{p?.rank}</div>
                </div>
                <h3 className="font-bold mb-1 truncate">{p?.username}</h3>
                <p className={`text-[10px] uppercase font-black tracking-widest mb-3 ${levelColors[p?.level] || 'text-gray-500'}`}>{p?.level}</p>
                <div className="flex justify-center text-xs">
                  <span className="flex items-center gap-1.5 text-purple-400 font-bold">
                    <Trophy className="w-3.5 h-3.5" />
                    {p?.lessons_completed} Lessons
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <GlassCard className="p-0 overflow-hidden border-white/5">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Loading rankings...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Learner</th>
                  <th className="px-6 py-4">Lessons</th>
                </tr>
              </thead>
              <tbody>
                {rest.map((row, i) => (
                  <motion.tr
                    key={row.rank}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`border-t border-white/5 hover:bg-white/5 transition-all group ${
                      (user?.name || user?.username) === row.username ? 'bg-purple/5 border-purple/20' : ''
                    }`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 w-8">
                        <RankBadge rank={row.rank} />
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-bold text-sm group-hover:text-purple transition-colors">
                            {row.username}
                            {(user?.name || user?.username) === row.username && <span className="ml-2 text-[9px] text-purple font-black uppercase tracking-widest">You</span>}
                          </p>
                          <p className={`text-[10px] uppercase font-black tracking-wider ${levelColors[row.level] || 'text-gray-500'}`}>{row.level}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-bold text-white flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-purple" />{row.lessons_completed}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
export default LeaderboardPage;

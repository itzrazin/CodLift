import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../components/ui/Core';
import { Users, Zap, BookOpen, ShieldAlert, Ticket, UserCheck, TrendingUp, Activity } from 'lucide-react';
import api from '../../api/axios';

const OverviewTab = () => {
  const [stats, setStats] = useState(null);
  const [growthData, setGrowthData] = useState([]);
  const [topLearners, setTopLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchStats = async () => {
    try {
      const [statsRes, growthRes, learnersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/stats/growth'),
        api.get('/admin/stats/top-learners')
      ]);
      setStats(statsRes.data.stats);
      setGrowthData(growthRes.data.data);
      setTopLearners(learnersRes.data.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchStats, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  if (error) return (
    <div className="text-center py-20 text-red-500 font-mono text-xs uppercase tracking-widest">
      Failed to load dashboard data — check API connection
    </div>
  );

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const primaryStats = [
    { label: 'Total Learners', value: stats.totalUsers, icon: Users, color: 'text-blue-400' },
    { label: 'Active Users (7d)', value: stats.activeUsers7d, icon: Activity, color: 'text-cyber-cyan' },
    { label: 'Total XP Earned', value: stats.totalXp.toLocaleString(), icon: Zap, color: 'text-yellow' },
    { label: 'Lessons Completed', value: stats.totalCompleted, icon: BookOpen, color: 'text-purple' }
  ];

  const secondaryStats = [
    { label: 'Banned Users', value: stats.bannedUsers, icon: ShieldAlert, color: 'text-red-400' },
    { label: 'Open Inquiries', value: stats.openInquiries, icon: Ticket, color: 'text-orange-400' },
    { label: 'Total Admins', value: stats.totalAdmins, icon: UserCheck, color: 'text-emerald-400' },
    { label: 'New Users (7d)', value: stats.newUsers7d, icon: TrendingUp, color: 'text-cyber-pink' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-syne font-black uppercase tracking-tight">System Overview</h2>
        <button 
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`px-4 py-2 rounded-lg font-mono text-[10px] font-bold border transition-all ${autoRefresh ? 'bg-cyber-green/20 border-cyber-green text-cyber-green shadow-[0_0_15px_rgba(0,255,0,0.2)]' : 'bg-white/5 border-white/10 text-gray-500'}`}
        >
          {autoRefresh ? 'AUTO-REFRESH: ON' : 'AUTO-REFRESH: OFF'}
        </button>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryStats.map((stat, i) => (
          <GlassCard key={i} className="p-6 border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-syne font-black mt-1">{stat.value}</h3>
          </GlassCard>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryStats.map((stat, i) => (
          <GlassCard key={i} className="p-5 border-white/5 bg-navy/20">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-xl font-syne font-black">{stat.value}</h3>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-6 border-white/5">
          <h3 className="text-lg font-syne font-black uppercase tracking-tight mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyber-pink" /> 30-Day Growth
          </h3>
          <div className="h-64 flex items-end gap-1">
            {growthData.map((day, i) => {
              const max = Math.max(...growthData.map(d => parseInt(d.count)), 1);
              const height = (parseInt(day.count) / max) * 100;
              return (
                <div key={i} className="flex-1 group relative">
                  <div 
                    style={{ height: `${height}%` }}
                    className="w-full bg-cyber-pink/40 border-t-2 border-cyber-pink group-hover:bg-cyber-pink/60 transition-all rounded-t-sm"
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-cyber-dark border border-cyber-pink text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {day.date}: {day.count}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex justify-between text-[10px] font-mono text-gray-600 uppercase tracking-widest">
            <span>30 Days Ago</span>
            <span>Today</span>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-white/5">
          <h3 className="text-lg font-syne font-black uppercase tracking-tight mb-6 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow" /> Top Learners
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="text-gray-500 border-b border-white/5">
                  <th className="pb-3 px-2">RANK</th>
                  <th className="pb-3 px-2">USER</th>
                  <th className="pb-3 px-2">LEVEL</th>
                  <th className="pb-3 px-2 text-right">XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {topLearners.map((user, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="py-3 px-2 font-bold text-gray-500">{i + 1}</td>
                    <td className="py-3 px-2 font-bold text-white group-hover:text-cyber-cyan transition-colors">{user.username}</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded bg-purple/10 text-purple border border-purple/20 uppercase text-[9px] font-black tracking-widest">
                        {user.level || 'beginner'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-bold text-yellow">{(user.xp_total ?? 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default OverviewTab;

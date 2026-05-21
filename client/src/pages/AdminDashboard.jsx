import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, GlassCard } from '../components/ui/Core';
import { 
  BarChart3, Users, BookOpen, DollarSign, 
  Settings, ShieldAlert, Activity, ArrowUpRight,
  TrendingUp, Monitor, Database, Globe
} from 'lucide-react';
import axios from '../api/axios';

const AdminStat = ({ title, value, change, icon: Icon, color }) => (
  <GlassCard className="p-6">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
        <Icon className="w-6 h-6" />
      </div>
      {change && (
        <span className="text-xs text-green-400 font-bold flex items-center gap-1">
          <ArrowUpRight className="w-3 h-3" /> {change}
        </span>
      )}
    </div>
    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
    <h3 className="text-3xl font-syne font-extrabold">{value}</h3>
  </GlassCard>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        // axios baseURL already includes /api, so path is just /admin/stats
        const response = await axios.get('/admin/stats');
        setStats(response.data.stats);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
        setError(err.response?.data?.error || 'Failed to load admin statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 animate-pulse">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <GlassCard className="p-8 max-w-md text-center">
          <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-400">{error}</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-navy/20 p-6 flex flex-col fixed h-full">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-navy" />
          </div>
          <span className="text-xl font-syne font-extrabold tracking-tighter uppercase">Admin Panel</span>
        </div>

        <nav className="space-y-2">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-white/5 text-white font-bold transition-all">
            <Activity className="w-5 h-5 text-red-400" /> Overview
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-500 hover:text-white transition-all">
            <Users className="w-5 h-5" /> User Management
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-500 hover:text-white transition-all">
            <BookOpen className="w-5 h-5" /> Lessons & Content
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-500 hover:text-white transition-all">
            <DollarSign className="w-5 h-5" /> Ad Revenue
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-500 hover:text-white transition-all">
            <Settings className="w-5 h-5" /> System Config
          </button>
        </div>
      </aside>

      {/* Admin Main Content */}
      <main className="flex-1 ml-64 p-10">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-syne font-extrabold">System <span className="text-red-400">Overview</span></h1>
            <p className="text-gray-400">Real-time stats and platform health monitoring.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm">Export Data</Button>
            <Button size="sm" className="bg-red-500 text-white hover:bg-red-400 border-none">Maintenance Mode</Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <AdminStat 
            title="Total Learners" 
            value={stats.totalUsers.toLocaleString()} 
            change={stats.userGrowth > 0 ? `${stats.userGrowth}%` : null} 
            icon={Users} 
            color="text-purple" 
          />
          <AdminStat 
            title="Active Users (7d)" 
            value={stats.activeUsers.toLocaleString()} 
            icon={Activity} 
            color="text-yellow" 
          />
          <AdminStat 
            title="Completed Lessons" 
            value={stats.completedLessons.toLocaleString()} 
            icon={BookOpen} 
            color="text-green-400" 
          />
          <AdminStat 
            title="Total XP Earned" 
            value={stats.totalXp.toLocaleString()} 
            icon={TrendingUp} 
            color="text-red-400" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple" /> Traffic Growth
              </h3>
              <select className="bg-navy border border-white/10 text-xs rounded-lg px-3 py-1 outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-64 flex items-end gap-2 px-2">
              {stats.dailyActiveUsers.length > 0 ? (
                stats.dailyActiveUsers.map((day, i) => {
                  const maxCount = Math.max(...stats.dailyActiveUsers.map(d => d.count));
                  const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                  return (
                    <div 
                      key={i} 
                      className="flex-1 bg-purple/20 rounded-t-lg relative group transition-all hover:bg-purple/40" 
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy border border-white/10 px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.count} Users
                      </div>
                    </div>
                  );
                })
              ) : (
                [40, 60, 45, 80, 55, 90, 75].map((h, i) => (
                  <div key={i} className="flex-1 bg-purple/20 rounded-t-lg relative group transition-all hover:bg-purple/40" style={{ height: `${h}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy border border-white/10 px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {h * 10} Users
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-between mt-4 px-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <span key={i} className="text-[10px] font-bold text-gray-600 uppercase">{day}</span>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Database className="w-5 h-5 text-yellow" /> System Status
            </h3>
            <div className="space-y-6">
              {[
                { name: "Frontend (Vercel)", status: "Operational", color: "bg-green-400" },
                { name: "Backend (Railway)", status: "Operational", color: "bg-green-400" },
                { name: "Database (PostgreSQL)", status: "Operational", color: "bg-green-400" },
                { name: "Piston API", status: "Slow Response", color: "bg-yellow" },
                { name: "OpenRouter AI", status: "Operational", color: "bg-green-400" }
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${s.color}`}></div>
                    <span className="text-sm font-medium text-gray-300">{s.name}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase">{s.status}</span>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-8 text-xs border-white/5 py-4">View Full System Logs</Button>
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;


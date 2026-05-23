import React, { useState, useEffect } from 'react';
import { Button, GlassCard } from '../components/ui/Core';
import { 
  Users, BookOpen, DollarSign, 
  Settings, ShieldAlert, Activity, ArrowUpRight,
  TrendingUp, Database, Search, ShieldCheck, HelpCircle,
  Eye, RefreshCw, Layers, Terminal, LayoutDashboard, Sliders, ToggleLeft, ToggleRight,
  MessageSquare, Trash2, Mail, CheckCircle2, ChevronRight
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
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Users State
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Inquiries State
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquiriesError, setInquiriesError] = useState(null);
  const [inquiryPage, setInquiryPage] = useState(1);
  const [inquiryTotalPages, setInquiryTotalPages] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('');
  const [updatingInquiryId, setUpdatingInquiryId] = useState(null);

  // Settings State (Mock overrides)
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [adStickyBanner, setAdStickyBanner] = useState(true);
  const [adSideColumns, setAdSideColumns] = useState(true);
  const [pistonStrict, setPistonStrict] = useState(true);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
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

  const fetchUsers = async (p = 1) => {
    try {
      setUsersLoading(true);
      const response = await axios.get(`/admin/users?page=${p}&limit=10`);
      setUsers(response.data.users);
      setTotalPages(response.data.pagination.totalPages);
      setUsersError(null);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setUsersError(err.response?.data?.error || 'Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchInquiries = async (p = 1, status = '') => {
    try {
      setInquiriesLoading(true);
      let url = `/admin/inquiries?page=${p}&limit=10`;
      if (status) {
        url += `&status=${encodeURIComponent(status)}`;
      }
      const response = await axios.get(url);
      setInquiries(response.data.inquiries);
      setInquiryTotalPages(response.data.pagination.totalPages);
      setInquiriesError(null);
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
      setInquiriesError(err.response?.data?.error || 'Failed to load inquiries');
    } finally {
      setInquiriesLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers(page);
    } else if (activeTab === 'inquiries') {
      fetchInquiries(inquiryPage, inquiryStatusFilter);
    }
  }, [activeTab, page, inquiryPage, inquiryStatusFilter]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchAdminStats();
    if (activeTab === 'users') fetchUsers(page);
    if (activeTab === 'inquiries') fetchInquiries(inquiryPage, inquiryStatusFilter);
  };

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      setUpdatingUserId(user.id);
      await axios.put(`/admin/users/${user.id}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error('Failed to update role:', err);
      alert(err.response?.data?.error || 'Failed to update user role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('⚠️ WARNING: Are you absolutely sure you want to PERMANENTLY REMOVE this user record from all databases? This action cannot be undone.')) {
      return;
    }
    try {
      setUpdatingUserId(userId);
      await axios.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
      if (stats) {
        setStats(prev => ({
          ...prev,
          totalUsers: Math.max(0, prev.totalUsers - 1)
        }));
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert(err.response?.data?.error || 'Failed to remove user account.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleUpdateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      setUpdatingInquiryId(inquiryId);
      await axios.put(`/admin/inquiries/${inquiryId}/status`, { status: newStatus });
      setInquiries(prev => prev.map(inq => inq.id === inquiryId ? { ...inq, status: newStatus } : inq));
      if (selectedInquiry && selectedInquiry.id === inquiryId) {
        setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Failed to update inquiry status:', err);
      alert(err.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdatingInquiryId(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 animate-pulse">Loading secure admin terminal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <GlassCard className="p-8 max-w-md text-center">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Secure Link Fault</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleRetry} 
              disabled={loading}
              className="w-full bg-red-500 text-white hover:bg-red-400 border-none"
            >
              {loading ? 'Reconnecting...' : `Re-Establish Port ${retryCount > 0 ? `(${retryCount})` : ''}`}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = '/dashboard'}
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex text-white font-mono select-none">
      
      {/* Dynamic Navigation Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-[#08080a] p-6 flex flex-col fixed h-full z-20">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-9 h-9 bg-cyber-pink rounded-xl flex items-center justify-center shadow-neo">
            <ShieldCheck className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="text-base font-syne font-black uppercase tracking-widest text-cyber-pink block">CODLIFT ADMIN</span>
            <span className="text-[9px] text-cyber-cyan tracking-wider font-bold">SECURE SHELL V3.0</span>
          </div>
        </div>

        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold uppercase tracking-wider text-xs border ${
              activeTab === 'overview' 
                ? 'bg-cyber-pink text-black border-white shadow-neo' 
                : 'text-gray-500 border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> System Overview
          </button>
          
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold uppercase tracking-wider text-xs border ${
              activeTab === 'users' 
                ? 'bg-cyber-pink text-black border-white shadow-neo' 
                : 'text-gray-500 border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" /> User Base CRUD
          </button>

          <button 
            onClick={() => setActiveTab('inquiries')}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold uppercase tracking-wider text-xs border ${
              activeTab === 'inquiries' 
                ? 'bg-cyber-pink text-black border-white shadow-neo' 
                : 'text-gray-500 border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Support Tickets
          </button>

          <button 
            onClick={() => setActiveTab('lessons')}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold uppercase tracking-wider text-xs border ${
              activeTab === 'lessons' 
                ? 'bg-cyber-pink text-black border-white shadow-neo' 
                : 'text-gray-500 border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Lesson Curriculum
          </button>

          <button 
            onClick={() => setActiveTab('revenue')}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold uppercase tracking-wider text-xs border ${
              activeTab === 'revenue' 
                ? 'bg-cyber-pink text-black border-white shadow-neo' 
                : 'text-gray-500 border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            <DollarSign className="w-4 h-4" /> Ad Monetization
          </button>
          
          <button 
            onClick={() => setActiveTab('config')}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold uppercase tracking-wider text-xs border ${
              activeTab === 'config' 
                ? 'bg-cyber-pink text-black border-white shadow-neo' 
                : 'text-gray-500 border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" /> Security Config
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase">
            <span>Terminal Status</span>
            <span className="text-cyber-green animate-pulse">ENCRYPTED</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-[9px] text-gray-500 uppercase font-black block mb-1">Active Admin Profile</span>
            <span className="text-xs text-white font-bold block truncate">Root Authority</span>
          </div>
        </div>
      </aside>

      {/* Main Dynamic View Panels */}
      <main className="flex-1 ml-72 p-10 overflow-y-auto min-h-screen">
        
        {/* TAB 1: SYSTEM OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <header className="mb-12 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-syne font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">System <span className="text-cyber-pink font-black">Overview</span></h1>
                <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">Real-time platform telemetry & operations node.</p>
              </div>
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" onClick={fetchAdminStats}>
                  <RefreshCw className="w-3.5 h-3.5 mr-1" /> Reload Core
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setMaintenanceMode(prev => !prev)}
                  className={`${maintenanceMode ? 'bg-red-500 text-white' : 'bg-transparent border-red-500 text-red-500 hover:bg-red-500/10'} hover:-translate-y-1`}
                >
                  {maintenanceMode ? '⚡ DEACTIVATE MAINTENANCE' : '⚠ ACTIVATE MAINTENANCE'}
                </Button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <AdminStat 
                title="Total Learners" 
                value={stats.totalUsers.toLocaleString()} 
                change={stats.userGrowth > 0 ? `+${stats.userGrowth}%` : null} 
                icon={Users} 
                color="text-cyber-pink" 
              />
              <AdminStat 
                title="Active Users (7d)" 
                value={stats.activeUsers.toLocaleString()} 
                icon={Activity} 
                color="text-cyber-cyan" 
              />
              <AdminStat 
                title="Completed Lessons" 
                value={stats.completedLessons.toLocaleString()} 
                icon={BookOpen} 
                color="text-cyber-green" 
              />
              <AdminStat 
                title="Total XP Earned" 
                value={stats.totalXp.toLocaleString()} 
                icon={TrendingUp} 
                color="text-yellow" 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <GlassCard className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyber-pink" /> Web Traffic Volume
                  </h3>
                  <span className="text-[10px] bg-white/5 border border-white/10 text-gray-400 px-3 py-1.5 rounded-lg font-bold">MONITORING ACTIVE</span>
                </div>
                <div className="h-64 flex items-end gap-2.5 px-2">
                  {stats.dailyActiveUsers && stats.dailyActiveUsers.length > 0 ? (
                    (() => {
                      const maxCount = Math.max(...stats.dailyActiveUsers.map(d => d.count));
                      return stats.dailyActiveUsers.map((day, i) => {
                        const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                        return (
                          <div 
                            key={`day-${i}`} 
                            className="flex-1 bg-cyber-pink/20 rounded-t-lg relative group transition-all hover:bg-cyber-pink border-t-2 border-transparent hover:border-cyber-pink shadow-[0_0_10px_rgba(255,0,255,0.1)]" 
                            style={{ height: `${Math.max(height, 5)}%` }}
                          >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black border border-white/20 px-2.5 py-1.5 rounded-lg text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-neo">
                              {day.count} Active Users
                            </div>
                          </div>
                        );
                      });
                    })()
                  ) : (
                    <div className="w-full flex items-center justify-center text-gray-500 h-full">
                      <p className="text-xs italic">No operational data collected for this cycle</p>
                    </div>
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
                  <Database className="w-5 h-5 text-cyber-cyan" /> Secure Network Nodes
                </h3>
                <div className="space-y-6">
                  {[
                    { name: "Frontend Cluster (Vercel)", status: "Operational", color: "bg-cyber-green" },
                    { name: "Backend Cluster (Railway)", status: "Operational", color: "bg-cyber-green" },
                    { name: "Persistent Database (PostgreSQL)", status: "Operational", color: "bg-cyber-green" },
                    { name: "Code Compiler Engine (Piston)", status: pistonStrict ? "Operational" : "Bypassed", color: pistonStrict ? "bg-cyber-green" : "bg-yellow" },
                    { name: "AI Guidance Module (OpenRouter)", status: "Operational", color: "bg-cyber-green" }
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${s.color} animate-pulse shadow-[0_0_8px_rgba(0,255,255,0.4)]`}></div>
                        <span className="text-xs font-semibold text-gray-300">{s.name}</span>
                      </div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{s.status}</span>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-8 text-xs border-white/10 py-3.5 uppercase tracking-wider font-bold">
                  <Terminal className="w-3.5 h-3.5 mr-1" /> View Systems Log Console
                </Button>
              </GlassCard>
            </div>
          </div>
        )}

        {/* TAB 2: USER BASE CRUD */}
        {activeTab === 'users' && (
          <div>
            <header className="mb-12 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-syne font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">User Base <span className="text-cyber-pink font-black">CRUD</span></h1>
                <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">Perform administrative changes & authentication role escalations.</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => fetchUsers(page)}>
                <RefreshCw className="w-3.5 h-3.5 mr-1" /> Sync Records
              </Button>
            </header>

            {/* Cyberpunk Search & Filter Panel */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
              <input 
                type="text" 
                placeholder="PROBE USER DATABASE (SEARCH BY USERNAME OR EMAIL)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#08080a] border-2 border-white/10 rounded-2xl text-xs tracking-wider outline-none text-white transition-all focus:border-cyber-pink shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
              />
            </div>

            {usersError && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl mb-6 flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                <span>Failed to query database sector: {usersError}</span>
              </div>
            )}

            {/* Neon Data Table Grid */}
            <div className="border-2 border-white shadow-[4px_4px_0px_0px_rgba(168,85,247,0.5)] rounded-2xl overflow-hidden bg-cyber-dark mb-8">
              {usersLoading ? (
                <div className="p-20 text-center flex flex-col items-center gap-4 justify-center">
                  <div className="w-8 h-8 border-2 border-cyber-pink border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-gray-500 animate-pulse uppercase tracking-widest">Querying SQL database tables...</span>
                </div>
              ) : filteredUsers.length > 0 ? (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-black/50 border-b-2 border-white text-gray-400 font-extrabold uppercase tracking-widest text-[9px]">
                      <th className="p-4">Sector Profile</th>
                      <th className="p-4">Security Level</th>
                      <th className="p-4">XP Status</th>
                      <th className="p-4 text-center">Login Session</th>
                      <th className="p-4 text-right">Access Controls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr 
                        key={user.id} 
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-white text-sm tracking-tight">{user.username}</span>
                            <span className="text-[10px] text-gray-500 lowercase">{user.email}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded border ${
                            user.role === 'admin' 
                              ? 'bg-cyber-pink/15 text-cyber-pink border-cyber-pink/30 shadow-[0_0_8px_rgba(255,0,255,0.15)]' 
                              : 'bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/30'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-white">LVL {user.level || 1}</span>
                            <span className="text-[9px] text-gray-500">{user.xp_total?.toLocaleString() || 0} XP</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          {user.last_login ? (
                            <span className="text-[10px] text-cyber-green font-semibold">
                              {new Date(user.last_login).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-600 italic">No record</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleRole(user)}
                              disabled={updatingUserId === user.id}
                              className={`px-3 py-1.5 rounded font-syne font-black text-[9px] uppercase tracking-wider transition-all border ${
                                user.role === 'admin'
                                  ? 'bg-cyber-cyan text-black hover:bg-white border-white'
                                  : 'bg-cyber-pink text-black hover:bg-white border-white'
                              } disabled:opacity-40`}
                            >
                              {updatingUserId === user.id ? 'Reconfiguring...' : `Set as ${user.role === 'admin' ? 'User' : 'Admin'}`}
                            </button>
                            
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={updatingUserId === user.id}
                              className="p-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-40"
                              title="Delete User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-16 text-center text-gray-500">
                  <HelpCircle className="w-10 h-10 mx-auto opacity-30 mb-3" />
                  <p className="text-xs uppercase font-bold tracking-wider">No corresponding records found matching: "{searchQuery}"</p>
                </div>
              )}
            </div>

            {/* Retro pagination controllers */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-600 uppercase">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  disabled={page <= 1 || usersLoading}
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  className="py-2.5 px-4 text-[10px] disabled:opacity-40"
                >
                  Prev Sector
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  disabled={page >= totalPages || usersLoading}
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  className="py-2.5 px-4 text-[10px] disabled:opacity-40"
                >
                  Next Sector
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SUPPORT TICKETS */}
        {activeTab === 'inquiries' && (
          <div>
            <header className="mb-12 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-syne font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">Support <span className="text-cyber-pink font-black">Tickets</span></h1>
                <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">Display active user enquiries and reconfigure service statuses.</p>
              </div>
              <div className="flex gap-3">
                <select
                  value={inquiryStatusFilter}
                  onChange={(e) => {
                    setInquiryStatusFilter(e.target.value);
                    setInquiryPage(1);
                  }}
                  className="bg-black border-2 border-white/10 text-xs rounded-xl px-4 py-2 outline-none tracking-wider text-gray-300"
                >
                  <option value="">ALL STATUSES</option>
                  <option value="Pending">PENDING</option>
                  <option value="In Progress">IN PROGRESS</option>
                  <option value="Resolved">RESOLVED</option>
                </select>
                <Button variant="ghost" size="sm" onClick={() => fetchInquiries(inquiryPage, inquiryStatusFilter)}>
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </header>

            {inquiriesError && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl mb-6 flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                <span>Error querying inquiries database: {inquiriesError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Inquiries List */}
              <div className="lg:col-span-2 space-y-4">
                {inquiriesLoading ? (
                  <div className="p-20 text-center bg-cyber-dark border-2 border-white rounded-2xl flex flex-col items-center gap-4 justify-center shadow-neo">
                    <div className="w-8 h-8 border-2 border-cyber-pink border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-gray-500 animate-pulse uppercase tracking-widest">Querying inquiries database...</span>
                  </div>
                ) : inquiries.length > 0 ? (
                  <div className="space-y-4">
                    {inquiries.map((inq) => (
                      <GlassCard 
                        key={inq.id}
                        hover={false}
                        className={`p-5 border-2 transition-all cursor-pointer ${
                          selectedInquiry && selectedInquiry.id === inq.id
                            ? 'border-cyber-pink shadow-[4px_4px_0px_0px_rgba(255,0,255,0.4)]'
                            : 'border-white/5 hover:border-white/20'
                        }`}
                        onClick={() => setSelectedInquiry(inq)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black block mb-0.5">Subject: {inq.subject}</span>
                            <h4 className="text-base font-bold text-white tracking-tight">{inq.name}</h4>
                            <span className="text-[10px] text-gray-400 lowercase">{inq.email}</span>
                          </div>
                          
                          <span className={`px-2.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded border ${
                            inq.status === 'Resolved'
                              ? 'bg-cyber-green/15 text-cyber-green border-cyber-green/30'
                              : inq.status === 'In Progress'
                              ? 'bg-yellow/15 text-yellow border-yellow/30'
                              : 'bg-red-500/15 text-red-400 border-red-500/30'
                          }`}>
                            {inq.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{inq.message}</p>
                        <div className="flex justify-between items-center mt-4 border-t border-white/5 pt-3">
                          <span className="text-[9px] text-gray-600">
                            {new Date(inq.created_at).toLocaleString()}
                          </span>
                          <span className="text-[9px] text-cyber-pink font-extrabold tracking-widest flex items-center gap-1">
                            VIEW SECURE LOG <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </GlassCard>
                    ))}
                    
                    {/* Inquiry Pagination */}
                    <div className="flex items-center justify-between mt-6">
                      <span className="text-[10px] font-bold text-gray-600 uppercase">Page {inquiryPage} of {inquiryTotalPages}</span>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          disabled={inquiryPage <= 1 || inquiriesLoading}
                          onClick={() => setInquiryPage(prev => Math.max(prev - 1, 1))}
                          className="py-2 px-3.5 text-[10px] disabled:opacity-40"
                        >
                          Prev Sector
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          disabled={inquiryPage >= inquiryTotalPages || inquiriesLoading}
                          onClick={() => setInquiryPage(prev => Math.min(prev + 1, inquiryTotalPages))}
                          className="py-2 px-3.5 text-[10px] disabled:opacity-40"
                        >
                          Next Sector
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-20 text-center bg-cyber-dark border-2 border-white/10 rounded-2xl">
                    <Mail className="w-10 h-10 mx-auto opacity-30 mb-3" />
                    <p className="text-xs uppercase font-bold tracking-wider text-gray-500">No support tickets match the selected status.</p>
                  </div>
                )}
              </div>

              {/* Inquiry Detail View Panel */}
              <div className="lg:col-span-1">
                {selectedInquiry ? (
                  <GlassCard 
                    hover={false}
                    className="p-6 border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,255,255,0.4)] bg-[#08080a]"
                  >
                    <div className="border-b border-white/10 pb-4 mb-6">
                      <span className="text-[9px] text-cyber-cyan uppercase font-black tracking-widest block mb-1">INQUIRY DETAIL SECURE LOG</span>
                      <h3 className="text-lg font-bold text-white tracking-tight mb-2">{selectedInquiry.subject}</h3>
                      
                      <div className="flex flex-col gap-1 text-[10px]">
                        <span className="text-gray-300 font-bold">NAME: <span className="text-white">{selectedInquiry.name}</span></span>
                        <span className="text-gray-300 font-bold">EMAIL: <span className="text-white lowercase">{selectedInquiry.email}</span></span>
                        <span className="text-gray-300 font-bold">DATE: <span className="text-white">{new Date(selectedInquiry.created_at).toLocaleString()}</span></span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      <span className="text-[9px] text-gray-500 uppercase font-black block">Message Content</span>
                      <div className="p-4 bg-black/60 rounded-xl border border-white/5 text-xs text-gray-300 select-text leading-relaxed min-h-[120px] whitespace-pre-wrap">
                        {selectedInquiry.message}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <span className="text-[9px] text-gray-500 uppercase font-black block">Status Operations</span>
                      
                      <div className="flex gap-2">
                        {['Pending', 'In Progress', 'Resolved'].map((st) => (
                          <button
                            key={st}
                            disabled={updatingInquiryId === selectedInquiry.id}
                            onClick={() => handleUpdateInquiryStatus(selectedInquiry.id, st)}
                            className={`flex-1 py-2 text-[8px] font-black uppercase tracking-wider rounded border transition-all ${
                              selectedInquiry.status === st
                                ? 'bg-cyber-pink text-black border-white shadow-neo'
                                : 'bg-transparent border-white/10 text-gray-400 hover:text-white hover:border-white/35'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                ) : (
                  <div className="p-10 text-center bg-[#08080a]/40 border-2 border-dashed border-white/5 rounded-2xl text-gray-500">
                    <Eye className="w-8 h-8 mx-auto opacity-20 mb-3" />
                    <p className="text-[10px] uppercase font-bold tracking-wider leading-relaxed">Select any active support ticket from the list to display full logs & edit operational statuses.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: LESSON CURRICULUM */}
        {activeTab === 'lessons' && (
          <div>
            <header className="mb-12">
              <h1 className="text-4xl font-syne font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">Lesson <span className="text-cyber-pink font-black">Curriculum</span></h1>
              <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">Outline curriculum levels, verify Piston compiler settings, and view active exercises.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { level: "Level 1", title: "HTML Structural Elements", count: "12 Modules", status: "Operational", color: "border-cyber-pink shadow-[4px_4px_0px_0px_rgba(255,0,255,0.4)]" },
                { level: "Level 2", title: "CSS Flexbox Mechanics", count: "8 Modules", status: "Operational", color: "border-cyber-cyan shadow-[4px_4px_0px_0px_rgba(0,255,255,0.4)]" },
                { level: "Level 3", title: "Advanced Chessboard Grids", count: "10 Modules", status: "Operational", color: "border-cyber-green shadow-[4px_4px_0px_0px_rgba(173,255,47,0.4)]" }
              ].map((lvl, idx) => (
                <div key={idx} className={`p-6 bg-cyber-dark border-2 rounded-2xl flex flex-col justify-between ${lvl.color}`}>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">{lvl.level}</span>
                    <h3 className="text-lg font-bold text-white mb-4">{lvl.title}</h3>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{lvl.count}</span>
                    <span className="text-[9px] text-cyber-green font-black uppercase tracking-wider">{lvl.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <GlassCard className="p-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyber-pink" /> Curriculum JSON Sync Configuration
              </h3>
              <p className="text-xs text-gray-400 mb-6 uppercase tracking-wider leading-relaxed">
                Lessons and curriculum indices are stored statically inside server data layers (`server/src/data/curriculum.ts`). Standard operations verify exercise schemas against compilation sandbox scripts.
              </p>
              <div className="flex gap-4">
                <Button size="sm">
                  <RefreshCw className="w-4 h-4 mr-1" /> RE-INDEX ALL LESSONS
                </Button>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-1" /> VALIDATE DATA SCHEMAS
                </Button>
              </div>
            </GlassCard>
          </div>
        )}

        {/* TAB 5: AD MONETIZATION */}
        {activeTab === 'revenue' && (
          <div>
            <header className="mb-12">
              <h1 className="text-4xl font-syne font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">Ad <span className="text-cyber-pink font-black">Monetization</span></h1>
              <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">Review ad server CPM metrics and configure active display nodes.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <GlassCard className="p-6">
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total Impressions</p>
                <h3 className="text-3xl font-extrabold font-syne text-cyber-pink">174,250</h3>
                <span className="text-[9px] text-cyber-green font-bold block mt-2">▲ 14.5% THIS WEEK</span>
              </GlassCard>
              <GlassCard className="p-6">
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Average CPM</p>
                <h3 className="text-3xl font-extrabold font-syne text-cyber-cyan">$4.25</h3>
                <span className="text-[9px] text-cyber-cyan font-bold block mt-2">STEADY BID RATE</span>
              </GlassCard>
              <GlassCard className="p-6">
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Est. Ad Revenue</p>
                <h3 className="text-3xl font-extrabold font-syne text-cyber-green">$740.56</h3>
                <span className="text-[9px] text-cyber-green font-bold block mt-2">PAYS OUT IN 7 DAYS</span>
              </GlassCard>
            </div>

            {/* Display Node Controls */}
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyber-cyan" /> Display Ad Injectors Config
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <span className="text-sm font-bold block text-white">Sticky Bottom Ad Banner</span>
                    <span className="text-[10px] text-gray-500 uppercase">Inject active banner container into bottom footer viewport</span>
                  </div>
                  <button onClick={() => setAdStickyBanner(!adStickyBanner)}>
                    {adStickyBanner ? (
                      <ToggleRight className="w-10 h-10 text-cyber-pink transition-transform hover:scale-105" />
                    ) : (
                      <ToggleLeft className="w-10 h-10 text-gray-600 transition-transform hover:scale-105" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between pb-2">
                  <div>
                    <span className="text-sm font-bold block text-white">Outer Side Ad Columns</span>
                    <span className="text-[10px] text-gray-500 uppercase">Inject lateral skyscraper ads for wider viewport screens</span>
                  </div>
                  <button onClick={() => setAdSideColumns(!adSideColumns)}>
                    {adSideColumns ? (
                      <ToggleRight className="w-10 h-10 text-cyber-pink transition-transform hover:scale-105" />
                    ) : (
                      <ToggleLeft className="w-10 h-10 text-gray-600 transition-transform hover:scale-105" />
                    )}
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* TAB 6: SECURITY CONFIG */}
        {activeTab === 'config' && (
          <div>
            <header className="mb-12">
              <h1 className="text-4xl font-syne font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">Security <span className="text-cyber-pink font-black">Config</span></h1>
              <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">Adjust environment variables, core sandboxes, and platform parameters.</p>
            </header>

            <div className="space-y-6">
              <GlassCard className="p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-cyber-pink" /> Compiler Sandbox Isolation
                </h3>
                <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-6">
                  <div>
                    <span className="text-sm font-bold block text-white">Execute Codes inside Docker Isolation</span>
                    <span className="text-[10px] text-gray-500 uppercase">Strict sandboxing blocks document modifications and system access</span>
                  </div>
                  <button onClick={() => setPistonStrict(!pistonStrict)}>
                    {pistonStrict ? (
                      <ToggleRight className="w-10 h-10 text-cyber-pink transition-transform hover:scale-105" />
                    ) : (
                      <ToggleLeft className="w-10 h-10 text-gray-600 transition-transform hover:scale-105" />
                    )}
                  </button>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] text-gray-500 uppercase font-black block">Blocked Variables Signature</span>
                  <div className="p-4 bg-black rounded-xl border border-white/10 font-mono text-xs text-cyber-cyan select-text">
                    ['window', 'document', 'localStorage', 'fetch', 'XMLHttpRequest']
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
};

export default AdminDashboard;board;



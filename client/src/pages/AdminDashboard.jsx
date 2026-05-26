import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Users, Ticket, Megaphone, Bell, 
  ShieldCheck, Lock, Activity, DollarSign,
  Menu, X, ChevronRight, LogOut, LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/ui/Core';
import { SEO } from '../utils/SEO';

// Sub-components
import OverviewTab from './admin/OverviewTab';
import UsersTab from './admin/UsersTab';
import TicketsTab from './admin/TicketsTab';
import BroadcastTab from './admin/BroadcastTab';
import AnnouncementsTab from './admin/AnnouncementsTab';
import AnalyticsTab from './admin/AnalyticsTab';
import AuditTab from './admin/AuditTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation Tabs Configuration
  const tabs = [
    { id: 'overview', label: 'System Overview', icon: LayoutDashboard, color: 'text-cyber-cyan' },
    { id: 'users', label: 'User Management', icon: Users, color: 'text-blue-400' },
    { id: 'tickets', label: 'Support Tickets', icon: Ticket, color: 'text-orange-400' },
    { id: 'broadcast', label: 'Broadcast & Email', icon: Megaphone, color: 'text-cyber-pink' },
    { id: 'announcements', label: 'Announcements', icon: Bell, color: 'text-purple' },
    { id: 'analytics', label: 'Lesson Analytics', icon: BarChart3, color: 'text-cyber-cyan' },
    { id: 'audit', label: 'Audit Log', icon: ShieldCheck, color: 'text-gray-400' },
    { id: 'security', label: 'Security Config', icon: Lock, color: 'text-red-500' },
    { id: 'monetization', label: 'Ad Monetization', icon: DollarSign, color: 'text-yellow' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'users': return <UsersTab />;
      case 'tickets': return <TicketsTab />;
      case 'broadcast': return <BroadcastTab />;
      case 'announcements': return <AnnouncementsTab />;
      case 'analytics': return <AnalyticsTab />;
      case 'audit': return <AuditTab />;
      default: return (
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-white/5 rounded-[3rem]">
          <Lock className="w-16 h-12 text-gray-800 mb-4" />
          <h3 className="text-xl font-syne font-black uppercase tracking-widest text-gray-600">Module Under Construction</h3>
          <p className="text-gray-700 font-mono text-xs mt-2">ACCESS RESTRICTED — ENCRYPTED BUFFER ACTIVE</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex overflow-hidden">
      <SEO title="Admin Control Center | CodLift" description="Restricted administrative access panel." />

      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-80' : 'w-20'} bg-navy/20 border-r border-white/5 flex flex-col transition-all duration-500 z-50 backdrop-blur-xl relative`}
      >
        {/* Toggle Button */}
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="absolute -right-4 top-24 w-8 h-8 bg-cyber-pink rounded-full flex items-center justify-center border-4 border-[#05070a] hover:scale-110 transition-all z-50"
        >
          <ChevronRight className={`w-4 h-4 text-black transition-transform duration-500 ${isSidebarOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Logo Area */}
        <div className="p-8 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-cyber-pink rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,0,255,0.4)] shrink-0">
              <ShieldCheck className="w-6 h-6 text-black" />
            </div>
            {isSidebarOpen && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <h1 className="text-xl font-syne font-black tracking-tighter leading-none">CORE<br /><span className="text-cyber-pink">ADMIN</span></h1>
              </div>
            )}
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative overflow-hidden ${activeTab === tab.id ? 'bg-white/5 border border-white/10 shadow-neo' : 'hover:bg-white/5 border border-transparent'}`}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute left-0 w-1 h-6 bg-cyber-pink rounded-r-full"
                />
              )}
              <tab.icon className={`w-5 h-5 shrink-0 transition-colors ${activeTab === tab.id ? tab.color : 'text-gray-500 group-hover:text-white'}`} />
              {isSidebarOpen && (
                <span className={`text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                  {tab.label}
                </span>
              )}
              {!isSidebarOpen && (
                <div className="absolute left-full ml-4 px-3 py-1 bg-cyber-pink text-black text-[10px] font-black rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {tab.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile Area */}
        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className={`flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-cyan to-blue-600 flex items-center justify-center text-xs font-black text-black">
              {user?.username?.substring(0, 2).toUpperCase()}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] font-black uppercase tracking-widest truncate">{user?.username}</p>
                <p className="text-[8px] text-gray-500 font-mono truncate uppercase">System Administrator</p>
              </div>
            )}
            {isSidebarOpen && (
              <button 
                onClick={logout}
                className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-500 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyber-pink/5 blur-[120px] -z-10 rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyber-cyan/5 blur-[120px] -z-10 rounded-full" />

        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 shrink-0 backdrop-blur-md bg-[#05070a]/50">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
            <h2 className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[0.4em]">Grid Status: <span className="text-cyber-green">Operational</span></h2>
          </div>
          
          <div className="flex items-center gap-8 font-mono text-[10px] font-black uppercase tracking-widest">
            <div className="flex flex-col items-end">
              <span className="text-gray-600">Local Time</span>
              <span className="text-white">{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="h-8 w-px bg-white/5" />
            <div className="flex flex-col items-end">
              <span className="text-gray-600">Session ID</span>
              <span className="text-cyber-cyan">CL-{Math.random().toString(36).substring(7).toUpperCase()}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

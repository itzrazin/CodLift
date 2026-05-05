import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, GlassCard } from './ui/Core';
import { 
  Home, BookOpen, Gamepad2, User, Settings, 
  Zap, Flame, Star, ChevronRight, CheckCircle2, Lock, Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { SEO } from './SEO';
import { API_URL } from '../config';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
      active ? 'bg-cyan text-black shadow-[0_0_15px_rgba(0,245,212,0.3)]' : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

const StatsBar = ({ user }) => (
  <div className="flex items-center gap-6">
    <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border-yellow/20">
      <Flame className="w-5 h-5 text-yellow" />
      <span className="font-bold">{user?.current_streak || 0}</span>
    </div>
    <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border-cyan/20">
      <Zap className="w-5 h-5 text-cyan" />
      <span className="font-bold">{user?.xp_total || 0} XP</span>
    </div>
    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan to-blue-500 p-[2px]">
      <div className="w-full h-full rounded-full bg-navy flex items-center justify-center">
        <User className="w-5 h-5" />
      </div>
    </div>
  </div>
);

const SkillNode = ({ title, status, x, y, delay, slug }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: 'spring' }}
      style={{ left: x, top: y }}
      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
      onClick={() => status !== 'locked' && slug && navigate(`/learn/beginner/${slug}`)}
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
        status === 'completed' ? 'bg-cyan shadow-[0_0_20px_rgba(0,245,212,0.4)]' :
        status === 'current' ? 'bg-navy border-2 border-cyan animate-pulse shadow-[0_0_15px_rgba(0,245,212,0.2)]' :
        'bg-gray-800 border-2 border-white/10 opacity-50 grayscale'
      }`}>
        {status === 'completed' ? <CheckCircle2 className="w-8 h-8 text-black" /> : 
         status === 'locked' ? <Lock className="w-6 h-6 text-gray-500" /> :
         <Star className="w-8 h-8 text-cyan" />}
      </div>
      <div className="absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
        <p className={`font-bold text-sm ${status === 'locked' ? 'text-gray-600' : 'text-white'}`}>{title}</p>
        {status === 'current' && <p className="text-[10px] text-cyan font-bold tracking-widest">START HERE</p>}
      </div>
    </motion.div>
  );
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (user) {
      // Load progress from localStorage
      const localProgress = JSON.parse(localStorage.getItem('codlift_progress') || '[]');
      // Map to the format the component expects if necessary, or just use the array
      setProgress(localProgress);
      setLoading(false);
    }
  }, [user]);

  if (!user) return null;

  const stats = [
    { label: "Total XP", value: (user.xp_total || 0).toLocaleString(), icon: Zap, color: "text-cyan" },
    { label: "Day Streak", value: user.current_streak || 0, icon: Flame, color: "text-yellow" },
    { label: "Rank", value: "#142", icon: Star, color: "text-purple-400" },
  ];

  const skillTree = [
    { title: "HTML Basics", status: "completed", x: "50%", y: "100px", delay: 0.1, slug: "html-basics" },
    { title: "CSS Styling", status: "completed", x: "30%", y: "250px", delay: 0.2, slug: "css-styling" },
    { title: "Flexbox", status: "completed", x: "70%", y: "250px", delay: 0.3, slug: "flexbox" },
    { title: "JavaScript Fundamentals", status: "current", x: "50%", y: "400px", delay: 0.4, slug: "js-fundamentals" },
    { title: "DOM Manipulation", status: "locked", x: "30%", y: "550px", delay: 0.5, slug: "dom-manipulation" },
    { title: "API Fetching", status: "locked", x: "70%", y: "550px", delay: 0.6, slug: "api-fetching" },
    { title: "React Components", status: "locked", x: "50%", y: "700px", delay: 0.7, slug: "react-components" },
  ];

  return (
    <div className="min-h-screen bg-background flex text-white font-sans overflow-hidden">
      <SEO 
        title="Dashboard | CodLift"
        description="Track your coding progress, view achievements, and continue your interactive lessons on CodLift."
        url="/dashboard"
      />
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 p-6 flex flex-col fixed h-full">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-cyan rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-navy rounded-sm rotate-45"></div>
          </div>
          <span className="text-xl font-syne font-extrabold tracking-tighter">CODELIFT</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={Home} label="Dashboard" active={activeTab === 'home'} onClick={() => navigate('/dashboard')} />
          <SidebarItem icon={BookOpen} label="Curriculum" active={activeTab === 'curriculum'} onClick={() => setActiveTab('curriculum')} />
          <SidebarItem icon={Gamepad2} label="Arena" active={activeTab === 'arena'} onClick={() => navigate('/arena')} />
          <SidebarItem icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => navigate('/profile')} />
        </nav>

        <div className="mt-auto">
          <SidebarItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/5 mt-2 transition-all"
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-syne font-extrabold tracking-tight">Welcome back, <span className="text-gradient-cyan">{user.username}</span>!</h1>
            <p className="text-gray-400">Ready to conquer your next coding challenge?</p>
          </div>
          <StatsBar user={user} />
        </header>

        <div className="relative">
          {/* Current Lesson Promo */}
          <div className="relative mb-12">
          {loading ? (
            <div className="animate-pulse bg-white/5 h-64 rounded-3xl border border-white/10"></div>
          ) : (
            <GlassCard className="p-8 flex items-center justify-between border-cyan/30 bg-gradient-to-r from-cyan/10 to-transparent">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-cyan/20 flex items-center justify-center border border-cyan/30">
                  <BookOpen className="w-10 h-10 text-cyan" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">JavaScript Fundamentals</h2>
                  <p className="text-gray-400">Mastering Functions • Exercise 1/5</p>
                </div>
              </div>
              <Button size="lg" className="w-48" onClick={() => navigate('/learn/js-fundamentals')}>
                Continue <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </GlassCard>
          )}
          </div>

          {/* Skill Tree Background */}
          <div className="glass rounded-[3rem] p-10 min-h-[900px] relative overflow-hidden bg-navy/40">
            {/* SVG Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <path d="M 50% 100 L 30% 250" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M 50% 100 L 70% 250" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M 30% 250 L 50% 400" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M 70% 250 L 50% 400" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M 50% 400 L 30% 550" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M 50% 400 L 70% 550" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M 30% 550 L 50% 700" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M 70% 550 L 50% 700" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
            </svg>

            {skillTree.map((node, i) => (
              <SkillNode key={i} {...node} />
            ))}
          </div>

          {/* Right Sidebar - Daily Quest */}
          <div className="absolute top-0 -right-4 w-72 h-fit space-y-6 hidden xl:block">
            <GlassCard className="p-6 border-cyan/20">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-cyan" />
                Daily Quests
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan"></div>
                  <p className="text-sm text-gray-400">Complete 1 lesson</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                  <p className="text-sm text-gray-600">Solve 1 challenge</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 border-yellow/20">
              <h4 className="font-bold mb-2">Pro Track</h4>
              <p className="text-xs text-gray-500 mb-4">Master React & Node.js</p>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-yellow w-1/3 h-full rounded-full shadow-[0_0_10px_rgba(255,214,10,0.5)]"></div>
              </div>
              <p className="text-[10px] mt-2 text-right text-yellow font-bold">12/36 LESSONS</p>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
};

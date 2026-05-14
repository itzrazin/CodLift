import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, GlassCard } from '../components/ui/Core';
import {
  Home, BookOpen, Gamepad2, User,
  Zap, Flame, Star, ChevronRight, CheckCircle2, Lock, Trophy, Menu, X
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLesson } from '../context/LessonContext';
import { SEO } from '../utils/SEO';
import { clientCurriculum } from '../data/curriculum';
import { Logo } from '../components/ui/Logo';
import { API_URL } from '../utils/config';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
      active ? 'bg-purple text-black shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon className="w-5 h-5 shrink-0" />
    <span className="font-medium">{label}</span>
  </button>
);

const SkillNode = ({ title, status, x, y, delay, slug, level: nodeLevel }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: 'spring' }}
      style={{ left: x, top: y }}
      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
      onClick={() => status !== 'locked' && slug && navigate(`/learn/${nodeLevel}/${slug}/1`)}
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
        status === 'completed' ? 'bg-purple shadow-[0_0_20px_rgba(168,85,247,0.4)]' :
        status === 'current'   ? 'bg-navy border-2 border-purple animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.2)]' :
        'bg-gray-800 border-2 border-white/10 opacity-50 grayscale'
      }`}>
        {status === 'completed' ? <CheckCircle2 className="w-8 h-8 text-black" /> : 
         status === 'locked'    ? <Lock className="w-6 h-6 text-gray-500" /> :
         <Star className="w-8 h-8 text-purple" />}
      </div>
      <div className="absolute top-[72px] left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
        <p className={`font-bold text-xs ${status === 'locked' ? 'text-gray-600' : 'text-white'}`}>{title}</p>
        {status === 'current' && <p className="text-[9px] text-purple font-black tracking-widest mt-0.5">START HERE</p>}
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { completedLessons: globalCompletedLessons, loadingProgress } = useLesson();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleResume = async () => {
    try {
      const res = await fetch(`${API_URL}/progress/resume`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('codlift_token')}` }
      });
      const data = await res.json();
      if (data.nextLesson) {
        navigate(`/learn/${data.nextLesson.level}/${data.nextLesson.slug}/${data.nextLesson.exerciseId}`);
      } else {
        navigate('/learn/beginner/html-basics/1');
      }
    } catch {
      navigate('/learn/beginner/html-basics/1');
    }
  };

  if (!user || loadingProgress) return null;

  // Build dynamic skill tree from curriculum
  const beginnerLessons = clientCurriculum.filter(l => l.level === 'beginner');
  // Compute progress array (lesson IDs that have at least one completed exercise)
  const progressArray = Object.keys(globalCompletedLessons);
  const completedLessons = new Set(progressArray);

  const buildSkillTree = () => {
    const positions = [
      { x: '50%', y: '80px' },
      { x: '30%', y: '220px' },
      { x: '70%', y: '220px' },
      { x: '50%', y: '360px' },
      { x: '25%', y: '500px' },
      { x: '75%', y: '500px' },
      { x: '50%', y: '640px' },
    ];
    let foundCurrent = false;
    return beginnerLessons.slice(0, 7).map((lesson, i) => {
      const isCompleted = completedLessons.has(lesson.id);
      let status = 'locked';
      if (isCompleted) status = 'completed';
      else if (!foundCurrent) { status = 'current'; foundCurrent = true; }
      return {
        title: lesson.title,
        status,
        slug: lesson.id,
        level: lesson.level,
        ...(positions[i] || { x: '50%', y: `${80 + i * 150}px` }),
        delay: i * 0.1
      };
    });
  };
  const skillTree = buildSkillTree();
  const currentLesson = skillTree.find(n => n.status === 'current') || skillTree[0];
  const completedCount = skillTree.filter(n => n.status === 'completed').length;

  const stats = [
    { label: 'Day Streak', value: user.current_streak || 0, icon: Flame, color: 'text-yellow' },
    { label: 'Lessons Done', value: completedCount, icon: Trophy, color: 'text-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-background flex text-white font-sans">
      <SEO title="Dashboard | CodLift" description="Track your coding progress, streaks, and continue learning." url="/dashboard" />

      {/* ── Mobile sidebar overlay ──────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      {/* On desktop: fixed left. On mobile: slides in over content.        */}
      <aside className={`
        fixed top-0 left-0 h-full z-40 flex flex-col
        w-64 border-r border-white/5 p-6
        bg-navy/95 backdrop-blur-md
        transition-transform duration-300 ease-in-out
        ${ sidebarOpen ? 'translate-x-0' : '-translate-x-full' }
        md:translate-x-0
      `}>
        <Link to="/" className="flex items-center gap-2 mb-10" onClick={() => setSidebarOpen(false)}>
          <Logo className="w-9 h-9" />
          <span className="text-xl font-syne font-extrabold tracking-tighter">CODLIFT</span>
        </Link>

        <nav className="flex-1 space-y-1.5">
          <SidebarItem icon={Home}     label="Dashboard"   active onClick={() => { setSidebarOpen(false); navigate('/dashboard'); }} />
          <SidebarItem icon={BookOpen} label="Curriculum"  onClick={() => { setSidebarOpen(false); navigate('/dashboard'); }} />
          <SidebarItem icon={Gamepad2} label="Arena"       onClick={() => { setSidebarOpen(false); navigate('/arena'); }} />
          <SidebarItem icon={Trophy}   label="Leaderboard" onClick={() => { setSidebarOpen(false); navigate('/leaderboard'); }} />
          <SidebarItem icon={User}     label="Profile"     onClick={() => { setSidebarOpen(false); navigate('/profile'); }} />
        </nav>

        <div className="mt-auto space-y-1">
          <div className="px-4 py-3 rounded-xl bg-purple/10 border border-purple/20 mb-3">
            <p className="text-xs text-gray-400">Signed in as</p>
            <p className="font-bold text-sm truncate">{user.username}</p>
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all text-sm"
          >
            <User className="w-4 h-4" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      {/* md:ml-64 offsets the fixed sidebar on desktop; no offset on mobile */}
      <main className="flex-1 md:ml-64 p-4 sm:p-8 lg:p-10 overflow-y-auto w-full">

        {/* Mobile header bar with hamburger */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-syne font-extrabold text-sm tracking-tight">Dashboard</span>
          <div className="w-9" />{/* spacer */}
        </div>

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-syne font-extrabold tracking-tight mb-2">
              Welcome back, <span className="text-gradient-purple">{user.username}</span>!
            </h1>
            
            {/* ── Gamified Rank HUD ── */}
            {rankInfo && (
              <div className="mt-4 max-w-md">
                <div className="flex items-end justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{rankInfo.current.badge}</span>
                    <span className="font-bold text-lg text-purple-light">{rankInfo.current.title}</span>
                  </div>
                </div>
              </div>
            )}
            {!rankInfo && <p className="text-gray-400 text-sm mt-1">Ready to conquer today's challenges?</p>}
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
            {stats.map(s => (
              <div key={s.label} className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 glass px-4 py-2.5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                  <s.icon className={`w-4 h-4 ${s.color} drop-shadow-[0_0_8px_currentColor]`} />
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">{s.label}</span>
                </div>
                <span className="font-black text-lg">{s.value}</span>
              </div>
            ))}
          </div>
        </header>

        {/* Continue Learning Card */}
        {currentLesson && (
          <GlassCard className="mb-8 p-6 flex items-center justify-between border-purple/30 bg-gradient-to-r from-purple/10 to-transparent">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-purple/20 flex items-center justify-center border border-purple/30">
                <BookOpen className="w-8 h-8 text-purple" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Continue Learning</p>
                <h2 className="text-lg font-bold">{currentLesson.title}</h2>
                <p className="text-gray-400 text-sm">Beginner Track • {completedCount}/{beginnerLessons.length} complete</p>
              </div>
            </div>
            <Button size="lg" className="shrink-0" onClick={handleResume}>
              Continue <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </GlassCard>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map(s => (
            <GlassCard key={s.label} className="p-5 text-center border-white/5">
              <s.icon className={`w-8 h-8 mx-auto mb-2 ${s.color}`} />
              <p className="text-2xl font-black">{s.value}</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{s.label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Skill Tree */}
        <div className="glass rounded-[2rem] p-8 min-h-[780px] relative overflow-hidden bg-navy/40">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-purple" />
            <h3 className="font-syne font-extrabold text-lg">Beginner Skill Tree</h3>
            <span className="text-xs text-gray-500 ml-auto">{completedCount}/{beginnerLessons.length} lessons</span>
          </div>

          {/* Connector lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15">
            <path d="M 50% 80 L 30% 220"  stroke="white" strokeWidth="2" strokeDasharray="5,5" fill="none"/>
            <path d="M 50% 80 L 70% 220"  stroke="white" strokeWidth="2" strokeDasharray="5,5" fill="none"/>
            <path d="M 30% 220 L 50% 360" stroke="white" strokeWidth="2" strokeDasharray="5,5" fill="none"/>
            <path d="M 70% 220 L 50% 360" stroke="white" strokeWidth="2" strokeDasharray="5,5" fill="none"/>
            <path d="M 50% 360 L 25% 500" stroke="white" strokeWidth="2" strokeDasharray="5,5" fill="none"/>
            <path d="M 50% 360 L 75% 500" stroke="white" strokeWidth="2" strokeDasharray="5,5" fill="none"/>
            <path d="M 25% 500 L 50% 640" stroke="white" strokeWidth="2" strokeDasharray="5,5" fill="none"/>
            <path d="M 75% 500 L 50% 640" stroke="white" strokeWidth="2" strokeDasharray="5,5" fill="none"/>
          </svg>

          {skillTree.map((node, i) => <SkillNode key={i} {...node} />)}
        </div>

        {/* Pro Track Teaser */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard className="p-6 border-blue-500/20 bg-blue-500/5">
            <p className="text-xs text-blue-400 font-black uppercase tracking-widest mb-2">🔵 Pro Track</p>
            <h4 className="font-bold mb-1">React, Node.js & APIs</h4>
            <p className="text-xs text-gray-500 mb-4">Complete Beginner track to unlock</p>
            <div className="w-full bg-white/5 h-1.5 rounded-full">
              <div className="bg-blue-500 w-0 h-full rounded-full" />
            </div>
          </GlassCard>
          <GlassCard className="p-6 border-red-500/20 bg-red-500/5">
            <p className="text-xs text-red-400 font-black uppercase tracking-widest mb-2">🔴 Master Track</p>
            <h4 className="font-bold mb-1">Full Stack, DSA & System Design</h4>
            <p className="text-xs text-gray-500 mb-4">Complete Pro track to unlock</p>
            <div className="w-full bg-white/5 h-1.5 rounded-full">
              <div className="bg-red-500 w-0 h-full rounded-full" />
            </div>
          </GlassCard>
        </div>

      </main>
    </div>
  );
};
export default Dashboard;

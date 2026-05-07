import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, GlassCard } from '../components/ui/Core';
import { 
  Home, BookOpen, Gamepad2, User, 
  Zap, Flame, Star, ChevronRight, CheckCircle2, Lock, Trophy
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { SEO } from '../utils/SEO';
import { clientCurriculum } from '../data/curriculum';
import { AdSenseBlock } from '../components/AdSenseBlock';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
      active ? 'bg-cyan text-black shadow-[0_0_15px_rgba(0,245,212,0.3)]' : 'text-gray-400 hover:text-white hover:bg-white/5'
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
        status === 'completed' ? 'bg-cyan shadow-[0_0_20px_rgba(0,245,212,0.4)]' :
        status === 'current'   ? 'bg-navy border-2 border-cyan animate-pulse shadow-[0_0_15px_rgba(0,245,212,0.2)]' :
        'bg-gray-800 border-2 border-white/10 opacity-50 grayscale'
      }`}>
        {status === 'completed' ? <CheckCircle2 className="w-8 h-8 text-black" /> : 
         status === 'locked'    ? <Lock className="w-6 h-6 text-gray-500" /> :
         <Star className="w-8 h-8 text-cyan" />}
      </div>
      <div className="absolute top-[72px] left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
        <p className={`font-bold text-xs ${status === 'locked' ? 'text-gray-600' : 'text-white'}`}>{title}</p>
        {status === 'current' && <p className="text-[9px] text-cyan font-black tracking-widest mt-0.5">START HERE</p>}
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await fetch(`${API_URL}/progress`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('codlift_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProgress(data.map(p => `beginner-${p.lesson_id}-${p.exercise_id}`));
      } else {
        // Fallback to local
        const local = JSON.parse(localStorage.getItem('codlift_progress') || '[]');
        setProgress(local);
      }
    } catch {
      const local = JSON.parse(localStorage.getItem('codlift_progress') || '[]');
      setProgress(local);
    }
  };

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

  if (!user) return null;

  // Build dynamic skill tree from curriculum (beginner only on main dashboard)
  const beginnerLessons = clientCurriculum.filter(l => l.level === 'beginner');
  const completedLessons = new Set(
    progress.map(key => key.split('-').slice(1, -1).join('-'))
  );

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
    { label: 'Total XP', value: (user.xp_total || 0).toLocaleString(), icon: Zap, color: 'text-cyan' },
    { label: 'Day Streak', value: user.current_streak || 0, icon: Flame, color: 'text-yellow' },
    { label: 'Lessons Done', value: completedCount, icon: Trophy, color: 'text-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-background flex text-white font-sans">
      <SEO title="Dashboard | CodLift" description="Track your coding progress, XP, and continue learning." url="/dashboard" />

      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 p-6 flex flex-col fixed h-full z-20 bg-navy/70 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-cyan rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,245,212,0.3)]">
            <div className="w-4 h-4 bg-navy rounded-sm rotate-45" />
          </div>
          <span className="text-xl font-syne font-extrabold tracking-tighter">CODLIFT</span>
        </Link>

        <nav className="flex-1 space-y-1.5">
          <SidebarItem icon={Home}     label="Dashboard"  active onClick={() => navigate('/dashboard')} />
          <SidebarItem icon={BookOpen} label="Curriculum" onClick={() => navigate('/dashboard')} />
          <SidebarItem icon={Gamepad2} label="Arena"      onClick={() => navigate('/arena')} />
          <SidebarItem icon={Trophy}   label="Leaderboard" onClick={() => navigate('/leaderboard')} />
          <SidebarItem icon={User}     label="Profile"    onClick={() => navigate('/profile')} />
        </nav>

        <div className="mt-auto space-y-1">
          <div className="px-4 py-3 rounded-xl bg-cyan/10 border border-cyan/20 mb-3">
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

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 lg:p-10 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-syne font-extrabold tracking-tight">
              Welcome back, <span className="text-gradient-cyan">{user.username}</span>!
            </h1>
            <p className="text-gray-400 text-sm mt-1">Ready to conquer today's challenges?</p>
          </div>
          <div className="flex items-center gap-3">
            {stats.map(s => (
              <div key={s.label} className="flex items-center gap-1.5 glass px-3 py-2 rounded-full">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="font-bold text-sm">{s.value}</span>
              </div>
            ))}
          </div>
        </header>

        {/* Continue Learning Card */}
        {currentLesson && (
          <GlassCard className="mb-8 p-6 flex items-center justify-between border-cyan/30 bg-gradient-to-r from-cyan/10 to-transparent">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-cyan/20 flex items-center justify-center border border-cyan/30">
                <BookOpen className="w-8 h-8 text-cyan" />
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
            <Star className="w-5 h-5 text-cyan" />
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

        <AdSenseBlock slot="dashboard_footer" format="horizontal" className="mt-8" />
      </main>
    </div>
  );
};
export default Dashboard;

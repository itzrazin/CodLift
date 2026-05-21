import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, GlassCard } from '../components/ui/Core';
import { 
  User, Share2, 
  ExternalLink,
  Calendar, Award, Trophy,
  Code2, Layout, Database, Terminal, Rocket,
  CheckCircle2, Lock, ArrowRight, Sparkles,
  Github, Linkedin, Edit3, Check, X, Eye, ShieldAlert
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLesson } from '../context/LessonContext';
import { arenaChallenges } from '../data/challenges';
import { clientCurriculum } from '../data/curriculum';
import { SEO } from '../utils/SEO';
import api from '../api/axios';

const Badge = ({ icon: Icon, title, description, color, unlocked }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="flex flex-col items-center gap-2 group relative cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
        unlocked 
          ? `bg-white/5 border border-white/10 group-hover:scale-110 group-hover:bg-white/10 ${color} shadow-[0_0_15px_rgba(168,85,247,0.15)]`
          : 'bg-white/5 border border-white/5 opacity-35 grayscale'
      }`}>
        {unlocked ? (
          <>
            <Icon className="w-7 h-7" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          </>
        ) : (
          <Lock className="w-5 h-5 text-gray-500" />
        )}
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-tighter text-center transition-colors ${
        unlocked ? 'text-gray-400 group-hover:text-white' : 'text-gray-600'
      }`}>{title}</span>
      
      {/* Mini locked indicator badge */}
      {!unlocked && (
        <div className="absolute top-0 right-1 bg-black/60 border border-white/15 p-0.5 rounded-full">
          <Lock className="w-2.5 h-2.5 text-gray-400" />
        </div>
      )}

      {/* High-Fidelity Hover Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-16 z-30 w-48 p-4 rounded-xl bg-navy/95 border border-white/15 backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.5)] text-center pointer-events-none"
          >
            <p className="font-bold text-xs text-white uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
              {title} {unlocked ? '✅' : '🔒'}
            </p>
            <p className="text-[10px] text-gray-400 leading-normal">{description}</p>
            <div className={`mt-2 text-[9px] font-mono font-bold uppercase tracking-wider ${unlocked ? 'text-emerald-400' : 'text-purple/70'}`}>
              {unlocked ? 'Achievement Unlocked' : 'Locked'}
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-navy border-r border-b border-white/15 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProjectCard = ({ title, tech, type, date, completed, onPlay, onViewCode }) => (
  <GlassCard className="p-0 overflow-hidden group border-white/5 hover:border-purple/30 transition-all duration-300">
    <div className="h-36 bg-[#080b11] relative overflow-hidden flex flex-col justify-between p-5 border-b border-white/5">
      <div className="absolute inset-0 bg-gradient-to-br from-purple/10 to-blue-500/10 group-hover:scale-105 transition-transform duration-500 pointer-events-none" />
      
      <div className="flex justify-between items-start z-10">
        <span className="text-[9px] px-2 py-0.5 rounded-md bg-purple/15 text-purple font-mono uppercase tracking-widest border border-purple/30">
          {type}
        </span>
        {completed ? (
          <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 font-mono uppercase tracking-widest border border-emerald-500/30 animate-pulse">
            <CheckCircle2 className="w-2.5 h-2.5" /> Verified Solution
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-md bg-white/5 text-gray-500 font-mono uppercase tracking-widest border border-white/5">
            Locked
          </span>
        )}
      </div>

      <div className="z-10 mt-auto">
        <h4 className="font-syne font-extrabold text-lg group-hover:text-purple transition-colors">{title}</h4>
        <span className="text-[10px] text-gray-500 font-bold block mt-1">{date}</span>
      </div>
    </div>
    
    <div className="p-4 bg-navy/40 flex justify-between items-center">
      <div className="flex gap-1.5">
        {tech.map((t, i) => (
          <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-gray-400 font-mono uppercase">{t}</span>
        ))}
      </div>
      <div className="flex gap-2">
        {completed && (
          <Button 
            onClick={onViewCode}
            size="sm" 
            variant="ghost"
            className="h-7 text-[10px] py-0 px-2.5 uppercase tracking-wider text-gray-400 border-white/10 hover:border-purple/30"
          >
            <Eye className="w-3 h-3 mr-1" /> View Code
          </Button>
        )}
        <Button 
          onClick={onPlay}
          size="sm" 
          variant={completed ? "purple" : "ghost"}
          className="h-7 text-[10px] py-0 px-3 uppercase tracking-wider"
        >
          {completed ? 'Replay App' : 'Battle'} <ExternalLink className="w-2.5 h-2.5 ml-1" />
        </Button>
      </div>
    </div>
  </GlassCard>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { completedLessons } = useLesson();

  // Customizer form states
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.name || user?.username || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editGithub, setEditGithub] = useState(user?.github_username || '');
  const [editLinkedin, setEditLinkedin] = useState(user?.linkedin_username || '');
  
  // Parse avatar e.g. "Terminal:pink"
  const defaultAvatarStr = user?.avatar || 'User:purple';
  const [initialIcon, initialColor] = defaultAvatarStr.split(':');
  const [selectedIcon, setSelectedIcon] = useState(initialIcon || 'User');
  const [selectedColor, setSelectedColor] = useState(initialColor || 'purple');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Code viewer modal states
  const [viewingCodeChallenge, setViewingCodeChallenge] = useState(null);
  const [viewingCodeExerciseId, setViewingCodeExerciseId] = useState(1);
  const [copied, setCopied] = useState(false);

  // Map icon names to Lucide icons
  const iconMap = {
    User,
    Terminal,
    Code2,
    Cpu: Rocket,
    Braces: Sparkles,
    Database,
    Sparkles
  };

  const colorMap = {
    purple: {
      gradient: 'from-purple to-indigo-500',
      border: 'border-purple/30',
      text: 'text-purple',
      shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.35)]',
      bg: 'bg-purple',
      hex: '#a855f7'
    },
    blue: {
      gradient: 'from-blue-500 to-cyan-500',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.35)]',
      bg: 'bg-blue-500',
      hex: '#3b82f6'
    },
    pink: {
      gradient: 'from-pink-500 to-purple',
      border: 'border-pink-500/30',
      text: 'text-pink-400',
      shadow: 'shadow-[0_0_20px_rgba(236,72,153,0.35)]',
      bg: 'bg-pink-500',
      hex: '#ec4899'
    },
    green: {
      gradient: 'from-emerald-500 to-teal-500',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.35)]',
      bg: 'bg-emerald-500',
      hex: '#10b981'
    },
    yellow: {
      gradient: 'from-yellow to-amber-500',
      border: 'border-yellow/30',
      text: 'text-yellow',
      shadow: 'shadow-[0_0_20px_rgba(234,179,8,0.35)]',
      bg: 'bg-yellow',
      hex: '#eab308'
    },
    orange: {
      gradient: 'from-orange-500 to-red-500',
      border: 'border-orange-500/30',
      text: 'text-orange-400',
      shadow: 'shadow-[0_0_20px_rgba(249,115,22,0.35)]',
      bg: 'bg-orange-500',
      hex: '#f97316'
    }
  };

  const parsedColor = colorMap[selectedColor] || colorMap.purple;
  const ProfileIcon = iconMap[selectedIcon] || User;

  // Calculate exercises solved
  let exercisesSolved = 0;
  if (completedLessons) {
    Object.values(completedLessons).forEach(exercisesMap => {
      if (exercisesMap) {
        exercisesSolved += Object.keys(exercisesMap).length;
      }
    });
  }

  // Calculate Arena Solves
  const arenaCompletedCount = completedLessons ? arenaChallenges.filter(challenge => {
    return challenge.exercises.every((ex, idx) => completedLessons[challenge.id]?.[idx + 1]);
  }).length : 0;

  // Joined Date parsing
  const formatJoinDate = (dateStr) => {
    if (!dateStr) return 'May 2026';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch (e) {
      return 'May 2026';
    }
  };

  // Achievements config
  const achievements = [
    { 
      icon: Trophy, 
      title: 'GLADIATOR', 
      description: 'Beat at least one interactive game in the Challenge Arena to earn.',
      color: 'text-yellow text-opacity-100', 
      unlocked: arenaCompletedCount > 0 
    },
    { 
      icon: Code2, 
      title: 'CLEAN CODER', 
      description: 'Solve 5 or more total coding exercises on the platform.',
      color: 'text-purple text-opacity-100', 
      unlocked: exercisesSolved >= 5 
    },
    { 
      icon: Rocket, 
      title: 'FAST SHIP', 
      description: 'Start your quest and complete your very first exercise.',
      color: 'text-pink-400 text-opacity-100', 
      unlocked: exercisesSolved >= 1 
    },
    { 
      icon: Terminal, 
      title: 'SHELL MASTER', 
      description: 'Complete the Algorithm Duel or Auth Logic 101 arena puzzle.',
      color: 'text-green-400 text-opacity-100', 
      unlocked: !!(completedLessons?.['algorithm-duel'] || completedLessons?.['auth-logic-101']) 
    },
    { 
      icon: Layout, 
      title: 'UI WIZARD', 
      description: 'Complete an exercise in the HTML Basics or CSS Flexbox course.',
      color: 'text-blue-400 text-opacity-100', 
      unlocked: !!(completedLessons?.['html-basics'] || completedLessons?.['css-flexbox']) 
    },
    { 
      icon: Database, 
      title: 'QUERY KING', 
      description: 'Complete the Auth Logic 101 backend challenge in the Arena.',
      color: 'text-yellow text-opacity-100', 
      unlocked: !!(completedLessons?.['auth-logic-101']) 
    }
  ];

  // Dynamic Skill Progression Levels
  const getSkillsProgress = () => {
    let htmlTotal = 0, htmlDone = 0;
    let cssTotal = 0, cssDone = 0;
    let jsTotal = 0, jsDone = 0;
    let backendTotal = 0, backendDone = 0;

    // Load from static curriculum
    clientCurriculum.forEach(lesson => {
      const lang = lesson.language;
      const count = lesson.exercises.length;
      let done = 0;
      lesson.exercises.forEach((ex, idx) => {
        if (completedLessons?.[lesson.id]?.[idx + 1]) {
          done++;
        }
      });

      if (lang === 'html') {
        htmlTotal += count;
        htmlDone += done;
      } else if (lang === 'css') {
        cssTotal += count;
        cssDone += done;
      } else if (lang === 'javascript') {
        jsTotal += count;
        jsDone += done;
      }
    });

    // Load from Challenge Arena
    arenaChallenges.forEach(challenge => {
      const count = challenge.exercises.length;
      let done = 0;
      challenge.exercises.forEach((ex, idx) => {
        if (completedLessons?.[challenge.id]?.[idx + 1]) {
          done++;
        }
      });

      if (challenge.id === 'auth-logic-101') {
        backendTotal += count;
        backendDone += done;
      } else {
        jsTotal += count;
        jsDone += done;
      }
    });

    const frontPct = Math.round(((htmlDone + cssDone) / Math.max(htmlTotal + cssTotal, 1)) * 100);
    const backPct = Math.round((backendDone / Math.max(backendTotal, 1)) * 100);
    const designPct = Math.round((cssDone / Math.max(cssTotal, 1)) * 100) || Math.round((htmlDone / Math.max(htmlTotal, 1)) * 50);
    const algoPct = Math.round((jsDone / Math.max(jsTotal, 1)) * 100);

    return [
      { name: "Frontend", level: `${Math.max(frontPct, 5)}%`, color: "bg-purple" },
      { name: "Backend", level: `${Math.max(backPct, 5)}%`, color: "bg-blue-500" },
      { name: "Design", level: `${Math.max(designPct, 5)}%`, color: "bg-pink-500" },
      { name: "Algorithms", level: `${Math.max(algoPct, 5)}%`, color: "bg-yellow" }
    ];
  };

  const skills = getSkillsProgress();

  const handleOpenEdit = () => {
    setEditUsername(user?.name || user?.username || '');
    setEditBio(user?.bio || '');
    setEditGithub(user?.github_username || '');
    setEditLinkedin(user?.linkedin_username || '');
    const [uIcon, uColor] = (user?.avatar || 'User:purple').split(':');
    setSelectedIcon(uIcon || 'User');
    setSelectedColor(uColor || 'purple');
    setErrorMsg('');
    setSuccessMsg('');
    setIsEditing(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editUsername.trim()) {
      setErrorMsg('Username is required.');
      return;
    }
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.put('/user/profile', {
        username: editUsername,
        bio: editBio,
        github_username: editGithub,
        linkedin_username: editLinkedin,
        avatar: `${selectedIcon}:${selectedColor}`
      });

      if (res.data.success) {
        setUser(res.data.user);
        setSuccessMsg('Profile updated successfully! ✨');
        setTimeout(() => {
          setIsEditing(false);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleViewCode = (challenge) => {
    setViewingCodeChallenge(challenge);
    setViewingCodeExerciseId(1);
    setCopied(false);
  };

  const handleCopyToClipboard = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render correct user code for exercise inside a completed challenge
  const getSavedCodeForViewing = () => {
    if (!viewingCodeChallenge) return '';
    const map = completedLessons?.[viewingCodeChallenge.id] || {};
    const record = map[viewingCodeExerciseId];
    return record?.code || '// Code content could not be retrieved.';
  };

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      <SEO 
        title={`${user?.name || user?.username || 'My'} Developer Profile | CodLift`}
        description="View my coding stats and public projects on CodLift."
        url="/profile"
      />
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start mb-20 bg-white/5 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple/5 to-transparent pointer-events-none" />
          
          <div className="relative group mx-auto md:mx-0">
            <div className={`w-36 h-36 rounded-[2rem] bg-gradient-to-tr ${parsedColor.gradient} p-1 ${parsedColor.shadow} transition-all duration-500`}>
              <div className="w-full h-full rounded-[1.8rem] bg-navy flex items-center justify-center overflow-hidden relative">
                <ProfileIcon className={`w-20 h-20 ${parsedColor.text}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex-1 w-full text-center md:text-left">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
              <div>
                <h1 className="text-4xl font-syne font-extrabold mb-3 uppercase tracking-tight flex flex-wrap items-center justify-center md:justify-start gap-2">
                  {user?.name || user?.username} 
                  <span className="text-purple/50 text-xl font-mono font-normal">#00{user?.id ? user.id.slice(-2) : '01'}</span>
                </h1>
                
                {/* Social Badges and Dynamic Track Rank */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    user?.level === 'advanced' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    user?.level === 'intermediate' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-purple/10 text-purple border border-purple/20'
                  }`}>
                    {user?.level || 'Beginner'} Developer
                  </span>

                  {user?.github_username && (
                    <a 
                      href={`https://github.com/${user.github_username}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-purple/30 text-gray-300 hover:text-white transition-all"
                    >
                      <Github className="w-3.5 h-3.5" /> github.com/{user.github_username}
                    </a>
                  )}

                  {user?.linkedin_username && (
                    <a 
                      href={`https://linkedin.com/in/${user.linkedin_username}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-purple/30 text-gray-300 hover:text-white transition-all"
                    >
                      <Linkedin className="w-3.5 h-3.5" /> linkedin.com/in/{user.linkedin_username}
                    </a>
                  )}
                </div>

                <p className="text-gray-400 max-w-lg italic font-medium leading-relaxed">
                  "{user?.bio || 'Building the future, one semi-colon at a time. Full-stack enthusiast and CSS wizard in training.'}"
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="ghost" size="sm" onClick={handleOpenEdit} className="border-white/10 hover:border-purple/30">
                  <Edit3 className="w-4 h-4 mr-2 text-purple" /> Edit Profile
                </Button>
                <Button size="sm" onClick={() => navigate('/dashboard')}>Dashboard</Button>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-8 text-sm border-t border-white/5 pt-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400">Joined <span className="text-white font-bold">{formatJoinDate(user?.created_at)}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow" />
                <span className="text-gray-400">Arena Solves <span className="text-yellow font-bold">{arenaCompletedCount}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-pink-400" />
                <span className="text-gray-400">Exercises Solved <span className="text-pink-400 font-bold">{exercisesSolved}</span></span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Stats & Badges */}
          <div className="space-y-8">
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow" /> Verified Achievements
              </h3>
              <div className="grid grid-cols-3 gap-y-8">
                {achievements.map((ach, idx) => (
                  <Badge 
                    key={idx} 
                    icon={ach.icon} 
                    title={ach.title} 
                    description={ach.description}
                    color={ach.color} 
                    unlocked={ach.unlocked} 
                  />
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple" /> Dynamic Skills Radar
              </h3>
              <div className="space-y-4">
                {skills.map((s, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                      <span>{s.name}</span>
                      <span className="text-white">{s.level}</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: s.level }}
                        transition={{ duration: 1.0, delay: i * 0.1 }}
                        className={`${s.color} h-full rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Projects */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-syne font-extrabold">Playable <span className="text-gradient-purple">Portfolio</span></h3>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Verified Solutions</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {arenaChallenges.map((challenge) => {
                const completed = challenge.exercises.every((ex, idx) => completedLessons?.[challenge.id]?.[idx + 1]);
                return (
                  <ProjectCard 
                    key={challenge.id}
                    title={challenge.title}
                    tech={[challenge.language, challenge.difficulty]}
                    type={challenge.type}
                    date={completed ? "Verified Solution Active ✅" : "Challenge Locked 🔒"}
                    completed={completed}
                    onPlay={() => navigate(`/learn/arena/${challenge.id}/1`)}
                    onViewCode={() => handleViewCode(challenge)}
                  />
                );
              })}
            </div>

            {arenaCompletedCount < arenaChallenges.length && (
              <div className="p-6 bg-purple/5 border border-purple/10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <h4 className="font-syne font-extrabold text-white text-md mb-1">⚔️ Enter the Challenge Arena</h4>
                  <p className="text-xs text-gray-400">Unlock more verified playable applications in your portfolio by beating challenges.</p>
                </div>
                <Button size="sm" onClick={() => navigate('/arena')}>
                  Battle Now <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── IMMERSIVE GLASSMORPHIC CUSTOMIZER DIALOG (Modal) ────────────────────────── */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-navy/95 border border-white/10 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[90vh] z-10"
            >
              <button 
                onClick={() => setIsEditing(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 text-gray-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-6">
                <div className="p-2 rounded-xl bg-purple/10 border border-purple/20">
                  <Sparkles className="w-5 h-5 text-purple" />
                </div>
                <h3 className="text-2xl font-syne font-extrabold tracking-tight uppercase">Customizer Console</h3>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Error/Success Feedbacks */}
                {errorMsg && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> {successMsg}
                  </div>
                )}

                {/* Username Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Developer Identity (Username)</label>
                  <input 
                    type="text" 
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    placeholder="E.g. CodeWarrior"
                    className="w-full bg-[#080b11] border border-white/10 focus:border-purple/50 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors text-white font-mono font-bold"
                  />
                </div>

                {/* Bio Textarea */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Developer Quote (Bio)</label>
                  <textarea 
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value.slice(0, 150))}
                    placeholder="Describe your quest..."
                    rows="3"
                    className="w-full bg-[#080b11] border border-white/10 focus:border-purple/50 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors text-white leading-relaxed resize-none"
                  />
                  <div className="text-right text-[10px] font-mono text-gray-600 font-bold">{editBio.length}/150 CHARACTERS</div>
                </div>

                {/* Social Handles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">GitHub Handle</label>
                    <div className="relative">
                      <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="text" 
                        value={editGithub}
                        onChange={(e) => setEditGithub(e.target.value)}
                        placeholder="username"
                        className="w-full bg-[#080b11] border border-white/10 focus:border-purple/50 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none transition-colors text-white font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">LinkedIn Handle</label>
                    <div className="relative">
                      <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="text" 
                        value={editLinkedin}
                        onChange={(e) => setEditLinkedin(e.target.value)}
                        placeholder="username"
                        className="w-full bg-[#080b11] border border-white/10 focus:border-purple/50 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none transition-colors text-white font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Avatar Icon Selector Grid */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Select Custom Identity Icon</label>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                    {Object.keys(iconMap).map((iconName) => {
                      const IconComponent = iconMap[iconName];
                      const isSelected = selectedIcon === iconName;
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => setSelectedIcon(iconName)}
                          className={`h-11 rounded-xl flex items-center justify-center transition-all ${
                            isSelected 
                              ? 'bg-purple/10 border border-purple text-purple shadow-[0_0_12px_rgba(168,85,247,0.25)]' 
                              : 'bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/15'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Avatar Accent Color Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Select Accent Theme Color</label>
                  <div className="flex flex-wrap gap-3">
                    {Object.keys(colorMap).map((colorName) => {
                      const details = colorMap[colorName];
                      const isSelected = selectedColor === colorName;
                      return (
                        <button
                          key={colorName}
                          type="button"
                          onClick={() => setSelectedColor(colorName)}
                          className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center shadow-lg ${
                            isSelected ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                          }`}
                          style={{ backgroundColor: details.hex, boxShadow: isSelected ? `0 0 15px ${details.hex}` : 'none' }}
                        >
                          {isSelected && <Check className="w-4 h-4 text-black font-black" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <Button 
                    type="button"
                    variant="ghost" 
                    onClick={() => setIsEditing(false)}
                    className="border-white/5 hover:border-white/15"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="px-6 relative overflow-hidden" 
                    disabled={saving}
                  >
                    {saving ? 'Syncing...' : 'Save Configuration'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── PLATFORM SOLUTION CODE VIEWER MODAL ─────────────────────────────────────── */}
      <AnimatePresence>
        {viewingCodeChallenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingCodeChallenge(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-navy/95 border border-white/10 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden max-h-[85vh] z-10 flex flex-col"
            >
              <button 
                onClick={() => setViewingCodeChallenge(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 text-gray-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-6 flex items-start gap-4">
                <div className="p-3 bg-purple/10 border border-purple/20 rounded-2xl">
                  <Code2 className="w-6 h-6 text-purple" />
                </div>
                <div>
                  <span className="text-[9px] px-2 py-0.5 rounded-md bg-purple/15 text-purple font-mono uppercase tracking-widest border border-purple/30 block w-fit mb-1.5">
                    Verified Repository
                  </span>
                  <h3 className="text-2xl font-syne font-extrabold tracking-tight uppercase">
                    {viewingCodeChallenge.title} Source Code
                  </h3>
                </div>
              </div>

              {/* Code Viewer Layout */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 overflow-hidden min-h-0">
                {/* Left Selector: Exercise milestones */}
                <div className="space-y-2 overflow-y-auto pr-2">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Target Milestones</p>
                  {viewingCodeChallenge.exercises.map((ex, idx) => {
                    const isSelected = viewingCodeExerciseId === (idx + 1);
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setViewingCodeExerciseId(idx + 1);
                          setCopied(false);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1 ${
                          isSelected 
                            ? 'bg-purple/10 border-purple text-white shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10 hover:text-white'
                        }`}
                      >
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-purple">Milestone 0{idx + 1}</span>
                        <span className="text-xs font-bold truncate">{ex.title}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Right Source Code Editor Simulator */}
                <div className="md:col-span-3 bg-[#080b11] border border-white/10 rounded-2xl flex flex-col overflow-hidden relative">
                  <div className="px-5 py-3.5 bg-navy/60 border-b border-white/5 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                      <span className="text-[11px] font-mono text-gray-500 ml-2">solution.js</span>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyToClipboard(getSavedCodeForViewing())}
                      className="h-7 text-[10px] py-0 px-3 uppercase tracking-wider border-white/5 text-gray-400 hover:text-white hover:bg-white/5"
                    >
                      {copied ? 'Copied! ✅' : 'Copy Code'}
                    </Button>
                  </div>

                  <div className="flex-1 overflow-auto p-6 font-mono text-xs leading-relaxed text-purple/90 select-text">
                    <pre className="whitespace-pre">{getSavedCodeForViewing()}</pre>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;

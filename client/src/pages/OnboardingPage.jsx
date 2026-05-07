import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { GlassCard, Button } from '../components/ui/Core';
import { Rocket, Code2, Zap, Terminal } from 'lucide-react';
import { API_URL } from '../utils/config';

const levels = [
  { id: 'beginner', title: 'BEGINNER', icon: Rocket, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30', desc: 'New to coding? Start from HTML and work your way up.' },
  { id: 'intermediate', title: 'INTERMEDIATE', icon: Code2, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30', desc: 'Know some basics? Deep dive into JavaScript.' },
  { id: 'pro', title: 'PRO', icon: Zap, color: 'text-yellow', bg: 'bg-yellow/10', border: 'border-yellow/30', desc: 'Comfortable with JS? Master React and modern frontend.' },
  { id: 'master', title: 'MASTER', icon: Terminal, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30', desc: 'Ready for backend? Build full-stack apps with Node and DBs.' }
];

export const OnboardingPage = () => {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/auth/level`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ level: selected })
      });
      
      if (res.ok) {
        setUser({ ...user, level: selected });
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan/5 blur-[120px] rounded-full"></div>
      
      <div className="text-center mb-12 z-10">
        <h1 className="text-4xl md:text-5xl font-syne font-extrabold mb-4">Choose Your Path</h1>
        <p className="text-gray-400 text-lg">Select your current skill level to personalize your curriculum.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl z-10 mb-12">
        {levels.map((level, idx) => {
          const Icon = level.icon;
          const isSelected = selected === level.id;
          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelected(level.id)}
            >
              <GlassCard 
                className={`cursor-pointer h-full transition-all duration-300 border-2 ${
                  isSelected ? `${level.border} scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]` : 'border-transparent hover:border-white/10'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${level.bg}`}>
                  <Icon className={`w-6 h-6 ${level.color}`} />
                </div>
                <h3 className={`text-xl font-bold tracking-widest mb-3 ${level.color}`}>{level.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{level.desc}</p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <Button 
        size="lg" 
        className="z-10 w-64"
        disabled={!selected || loading}
        onClick={handleContinue}
      >
        {loading ? 'Saving...' : 'Start Coding'}
      </Button>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Button, GlassCard } from '../components/ui/Core';
import { 
  User, Share2, 
  ExternalLink,
  Calendar, Zap, Flame, Award,
  Code2, Layout, Database, Terminal, Rocket,
  CheckCircle2, Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { SEO } from '../utils/SEO';

const Badge = ({ icon: Icon, title, color }) => (
  <div className="flex flex-col items-center gap-2 group">
    <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/10 ${color}`}>
      <Icon className="w-7 h-7" />
    </div>
    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter text-center">{title}</span>
  </div>
);

const ProjectCard = ({ title, tech, image, date }) => (
  <GlassCard className="p-0 overflow-hidden group border-white/5">
    <div className="h-40 bg-navy relative overflow-hidden">
      {/* Mock Image/Preview */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple/20 to-blue-500/20 group-hover:scale-110 transition-transform duration-500"></div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-navy/60 backdrop-blur-sm">
        <Button size="sm" variant="purpleGhost">
          View Project <ExternalLink className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
    <div className="p-5">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-lg">{title}</h4>
        <span className="text-[10px] text-gray-600 font-bold">{date}</span>
      </div>
      <div className="flex gap-2">
        {tech.map((t, i) => (
          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 font-bold uppercase">{t}</span>
        ))}
      </div>
    </div>
  </GlassCard>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="My Developer Profile | CodLift"
        description="View my coding stats, streak, XP, and public projects on CodLift."
        url="/profile"
      />
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-12 items-start mb-20">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-purple to-blue-500 p-1">
              <div className="w-full h-full rounded-[1.4rem] bg-navy flex items-center justify-center overflow-hidden">
                <User className="w-16 h-16 text-gray-700" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-yellow flex items-center justify-center border-4 border-navy">
              <span className="text-black font-black text-xs">Lvl 8</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div>
                <h1 className="text-4xl font-syne font-extrabold mb-2">{user?.username} <span className="text-gray-600 text-xl font-normal ml-2">#0001</span></h1>
                <p className="text-gray-400 max-w-lg italic">"Building the future, one semi-colon at a time. Full-stack enthusiast and CSS wizard in training."</p>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4 mr-2" /> Share Profile
                </Button>
                <Button size="sm">Edit Profile</Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400">Joined <span className="text-white font-bold">Today</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-yellow" />
                <span className="text-gray-400">Max Streak <span className="text-yellow font-bold">{user?.current_streak || 0} Days</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple" />
                <span className="text-gray-400">Total XP <span className="text-purple font-bold">{user?.xp_total || 0}</span></span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Stats & Badges */}
          <div className="space-y-8">
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow" /> Achievements
              </h3>
              <div className="grid grid-cols-3 gap-y-8">
                <Badge icon={Flame} title="HOT STREAK" color="text-yellow" />
                <Badge icon={Code2} title="CLEAN CODER" color="text-purple" />
                <Badge icon={Rocket} title="FAST SHIP" color="text-purple-400" />
                <Badge icon={Terminal} title="SHELL MASTER" color="text-green-400" />
                <Badge icon={Layout} title="UI WIZARD" color="text-pink-400" />
                <Badge icon={Database} title="QUERY KING" color="text-blue-400" />
              </div>
            </GlassCard>

            <GlassCard className="p-8">
              <h3 className="text-xl font-bold mb-6">Skills Radar</h3>
              <div className="space-y-4">
                {[
                  { name: "Frontend", level: "85%", color: "bg-purple" },
                  { name: "Backend", level: "60%", color: "bg-blue-500" },
                  { name: "Design", level: "75%", color: "bg-pink-500" },
                  { name: "Algorithms", level: "45%", color: "bg-yellow" }
                ].map((s, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                      <span>{s.name}</span>
                      <span>{s.level}</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className={`${s.color} h-full rounded-full`} style={{ width: s.level }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Projects */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-syne font-extrabold">Public <span className="text-gradient-purple">Projects</span></h3>
              <div className="flex gap-2">
                <button className="text-xs font-bold text-purple border-b border-purple pb-1">All Projects</button>
                <button className="text-xs font-bold text-gray-500 hover:text-white transition-colors pb-1">Mini Games</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProjectCard 
                title="Glassmorphism UI Kit" 
                tech={["React", "Tailwind"]} 
                date="2 days ago" 
              />
              <ProjectCard 
                title="Real-time Chat App" 
                tech={["Node.js", "Socket.io"]} 
                date="1 week ago" 
              />
              <ProjectCard 
                title="Personal Bio Page" 
                tech={["HTML", "CSS"]} 
                date="2 weeks ago" 
              />
              <ProjectCard 
                title="Crypto Dashboard" 
                tech={["React", "APIs"]} 
                date="1 month ago" 
              />
            </div>

            <Button variant="ghost" className="w-full py-4 border-dashed">
              Show more projects
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


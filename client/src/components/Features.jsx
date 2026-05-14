import React from 'react';
import { GlassCard } from './ui/Core';
import { Terminal, Trophy, Rocket, Gamepad2 } from 'lucide-react';

export const Marquee = () => {
  const techs = ['React', 'HTML', 'CSS', 'JavaScript', 'Python', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker', 'AWS'];
  
  return (
    <div className="py-6 border-y-4 border-cyber-pink overflow-hidden bg-cyber-pink shadow-[0_0_20px_rgba(255,0,255,0.4)]">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...techs, ...techs].map((tech, i) => (
          <span key={i} className="mx-12 text-3xl font-syne font-black text-black uppercase tracking-widest cursor-default">
            {tech}
          </span>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}} />
    </div>
  );
};

export const Features = () => {
  const features = [
    {
      icon: <Terminal className="w-8 h-8 text-purple" />,
      title: "In-browser IDE",
      desc: "Zero install, code instantly. Monaco editor power right in your browser."
    },
    {
      icon: <Trophy className="w-8 h-8 text-yellow" />,
      title: "XP + Daily Streaks",
      desc: "Stay motivated like Duolingo. Earn XP and keep your streak alive."
    },
    {
      icon: <Rocket className="w-8 h-8 text-purple" />,
      title: "Real Projects",
      desc: "Build something every single lesson. Practical skills, no theory walls."
    },
    {
      icon: <Gamepad2 className="w-8 h-8 text-yellow" />,
      title: "Coding Challenges",
      desc: "Practical games and battles. Master syntax through high-engagement play."
    }
  ];

  return (
    <section className="py-24 relative scanlines">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl lg:text-5xl mb-16 font-syne font-extrabold uppercase tracking-tight">Everything you need to <span className="text-gradient-purple drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]">Level Up.</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <GlassCard key={i} className="text-left group border-4 hover:border-cyber-cyan hover:-translate-y-2 transition-all">
              <div className="mb-6 p-4 border-2 border-white bg-cyber-dark shadow-neo w-fit group-hover:shadow-neo-cyan group-hover:scale-110 transition-all duration-300">
                {f.icon}
              </div>
              <h3 className="text-xl mb-4 font-syne font-bold uppercase">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed font-mono text-sm">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

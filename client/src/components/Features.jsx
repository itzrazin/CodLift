import React from 'react';
import { GlassCard } from './ui/Core';
import { Terminal, Trophy, Rocket, Gamepad2 } from 'lucide-react';

export const Marquee = () => {
  const techs = ['React', 'HTML', 'CSS', 'JavaScript', 'Python', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker', 'AWS'];
  
  return (
    <div className="py-10 border-y border-white/5 overflow-hidden bg-navy/50">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...techs, ...techs].map((tech, i) => (
          <span key={i} className="mx-12 text-2xl font-syne font-bold text-gray-600 hover:text-purple transition-colors cursor-default">
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
    <section className="py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl lg:text-5xl mb-16">Everything you need to <span className="text-gradient-purple">Level Up.</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <GlassCard key={i} className="text-left group">
              <div className="mb-6 p-4 rounded-xl bg-white/5 w-fit group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <h3 className="text-xl mb-4">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

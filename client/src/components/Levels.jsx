
import { CheckCircle2, Lock } from 'lucide-react';

export const LevelProgression = () => {
  const levels = [
    { name: "BEGINNER", color: "bg-green-500", border: "border-green-500/30", text: "HTML, CSS, Basic JS", dot: "🟢" },
    { name: "PRO", color: "bg-blue-500", border: "border-blue-500/30", text: "React, Node.js, APIs", dot: "🔵" },
    { name: "MASTER", color: "bg-red-500", border: "border-red-500/30", text: "Full Stack, Systems, DSA", dot: "🔴" }
  ];

  return (
    <section className="py-24 bg-cyber-dark border-y-4 border-cyber-cyan relative scanlines">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-4xl lg:text-5xl mb-8">From Zero to <span className="text-gradient-purple">Hero.</span></h2>
            <p className="text-xl text-gray-400 mb-12">
              Our curriculum is designed to take you through three major career milestones. 
              Each tier unlocks new potential and complex challenges.
            </p>
            <div className="space-y-6">
              {levels.map((level, i) => (
                <div key={i} className={`flex items-center gap-6 p-6 border-4 ${level.border} bg-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:-translate-y-2 hover:shadow-neo transition-all duration-300`}>
                  <div className="text-4xl">{level.dot}</div>
                  <div>
                    <h4 className="text-lg font-syne font-black tracking-widest uppercase">{level.name}</h4>
                    <p className="text-gray-400 font-mono text-sm uppercase">{level.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-xl">
            <div className="slanted-box bg-cyber-dark border-4 border-cyber-pink p-8 relative overflow-hidden shadow-neo">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <CheckCircle2 className="w-32 h-32 text-cyber-pink animate-pulse" />
              </div>
              <h3 className="text-2xl mb-8 font-syne font-extrabold uppercase tracking-widest text-cyber-cyan drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">Skill Tree</h3>
              <div className="space-y-8 relative">
                {/* Vertical Line */}
                <div className="absolute left-6 top-8 bottom-8 w-1 bg-cyber-pink/30"></div>
                
                {[
                  { title: "HTML Fundamentals", status: "completed" },
                  { title: "CSS Flexbox & Grid", status: "current" },
                  { title: "JavaScript Logic", status: "locked" },
                  { title: "React Components", status: "locked" },
                  { title: "Backend Systems", status: "locked" }
                ].map((node, i) => (
                  <div key={i} className="flex items-center gap-6 group">
                    <div className={`w-12 h-12 flex items-center justify-center z-10 transition-all duration-500 border-2 ${
                      node.status === 'completed' ? 'bg-cyber-pink border-cyber-pink shadow-[0_0_15px_rgba(255,0,255,0.8)]' :
                      node.status === 'current' ? 'bg-black border-cyber-cyan shadow-[0_0_15px_rgba(0,255,255,0.8)] animate-pulse' :
                      'bg-black border-white/20'
                    }`}>
                      {node.status === 'completed' ? <CheckCircle2 className="w-6 h-6 text-black" /> : 
                       node.status === 'locked' ? <Lock className="w-5 h-5 text-gray-500" /> :
                       <div className="w-4 h-4 bg-cyber-cyan"></div>}
                    </div>
                    <div className={`transition-colors duration-300 font-mono uppercase ${
                      node.status === 'locked' ? 'text-gray-600' : 'text-white'
                    }`}>
                      <p className="font-bold text-sm">{node.title}</p>
                      {node.status === 'current' && <p className="text-xs text-cyber-cyan drop-shadow-[0_0_5px_rgba(0,255,255,0.8)] mt-1">&gt; IN PROGRESS</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

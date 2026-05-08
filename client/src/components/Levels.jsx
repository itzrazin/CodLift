import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, ChevronRight } from 'lucide-react';

export const LevelProgression = () => {
  const levels = [
    { name: "BEGINNER", color: "bg-green-500", border: "border-green-500/30", text: "HTML, CSS, Basic JS", dot: "🟢" },
    { name: "PRO", color: "bg-blue-500", border: "border-blue-500/30", text: "React, Node.js, APIs", dot: "🔵" },
    { name: "MASTER", color: "bg-red-500", border: "border-red-500/30", text: "Full Stack, Systems, DSA", dot: "🔴" }
  ];

  return (
    <section className="py-24 bg-navy/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-4xl lg:text-5xl mb-8">From Zero to <span className="text-gradient-purple">Hero.</span></h2>
            <p className="text-xl text-gray-400 mb-12">
              Our curriculum is designed to take you through three major career milestones. 
              Each tier unlocks new potential and complex challenges.
            </p>
            <div className="space-y-6">
              {levels.map((level, i) => (
                <div key={i} className={`flex items-center gap-6 p-6 rounded-2xl border ${level.border} bg-white/5`}>
                  <div className="text-4xl">{level.dot}</div>
                  <div>
                    <h4 className="text-lg font-bold tracking-widest">{level.name}</h4>
                    <p className="text-gray-400">{level.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-xl">
            <div className="glass p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <CheckCircle2 className="w-32 h-32 text-purple" />
              </div>
              <h3 className="text-2xl mb-8">Skill Tree Preview</h3>
              <div className="space-y-8 relative">
                {/* Vertical Line */}
                <div className="absolute left-6 top-8 bottom-8 w-1 bg-white/5"></div>
                
                {[
                  { title: "HTML Fundamentals", status: "current" },
                  { title: "CSS Flexbox & Grid", status: "locked" },
                  { title: "JavaScript Logic", status: "locked" },
                  { title: "React Components", status: "locked" },
                  { title: "Backend Systems", status: "locked" }
                ].map((node, i) => (
                  <div key={i} className="flex items-center gap-6 group">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                      node.status === 'completed' ? 'bg-purple shadow-[0_0_15px_rgba(168,85,247,0.5)]' :
                      node.status === 'current' ? 'bg-navy border-2 border-purple animate-pulse' :
                      'bg-gray-800 border-2 border-white/10'
                    }`}>
                      {node.status === 'completed' ? <CheckCircle2 className="w-6 h-6 text-black" /> : 
                       node.status === 'locked' ? <Lock className="w-5 h-5 text-gray-500" /> :
                       <div className="w-3 h-3 bg-purple rounded-full"></div>}
                    </div>
                    <div className={`transition-colors duration-300 ${
                      node.status === 'locked' ? 'text-gray-600' : 'text-white'
                    }`}>
                      <p className="font-bold">{node.title}</p>
                      {node.status === 'current' && <p className="text-xs text-purple">IN PROGRESS</p>}
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

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Core';
import { Play, Code, Zap, Trophy, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CodeMockup = () => {
  const [code, setCode] = useState('');
  const fullCode = `function startCoding() {
  const platform = "CodLift";
  const mission = "Ship Real Things";
  
  while(isLearning) {
    buildProject();
    runValidator();
    buildSkills();
  }
  
  return "Ready to code!";
}`;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setCode(fullCode.slice(0, index));
      index++;
      if (index > fullCode.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative group perspective-1000">
      <div className="absolute -inset-2 bg-gradient-to-r from-cyber-pink to-cyber-cyan rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
      <div className="relative bg-cyber-dark border-4 border-cyber-pink rounded-xl p-2 shadow-neo z-10 transform group-hover:rotate-y-12 transition-transform duration-500">
        <div className="bg-navy p-4 rounded-lg font-mono text-sm h-64 overflow-hidden border-2 border-white/10 scanlines">
          <div className="flex gap-2 mb-4">
            <div className="w-3 h-3 rounded-none bg-red-500"></div>
            <div className="w-3 h-3 rounded-none bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-none bg-cyber-green"></div>
          </div>
          <pre className="text-cyber-cyan drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">
            <code>{code}</code>
            <span className="animate-pulse bg-cyber-pink w-2 inline-block h-4 ml-1"></span>
          </pre>
        </div>
        
        {/* Floating Badges */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-10 -right-8 bg-cyber-dark p-3 border-2 border-yellow shadow-[4px_4px_0px_0px_rgba(255,214,10,1)] flex items-center gap-2"
        >
          <div className="bg-yellow/20 p-2">
            <Trophy className="w-5 h-5 text-yellow drop-shadow-[0_0_5px_rgba(255,214,10,0.8)]" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-black">Status</p>
            <p className="text-sm font-bold text-white">100% Solved</p>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
          className="absolute bottom-10 -left-8 bg-cyber-dark p-3 border-2 border-cyber-green shadow-neo-green flex items-center gap-2"
        >
          <div className="bg-cyber-green/20 p-2">
            <CheckCircle2 className="w-5 h-5 text-cyber-green drop-shadow-[0_0_5px_rgba(0,255,127,0.8)]" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-black">Validator</p>
            <p className="text-sm font-bold text-white">Code Passed</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl lg:text-7xl mb-6 leading-tight">
                Learn to Code.<br />
                <span className="text-gradient-purple">Ship Real Things.</span>
              </h1>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl">
                No setup. No confusion. No cost. Open browser and start building today. 
                Experience the most interactive and practice-driven way to master full-stack development.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {localStorage.getItem('codlift_token') ? (
                  <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/dashboard')}>
                    Resume <Play className="w-5 h-5" />
                  </Button>
                ) : (
                  <>
                    <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/signup')}>
                      Start Now <Play className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                      See How It Works <Code className="w-5 h-5" />
                    </Button>
                  </>
                )}
              </div>
              
              <div className="mt-12 flex items-center justify-center lg:justify-start gap-6 text-gray-500">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-navy bg-gray-800"></div>
                  ))}
                </div>
                <p className="text-sm">
                  <span className="text-white font-bold">10,000+</span> learners already coding
                </p>
              </div>
            </motion.div>
          </div>
          
          <div className="flex-1 w-full max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <CodeMockup />
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyber-pink/20 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyber-cyan/20 blur-[120px] rounded-full -z-10 animate-pulse"></div>
    </section>
  );
};

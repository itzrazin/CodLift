
import { SEO } from '../utils/SEO';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Rocket, Target, Sparkles, Code2, Users, Trophy, Globe, Zap } from 'lucide-react';
import { GlassCard, Button } from '../components/ui/Core';

const StatCard = ({ icon: Icon, label, value }) => (
  <GlassCard className="p-8 text-center" hover={true}>
    <div className="w-12 h-12 bg-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple/20">
      <Icon className="w-6 h-6 text-purple" />
    </div>
    <div className="text-3xl font-syne font-extrabold mb-1 tracking-tight">{value}</div>
    <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">{label}</div>
  </GlassCard>
);

const About = () => {
  return (
    <div className="min-h-screen bg-background text-white selection:bg-purple/30">
      <SEO 
        title="Our Story | CodLift"
        description="Learn about the mission behind CodLift — the world's most engaging platform to master full-stack development through hands-on practice."
        url="/about"
      />
      <Navbar />

      <main className="pt-32 pb-24 px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Section */}
          <header className="text-center mb-24 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple/10 border border-purple/20 text-purple text-xs font-bold mb-6">
                <Sparkles className="w-3 h-3" /> OUR MISSION
              </div>
              <h1 className="text-6xl md:text-8xl font-syne font-extrabold mb-8 tracking-tighter leading-none">
                Engineering <span className="text-gradient-purple italic">Future</span> Developers.
              </h1>
              <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed font-medium">
                CodLift was born out of a single, frustrating observation: the modern path 
                to learning software engineering is broken. Millions of aspiring developers 
                are trapped in what the industry calls "Tutorial Hell"—a cycle of 
                passively watching videos and feeling like you understand, only to face 
                a paralyzing blank screen the moment you try to build something on your own.
                <br /><br />
                Our mission is to dismantle this passive learning model. We believe that 
                true technical mastery isn't achieved through observation; it's forged through 
                repetition, failure, and real-time correction. CodLift is the world's 
                first truly "Hands-On First" platform that combines a structured, professional 
                curriculum with a high-performance AI Gatekeeper.
                <br /><br />
                By gamifying the learning experience and enforcing strict, AI-powered 
                code verification, we ensure that every student who uses CodLift is 
                actually shipping code from day one. We aren't just teaching syntax; 
                we are engineering the next generation of confident, job-ready software 
                architects who know how to solve real problems in a production environment.
              </p>
            </motion.div>
            
            {/* Background decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple/5 blur-[120px] -z-10 rounded-full" />
          </header>

          {/* Core Values */}
          <section className="grid md:grid-cols-3 gap-8 mb-32">
            <GlassCard className="p-10 border-purple/10">
              <Target className="w-12 h-12 text-purple mb-8" />
              <h3 className="text-2xl font-syne font-extrabold mb-4">Hands-On First</h3>
              <p className="text-gray-400 leading-relaxed">
                Passive learning is a trap. Every lesson on CodLift is a mission 
                where you write code, run it, and get real-time AI feedback.
              </p>
            </GlassCard>

            <GlassCard className="p-10 border-blue-400/10">
              <Zap className="w-12 h-12 text-blue-400 mb-8" />
              <h3 className="text-2xl font-syne font-extrabold mb-4">AI Mentorship</h3>
              <p className="text-gray-400 leading-relaxed">
                Our proprietary AI Gatekeeper acts as your 1-on-1 mentor, explaining 
                complex logic and guiding you when you're stuck.
              </p>
            </GlassCard>

            <GlassCard className="p-10 border-purple-400/10">
              <Trophy className="w-12 h-12 text-purple-400 mb-8" />
              <h3 className="text-2xl font-syne font-extrabold mb-4">Gamified Path</h3>
              <p className="text-gray-400 leading-relaxed">
                Mastery shouldn't feel like a chore. Earn XP, climb the leaderboard, 
                and unlock badges as you evolve from Zero to Engineer.
              </p>
            </GlassCard>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
            <StatCard icon={Users} label="Active Learners" value="50K+" />
            <StatCard icon={Code2} label="Lines Written" value="12M+" />
            <StatCard icon={Globe} label="Countries" value="140+" />
            <StatCard icon={Sparkles} label="AI Verifications" value="2M+" />
          </section>

          {/* The Founder Section (Optional style) */}
          <GlassCard className="p-12 md:p-20 relative overflow-hidden bg-gradient-to-br from-navy/50 to-transparent border-white/5">
            <div className="md:flex items-center gap-16 relative z-10">
              <div className="w-48 h-48 rounded-3xl overflow-hidden shrink-0 mb-8 md:mb-0 grayscale hover:grayscale-0 transition-all duration-700 border border-white/10 rotate-3">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rafeek" alt="Founder" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div>
                <h2 className="text-4xl font-syne font-extrabold mb-6">Built for the <span className="text-purple">Builders</span>.</h2>
                <p className="text-lg text-gray-400 leading-relaxed mb-8 italic">
                  "I started CodLift because I was tired of overpriced bootcamps and 
                  surface-level tutorials. I wanted to build a platform that felt like 
                  playing a video game but resulted in high-paying engineering skills. 
                  Today, we're helping thousands achieve their dreams."
                </p>
                <div className="font-bold text-white">— Razin Rafeek, Founder</div>
              </div>
            </div>
            
            {/* Aesthetic circle */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple/5 rounded-full blur-3xl" />
          </GlassCard>

          {/* CTA */}
          <section className="mt-32 text-center">
            <h2 className="text-4xl md:text-5xl font-syne font-extrabold mb-8 tracking-tight">
              Ready to start your <span className="text-gradient-purple">evolution</span>?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="px-12 py-5 rounded-2xl" onClick={() => window.location.href='/signup'}>
                Join the Platform
              </Button>
              <Button size="lg" variant="ghost" className="px-12 py-5 rounded-2xl" onClick={() => window.location.href='/faq'}>
                Browse FAQ
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;

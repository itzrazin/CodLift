import React from 'react';
import { SEO } from '../utils/SEO';
import { Rocket, Target, BookOpen, Code2 } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background text-white pt-24 pb-16 px-6 overflow-hidden relative">
      <SEO 
        title="About Us | CodLift"
        description="Learn about CodLift's mission to make coding education free, fun, and accessible to everyone."
        url="/about"
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-syne font-extrabold mb-6 tracking-tight">
            We are <span className="text-gradient-cyan">CodLift</span>.
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            We believe that learning to code shouldn't be expensive, boring, or strictly theoretical.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="glass p-8 rounded-3xl border border-white/5">
            <Target className="w-12 h-12 text-cyan mb-6" />
            <h3 className="text-2xl font-bold mb-4 font-syne">Our Mission</h3>
            <p className="text-gray-400 leading-relaxed">
              To democratize technical education by providing a world-class, gamified coding curriculum.
            </p>
          </div>
          
          <div className="glass p-8 rounded-3xl border border-white/5">
            <Rocket className="w-12 h-12 text-blue-400 mb-6" />
            <h3 className="text-2xl font-bold mb-4 font-syne">Why We're Different</h3>
            <p className="text-gray-400 leading-relaxed">
               passive video tutorials don't work. CodLift forces you to write real code.
            </p>
          </div>
        </div>

        <div className="text-center glass p-12 rounded-3xl border border-white/10">
          <h2 className="text-3xl font-syne font-bold mb-6">Get in Touch</h2>
          <a 
            href="mailto:hello@codlift.site" 
            className="inline-block bg-cyan text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform"
          >
            hello@codlift.site
          </a>
        </div>

      </div>
    </div>
  );
};

export default About;


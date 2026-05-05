import React from 'react';
import { Hero } from '../components/Hero';
import { Features, Marquee } from '../components/Features';
import { LevelProgression } from '../components/Levels';
import { Button } from '../components/ui/Core';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../utils/SEO';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-navy rounded-sm rotate-45"></div>
          </div>
          <span className="text-2xl font-syne font-extrabold tracking-tighter">CODELIFT</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#curriculum" className="hover:text-white transition-colors">Curriculum</a>
          <button onClick={() => navigate('/arena')} className="hover:text-white transition-colors">Arena</button>
          <a href="#community" className="hover:text-white transition-colors">Community</a>
          <a href="#pricing" className="hover:text-white transition-colors">Free Forever</a>
        </div>

        <div className="flex items-center gap-4">
          <Button size="sm" onClick={() => navigate('/dashboard')}>Start Learning</Button>
        </div>
      </div>
    </nav>
  );
};

const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="glass p-12 lg:p-20 rounded-[3rem] text-center relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan/10 blur-[100px] rounded-full"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-yellow/10 blur-[100px] rounded-full"></div>

          <h2 className="text-4xl lg:text-6xl mb-8">Write your first line of code in <span className="text-gradient-cyan">60 seconds.</span></h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            No credit card required. No setup needed. Just pure, gamified learning
            that helps you ship real software.
          </p>
          <Button size="lg" className="mx-auto px-12 text-xl" onClick={() => navigate('/dashboard')}>
            Start Learning Free <ArrowRight className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-20 border-t border-white/5">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-cyan rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-navy rounded-sm rotate-45"></div>
            </div>
            <span className="text-xl font-syne font-extrabold">CODELIFT</span>
          </div>
          <p className="text-gray-500 max-w-sm mb-8">
            The world's most engaging free platform for learning full-stack development.
            Gamified to the max, powered by real projects.
          </p>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-cyan transition-colors cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-cyan transition-colors cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-cyan transition-colors cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6">Learning</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            <li><a href="#" className="hover:text-cyan">HTML & CSS</a></li>
            <li><a href="#" className="hover:text-cyan">JavaScript</a></li>
            <li><a href="#" className="hover:text-cyan">React & Frontend</a></li>
            <li><a href="#" className="hover:text-cyan">Node & Backend</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Platform</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            <li><a href="#" className="hover:text-cyan">About Us</a></li>
            <li><a href="#" className="hover:text-cyan">Challenges</a></li>
            <li><a href="#" className="hover:text-cyan">Leaderboard</a></li>
            <li><a href="#" className="hover:text-cyan">Public API</a></li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-gray-600 text-sm gap-4">
        <p>© 2024 CodLift Platform. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

export const LandingPage = () => {
  const navigate = useNavigate();

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CodLift",
    "url": "https://codlift.site",
    "description": "Free coding website for beginners. Learn HTML, CSS, and JavaScript interactively.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://codlift.site/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden selection:bg-cyan/30">
      <SEO 
        title="CodLift — Free Coding Website for Beginners"
        description="Learn to code for free with interactive lessons, real projects, and gamified challenges. Master HTML, CSS, and JavaScript directly in your browser."
        keywords="free coding website for beginners, learn to code free, interactive coding lessons, learn HTML CSS JavaScript free"
        url="/"
        schema={websiteSchema}
      />
      <Navbar />
      <Hero />
      <Marquee />
      <Features />
      <LevelProgression />
      <CTA />
      <Footer />

      {/* Global Background Elements */}
      <div className="particles-container">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

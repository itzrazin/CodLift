import React from 'react';
import { Hero } from '../components/Hero';
import { Features, Marquee } from '../components/Features';
import { LevelProgression } from '../components/Levels';
import { Button } from '../components/ui/Core';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../utils/SEO';
import { Navbar } from '../components/Navbar';

const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="glass p-12 lg:p-20 rounded-[3rem] text-center relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan/10 blur-[100px] rounded-full"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-yellow/10 blur-[100px] rounded-full"></div>

          <h2 className="text-4xl lg:text-6xl mb-8 font-syne font-extrabold">Write your first line of code in <span className="text-gradient-cyan">60 seconds.</span></h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            No credit card required. No setup needed. Just pure, gamified learning
            that helps you ship real software.
          </p>
          <Button size="lg" className="mx-auto px-12 text-xl" onClick={() => navigate(localStorage.getItem('codlift_token') ? '/dashboard' : '/signup')}>
            Start Now <ArrowRight className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </section>
  );
};

const LandingPage = () => {
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
      <div id="curriculum">
        <Features />
      </div>
      <LevelProgression />
      <CTA />

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


export default LandingPage;

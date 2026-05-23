
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
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 scanlines opacity-50 pointer-events-none"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="slanted-box bg-cyber-dark border-4 border-cyber-pink p-12 lg:p-20 text-center relative overflow-hidden shadow-neo">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyber-pink/20 blur-[100px] rounded-full"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyber-cyan/20 blur-[100px] rounded-full"></div>

          <h2 className="text-4xl lg:text-6xl mb-8 font-syne font-extrabold uppercase tracking-tight">
            INITIATE SEQUENCE IN <span className="text-gradient-purple drop-shadow-[0_0_15px_rgba(255,0,255,0.5)]">60 SECONDS.</span>
          </h2>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto font-mono">
            &gt; SYSTEM READY. NO CREDIT CARD REQUIRED. 
            <br />&gt; PURE GAMIFIED LEARNING ENGINE ONLINE.
          </p>
          <Button size="lg" className="mx-auto" onClick={() => navigate(localStorage.getItem('codlift_token') ? '/dashboard' : '/signup')}>
            {localStorage.getItem('codlift_token') ? 'RESUME QUEST' : 'START QUEST'} <ArrowRight className="w-6 h-6" />
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
    <div className="min-h-screen bg-background overflow-hidden selection:bg-purple/30">
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

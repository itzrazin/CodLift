
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './ui/Logo';

export const Footer = () => {
  const location = useLocation();
  
  // Hide footer on specific full-screen app routes where it breaks layout
  const hiddenRoutes = ['/learn', '/arena', '/onboarding', '/dashboard'];
  const isHidden = hiddenRoutes.some(route => location.pathname.startsWith(route));

  if (isHidden) return null;

  return (
    <footer className="py-20 border-t-4 border-cyber-pink bg-cyber-dark relative scanlines overflow-hidden">
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyber-pink/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6 group cursor-pointer">
              <Logo className="w-7 h-7 transition-transform group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span className="text-xl font-syne font-extrabold tracking-widest text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">CODLIFT</span>
            </div>
            <p className="text-gray-400 font-mono max-w-sm mb-8 text-sm uppercase leading-relaxed">
              &gt; THE WORLD'S MOST ENGAGING LEARNING ENGINE.
              <br />&gt; GAMIFIED TO THE MAX. POWERED BY REAL PROJECTS.
            </p>
            <div className="flex gap-4">
              {/* Social icons */}
              {['twitter', 'github', 'linkedin'].map(icon => (
                <SocialIcon key={icon} href="#" icon={icon} />
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-syne font-bold mb-6 uppercase text-cyber-cyan tracking-widest">Learning</h4>
            <ul className="space-y-4 text-gray-400 font-mono text-sm uppercase">
              <li><Link to="/#curriculum" className="hover:text-cyber-pink transition-colors">&gt; HTML & CSS</Link></li>
              <li><Link to="/#curriculum" className="hover:text-cyber-pink transition-colors">&gt; JavaScript</Link></li>
              <li><Link to="/#curriculum" className="hover:text-cyber-pink transition-colors">&gt; React & Frontend</Link></li>
              <li><Link to="/#curriculum" className="hover:text-cyber-pink transition-colors">&gt; Node & Backend</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-syne font-bold mb-6 uppercase text-cyber-green tracking-widest">Platform</h4>
            <ul className="space-y-4 text-gray-400 font-mono text-sm uppercase">
              <li><Link to="/about" className="hover:text-cyber-pink transition-colors">&gt; About Us</Link></li>
              <li><Link to="/faq" className="hover:text-cyber-pink transition-colors">&gt; FAQ</Link></li>
              <li><Link to="/blog" className="hover:text-cyber-pink transition-colors">&gt; Blog</Link></li>
              <li><Link to="/arena" className="hover:text-cyber-pink transition-colors">&gt; Challenges</Link></li>
              <li><Link to="/leaderboard" className="hover:text-cyber-pink transition-colors">&gt; Leaderboard</Link></li>
              <li><Link to="/contact" className="hover:text-cyber-pink transition-colors">&gt; Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t-2 border-white/10 text-gray-500 font-mono text-xs uppercase tracking-widest gap-4">
          <p>&gt; © {new Date().getFullYear()} CODLIFT PLATFORM. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">PRIVACY POLICY</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">TERMS OF SERVICE</Link>
            <Link to="/about" className="hover:text-white transition-colors">ABOUT</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ href, icon }) => {
  const icons = {
    twitter: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />,
    github: <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>
  };
  return (
    <a href={href} className="w-10 h-10 border-2 border-cyber-pink shadow-neo flex items-center justify-center hover:bg-cyber-pink hover:-translate-y-1 transition-all text-white hover:text-black cursor-pointer bg-cyber-dark">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {icons[icon]}
      </svg>
    </a>
  );
};


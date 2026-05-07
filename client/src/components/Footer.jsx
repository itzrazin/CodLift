import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Footer = () => {
  const location = useLocation();
  
  // Hide footer on specific full-screen app routes where it breaks layout
  const hiddenRoutes = ['/learn', '/arena', '/onboarding', '/dashboard'];
  const isHidden = hiddenRoutes.some(route => location.pathname.startsWith(route));

  if (isHidden) return null;

  return (
    <footer className="py-20 border-t border-white/5 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-cyan rounded flex items-center justify-center shadow-[0_0_10px_rgba(0,245,212,0.3)]">
                <div className="w-3 h-3 bg-navy rounded-sm rotate-45"></div>
              </div>
              <span className="text-xl font-syne font-extrabold">CODELIFT</span>
            </div>
            <p className="text-gray-500 max-w-sm mb-8">
              The world's most engaging free platform for learning full-stack development.
              Gamified to the max, powered by real projects.
            </p>
            <div className="flex gap-4">
              {/* Social icons */}
              <SocialIcon href="#" icon="twitter" />
              <SocialIcon href="#" icon="github" />
              <SocialIcon href="#" icon="linkedin" />
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Learning</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><Link to="/#curriculum" className="hover:text-cyan">HTML & CSS</Link></li>
              <li><Link to="/#curriculum" className="hover:text-cyan">JavaScript</Link></li>
              <li><Link to="/#curriculum" className="hover:text-cyan">React & Frontend</Link></li>
              <li><Link to="/#curriculum" className="hover:text-cyan">Node & Backend</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><Link to="/about" className="hover:text-cyan">About Us</Link></li>
              <li><Link to="/arena" className="hover:text-cyan">Challenges</Link></li>
              <li><Link to="/leaderboard" className="hover:text-cyan">Leaderboard</Link></li>
              <li><a href="mailto:hello@codlift.site" className="hover:text-cyan">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-gray-600 text-sm gap-4">
          <p>© {new Date().getFullYear()} CodLift Platform. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white">Terms of Service</Link>
            <Link to="/about" className="hover:text-white">About</Link>
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
    <a href={href} className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-cyan transition-colors cursor-pointer">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {icons[icon]}
      </svg>
    </a>
  );
};


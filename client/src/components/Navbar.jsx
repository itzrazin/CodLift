import React from 'react';
import { Button } from './ui/Core';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from './ui/Logo';

export const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="w-9 h-9" />
            <span className="text-2xl font-syne font-extrabold tracking-tighter">CODLIFT</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="/#curriculum" className="hover:text-white transition-colors">Curriculum</a>
          <Link to="/arena" className="hover:text-white transition-colors">Arena</Link>
          <Link to="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
          <Link to="/about" className="hover:text-white transition-colors">About</Link>
        </div>

        <div className="flex items-center gap-4">
          {!localStorage.getItem('codlift_token') ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="hidden sm:flex">Log In</Button>
              <Button size="sm" onClick={() => navigate('/signup')}>Start Now</Button>
            </>
          ) : (
            <Button size="sm" onClick={() => navigate('/dashboard')}>Resume</Button>
          )}
        </div>
      </div>
    </nav>
  );
};

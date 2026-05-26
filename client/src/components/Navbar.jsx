
import { Button } from './ui/Core';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from './ui/Logo';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cyber-dark/90 backdrop-blur-md border-b-2 border-cyber-pink shadow-[0_0_15px_rgba(255,0,255,0.2)]">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 group">
            <Logo className="w-9 h-9 transition-transform group-hover:scale-110" />
            <span className="text-2xl font-syne font-extrabold tracking-tighter text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">CODLIFT</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-mono font-bold text-gray-400 tracking-widest uppercase">
          <a href="/#curriculum" className="hover:text-cyber-cyan hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] transition-all">Curriculum</a>
          <Link to="/arena" className="hover:text-cyber-cyan hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] transition-all">Arena</Link>
          <Link to="/leaderboard" className="hover:text-cyber-cyan hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] transition-all">Leaderboard</Link>
          <Link to="/about" className="hover:text-cyber-cyan hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] transition-all">About</Link>
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="hidden sm:flex">LOG IN</Button>
              <Button size="sm" onClick={() => navigate('/signup')}>START QUEST</Button>
            </>
          ) : (
            <Button size="sm" onClick={() => navigate('/dashboard')}>RESUME</Button>
          )}
        </div>
      </div>
    </nav>
  );
};

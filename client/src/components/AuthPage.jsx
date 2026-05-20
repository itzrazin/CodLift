import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, User as UserIcon, 
  ArrowRight, Github, Chrome, AlertCircle,
  Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../utils/config';
import { Button, GlassCard } from './ui/Core';
import { Logo } from './ui/Logo';

const InputField = ({ type, placeholder, icon: Icon, value, onChange, name, required, minLength }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="relative group mb-6">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyber-cyan transition-colors">
        <Icon size={20} />
      </div>
      <input
        type={isPassword && isPasswordShown ? 'text' : type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        className="w-full bg-navy-light border-2 border-white/10 p-4 pl-12 rounded-xl outline-none focus:border-cyber-cyan focus:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all font-mono text-white placeholder:text-gray-600"
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setIsPasswordShown(!isPasswordShown)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
        >
          {isPasswordShown ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

const AuthPage = () => {
  const location = useLocation();
  const [isLogin, setIsLogin]   = useState(location.pathname !== '/signup');
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  const { login, signup } = useAuth();
  const navigate  = useNavigate();

  useEffect(() => {
    if (location.pathname === '/signup') {
      setIsLogin(false);
    } else if (location.pathname === '/login') {
      setIsLogin(true);
    }
  }, [location.pathname]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.username.trim(), formData.email.trim().toLowerCase(), formData.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyber-pink/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyber-cyan/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <Logo className="w-16 h-16 mb-4" />
          <h1 className="text-3xl font-syne font-extrabold tracking-tighter text-white">
            {isLogin ? 'WELCOME BACK' : 'JOIN THE MISSION'}
          </h1>
          <p className="text-gray-500 font-mono text-sm mt-1 uppercase tracking-widest">
            {isLogin ? 'Authorized access only' : 'Create your operative account'}
          </p>
        </div>

        <GlassCard className="p-8 border-white/5 bg-navy/40 backdrop-blur-xl">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="username-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <InputField
                    type="text"
                    name="username"
                    placeholder="OPERATIVE NAME"
                    icon={UserIcon}
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <InputField
              type="email"
              name="email"
              placeholder="EMAIL ADDRESS"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <InputField
              type="password"
              name="password"
              placeholder="SECURE PASSWORD"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              required
              minLength={!isLogin ? 8 : undefined}
            />

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold uppercase tracking-widest"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full mb-6"
              variant={isLogin ? 'primary' : 'secondary'}
            >
              {loading ? 'PROCESSING...' : (isLogin ? 'INITIALIZE LOGIN' : 'RECRUIT OPERATIVE')}
              {!loading && <ArrowRight size={18} />}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em] text-gray-600">
              <span className="bg-cyber-dark px-4">Direct Connection</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoogleLogin}
              className="border-white/10 text-white hover:border-cyber-cyan"
            >
              <Chrome size={18} />
              GOOGLE
            </Button>
          </div>
        </GlassCard>

        <p className="text-center mt-8 text-gray-500 font-mono text-xs uppercase tracking-widest">
          {isLogin ? "New operative?" : "Already recruited?"}{' '}
          <Link
            to={isLogin ? '/signup' : '/login'}
            className="text-cyber-cyan hover:text-white transition-colors font-black underline underline-offset-4"
          >
            {isLogin ? 'SIGN UP NOW' : 'LOG IN HERE'}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, GlassCard } from './ui/Core';
import { Mail, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { SEO } from './SEO';
import { API_URL } from '../config';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        login(data.token, data.user, data.is_new_user);
      } else {
        alert(data.message || 'Authentication failed');
      }
    } catch (err) {
      alert('Connection error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleOAuth = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const handleGitHubOAuth = () => {
    window.location.href = `${API_URL}/api/auth/github`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background px-6">
      <SEO 
        title={isLogin ? "Log In | CodLift" : "Sign Up for Free | CodLift"}
        description="Join CodLift for free interactive coding lessons. Start learning HTML, CSS, and JavaScript today."
        url={isLogin ? "/login" : "/signup"}
      />
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan/10 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow/5 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </button>

        <GlassCard hover={false} className="p-8 lg:p-10">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-cyan rounded-xl flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-navy rounded-sm rotate-45"></div>
            </div>
            <h2 className="text-3xl font-syne font-extrabold mb-2">
              {isLogin ? 'Welcome Back' : 'Join CodLift'}
            </h2>
            <p className="text-gray-400">
              {isLogin ? 'Enter your details to continue coding.' : 'Start your gamified coding journey today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    required
                    placeholder="codemaster99"
                    className="w-full bg-navy border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-cyan/50 transition-colors"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full bg-navy border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-cyan/50 transition-colors"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-navy border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-cyan/50 transition-colors"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <Button size="lg" className="w-full mt-6" disabled={loading}>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-navy px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={handleGoogleOAuth}
              className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl py-3 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-sm font-medium">Google</span>
            </button>
            <button 
              type="button"
              onClick={handleGitHubOAuth}
              className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl py-3 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </div>

          <p className="text-center mt-8 text-gray-400 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyan hover:underline font-semibold"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Core';
import { API_URL } from '../utils/config';
import { User, Lock, Eye, EyeOff, Zap } from 'lucide-react';
import { Logo } from '../components/ui/Logo';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) return setError('All fields required');
    
    setLoading(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm glass p-8 rounded-2xl border border-white/10">
        <div className="text-center mb-8">
          <Logo className="w-10 h-10 mx-auto mb-4" />
          <h1 className="text-2xl font-black">LOGIN</h1>
        </div>

        {error && <p className="text-red-400 text-xs text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Username" 
              className="w-full bg-navy-light pl-10 p-2.5 rounded-lg border border-white/10 outline-none focus:border-purple"
              value={username} 
              onChange={e => setUsername(e.target.value)} 
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-navy-light pl-10 p-2.5 rounded-lg border border-white/10 outline-none focus:border-purple"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '...' : 'LOG IN'}
          </Button>
        </form>

        <p className="text-center text-xs mt-6 text-gray-500">
          No account? <Link to="/signup" className="text-purple">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Core';
import api from '../api/axios';
import { Mail, ArrowLeft } from 'lucide-react';
import { Logo } from '../components/ui/Logo';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    if (!email) return setStatus({ type: 'error', message: 'Email required' });
    
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setStatus({ type: 'success', message: 'If an account exists, a reset link has been sent.' });
      setEmail('');
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to send reset link' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm glass p-8 rounded-2xl border border-white/10 relative">
        <Link to="/login" className="absolute top-4 left-4 text-gray-500 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="text-center mb-8 mt-4">
          <Logo className="w-10 h-10 mx-auto mb-4" />
          <h1 className="text-2xl font-black">RESET PASSWORD</h1>
          <p className="text-xs text-gray-400 mt-2">Enter your email to receive a reset link.</p>
        </div>

        {status.message && (
          <p className={`text-xs text-center mb-6 p-3 rounded-lg border ${status.type === 'error' ? 'text-red-400 border-red-500/20 bg-red-500/10' : 'text-cyber-green border-cyber-green/20 bg-cyber-green/10'}`}>
            {status.message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
            <input 
              type="email" 
              placeholder="Email address" 
              required
              autoComplete="email"
              className="w-full bg-navy-light pl-10 p-2.5 rounded-lg border border-white/10 outline-none focus:border-purple text-sm"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'SENDING...' : 'SEND RESET LINK'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;

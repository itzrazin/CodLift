import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Core';
import api from '../api/axios';
import { Lock } from 'lucide-react';
import { Logo } from '../components/ui/Logo';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus({ type: 'error', message: 'Invalid or missing reset token.' });
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    if (!password || !confirmPassword) return setStatus({ type: 'error', message: 'All fields required' });
    if (password !== confirmPassword) return setStatus({ type: 'error', message: 'Passwords do not match' });
    if (password.length < 8) return setStatus({ type: 'error', message: 'Password must be at least 8 characters' });
    
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      setStatus({ type: 'success', message: 'Password reset successfully!' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to reset password' });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm glass p-8 rounded-2xl border border-white/10 text-center">
          <Logo className="w-10 h-10 mx-auto mb-4" />
          <h1 className="text-xl font-black text-red-400 mb-2">INVALID LINK</h1>
          <p className="text-sm text-gray-400 mb-6">The password reset link is invalid or has expired.</p>
          <Link to="/forgot-password">
            <Button className="w-full">REQUEST NEW LINK</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm glass p-8 rounded-2xl border border-white/10 text-center">
        <div className="mb-8">
          <Logo className="w-10 h-10 mx-auto mb-4" />
          <h1 className="text-2xl font-black">NEW PASSWORD</h1>
          <p className="text-xs text-gray-400 mt-2">Enter your new secure password.</p>
        </div>

        {status.message && (
          <p className={`text-xs text-center mb-6 p-3 rounded-lg border ${status.type === 'error' ? 'text-red-400 border-red-500/20 bg-red-500/10' : 'text-cyber-green border-cyber-green/20 bg-cyber-green/10'}`}>
            {status.message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
            <input 
              type="password" 
              placeholder="New password" 
              required
              autoComplete="new-password"
              className="w-full bg-navy-light pl-10 p-2.5 rounded-lg border border-white/10 outline-none focus:border-purple text-sm"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
            <input 
              type="password" 
              placeholder="Confirm new password" 
              required
              autoComplete="new-password"
              className="w-full bg-navy-light pl-10 p-2.5 rounded-lg border border-white/10 outline-none focus:border-purple text-sm"
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading || status.type === 'success'}>
            {loading ? 'RESETTING...' : 'UPDATE PASSWORD'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;

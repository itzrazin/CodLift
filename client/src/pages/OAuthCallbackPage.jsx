import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const isNew = searchParams.get('is_new') === 'true';
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage('Google sign-in failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (!token) {
        setStatus('error');
        setMessage('No authentication token received.');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        await loginWithToken(token);
        setStatus('success');
        setMessage(isNew ? 'Welcome to CodLift! Setting up your profile...' : 'Welcome back! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1500);
      } catch {
        setStatus('error');
        setMessage('Authentication failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-3xl p-12 text-center max-w-sm mx-4"
      >
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-purple border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-bold mb-2">Signing you in...</h2>
            <p className="text-gray-400 text-sm">Just a moment!</p>
          </>
        )}
        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <CheckCircle2 className="w-16 h-16 text-purple mx-auto mb-6" />
            </motion.div>
            <h2 className="text-xl font-bold mb-2">Success!</h2>
            <p className="text-gray-400 text-sm">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-gray-400 text-sm">{message}</p>
            <p className="text-gray-600 text-xs mt-4">Redirecting to login...</p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default OAuthCallbackPage;


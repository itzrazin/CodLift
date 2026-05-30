import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../utils/config';

const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();
  const processedRef = useRef(false);

  useEffect(() => {
    // Prevent double-processing in strict mode
    if (processedRef.current) return;
    
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage('Google sign-in failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No authentication code received.');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      processedRef.current = true;

      try {
        // Exchange code for token
        const exchangeRes = await axios.post(`${API_URL}/auth/exchange-code`, { code });
        const { token, isNew: isNewParam } = exchangeRes.data;

        // Fetch user data using the token
        const response = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const userData = response.data.user;
        
        // Manually update auth state
        setToken(token);
        setUser(userData);
        
        setStatus('success');
        const isNewUser = isNewParam || !userData.level;
        setMessage(isNewUser ? 'Welcome to CodLift! Setting up your profile...' : 'Welcome back! Redirecting...');
        
        // Use a 1.5s delay to ensure state is solid and give user feedback
        setTimeout(() => {
          if (isNewUser) {
            navigate('/onboarding', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        }, 1500);
      } catch (err) {
        console.error('OAuth Callback Error:', err);
        setStatus('error');
        setMessage('Authentication failed. The secure session could not be established.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, setToken, setUser]);

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
            <p className="text-gray-400 text-sm">Validating secure credentials...</p>
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
            <h2 className="text-xl font-bold mb-2">Login Failed</h2>
            <p className="text-gray-400 text-sm">{message}</p>
            <p className="text-gray-600 text-xs mt-4 italic">You will be redirected shortly...</p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default OAuthCallbackPage;

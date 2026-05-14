import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../utils/config';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');

      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        login(token, response.data.user);
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('Failed to fetch user in callback:', error);
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [location, navigate, login]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-400 font-medium">Authenticating...</p>
    </div>
  );
};

export default AuthCallback;

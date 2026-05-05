import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Loader2 } from 'lucide-react';
import { API_URL } from '../config';

export const OAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const isNew = params.get('is_new') === 'true';

    if (token) {
      // We need to fetch the user profile to set it in context
      fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          login(token, data.user, isNew);
        } else {
          navigate('/login?error=auth_failed');
        }
      })
      .catch(() => {
        navigate('/login?error=auth_failed');
      });
    } else {
      navigate('/login?error=no_token');
    }
  }, [location, navigate, login]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 text-cyan animate-spin mb-4" />
      <h2 className="text-xl font-syne font-bold text-white">Authenticating...</h2>
    </div>
  );
};

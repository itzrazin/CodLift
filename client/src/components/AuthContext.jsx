import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_URL } from '../utils/config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Persist token & user to localStorage
  const persistAuth = (tok, usr) => {
    if (tok) localStorage.setItem('codlift_token', tok);
    else localStorage.removeItem('codlift_token');
    if (usr) localStorage.setItem('codlift_user', JSON.stringify(usr));
    else localStorage.removeItem('codlift_user');
  };

  // On mount: restore from localStorage, then validate with backend
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('codlift_token');
      const savedUser = localStorage.getItem('codlift_user');

      if (savedToken && savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);

        // Silently re-validate token with backend
        try {
        const res = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${savedToken}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            localStorage.setItem('codlift_user', JSON.stringify(data.user));
          } else if (res.status === 401 || res.status === 403) {
            // Token expired — clear auth
            persistAuth(null, null);
            setToken(null);
            setUser(null);
          }
          // If backend unreachable (500/network), keep local data
        } catch {
          // Backend offline — keep local auth state
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    persistAuth(data.token, data.user);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const signup = async (username, email, password) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Signup failed');

    persistAuth(data.token, data.user);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const loginWithToken = async (tok) => {
    setToken(tok);
    localStorage.setItem('codlift_token', tok);
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${tok}` }
      });
      if (res.ok) {
        const data = await res.json();
        persistAuth(tok, data.user);
        setUser(data.user);
        return data;
      }
    } catch {}
    return null;
  };

  const logout = () => {
    persistAuth(null, null);
    setToken(null);
    setUser(null);
  };

  const updateProgress = useCallback((xpGained) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, xp_total: (prev.xp_total || 0) + xpGained };
      localStorage.setItem('codlift_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem('codlift_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{
      user, token, loading, isAuthenticated,
      login, signup, logout, loginWithToken,
      updateProgress, updateUser, setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

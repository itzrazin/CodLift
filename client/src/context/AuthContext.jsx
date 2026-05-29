import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(() => localStorage.getItem('codlift_token'));
  const [loading, setLoading] = useState(true);

  // Helper to sync with storage and state
  const setToken = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem('codlift_token', newToken);
    } else {
      localStorage.removeItem('codlift_token');
    }
    setTokenState(newToken);
  }, []);

  const getToken = () => token;

  // Verify token on mount
  useEffect(() => {
    const initAuth = async () => {
      const currentToken = localStorage.getItem('codlift_token');
      if (!currentToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${currentToken}` }
        });
        setUser(res.data.user);
        setTokenState(currentToken);
      } catch (err) {
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [setToken]);

  const login = useCallback(async (usernameOrEmail, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { username: usernameOrEmail, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Login failed');
    }
  }, [setToken]);

  const signup = useCallback(async (username, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        name: username, // Fallback name
        username,
        email,
        password
      });
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Signup failed');
    }
  }, [setToken]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  }, [setToken]);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

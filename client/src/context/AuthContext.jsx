import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('codlift_token') || localStorage.getItem('codelift_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Idempotent migration - only if destination empty
    const legacyToken = localStorage.getItem('codelift_token');
    const newToken = localStorage.getItem('codlift_token');
    
    if (legacyToken && !newToken) {
      localStorage.setItem('codlift_token', legacyToken);
      localStorage.removeItem('codelift_token');
    }
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.status === 200) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('codlift_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = async (param1, param2) => {
    // If param2 is an object, it is the OAuth token callback flow
    if (param2 && typeof param2 === 'object') {
      const newToken = param1;
      const userData = param2;
      localStorage.setItem('codlift_token', newToken);
      setToken(newToken);
      setUser(userData);
      return userData;
    }

    // Otherwise, it is the regular email/password login flow
    const email = param1;
    const password = param2;
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('codlift_token', newToken);
      setToken(newToken);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('codlift_token', newToken);
      setToken(newToken);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error.response?.data?.error || 'Signup failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('codlift_token');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

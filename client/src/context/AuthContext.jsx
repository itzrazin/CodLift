import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('codlift_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Idempotent migration - migrate legacy 'codelift_token' to 'codlift_token'
    const legacyToken = localStorage.getItem('codelift_token');
    const currentToken = localStorage.getItem('codlift_token');

    if (legacyToken && !currentToken) {
      localStorage.setItem('codlift_token', legacyToken);
      localStorage.removeItem('codelift_token');
    }
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      // If we already have a user and the token hasn't changed, skip
      if (user && token === localStorage.getItem('codlift_token')) {
        setLoading(false);
        return;
      }

      if (!token) {
        setLoading(false);
        setUser(null);
        return;
      }

      setLoading(true);
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
      // Set user first to avoid transient null user state when token changes
      setUser(userData);
      setToken(newToken);
      setLoading(false);
      return userData;
    }

    // Otherwise, it is the regular username/password login flow
    const username = param1;
    const password = param2;
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('codlift_token', newToken);
      setUser(userData);
      setToken(newToken);
      setLoading(false);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.error || 'Login failed. Please try again.', { cause: error });
    }
  };

  const signup = async (name, email, username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, username, password });
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('codlift_token', newToken);
      setUser(userData);
      setToken(newToken);
      setLoading(false);
      return userData;
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error.response?.data?.error || 'Signup failed. Please try again.', { cause: error });
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

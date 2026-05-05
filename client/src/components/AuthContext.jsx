import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize or load local user
    const localUser = localStorage.getItem('codlift_user');
    if (localUser) {
      setUser(JSON.parse(localUser));
    } else {
      const newUser = {
        id: 'local-user',
        username: 'Coder',
        email: 'you@local',
        avatar: null,
        level: 'beginner',
        xp_total: 0,
        current_streak: 0,
        longest_streak: 0,
        created_at: new Date().toISOString()
      };
      setUser(newUser);
      localStorage.setItem('codlift_user', JSON.stringify(newUser));
    }
    setLoading(false);
  }, []);

  const login = () => { /* No-op */ };
  const logout = () => {
    localStorage.removeItem('codlift_user');
    localStorage.removeItem('codlift_progress');
    window.location.href = '/';
  };

  const updateProgress = (xpGained) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      xp_total: user.xp_total + xpGained,
      current_streak: user.current_streak + 1 // Simple logic for demo
    };
    setUser(updatedUser);
    localStorage.setItem('codlift_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, updateProgress }}>
      {children}
    </AuthContext.Provider>
  );
};

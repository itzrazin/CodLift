import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default hardcoded user
  const DEFAULT_USER = {
    id: 'default_user',
    username: 'Learner',
    email: 'learner@codlift.local',
    level: 'beginner',
    xp_total: 0,
    current_streak: 1,
    avatar: null
  };

  useEffect(() => {
    // Load from localStorage or use default
    const savedUser = localStorage.getItem('codlift_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(DEFAULT_USER);
      localStorage.setItem('codlift_user', JSON.stringify(DEFAULT_USER));
    }
    setLoading(false);
  }, []);

  const updateProgress = (xpGained) => {
    setUser(prev => {
      const updated = {
        ...prev,
        xp_total: (prev?.xp_total || 0) + xpGained
      };
      localStorage.setItem('codlift_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    // Just reset to default for this login-free version
    setUser(DEFAULT_USER);
    localStorage.setItem('codlift_user', JSON.stringify(DEFAULT_USER));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, updateProgress, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

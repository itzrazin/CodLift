import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { API_URL } from '../utils/config';

const LessonContext = createContext(null);

export const LessonProvider = ({ children }) => {
  const { token, user } = useAuth();
  
  // completedLessons structure: { 'html-basics': { '1': true, '2': true }, 'css-flexbox': { '1': true } }
  const [completedLessons, setCompletedLessons] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!token) {
      setLoadingProgress(false);
      return;
    }
    
    try {
      const res = await axios.get(`${API_URL}/user/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const progressData = res.data.progress_data || [];
      const newCompleted = {};
      
      progressData.forEach(item => {
        if (!newCompleted[item.lesson_id]) {
          newCompleted[item.lesson_id] = {};
        }
        if (item.is_completed) {
          newCompleted[item.lesson_id][item.exercise_id] = true;
        }
      });
      
      setCompletedLessons(newCompleted);
    } catch (err) {
      console.error('Failed to fetch user progress', err);
    } finally {
      setLoadingProgress(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Centralized updateUserProgress function
  const submitProgress = async (trackId, exerciseId, codeSubmitted, solveTimeMs) => {
    if (!token) return false;
    
    try {
      const res = await axios.post(`${API_URL}/user/update-progress`, {
        lesson_id: trackId,
        exercise_id: exerciseId.toString(),
        code_submitted: codeSubmitted,
        solve_time_ms: solveTimeMs
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        // Optimistic UI update
        setCompletedLessons(prev => ({
          ...prev,
          [trackId]: {
            ...(prev[trackId] || {}),
            [exerciseId]: true
          }
        }));
        
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update progress', err);
      throw err;
    }
  };

  const isExerciseCompleted = (trackId, exerciseId) => {
    return !!(completedLessons[trackId] && completedLessons[trackId][exerciseId]);
  };

  return (
    <LessonContext.Provider value={{
      completedLessons,
      loadingProgress,
      submitProgress,
      isExerciseCompleted,
      refreshProgress: fetchProgress
    }}>
      {children}
    </LessonContext.Provider>
  );
};

export const useLesson = () => useContext(LessonContext);

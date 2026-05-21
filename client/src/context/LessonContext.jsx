import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const LessonContext = createContext(null);

export const LessonProvider = ({ children }) => {
  const { token, user, setUser } = useAuth();
  
  // completedLessons structure: { 'html-basics': { '1': true, '2': true }, 'css-flexbox': { '1': true } }
  const [completedLessons, setCompletedLessons] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!token) {
      setLoadingProgress(false);
      return;
    }
    
    try {
      const res = await api.get('/user/progress');
      
      const progressData = res.data.progress_data || [];
      const newCompleted = {};
      
      progressData.forEach(item => {
        if (!newCompleted[item.lesson_id]) {
          newCompleted[item.lesson_id] = {};
        }
        if (item.is_completed) {
          newCompleted[item.lesson_id][item.exercise_id] = {
            completed: true,
            code: item.code_content
          };
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
    if (!token) return { success: false, error: 'No authentication token' };
    
    try {
      const res = await api.post('/user/update-progress', {
        lesson_id: trackId,
        exercise_id: exerciseId.toString(),
        code_submitted: codeSubmitted,
        solve_time_ms: solveTimeMs
      });

      if (res.data.success) {
        // Strict state update to ensure "Session Gatekeeping" works immediately
        setCompletedLessons(prev => {
          const updated = { ...prev };
          if (!updated[trackId]) updated[trackId] = {};
          updated[trackId][exerciseId] = {
            completed: true,
            code: codeSubmitted
          };
          return updated;
        });

        return {
          success: true,
          alreadyDone: res.data.already_done
        };
      }
      return { success: false, error: res.data.error || 'Unknown server error' };
    } catch (err) {
      console.error('Failed to update progress', err);
      return { success: false, error: err.message };
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

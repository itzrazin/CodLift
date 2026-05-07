import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import api from '../api/axios';


const Dashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hardcode curriculum length for the prototype based on 3 tiers x 3 lessons
  const totalLessons = 9;
  const lessonsList = Array.from({ length: totalLessons }, (_, i) => i + 1);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProgress = async () => {
      try {
        const res = await api.get('/progress');
        // progress is an array of completed lesson IDs
        setProgress(res.data || []);
      } catch (err) {
        console.error('Error fetching progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [token, navigate]);

  if (loading || !user) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading Dashboard...</div>;
  }

  // Find next uncompleted lesson
  const nextLessonId = lessonsList.find(id => !progress.includes(id)) || totalLessons;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Top Header / Stats */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col sm:flex-row items-center justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
              {user.username ? user.username[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">{user.username}</h1>
              <p className="text-gray-400">Keep up the good work!</p>
            </div>
          </div>
          <div className="flex gap-6 text-center">
            <div className="bg-gray-950 px-4 py-2 rounded-lg border border-gray-700">
              <span className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">XP</span>
              <span className="text-xl font-bold text-blue-400">{user.xp || 0}</span>
            </div>
            <div className="bg-gray-950 px-4 py-2 rounded-lg border border-gray-700">
              <span className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Streak</span>
              <span className="text-xl font-bold text-orange-400">{user.streak || 0} 🔥</span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="bg-blue-900/30 border border-blue-500/50 p-6 rounded-xl text-center mb-12">
          <h2 className="text-xl font-bold text-blue-100 mb-2">Ready to Code?</h2>
          <p className="text-blue-200 mb-4">Pick up right where you left off.</p>
          <button
            onClick={() => navigate(`/lesson/${nextLessonId}`)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3 px-8 rounded-full shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
          >
            Continue to Lesson {nextLessonId}
          </button>
        </div>

        {/* Lesson Path Map */}
        <h2 className="text-2xl font-extrabold mb-6 text-center">Your Curriculum Path</h2>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gray-800 rounded-full z-0"></div>
          <div className="flex flex-col gap-6 relative z-10">
            {lessonsList.map(lessonId => {
              const isCompleted = progress.includes(lessonId);
              const isLocked = !isCompleted && lessonId !== nextLessonId;
              
              let statusClasses = "bg-blue-600 border-blue-400 text-white"; // Current/Next
              let icon = "📝";
              
              if (isCompleted) {
                statusClasses = "bg-green-600 border-green-400 text-white";
                icon = "✅";
              } else if (isLocked) {
                statusClasses = "bg-gray-800 border-gray-600 text-gray-500";
                icon = "🔒";
              }

              return (
                <div key={lessonId} className="flex justify-center">
                  <div 
                    onClick={() => !isLocked && navigate(`/lesson/${lessonId}`)}
                    className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center font-bold text-xl shadow-lg cursor-pointer transition-transform hover:scale-110 ${statusClasses} ${isLocked ? 'cursor-not-allowed hover:scale-100' : ''}`}
                  >
                    <span>{icon}</span>
                    <span className="text-xs mt-1">L{lessonId}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

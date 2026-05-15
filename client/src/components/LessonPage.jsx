import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';


const LessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await api.get(`/lessons/${id}`);
        setLesson(res.data);
        setLoading(false);
        // Reset state on lesson change
        setCode('');
        setFeedback(null);
        setSuccess(false);
      } catch (err) {
        console.error('Failed to fetch lesson:', err);
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('codlift_token');
      const res = await api.post(
        `/lessons/${id}/submit`,
        { userCode: code, language: lesson.category.toLowerCase() }
      );

      if (res.data.success) {
        setSuccess(true);
        setFeedback(`Success! You earned ${res.data.xp} XP.`);
        
        // Save progress
        await api.post(
          '/progress',
          { lesson_id: id }
        );
      } else {
        setSuccess(false);
        setFeedback(res.data.hint || 'Incorrect. Try again.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setFeedback('An error occurred while checking your code.');
    }
  };

  if (loading) return <div className="p-8 text-center text-white">Loading...</div>;
  if (!lesson) return <div className="p-8 text-center text-white">Lesson not found.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Panel: Content & Task */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2 block">
            {lesson.category} • Tier {lesson.tier}
          </span>
          <h1 className="text-3xl font-extrabold mb-4">{lesson.title}</h1>
          <p className="text-gray-300 mb-6 leading-relaxed">{lesson.content}</p>
          
          <div className="bg-blue-900/30 border border-blue-500/50 p-4 rounded-lg">
            <h2 className="text-xl font-bold text-blue-300 mb-2">Task</h2>
            <p className="text-blue-100">{lesson.task}</p>
          </div>
        </div>

        {/* Right Panel: Editor & Actions */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col">
          <h2 className="text-xl font-bold mb-4">Code Editor</h2>
          <textarea
            className="flex-1 w-full bg-gray-950 text-green-400 font-mono p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 resize-none border border-gray-700"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your code here..."
          />
          
          {feedback && (
            <div className={`p-4 rounded-lg mb-4 font-bold ${success ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
              {feedback}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Run Code
            </button>
            {success && (
              <button
                onClick={() => navigate(`/lesson/${parseInt(id) + 1}`)}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Next Lesson
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LessonPage;

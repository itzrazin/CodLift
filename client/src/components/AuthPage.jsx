import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(username, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-extrabold text-center mb-6">
          {isLogin ? 'Welcome Back' : 'Join CodeLift'}
        </h2>
        
        {error && (
          <div className="bg-red-500/20 text-red-400 border border-red-500/50 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
              <input
                type="text"
                required
                className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="codewizard"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-2"
          >
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            className="text-blue-400 hover:text-blue-300 font-semibold focus:outline-none"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;

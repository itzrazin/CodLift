// Backend API URL — set VITE_API_URL in Vercel environment variables
// pointing to your Railway/Render backend (e.g. https://xxx.railway.app)
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // If running on localhost or 127.0.0.1, default to local backend port 10000
  if (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1' || 
       window.location.hostname.startsWith('192.168.'))) {
    return 'http://localhost:10000/api';
  }
  return 'https://codlift.onrender.com/api';
};

export const API_URL = getApiUrl();


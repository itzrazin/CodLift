import axios from 'axios';
import { API_URL } from '../utils/config';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('codlift_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  response => response,
  error => {
    const isAuthPath = window.location.pathname === '/login' || window.location.pathname === '/signup';
    if (error.response?.status === 401 && !isAuthPath) {
      localStorage.removeItem('codlift_token');
      window.location.href = '/login?session=expired';
    }
    return Promise.reject(error);
  }
);

export default api;

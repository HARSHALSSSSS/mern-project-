import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://mern-project-1ob8.onrender.com/api' 
    : 'http://localhost:5000/api');

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000, // 15 second timeout for faster failure detection
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't override Content-Type if it's already set to multipart/form-data
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      console.log('📤 FormData request detected - removing Content-Type header to let browser set it');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

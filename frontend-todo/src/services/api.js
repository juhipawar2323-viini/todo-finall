import axios from 'axios';

// Keep the API location configurable while preserving a safe production
// fallback for deployments where Vercel has not been given the variable yet.
const API_URL = (process.env.REACT_APP_API_URL || 'https://todos-app-8za0.onrender.com')
  .replace(/\/$/, '');

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

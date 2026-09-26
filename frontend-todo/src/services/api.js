import axios from 'axios';

let rawUrl = (process.env.REACT_APP_API_URL || 'https://todo-finall.onrender.com')
  .trim()
  .replace(/\/$/, '');

// If the user appended /api to the base URL, strip it to prevent duplicate /api/api/...
if (rawUrl.endsWith('/api')) {
  rawUrl = rawUrl.slice(0, -4);
}

const API_URL = rawUrl;

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

import axios from 'axios';

const api = axios.create({
  // baseURL: "https://artisan-8ezm.onrender.com/api",
  baseURL: "http://localhost:5000/api",
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  let token;


  if (config.url.startsWith('/admin')) {
    token = localStorage.getItem('adminToken');
  } else {
    token = localStorage.getItem('artisanToken') || localStorage.getItem('studentToken');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

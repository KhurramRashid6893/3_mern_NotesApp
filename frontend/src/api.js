import axios from 'axios';

// ✅ Hardcoded Render backend URL
const API_URL = 'https://three-mern-notesapp.onrender.com';

// ✅ Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ✅ Automatically attach token if present (updated to use Authorization Bearer)
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // ✅ THIS LINE CHANGED
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;

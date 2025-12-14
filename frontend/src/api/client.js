import axios from 'axios';

// 1. Create the Axios instance
const apiClient = axios.create({
  // Ensure this matches your backend URL (usually port 8000)
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor: Attaches Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor: Handles Token Expiry (401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend says "Unauthorized" (401), force logout
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
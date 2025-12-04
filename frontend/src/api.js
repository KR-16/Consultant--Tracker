import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Auth Errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('token');
      if (token) {
        localStorage.removeItem('token');
        // Prevent redirect loop if already on auth pages
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/register') &&
            !window.location.pathname.includes('/forgot-password') &&
            !window.location.pathname.includes('/reset-password')) {
          window.location.href = '/login';
        }
      }
    }
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Login: Updated to send 'identifier' (email or username)
  login: (identifier, password) => api.post('/auth/login', { identifier, password }),
  
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh'),
  
  // Forgot Password
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  // Reset Password
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { 
    token, 
    new_password: newPassword 
  }),
};

export const jobAPI = {
  getAll: () => api.get('/jobs/'), 
  create: (jobData) => api.post('/jobs/', jobData),
  getOne: (id) => api.get(`/jobs/${id}`),
};

export const submissionAPI = {
  getAll: () => api.get('/submissions/'),
  create: (data) => api.post('/submissions/', data),
  updateStatus: (id, status) => api.put(`/submissions/${id}`, { status }),
};

export const consultantAPI = {
  getAll: () => api.get('/consultants/'),
  getProfile: () => api.get('/consultants/me'),
};

export default api;
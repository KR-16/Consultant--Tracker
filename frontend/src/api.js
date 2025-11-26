import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('token');
      if (token) {
        localStorage.removeItem('token');
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
      }
    }
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);


export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
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
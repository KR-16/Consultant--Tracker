import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Consultant API
export const consultantAPI = {
  getAll: (params = {}) => api.get('/consultants/', { params }),
  getById: (id) => api.get(`/consultants/${id}`),
  create: (data) => api.post('/consultants/', data),
  update: (id, data) => api.put(`/consultants/${id}`, data),
  delete: (id) => api.delete(`/consultants/${id}`),
  importCSV: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/consultants/import-csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  exportCSV: () => api.get('/consultants/export/csv'),
};

// Submission API
export const submissionAPI = {
  getAll: (params = {}) => api.get('/submissions/', { params }),
  getById: (id) => api.get(`/submissions/${id}`),
  create: (data) => api.post('/submissions/', data),
  update: (id, data) => api.put(`/submissions/${id}`, data),
  updateStatus: (id, status, changedBy, comments) => 
    api.put(`/submissions/${id}/status`, { status, comments }, {
      params: { changed_by: changedBy }
    }),
  delete: (id) => api.delete(`/submissions/${id}`),
  getByConsultant: (consultantId) => api.get(`/submissions/consultant/${consultantId}`),
  getStatusHistory: (id) => api.get(`/submissions/${id}/history`),
  importCSV: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/submissions/import-csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  exportCSV: (params = {}) => api.get('/submissions/export/csv', { params }),
};

// Reports API
export const reportsAPI = {
  getStatusReport: (params = {}) => api.get('/reports/status', { params }),
  getTechReport: (params = {}) => api.get('/reports/tech', { params }),
  getRecruiterReport: (params = {}) => api.get('/reports/recruiter', { params }),
  getFunnelReport: (params = {}) => api.get('/reports/funnel', { params }),
  getTimeToStageReport: (params = {}) => api.get('/reports/time-to-stage', { params }),
  getDashboard: (params = {}) => api.get('/reports/dashboard', { params }),
};

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
  getAllUsers: (params = {}) => api.get('/auth/users', { params }),
  createUser: (userData) => api.post('/auth/users', userData),
};

// Job Descriptions API
export const jobAPI = {
  getAll: (params = {}) => api.get('/jobs/', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs/', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  getOpenJobs: (params = {}) => api.get('/jobs/open', { params }),
  searchJobs: (query, params = {}) => api.get('/jobs/search', { params: { q: query, ...params } }),
  getJobsByTechStack: (techStack, params = {}) => api.get('/jobs/tech-stack', { params: { tech_stack: techStack, ...params } }),
  closeJob: (id) => api.post(`/jobs/${id}/close`),
  fillJob: (id) => api.post(`/jobs/${id}/fill`),
};

// Applications API
export const applicationAPI = {
  getAll: (params = {}) => api.get('/applications/', { params }),
  getById: (id) => api.get(`/applications/${id}`),
  create: (data) => api.post('/applications/', data),
  update: (id, data) => api.put(`/applications/${id}`, data),
  delete: (id) => api.delete(`/applications/${id}`),
  getMyApplications: (params = {}) => api.get('/applications/my-applications', { params }),
  getJobApplications: (jobId, params = {}) => api.get(`/applications/job/${jobId}`, { params }),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, null, { params: { status } }),
  withdraw: (id) => api.post(`/applications/${id}/withdraw`),
  uploadResume: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/applications/${id}/upload-resume`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  downloadResume: (id) => api.get(`/applications/${id}/resume`, { responseType: 'blob' }),
  deleteResume: (id) => api.delete(`/applications/${id}/resume`),
  getResumeInfo: (id) => api.get(`/applications/${id}/resume-info`),
  getStats: (params = {}) => api.get('/applications/stats/summary', { params }),
};

export default api;

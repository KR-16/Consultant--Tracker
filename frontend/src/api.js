import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
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

export default api;

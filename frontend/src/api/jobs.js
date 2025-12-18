import client from './client';

// --- Public / Candidate Routes ---

export const getJobs = async () => {
  // ✅ FIX: Added '/api' prefix
  const response = await client.get('/api/jobs/'); 
  return response.data;
};

export const getJob = async (id) => {
  // ✅ FIX: Added '/api' prefix
  const response = await client.get(`/api/jobs/${id}`);
  return response.data;
};

// --- Manager Routes ---

export const createJob = async (jobData) => {
  // ✅ FIX: Added '/api' prefix
  const response = await client.post('/api/jobs/', jobData);
  return response.data;
};

export const getMyJobs = async () => {
  // ✅ FIX: Added '/api' prefix
  const response = await client.get('/api/jobs/my-jobs');
  return response.data;
};
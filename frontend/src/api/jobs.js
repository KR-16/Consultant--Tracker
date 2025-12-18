import client from './client';

export const getJobs = async () => {
  const response = await client.get('/api/jobs/'); 
  return response.data;
};

export const getJob = async (id) => {
  const response = await client.get(`/api/jobs/${id}`);
  return response.data;
};

// --- Manager Routes ---

export const createJob = async (jobData) => {
  const response = await client.post('/api/jobs/', jobData);
  return response.data;
};

export const getMyJobs = async () => {
  const response = await client.get('/api/jobs/my-jobs');
  return response.data;
};
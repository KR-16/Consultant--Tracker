import client from './client';

export const getJobs = async () => {
  const response = await client.get('/jobs/'); 
  return response.data;
};

export const getJob = async (id) => {
  const response = await client.get(`/jobs/${id}`);
  return response.data;
};


export const createJob = async (jobData) => {
  const response = await client.post('/jobs/', jobData);
  return response.data;
};

export const getMyJobs = async () => {
  const response = await client.get('/jobs/my-jobs');
  return response.data;
};
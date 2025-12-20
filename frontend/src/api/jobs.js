import client from './client';

/**
 * Fetch all active jobs
 */
export const getJobs = async () => {
  const response = await client.get('/jobs/');
  return response.data;
};

/**
 * Fetch a single job by its ID
 */
export const getJobDetails = async (id) => {
  const response = await client.get(`/jobs/${id}`);
  return response.data;
};

/**
 * Create a new job post
 */
export const createJob = async (jobData) => {
  const response = await client.post('/jobs/', jobData);
  return response.data;
};

/**
 * Update an existing job post
 */
export const updateJob = async (id, jobData) => {
  const response = await client.put(`/jobs/${id}`, jobData);
  return response.data;
};

/**
 * Delete a job post
 */
export const deleteJob = async (id) => {
  const response = await client.delete(`/jobs/${id}`);
  return response.data;
};
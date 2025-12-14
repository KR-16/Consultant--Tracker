import client from './client';

export const applyForJob = async (jobId, resumeUsed) => {
  const response = await client.post('/api/submissions/apply', {
    job_id: jobId,
    resume_used: resumeUsed
  });
  return response.data;
};

export const getMyApplications = async () => {
  const response = await client.get('/api/submissions/my-applications');
  return response.data;
};

export const getJobSubmissions = async (jobId) => {
  const response = await client.get(`/api/submissions/job/${jobId}`);
  return response.data;
};
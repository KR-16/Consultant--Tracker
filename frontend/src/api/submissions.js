import client from './client';

export const applyForJob = async (jobId) => {
  const response = await client.post('/api/submissions/apply', { 
    job_id: jobId 
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

export const updateSubmissionStatus = async (submissionId, status, atsScore) => {
    const response = await client.put(`/api/submissions/${submissionId}/status`, {
        status,
        ats_score: atsScore
    });
    return response.data;
};
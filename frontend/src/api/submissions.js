import client from './client';

export const applyForJob = async (jobId) => {
  const response = await client.post('/submissions/apply', { 
    job_id: jobId 
  });
  return response.data;
};

export const getMyApplications = async () => {
  const response = await client.get('/submissions/my-applications');
  return response.data;
};

export const getJobSubmissions = async (jobId) => {
    // Manager only
    const response = await client.get(`/submissions/job/${jobId}`);
    return response.data;
};

export const updateSubmissionStatus = async (submissionId, status, atsScore) => {
    // Manager only
    const response = await client.put(`/submissions/${submissionId}/status`, {
        status,
        ats_score: atsScore
    });
    return response.data;
};
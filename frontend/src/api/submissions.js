import client from './client';

export const applyForJob = async (jobId) => {
  // ✅ ADDED /api prefix
  const response = await client.post('/api/submissions/apply', { 
    job_id: jobId 
  });
  return response.data;
};

export const getMyApplications = async () => {
  // ✅ ADDED /api prefix
  const response = await client.get('/api/submissions/my-applications');
  return response.data;
};

export const getJobSubmissions = async (jobId) => {
    // Manager only
    // ✅ ADDED /api prefix
    const response = await client.get(`/api/submissions/job/${jobId}`);
    return response.data;
};

export const updateSubmissionStatus = async (submissionId, status, atsScore) => {
    // Manager only
    // ✅ ADDED /api prefix
    const response = await client.put(`/api/submissions/${submissionId}/status`, {
        status,
        ats_score: atsScore
    });
    return response.data;
};
import client from './client';

export const applyForJob = async (jobId, resumeId) => {
  const response = await client.post('/submissions/apply', { 
    job_id: jobId,
    resume_id: resumeId 
  });
  return response.data;
};

export const getMyApplications = async () => {
  const response = await client.get('/submissions/my-applications');
  return response.data;
};

export const getJobSubmissions = async (jobId) => {
    const response = await client.get(`/submissions/job/${jobId}`);
    return response.data;
};

export const getPipelineSubmissions = async () => {
  const response = await client.get('/submissions/pipeline');
  return response.data;
};

export const updateSubmissionStatus = async (submissionId, status, notes = "") => {
    const response = await client.put(`/submissions/${submissionId}/stage`, {
        current_status: status,
        notes: notes 
    });
    return response.data;
};
import client from './client';

export const getMyCandidates = async () => {
  const response = await client.get('/hiring/my-candidates');
  return response.data;
};

export const getCandidateDetails = async (id) => {
  const response = await client.get(`/hiring/candidates/${id}`);
  return response.data;
};
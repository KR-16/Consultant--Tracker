import client from './client';
export const getAllUsers = async (role = null) => {
  const params = role ? { role } : {};
  const response = await client.get('/admin/users', { params });
  return response.data;
};


export const assignCandidate = async (managerId, candidateId) => {
  const response = await client.post('/admin/assign', {
    manager_id: managerId,
    candidate_id: candidateId,
  });
  return response.data;
};
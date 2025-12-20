import client from './client';

export const updateProfile = async (profileData) => {
  const response = await client.put('/candidates/profile', profileData);
  return response.data;
};

export const getMyResumes = async () => {
  const response = await client.get('/candidates/resumes');
  return response.data;
};

export const uploadResume = async (file, isPrimary = false) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('is_primary', isPrimary);

  const response = await client.post('/candidates/resumes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteResume = async (resumeId) => {
  const response = await client.delete(`/candidates/resumes/${resumeId}`);
  return response.data;
};
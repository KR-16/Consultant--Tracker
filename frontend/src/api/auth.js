import client from './client';

export const loginUser = async (email, password) => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);
  
  const response = await client.post('/auth/login', formData);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await client.post('/auth/register', userData);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await client.get('/auth/users');
  return response.data;
};
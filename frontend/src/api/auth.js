import client from './client';

export const loginUser = async (email, password) => {
  // The backend uses OAuth2 form data (username=email, password=password)
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);
  
  const response = await client.post('/auth/login', formData);
  return response.data; // Returns { access_token, token_type }
};

export const registerUser = async (userData) => {
  const response = await client.post('/auth/register', userData);
  return response.data;
};
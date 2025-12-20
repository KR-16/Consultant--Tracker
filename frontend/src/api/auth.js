import client from './client';

export const login = async (email, password) => {
  const params = new URLSearchParams();
  params.append('username', email); 
  params.append('password', password);

  const response = await client.post('/auth/login', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

export const register = async (userData) => {
  const response = await client.post('/auth/register', userData);
  return response.data;
};

export const getMe = async () => {
  const response = await client.get('/auth/me');
  return response.data;
};

export const logout = async () => {
    try {
        await client.post('/auth/logout');
    } catch (error) {
        console.error("Logout error", error);
    }
};
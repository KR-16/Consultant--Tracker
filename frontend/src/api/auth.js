import client from './client';

// --- Auth Functions ---

export const loginUser = async (email, password) => {
  // Fix: Use URLSearchParams to force application/x-www-form-urlencoded
  // This is required by FastAPI's OAuth2PasswordRequestForm
  const params = new URLSearchParams();
  params.append('username', email); 
  params.append('password', password);

  const response = await client.post('/auth/login', params, {
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded' 
    }
  });
  return response.data;
};

export const registerUser = async (userData) => {
  // Registration sends JSON, so the default client settings work fine
  const response = await client.post('/auth/register', userData);
  return response.data;
};

// --- Admin User Management Functions ---

// Get all users
export const getAllUsers = async () => {
  const response = await client.get('/api/users'); 
  return response.data;
};

// Create a user (Admin manually creating a user)
export const createUser = async (userData) => {
  const response = await client.post('/api/users', userData);
  return response.data;
};

// Update a user
export const updateUser = async (userId, userData) => {
  const response = await client.put(`/api/users/${userId}`, userData);
  return response.data;
};

// Delete a user
export const deleteUser = async (userId) => {
  const response = await client.delete(`/api/users/${userId}`);
  return response.data;
};
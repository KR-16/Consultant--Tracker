import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api'; // <--- Import the new api connection

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Use api.get (no need to manually add headers, api.js does it)
      api.get('/auth/me')
        .then(response => setUser(response.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      // Login endpoint expects a JSON body matching LoginRequest schema
      const response = await api.post('/auth/login', { 
        identifier: email, 
        password: password 
      });

      const { access_token } = response.data;
      localStorage.setItem('token', access_token);

      // Fetch user details immediately
      const userResponse = await api.get('/auth/me');
      setUser(userResponse.data);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
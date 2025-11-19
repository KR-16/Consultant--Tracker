import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set token in localStorage and axios headers
  const setAuthToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
    } else {
      localStorage.removeItem('token');
      setToken(null);
    }
  };

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          // Token invalid or expired
          setAuthToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      setAuthToken(response.data.access_token);
      const userResponse = await authAPI.getCurrentUser();
      setUser(userResponse.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return { success: true, data: response.data };
    } catch (error) {
      // Handle network errors (CORS, connection refused, etc.)
      if (!error.response) {
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
          return {
            success: false,
            error: 'Cannot connect to server. Please ensure the backend is running on http://localhost:8000'
          };
        }
        return {
          success: false,
          error: error.message || 'Registration failed: Network error'
        };
      }
      // Handle HTTP errors
      return {
        success: false,
        error: error.response?.data?.detail || `Registration failed (${error.response?.status})`
      };
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  const refreshToken = async () => {
    try {
      const response = await authAPI.refreshToken();
      setAuthToken(response.data.access_token);
      return { success: true };
    } catch (error) {
      logout();
      return { success: false };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshToken,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isRecruiter: user?.role === 'RECRUITER',
    isConsultant: user?.role === 'CONSULTANT',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


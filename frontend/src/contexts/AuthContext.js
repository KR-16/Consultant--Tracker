import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext();

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
  const [token, setToken] = useState(localStorage.getItem('access_token'));

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          // Verify token is still valid
          const response = await authAPI.getCurrentUser();
          setUser(response.data);
          setToken(storedToken);
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { access_token } = response.data;
      
      // Get user info
      const userResponse = await authAPI.getCurrentUser();
      
      // Store in localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(userResponse.data));
      
      setToken(access_token);
      setUser(userResponse.data);
      
      return { success: true, user: userResponse.data };
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
      return { success: true, user: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear storage regardless of API call success
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authAPI.refreshToken();
      const { access_token } = response.data;
      
      localStorage.setItem('access_token', access_token);
      setToken(access_token);
      
      return { success: true };
    } catch (error) {
      // Refresh failed, logout user
      await logout();
      return { success: false };
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const isAuthenticated = () => {
    return !!user && !!token;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const isRecruiter = () => {
    return user?.role === 'RECRUITER';
  };

  const isConsultant = () => {
    return user?.role === 'CONSULTANT';
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshToken,
    updateUser,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    isAdmin,
    isRecruiter,
    isConsultant,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

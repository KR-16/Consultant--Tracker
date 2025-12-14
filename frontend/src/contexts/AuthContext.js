import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode"; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token on app startup
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Backend sends: { sub: "email", role: "ROLE" }
        setUser({
          email: decoded.sub,
          role: decoded.role,
        });
      } catch (e) {
        console.error("Invalid token", e);
        localStorage.removeItem('access_token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('access_token', token);
    const decoded = jwtDecode(token);
    setUser({
      email: decoded.sub,
      role: decoded.role,
    });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
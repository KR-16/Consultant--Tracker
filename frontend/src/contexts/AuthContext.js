import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode"; // ✅ Correct named import

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
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            console.warn("Token expired, logging out");
            localStorage.removeItem('access_token');
        } else {
            setUser({
              email: decoded.sub,
              role: decoded.role,
            });
        }
      } catch (e) {
        console.error("Invalid token found in storage:", e);
        localStorage.removeItem('access_token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    console.log("Login function called with token"); 
    localStorage.setItem('access_token', token);
    
    try {
        const decoded = jwtDecode(token);
        console.log("Decoded user from token:", decoded);
        setUser({
          email: decoded.sub,
          role: decoded.role,
        });
    } catch (e) {
        console.error("Failed to decode token during login:", e);
    }
  };

  const logout = () => {
    console.log("Logging out...");
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
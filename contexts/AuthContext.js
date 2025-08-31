'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('adminToken');
      const adminData = localStorage.getItem('adminData');
      
      if (token && adminData) {
        try {
          // Verify token is still valid by making a simple API call
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Optional: You can add a token validation API endpoint
          // const response = await axios.get('/api/admin/validate');
          
          setAdmin(JSON.parse(adminData));
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('adminData');
          localStorage.removeItem('adminToken');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/admin/login', {
        email,
        password
      });

      if (response.data.success) {
        const { admin, token } = response.data;
        setAdmin(admin);
        localStorage.setItem('adminData', JSON.stringify(admin));
        localStorage.setItem('adminToken', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('adminData');
    localStorage.removeItem('adminToken');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    admin,
    login,
    logout,
    isAuthenticated: !!admin,
    loading: !isInitialized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
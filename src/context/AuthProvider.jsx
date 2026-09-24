import React, { useState, useEffect } from 'react';
import { authApi } from '../api/auth.api';
import { AuthContext } from './authContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const { data } = await authApi.getMe();
          setUser(data.user);
        } catch {
          localStorage.clear();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user || { role: credentials.role || 'FSE', ...credentials });
    return data.user || { role: credentials.role || 'FSE', ...credentials };
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await authApi.logout(refreshToken);
    } finally {
      localStorage.clear();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
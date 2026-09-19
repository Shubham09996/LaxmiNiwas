import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('lxn_auth_token');
      const savedUser = localStorage.getItem('lxn_auth_user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error('Failed to parse cached auth session:', err);
      localStorage.removeItem('lxn_auth_token');
      localStorage.removeItem('lxn_auth_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.login(credentials);
      if (response && response.success) {
        const authToken = response.token;
        const authUser = response.user;

        localStorage.setItem('lxn_auth_token', authToken);
        localStorage.setItem('lxn_auth_user', JSON.stringify(authUser));

        setToken(authToken);
        setUser(authUser);
        return { success: true, user: authUser };
      } else {
        throw new Error(response?.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.logout().catch(() => {});
    } finally {
      localStorage.removeItem('lxn_auth_token');
      localStorage.removeItem('lxn_auth_user');
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

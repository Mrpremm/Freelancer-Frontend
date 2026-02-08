import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/auth.service';
import { tokenUtils } from '../utils/token';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenUtils.getToken();
      const savedUser = tokenUtils.getUser();
      
      if (token && savedUser) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
          tokenUtils.setUser(profile);
        } catch (err) {
          tokenUtils.removeToken();
          tokenUtils.removeUser();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const data = await authService.login({ email, password });
      tokenUtils.setToken(data.token);
      tokenUtils.setUser(data.user);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, error: err.response?.data?.message };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const data = await authService.register(userData);
      tokenUtils.setToken(data.token);
      tokenUtils.setUser(data.user);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, error: err.response?.data?.message };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isFreelancer: user?.role === 'freelancer',
    isClient: user?.role === 'client'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/auth.service';
import { tokenUtils } from '../utils/token';

// Create the context
export const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('Initializing auth...');
        const token = tokenUtils.getToken();
        const savedUser = tokenUtils.getUser(); // This now handles parsing safely
        
        console.log('Token exists:', !!token);
        console.log('Saved user exists:', !!savedUser);
        
        if (token && savedUser) {
          try {
            console.log('Fetching updated profile...');
            const profile = await authService.getProfile();
            console.log('Profile fetched successfully:', profile);
            setUser(profile);
            tokenUtils.setUser(profile);
          } catch (err) {
            console.error('Error fetching profile:', err);
            tokenUtils.clearAuth();
            setError('Session expired. Please login again.');
          }
        } else {
          console.log('No valid auth data found in localStorage');
        }
      } catch (err) {
        console.error('Error in auth initialization:', err);
        tokenUtils.clearAuth();
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      console.log('Attempting login for:', email);
      const data = await authService.login({ email, password });
      console.log('Login successful:', data);
      
      tokenUtils.setToken(data.token);
      tokenUtils.setUser(data.user);
      setUser(data.user);
      
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      console.error('Login error:', errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      console.log('Attempting registration for:', userData.email);
      const data = await authService.register(userData);
      console.log('Registration successful:', data);
      
      tokenUtils.setToken(data.token);
      tokenUtils.setUser(data.user);
      setUser(data.user);
      
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      console.error('Registration error:', errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    console.log('Logging out...');
    authService.logout();
    tokenUtils.clearAuth();
    setUser(null);
    setError(null);
  };

  const updateUser = (userData) => {
    try {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      tokenUtils.setUser(updatedUser);
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
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
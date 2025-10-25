import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, getUserType, isAuthenticated, logout as logoutService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getCurrentUser());
      setUserType(getUserType());
    }
    setLoading(false);
  }, []);

  const login = (userData, type) => {
    setUser(userData);
    setUserType(type);
  };

  const logout = () => {
    logoutService();
    setUser(null);
    setUserType(null);
  };

  const value = {
    user,
    userType,
    loading,
    isAuthenticated: isAuthenticated(),
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
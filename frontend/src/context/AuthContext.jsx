import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('shm_user');
      return savedUser ? JSON.parse(savedUser) : {
        id: 'usr-101',
        name: 'Dr. Aris Thorne',
        email: 'aris.thorne@shm-civil.edu',
        role: 'ADMIN',
        title: 'Senior Structural Engineer'
      };
    } catch {
      return {
        id: 'usr-101',
        name: 'Dr. Aris Thorne',
        email: 'aris.thorne@shm-civil.edu',
        role: 'ADMIN',
        title: 'Senior Structural Engineer'
      };
    }
  });

  const login = (userData) => {
    const newUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: userData.name || userData.email?.split('@')[0] || 'Field Engineer',
      email: userData.email || 'engineer@shm-civil.edu',
      role: userData.role || 'ENGINEER',
      title: userData.role === 'ADMIN' ? 'Senior Structural Engineer' : 'Field Structural Engineer'
    };
    setUser(newUser);
    try {
      localStorage.setItem('shm_user', JSON.stringify(newUser));
    } catch (e) {
      console.warn('localStorage save failed', e);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('shm_user');
    } catch (e) {
      console.warn('localStorage remove failed', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

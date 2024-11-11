import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Dummy authentication logic for testing
      if (email === 'doctor@example.com' && password === 'doctor123') {
        setCurrentUser({
          id: '1',
          name: 'Dr. Smith',
          role: 'doctor'
        });
        return true;
      } else if (email === 'patient@example.com' && password === 'patient123') {
        setCurrentUser({
          id: '2',
          name: 'John Doe',
          role: 'patient'
        });
        return true;
      }
      
      throw new Error('Invalid credentials');
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

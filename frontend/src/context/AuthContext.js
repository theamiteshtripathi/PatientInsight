import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (credentials) => {
    try {
      setLoading(true);
      // Mock authentication
      if (credentials.email === 'doctor@test.com' && credentials.password === 'test123') {
        const mockUser = {
          id: 1,
          email: credentials.email,
          name: 'Dr. Smith',
          role: 'doctor'
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        return mockUser;
      } else if (credentials.email === 'patient@test.com' && credentials.password === 'test123') {
        const mockUser = {
          id: 2,
          email: credentials.email,
          name: 'John Doe',
          role: 'patient'
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        return mockUser;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

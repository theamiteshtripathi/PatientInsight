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
      
      // Check for doctor/patient local login first
      if (email === 'doctor@example.com' && password === 'doctor123') {
        const doctorUser = {
          id: '1',
          name: 'Dr. Smith',
          role: 'doctor'
        };
        setCurrentUser(doctorUser);
        localStorage.setItem('user', JSON.stringify(doctorUser));
        return true;
      } else if (email === 'patient@example.com' && password === 'patient123') {
        const patientUser = {
          id: '2',
          name: 'John Doe',
          role: 'patient'
        };
        setCurrentUser(patientUser);
        localStorage.setItem('user', JSON.stringify(patientUser));
        return true;
      }

      // If not a local user, try database login
      const response = await fetch('http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // Set the logged-in user data
      const dbUser = {
        ...data.user,
        role: 'patient' // Default role for database users
      };
      
      setCurrentUser(dbUser);
      localStorage.setItem('user', JSON.stringify(dbUser));
      return true;

    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    return true;
  };

  // Check for existing login on app load
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        loading, 
        error, 
        login, 
        logout,
        setError // Export setError to clear errors when needed
      }}
    >
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


const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api';

export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data.user;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
}; 
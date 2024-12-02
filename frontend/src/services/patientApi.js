const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const createPatient = async (patientData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
      credentials: 'include',
    });

    console.log('API Response status:', response.status);

    const data = await response.json();
    
    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.message || 'Server error occurred');
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}; 
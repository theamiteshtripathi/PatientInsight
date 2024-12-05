const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

export const createPatient = async (patientData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/patientsonboardingform`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
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
    throw new Error(error.message || 'Failed to fetch');
  }
}; 
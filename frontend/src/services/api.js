const API_BASE_URL = process.env.REACT_APP_API_URL || 

export const fetchPatients = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/patients`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch patients')
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}

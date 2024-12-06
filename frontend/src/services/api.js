const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com:5000/api'

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

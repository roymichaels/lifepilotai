import api from './api';

// Description: Get user profile information
// Endpoint: GET /users/profile
// Request: {}
// Response: { success: boolean, user: { id: string, email: string, name: string, level: number, xp: number, unlockedSkills: string[], createdAt: string, lastLoginAt: string } }
export const getUserProfile = async () => {
  try {
    if (import.meta.env.DEV)
      console.log('getUserProfile - Making API request to /users/profile');
    if (import.meta.env.DEV)
      console.log('getUserProfile - Checking localStorage for access token...');
    
    const token = localStorage.getItem('accessToken');
    if (import.meta.env.DEV)
      console.log('getUserProfile - Access token exists:', !!token);
    if (import.meta.env.DEV)
      console.log('getUserProfile - Access token length:', token ? token.length : 0);
    
    const response = await api.get('/users/profile');
    if (import.meta.env.DEV)
      console.log('getUserProfile - API response received:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('getUserProfile - API error:', error);
    console.error('getUserProfile - Error response:', error.response?.data);
    console.error('getUserProfile - Error status:', error.response?.status);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

import axios from 'axios';

// Mock API for UX/UI development - Replace with real implementation
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
    'Accept-Language':
      typeof navigator !== 'undefined' ? ((navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language) ?? 'cs') : 'cs',
  },
  withCredentials: true,
});

// Add mock interceptor for UX development
if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL) {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.warn('API Mock: Real API not available, returning mock data for UX development');
      return Promise.resolve({ 
        data: { 
          data: [], 
          message: 'Mock API response for UX development' 
        } 
      });
    }
  );
}

export default api;

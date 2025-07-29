/* eslint-disable @typescript-eslint/no-unused-expressions */
import axios from 'axios';
import { loadConfig } from '@/services/ConfigService'

let baseURL = ''
const api = axios.create({
  baseURL,
  timeout: 10000,
})

loadConfig().then(cfg => {
  baseURL = cfg?.apiBaseUrl || ''
  api.defaults.baseURL = baseURL
})

export function setBaseURL(url: string) {
  baseURL = url
  api.defaults.baseURL = url
}

const isDev = import.meta.env.DEV;

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    isDev && console.log('[API] Making request to:', config.url);
    isDev && console.log('[API] Request method:', config.method);
    
    const token = localStorage.getItem('accessToken');
    isDev && console.log('[API] Access token exists:', !!token);
    isDev && console.log('[API] Access token length:', token ? token.length : 0);
    isDev && console.log('[API] Access token first 20 chars:', token ? token.substring(0, 20) + '...' : 'null');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      isDev && console.log('[API] Authorization header set:', config.headers.Authorization.substring(0, 30) + '...');
    } else {
      isDev && console.log('[API] No access token found in localStorage');
    }
    
    isDev && console.log('[API] Final request headers:', JSON.stringify(config.headers, null, 2));
    return config;
  },
  (error) => {
    console.error('[API] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    isDev && console.log('[API] Response received for:', response.config.url);
    isDev && console.log('[API] Response status:', response.status);
    isDev && console.log('[API] Response data:', JSON.stringify(response.data, null, 2));
    return response;
  },
  async (error) => {
    console.error('[API] Response error for:', error.config?.url);
    console.error('[API] Error status:', error.response?.status);
    console.error('[API] Error message:', error.message);
    console.error('[API] Error response data:', error.response?.data);

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      isDev && console.log('[API] 401 error detected, attempting token refresh...');
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        isDev && console.log('[API] Refresh token exists:', !!refreshToken);
        
        if (!refreshToken) {
          isDev && console.log('[API] No refresh token available, redirecting to login');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        isDev && console.log('[API] Attempting to refresh access token...');
        const response = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken: refreshToken
        });

        isDev && console.log('[API] Token refresh response:', response.data);
        
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
          isDev && console.log('[API] New access token stored, retrying original request');
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return api(originalRequest);
        } else {
          console.error('[API] Token refresh failed - no access token in response');
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        console.error('[API] Token refresh error:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

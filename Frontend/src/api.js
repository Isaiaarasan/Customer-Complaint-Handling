import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.DEV ? '' : 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('API Request:', config.method?.toUpperCase(), config.url, 'Token:', token ? 'exists' : 'missing');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data, error.config?.url);
    
    if (error.response?.status === 401) {
      console.log('Unauthorized - clearing token and redirecting to login');
      localStorage.removeItem('token');
      // Don't use window.location.href to avoid browser auth prompt
      // Instead, let the component handle the redirect
      if (window.location.pathname !== '/login') {
        window.location.pathname = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}

export default api; 
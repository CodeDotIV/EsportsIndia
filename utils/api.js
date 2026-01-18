import axios from 'axios';
import { Platform, Alert } from 'react-native';

// API Configuration - Works anywhere without manual IP setup
// Production backend is deployed at: https://esportsindia-hh3x.onrender.com
// Option 1: Use deployed backend (default) - works everywhere
// Option 2: For local development, set EXPO_PUBLIC_API_IP in .env for local IP

const getApiBaseUrl = () => {
  // Priority 1: Use explicit API URL from environment variable (works everywhere)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Default to deployed backend (works everywhere)
  const DEPLOYED_BACKEND_URL = 'https://esportsindia-hh3x.onrender.com/api';

  // Priority 2: For local development - use local IP if provided
  const localIP = process.env.EXPO_PUBLIC_API_IP;
  
  if (Platform.OS === 'web') {
    // Web: Use local IP if provided, otherwise localhost, then deployed backend
    if (localIP) {
      return `http://${localIP}:5000/api`;
    }
    return 'http://localhost:5000/api';
  }

  // For mobile devices (iOS/Android)
  if (localIP) {
    // Use provided local IP for local development
    return `http://${localIP}:5000/api`;
  }

  // Default: Use deployed backend (works everywhere)
  return DEPLOYED_BACKEND_URL;
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    console.log('📤 Request Data:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    console.log('📥 Response Data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.message);
    console.error('📛 Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    
    // Show user-friendly error messages
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timeout - Server may be down or slow');
    } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.error('🌐 Network error - Check your connection and API server');
      Alert.alert(
        'Connection Error',
        `Cannot connect to server at ${API_BASE_URL}\n\nPlease check:\n1. Backend server is running\n2. Correct IP address\n3. Network connection`
      );
    } else if (error.response) {
      console.error('📡 Server responded with error:', error.response.status);
    } else {
      console.error('❓ Unknown error:', error);
    }
    
    return Promise.reject(error);
  }
);

// OTP endpoints (using new backend structure)
export const sendOtp = (email, purpose = 'email_verification') => 
  api.post('/otp/send', { email, purpose });
export const verifyOtp = (email, otp) => 
  api.post('/otp/verify', { email, otp });

// Auth endpoints (using new backend structure)
export const registerUser = (name, email, password) =>
  api.post('/auth/signup', { name, email, password });
export const login = (email, password) => 
  api.post('/auth/login', { email, password });
export const forgotPassword = (email) => 
  api.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) =>
  api.post('/auth/reset-password', { token, password });
export const getCurrentUser = (token) =>
  api.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });

// Export the base URL for debugging
export { API_BASE_URL };

export default api;
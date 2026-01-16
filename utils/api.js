import axios from 'axios';
import { Platform, Alert } from 'react-native';

// Detect the API base URL based on platform and environment
const getApiBaseUrl = () => {
  // For iOS Simulator, use localhost
  if (Platform.OS === 'ios') {
    return 'http://localhost:5000/api';
  }
  
  // For Android Emulator, use 10.0.2.2 (special IP that maps to host machine's localhost)
  if (Platform.OS === 'android') {
    // For Android emulator, use 10.0.2.2 to access host machine's localhost
    // For physical device, use your machine's local IP address
    return 'http://10.0.2.2:5000/api'; // Android emulator
    // return 'http://YOUR_LOCAL_IP:5000/api'; // Physical device - update YOUR_LOCAL_IP
  }
  
  // For web, use localhost
  return 'http://localhost:5000/api';
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
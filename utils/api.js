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
    // Try local IP first (update this to your machine's IP if needed)
    return 'http://192.168.0.73:5000/api';
    // Alternative: return 'http://10.0.2.2:5000/api'; // For Android emulator
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

export const sendOtp = (phone, email) => api.post('/send-otp', { phone, email });
export const verifyOtp = (phone, otp) => api.post('/verify-otp', { phone, otp });
export const registerUser = (phone, email, name, password) =>
  api.post('/register', { phone, email, name, password });
export const login = (email, password) => api.post('/login', { email, password });
export const forgotPassword = (email) => api.post('/forgot-password', { email });
export const resetPassword = (email, otp, newPassword) =>
  api.post('/reset-password', { email, otp, newPassword });
export const getUserByEmail = (email) => api.post('/get-user', { email });

// Export the base URL for debugging
export { API_BASE_URL };

export default api;
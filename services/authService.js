// services/authService.js
import axios from "axios";
import { Platform } from "react-native";

// Detect the API base URL based on platform
const getApiBaseUrl = () => {
  // You can also use a shared API utility from utils/api.js
  if (Platform.OS === 'ios') {
    return 'http://localhost:5000/api';
  }
  if (Platform.OS === 'android') {
    // For Android emulator, use 10.0.2.2 to access host machine's localhost
    // For physical device, use your machine's local IP address
    return 'http://10.0.2.2:5000/api'; // Android emulator
    // return 'http://YOUR_LOCAL_IP:5000/api'; // Physical device - update YOUR_LOCAL_IP
  }
  return 'http://localhost:5000/api';
};

const BASE_URL = getApiBaseUrl();

// Signup with Email & Password
export const signUp = async (name, email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/signup`, {
      name,
      email,
      password
    });
    return { 
      success: true, 
      user: response.data.user,
      token: response.data.token,
      message: response.data.message,
      requiresVerification: response.data.requiresVerification || false
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

// Login with Email & Password
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password
    });
    return { 
      success: true, 
      user: response.data.user,
      token: response.data.token,
      message: response.data.message,
      requiresVerification: response.data.requiresVerification || false
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message,
      requiresVerification: error.response?.data?.requiresVerification || false,
      email: error.response?.data?.email || email
    };
  }
};

// Logout (client-side only, token removed from storage)
export const logout = async () => {
  try {
    const { removeItem } = await import('../utils/storageHelper');
    await removeItem('user');
    await removeItem('userToken');
    console.log('✅ Logout successful - tokens cleared');
    return { success: true };
  } catch (error) {
    console.error('❌ Logout error:', error);
    return { success: false, error: error.message };
  }
};

// Forgot Password (Send Reset Email)
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/forgot-password`, { email });
    return { 
      success: true, 
      message: response.data.message || "Password reset link sent to your email." 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

// Reset Password with Token
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/reset-password`, {
      token,
      password: newPassword
    });
    return { 
      success: true, 
      message: response.data.message || "Password reset successful." 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

// Get current user (requires token in header)
export const getCurrentUser = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return { 
      success: true, 
      user: response.data.user 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

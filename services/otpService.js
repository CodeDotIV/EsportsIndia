// services/otpService.js
import axios from "axios";
import { Platform } from "react-native";

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

const BASE_URL = getApiBaseUrl();

// Send OTP to email
export const sendOtp = async (email, purpose = 'email_verification') => {
  try {
    const response = await axios.post(`${BASE_URL}/otp/send`, { 
      email,
      purpose // 'email_verification', 'password_reset', or 'login'
    });
    return { 
      success: true, 
      message: response.data.message || "OTP sent successfully" 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

// Verify OTP
export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(`${BASE_URL}/otp/verify`, { email, otp });
    return { 
      success: true, 
      message: response.data.message || "OTP verified successfully",
      token: response.data.token || null,
      user: response.data.user || null
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

// Reset Password after OTP Verification
export const resetPasswordWithOtp = async (email, newPassword) => {
  try {
    const response = await axios.post(`${BASE_URL}/otp/reset-password`, {
      email,
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

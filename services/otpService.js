// services/otpService.js
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

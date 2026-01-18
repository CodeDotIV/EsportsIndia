// services/authService.js
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

// Log the API URL for debugging
console.log(`🔗 API Base URL: ${BASE_URL}`);
console.log(`📱 Platform: ${Platform.OS}`);
if (__DEV__) {
  console.log(`💡 To use a deployed backend, set EXPO_PUBLIC_API_URL in .env`);
  console.log(`💡 For local dev, set EXPO_PUBLIC_API_IP in .env or it will auto-detect from Expo`);
}

// Signup with Email & Password
export const signUp = async (name, email, password) => {
  try {
    console.log(`🌐 Connecting to API at: ${BASE_URL}`);
    const response = await axios.post(`${BASE_URL}/auth/signup`, {
      name,
      email,
      password
    }, {
      timeout: 15000 // 15 second timeout for signup (may need to send email)
    });
    return { 
      success: true, 
      user: response.data.user,
      token: response.data.token,
      message: response.data.message,
      requiresVerification: response.data.requiresVerification || false
    };
  } catch (error) {
    console.error('❌ Signup API Error:', {
      message: error.message,
      code: error.code,
      url: BASE_URL,
      status: error.response?.status,
      response: error.response?.data
    });
    
    // Extract detailed error message
    let errorMessage = 'Signup failed';
    
    if (error.response?.data) {
      // Server returned an error response
      errorMessage = error.response.data.message || error.response.data.error || 'Server error during signup';
      
      // Include validation errors if present
      if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
        const validationErrors = error.response.data.errors.map(e => e.msg || e.message).join(', ');
        errorMessage = `${errorMessage}: ${validationErrors}`;
      }
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      errorMessage = `Cannot connect to server at ${BASE_URL}. Please check your connection.`;
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. Please try again.';
    } else {
      errorMessage = error.message || 'An unexpected error occurred';
    }
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
};

// Login with Email & Password
export const login = async (email, password) => {
  try {
    console.log(`🌐 Connecting to API at: ${BASE_URL}`);
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password
    }, {
      timeout: 10000 // 10 second timeout
    });
    return { 
      success: true, 
      user: response.data.user,
      token: response.data.token,
      message: response.data.message,
      requiresVerification: response.data.requiresVerification || false
    };
  } catch (error) {
    console.error('❌ Login API Error:', {
      message: error.message,
      code: error.code,
      url: BASE_URL,
      response: error.response?.data
    });
    
    // Check for network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      return { 
        success: false, 
        error: `Cannot connect to server at ${BASE_URL}. Please check:\n1. Backend server is running\n2. Your device and computer are on the same network\n3. Update LOCAL_IP in authService.js to your computer's IP address`,
        requiresVerification: false,
        email: email
      };
    }
    
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

// Update user profile
export const updateProfile = async (token, profileData) => {
  try {
    const response = await axios.put(`${BASE_URL}/auth/profile`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return { 
      success: true, 
      user: response.data.user,
      message: response.data.message || 'Profile updated successfully'
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

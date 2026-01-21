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

// Helper function to wake up Render free tier service (ping health endpoint)
const wakeUpService = async () => {
  try {
    // Ping health endpoint to wake up the service (non-blocking)
    // BASE_URL format: https://domain.com/api, so health is at /api/health
    const healthUrl = `${BASE_URL}/health`;
    axios.get(healthUrl, { timeout: 5000 }).catch(() => {
      // Ignore errors - this is just to wake up the service
    });
  } catch (e) {
    // Ignore errors
  }
};

// Helper function to retry requests (for Render free tier cold starts)
const retryRequest = async (requestFn, maxRetries = 2, delay = 2000) => {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      // If it's a network error and we have retries left, wait and retry
      if (i < maxRetries && (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || error.message.includes('Network Error'))) {
        console.log(`⚠️ Network error, retrying... (${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1))); // Exponential backoff
        continue;
      }
      throw error; // Re-throw if no retries left or different error
    }
  }
};

// Signup with Email & Password
export const signUp = async (name, email, password) => {
  try {
    console.log(`🌐 Connecting to API at: ${BASE_URL}`);
    
    // Wake up Render free tier service if needed (non-blocking)
    wakeUpService();
    
    // Retry logic for Render free tier cold starts
    const response = await retryRequest(async () => {
      return await axios.post(`${BASE_URL}/auth/signup`, {
        name,
        email,
        password
      }, {
        timeout: 30000 // 30 second timeout (Render free tier can take 20-60s to wake up)
      });
    }, 3, 3000); // 3 retries with 3s delay
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
      errorMessage = `Cannot connect to server. The server may be waking up (free tier services sleep after inactivity). Please wait a moment and try again.`;
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. The server may be waking up. Please try again in a few seconds.';
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
    
    // Wake up Render free tier service if needed (non-blocking)
    wakeUpService();
    
    // Retry logic for Render free tier cold starts
    const response = await retryRequest(async () => {
      return await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password
      }, {
        timeout: 30000 // 30 second timeout (Render free tier can take 20-60s to wake up)
      });
    }, 3, 3000); // 3 retries with 3s delay
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
        error: `Cannot connect to server. The server may be waking up (free tier services sleep after inactivity). Please wait a moment and try again.`,
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
    console.log('📤 Sending profile update:', profileData);
    
    // Wake up Render free tier service if needed (non-blocking)
    wakeUpService();
    
    // Retry logic for Render free tier cold starts
    const response = await retryRequest(async () => {
      return await axios.put(`${BASE_URL}/auth/profile`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 30000 // 30 second timeout
      });
    }, 3, 3000); // 3 retries with 3s delay
    return { 
      success: true, 
      user: response.data.user,
      message: response.data.message || 'Profile updated successfully'
    };
  } catch (error) {
    console.error('❌ Profile update error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Extract detailed error message
    let errorMessage = 'Failed to update profile';
    
    if (error.response?.data) {
      errorMessage = error.response.data.message || 'Validation failed';
      
      // Include validation errors if present
      if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
        const validationErrors = error.response.data.errors.map(e => e.msg || e.message || e).join(', ');
        errorMessage = `${errorMessage}: ${validationErrors}`;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
};

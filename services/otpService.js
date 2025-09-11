// services/otpService.js
import axios from "axios";

const BASE_URL = "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net"; // Replace with your Firebase project ID

// Send OTP to email
export const sendOtp = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/sendOtp`, { email });
    return { success: true, message: response.data.message };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

// Verify OTP
export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(`${BASE_URL}/verifyOtp`, { email, otp });
    return { success: true, message: response.data.message };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

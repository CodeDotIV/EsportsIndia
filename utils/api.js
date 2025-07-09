import axios from 'axios';

const API_BASE_URL = 'https://esportsindia.onrender.com/api';  // ✅ Use Render URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const sendOtp = (phone, email) => api.post('/send-otp', { phone, email });
export const verifyOtp = (phone, otp) => api.post('/verify-otp', { phone, otp });
export const signup = (phone, name, email, password) => api.post('/register', { phone, name, email, password });
export const login = (email, password) => api.post('/login', { email, password });
export const forgotPassword = (email) => api.post('/forgot-password', { email });
export const resetPassword = (email, otp, newPassword) => api.post('/reset-password', { email, otp, newPassword });

export default api;

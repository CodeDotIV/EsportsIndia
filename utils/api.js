import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.73:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const sendOtp = (phone, email) => api.post('/send-otp', { phone, email });
export const verifyOtp = (phone, otp) => api.post('/verify-otp', { phone, otp });
export const registerUser = (phone, email, name, password) =>
  api.post('/register', { phone, email, name, password });
export const login = (email, password) => api.post('/login', { email, password });
export const forgotPassword = (email) => api.post('/forgot-password', { email });
export const resetPassword = (email, otp, newPassword) =>
  api.post('/reset-password', { email, otp, newPassword });
export const getUserByEmail = (email) => api.post('/get-user', { email });

export default api;
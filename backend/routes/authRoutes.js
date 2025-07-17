const express = require('express');
const {
  sendOtp,
  verifyOtp,
  registerWithPassword,
  login,
  forgotPassword,
  resetPassword,
  getUserByEmail
} = require('../controllers/authController');

const router = express.Router();

// 🔐 Auth Routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', registerWithPassword);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/get-user', getUserByEmail);  

module.exports = router;

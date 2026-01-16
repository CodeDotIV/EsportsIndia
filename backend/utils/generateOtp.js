import crypto from 'crypto';

// Generate random 6-digit OTP
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate random token for password reset
export const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

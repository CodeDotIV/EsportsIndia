import express from 'express';
import { body, validationResult } from 'express-validator';
import Otp from '../models/Otp.js';
import User from '../models/User.js';
import { generateOtp } from '../utils/generateOtp.js';
import { generateToken } from '../utils/generateToken.js';
import { sendOtpEmail } from '../utils/emailService.js';

const router = express.Router();

// Send OTP
router.post('/send', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('purpose').optional().isIn(['email_verification', 'password_reset', 'login'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email, purpose = 'email_verification' } = req.body;

    // Check if user exists (for password reset)
    if (purpose === 'password_reset') {
      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if user exists for security
        return res.json({ 
          success: true, 
          message: 'If email exists, OTP will be sent' 
        });
      }
    }

    // Generate OTP
    const otp = generateOtp();

    // Save OTP to database
    const otpDoc = new Otp({
      email,
      otp,
      purpose,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    await otpDoc.save();

    // Send email
    const emailResult = await sendOtpEmail(email, otp, purpose);

    if (emailResult.success) {
      res.json({ 
        success: true, 
        message: 'OTP sent successfully to your email' 
      });
    } else {
      // Delete OTP if email failed
      await Otp.deleteOne({ _id: otpDoc._id });
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send OTP email',
        error: emailResult.error 
      });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Verify OTP
router.post('/verify', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email, otp } = req.body;

    // Find OTP
    const otpDoc = await Otp.findOne({ 
      email, 
      otp, 
      verified: false,
      expiresAt: { $gt: Date.now() }
    }).sort({ createdAt: -1 });

    if (!otpDoc) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired OTP' 
      });
    }

    // Mark OTP as verified
    otpDoc.verified = true;
    await otpDoc.save();

    // Handle based on purpose
    let token = null;
    let userData = null;
    
    if (otpDoc.purpose === 'email_verification') {
      // Verify user email
      const user = await User.findOne({ email });
      if (user) {
        user.isEmailVerified = true;
        user.emailVerificationToken = null;
        await user.save();
        
        // Generate token using custom userId
        token = generateToken(user.userId || user._id);
        userData = {
          id: user.userId || user._id.toString(),
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified
        };
      }
    }

    res.json({ 
      success: true, 
      message: 'OTP verified successfully',
      token: token,
      user: userData
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

export default router;

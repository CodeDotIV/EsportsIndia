import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import { generateToken } from '../utils/generateToken.js';
import { generateResetToken, generateOtp } from '../utils/generateOtp.js';
import { generateUserId } from '../utils/generateUserId.js';
import { sendPasswordResetLink, sendOtpEmail } from '../utils/emailService.js';
import { authenticate } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

// Signup
router.post('/signup', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
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

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    // If user exists and is verified, reject signup
    if (existingUser && existingUser.isEmailVerified) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists. Please login instead.' 
      });
    }

    // Generate random profile data
    const randomAvatars = [
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' + name,
      'https://api.dicebear.com/7.x/personas/svg?seed=' + name,
      'https://api.dicebear.com/7.x/micah/svg?seed=' + name,
      'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=random&color=fff&size=200&bold=true'
    ];
    const randomAvatar = randomAvatars[Math.floor(Math.random() * randomAvatars.length)];
    
    const gamingPlatforms = ['PC', 'Mobile', 'Console', 'PC & Mobile', 'PC & Console', 'Mobile & Console', 'All Platforms'];
    const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
    const gameModes = ['Solo', 'Duo', 'Squad', 'Tournament', 'All'];
    const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];
    
    let user;
    
    // If user exists but not verified, update their info and resend OTP
    if (existingUser && !existingUser.isEmailVerified) {
      // Update existing unverified user
      existingUser.name = name;
      existingUser.password = password; // Update password (will be hashed by pre-save hook)
      existingUser.emailVerificationToken = crypto.randomBytes(32).toString('hex');
      existingUser.avatar = randomAvatar;
      existingUser.gamingPlatform = gamingPlatforms[Math.floor(Math.random() * gamingPlatforms.length)];
      existingUser.skillLevel = skillLevels[Math.floor(Math.random() * skillLevels.length)];
      existingUser.preferredGameMode = gameModes[Math.floor(Math.random() * gameModes.length)];
      existingUser.gender = genders[Math.floor(Math.random() * genders.length)];
      existingUser.language = 'English';
      
      await existingUser.save();
      user = existingUser;
    } else {
      // Create new user
      let retries = 0;
      const maxRetries = 5;
      
      while (retries < maxRetries) {
        try {
          // Generate userId explicitly before creating user
          const userId = await generateUserId(User);
          
          user = new User({
            userId, // Set userId explicitly
            name,
            email,
            password,
            emailVerificationToken: crypto.randomBytes(32).toString('hex'),
            avatar: randomAvatar,
            gamingPlatform: gamingPlatforms[Math.floor(Math.random() * gamingPlatforms.length)],
            skillLevel: skillLevels[Math.floor(Math.random() * skillLevels.length)],
            preferredGameMode: gameModes[Math.floor(Math.random() * gameModes.length)],
            gender: genders[Math.floor(Math.random() * genders.length)],
            language: 'English'
          });
          
          await user.save();
          break; // Success, exit loop
        } catch (error) {
          // If userId collision (duplicate key error), wait and retry
          if (error.code === 11000 && error.keyPattern?.userId) {
            retries++;
            if (retries >= maxRetries) {
              throw new Error('Failed to generate unique user ID. Please try again.');
            }
            // Wait 1 second before retry (to get new timestamp)
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            throw error; // Re-throw if it's a different error
          }
        }
      }
    }

    // Delete any existing unverified OTPs for this email
    await Otp.deleteMany({ 
      email, 
      purpose: 'email_verification',
      verified: false 
    });

    // Generate and send OTP for email verification
    const otp = generateOtp();
    const otpDoc = new Otp({
      email,
      otp,
      purpose: 'email_verification',
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    });
    await otpDoc.save();

    // Send OTP email
    const emailResult = await sendOtpEmail(email, otp, 'email_verification');
    
    if (!emailResult.success) {
      console.error('Failed to send OTP email:', emailResult.error);
      // Still return success but note email sending failed
    }

    const isExistingUser = existingUser && !existingUser.isEmailVerified;
    const message = isExistingUser 
      ? 'OTP resent to your email. Please verify your email with the new OTP.'
      : 'User created successfully. Please verify your email with OTP.';

    res.status(201).json({
      success: true,
      message: message,
      requiresVerification: true,
      user: {
        id: user.userId || user._id.toString(),
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during signup',
      error: error.message 
    });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
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

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Please verify your email before logging in. Check your inbox for OTP.',
        requiresVerification: true,
        email: user.email
      });
    }

    // Generate token using custom userId
    const token = generateToken(user.userId || user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.userId || user._id.toString(),
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login',
      error: error.message 
    });
  }
});

// Forgot Password
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
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

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ 
        success: true, 
        message: 'If email exists, password reset link will be sent' 
      });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email
    const emailResult = await sendPasswordResetLink(email, resetToken);
    
    if (emailResult.success) {
      res.json({ 
        success: true, 
        message: 'Password reset link sent to your email' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send reset email' 
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Reset Password
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
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

    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired reset token' 
      });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ 
      success: true, 
      message: 'Password reset successful' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get current user (protected route)
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Update user profile (protected route)
router.put('/profile', authenticate, [
  body('name').optional({ nullable: true, checkFalsy: true }).custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    const trimmed = String(value).trim();
    if (trimmed.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    return true;
  }),
  body('phone').optional({ nullable: true }).custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    return true;
  }),
  body('gender').optional({ nullable: true }).isIn(['Male', 'Female', 'Other', 'Prefer not to say', '']).withMessage('Invalid gender'),
  body('location').optional({ nullable: true }).custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    return true;
  }),
  body('bio').optional({ nullable: true }).custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    const trimmed = String(value).trim();
    if (trimmed.length > 500) {
      throw new Error('Bio cannot exceed 500 characters');
    }
    return true;
  }),
  body('dateOfBirth').optional().custom((value) => {
    if (!value || value === null || value === '') return true; // Allow null/empty
    // Check if it's a valid date string in YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      throw new Error('Date must be in YYYY-MM-DD format');
    }
    // Parse the date components
    const [year, month, day] = value.split('-').map(Number);
    // Validate date components
    if (year < 1900 || year > new Date().getFullYear()) {
      throw new Error('Year must be between 1900 and current year');
    }
    if (month < 1 || month > 12) {
      throw new Error('Month must be between 1 and 12');
    }
    if (day < 1 || day > 31) {
      throw new Error('Day must be between 1 and 31');
    }
    // Create date and validate it's actually valid
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
      throw new Error('Invalid date (e.g., February 30th doesn\'t exist)');
    }
    return true;
  }),
  body('avatar').optional({ nullable: true }).custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    // Check if it's a base64 data URL or regular URL
    if (typeof value === 'string' && (value.startsWith('data:image/') || value.startsWith('http://') || value.startsWith('https://'))) {
      return true;
    }
    // Allow empty string
    if (value === '') return true;
    throw new Error('Invalid avatar format. Must be a base64 data URL or HTTP/HTTPS URL.');
  }),
  body('gamingUsername').optional({ nullable: true }).custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    return true;
  }),
  body('favoriteGame').optional({ nullable: true }).custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    return true;
  }),
  body('gamingPlatform').optional({ nullable: true }).isIn(['PC', 'Mobile', 'Console', 'PC & Mobile', 'PC & Console', 'Mobile & Console', 'All Platforms', '']).withMessage('Invalid gaming platform'),
  body('skillLevel').optional({ nullable: true }).isIn(['Beginner', 'Intermediate', 'Advanced', 'Professional', '']).withMessage('Invalid skill level'),
  body('teamName').optional({ nullable: true }).custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    return true;
  }),
  body('yearsOfGaming').optional({ nullable: true }).custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    const num = parseInt(value);
    if (isNaN(num) || num < 0 || num > 100) {
      throw new Error('Years of gaming must be a number between 0 and 100');
    }
    return true;
  }),
  body('preferredGameMode').optional({ nullable: true }).isIn(['Solo', 'Duo', 'Squad', 'Tournament', 'All', '']).withMessage('Invalid preferred game mode'),
  body('country').optional({ nullable: true }).custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    return true;
  }),
  body('timezone').optional({ nullable: true }).custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    return true;
  }),
  body('language').optional({ nullable: true }).custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    return true;
  }),
  body('instagram').optional({ nullable: true }).custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    return true;
  }),
  body('twitter').optional({ nullable: true }).custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    return true;
  }),
  body('discord').optional({ nullable: true }).custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    return true;
  }),
  body('youtube').optional({ nullable: true }).custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    return true;
  }),
  body('twitch').optional({ nullable: true }).custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    return true;
  })
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

    const user = req.user;
    
    // Rate limiting: Check if user is updating too frequently
    const now = Date.now();
    const lastUpdateTime = user.lastProfileUpdate || 0;
    const timeSinceLastUpdate = now - lastUpdateTime;
    const MIN_UPDATE_INTERVAL_MS = 1000; // 1 second minimum between updates
    
    if (timeSinceLastUpdate < MIN_UPDATE_INTERVAL_MS) {
      return res.status(429).json({
        success: false,
        message: 'Please wait before updating your profile again. Too many requests.',
        retryAfter: Math.ceil((MIN_UPDATE_INTERVAL_MS - timeSinceLastUpdate) / 1000)
      });
    }
    
    // Update last update timestamp
    user.lastProfileUpdate = now;
    
    // Ensure userId exists before updating (for backward compatibility)
    if (!user.userId && user._id) {
      // Generate userId for old documents that don't have it
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      user.userId = `${year}${month}${day}${hours}${minutes}${seconds}`;
    }
    
    const {
      name,
      phone,
      gender,
      location,
      bio,
      dateOfBirth,
      gamingUsername,
      favoriteGame,
      gamingPlatform,
      skillLevel,
      teamName,
      yearsOfGaming,
      preferredGameMode,
      country,
      timezone,
      language,
      instagram,
      twitter,
      discord,
      youtube,
      twitch
    } = req.body;

    // Update only provided fields
    try {
      if (name !== undefined && name !== null) {
        const trimmedName = String(name).trim();
        if (trimmedName.length < 2) {
          return res.status(400).json({
            success: false,
            message: 'Name must be at least 2 characters'
          });
        }
        user.name = trimmedName;
      }
      
      if (phone !== undefined) user.phone = phone ? String(phone).trim() : '';
      if (gender !== undefined) user.gender = gender || '';
      if (location !== undefined) user.location = location ? String(location).trim() : '';
      if (bio !== undefined) {
        // Allow empty strings, null, or actual bio text
        if (bio === null || bio === undefined) {
          user.bio = '';
        } else {
          user.bio = String(bio).trim();
        }
      }
      
      if (dateOfBirth !== undefined) {
        // Convert date string to Date object if provided
        if (dateOfBirth && typeof dateOfBirth === 'string' && dateOfBirth.trim()) {
          const dateStr = dateOfBirth.trim();
          // Validate date format (YYYY-MM-DD)
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(dateStr)) {
            return res.status(400).json({
              success: false,
              message: 'Invalid date format. Use YYYY-MM-DD format (e.g., 1990-01-15).'
            });
          }
          // Parse and validate date components
          const [year, month, day] = dateStr.split('-').map(Number);
          if (year < 1900 || year > new Date().getFullYear()) {
            return res.status(400).json({
              success: false,
              message: 'Year must be between 1900 and current year.'
            });
          }
          if (month < 1 || month > 12) {
            return res.status(400).json({
              success: false,
              message: 'Month must be between 1 and 12.'
            });
          }
          if (day < 1 || day > 31) {
            return res.status(400).json({
              success: false,
              message: 'Day must be between 1 and 31.'
            });
          }
          // Create date and validate it's actually valid
          const date = new Date(year, month - 1, day);
          if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
            return res.status(400).json({
              success: false,
              message: 'Invalid date (e.g., February 30th doesn\'t exist).'
            });
          }
          user.dateOfBirth = date;
        } else {
          user.dateOfBirth = null;
        }
      }
      
      if (gamingUsername !== undefined) user.gamingUsername = gamingUsername ? String(gamingUsername).trim() : '';
      if (favoriteGame !== undefined) user.favoriteGame = favoriteGame ? String(favoriteGame).trim() : '';
      if (gamingPlatform !== undefined) user.gamingPlatform = gamingPlatform || '';
      if (skillLevel !== undefined) user.skillLevel = skillLevel || '';
      if (teamName !== undefined) user.teamName = teamName ? String(teamName).trim() : '';
      
      if (yearsOfGaming !== undefined) {
        // Handle null, empty string, or number
        if (yearsOfGaming === null || yearsOfGaming === '' || yearsOfGaming === undefined) {
          user.yearsOfGaming = null;
        } else {
          const years = parseInt(yearsOfGaming);
          if (!isNaN(years) && years >= 0 && years <= 100) {
            user.yearsOfGaming = years;
          } else {
            return res.status(400).json({
              success: false,
              message: 'Years of gaming must be a number between 0 and 100.'
            });
          }
        }
      }
      
    if (preferredGameMode !== undefined) user.preferredGameMode = preferredGameMode || '';
    if (country !== undefined) user.country = country ? String(country).trim() : '';
    if (timezone !== undefined) user.timezone = timezone ? String(timezone).trim() : '';
    if (language !== undefined) {
        // Default to 'English' if empty
        user.language = language && String(language).trim() ? String(language).trim() : 'English';
      }
      if (instagram !== undefined) user.instagram = instagram ? String(instagram).trim() : '';
      if (twitter !== undefined) user.twitter = twitter ? String(twitter).trim() : '';
      if (discord !== undefined) user.discord = discord ? String(discord).trim() : '';
      if (youtube !== undefined) user.youtube = youtube ? String(youtube).trim() : '';
      if (twitch !== undefined) user.twitch = twitch ? String(twitch).trim() : '';

      await user.save({ validateBeforeSave: true });
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      // Handle Mongoose validation errors
      if (saveError.name === 'ValidationError') {
        const errors = Object.values(saveError.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors
        });
      }
      throw saveError; // Re-throw to be caught by outer catch
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

export default router;

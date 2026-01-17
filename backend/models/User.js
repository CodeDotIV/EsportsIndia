import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { generateUserId } from '../utils/generateUserId.js';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
  // Profile fields
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say', ''],
    default: ''
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  avatar: {
    type: String,
    default: ''
  },
  gamingUsername: {
    type: String,
    trim: true,
    default: ''
  },
  favoriteGame: {
    type: String,
    trim: true,
    default: ''
  },
  gamingPlatform: {
    type: String,
    enum: ['PC', 'Mobile', 'Console', 'PC & Mobile', 'PC & Console', 'Mobile & Console', 'All Platforms', ''],
    default: ''
  },
  skillLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional', ''],
    default: ''
  },
  teamName: {
    type: String,
    trim: true,
    default: ''
  },
  yearsOfGaming: {
    type: Number,
    default: null
  },
  preferredGameMode: {
    type: String,
    enum: ['Solo', 'Duo', 'Squad', 'Tournament', 'All', ''],
    default: ''
  },
  country: {
    type: String,
    trim: true,
    default: ''
  },
  timezone: {
    type: String,
    trim: true,
    default: ''
  },
  language: {
    type: String,
    trim: true,
    default: 'English'
  },
  instagram: {
    type: String,
    trim: true,
    default: ''
  },
  twitter: {
    type: String,
    trim: true,
    default: ''
  },
  discord: {
    type: String,
    trim: true,
    default: ''
  },
  youtube: {
    type: String,
    trim: true,
    default: ''
  },
  twitch: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastProfileUpdate: {
    type: Date,
    default: null
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Generate custom userId before saving (if new user)
// Format: YYYYMMDDHHmmss (14 digits)
// Example: 20250114143025 (January 14, 2025 at 14:30:25)
userSchema.pre('save', function(next) {
  // Only generate userId for new documents
  if (this.isNew && !this.userId) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    this.userId = `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
  
  // Ensure userId is never undefined for existing documents
  // This can happen if userId was not selected in a query or document was created before userId field existed
  if (!this.isNew && (!this.userId || this.userId === undefined || this.userId === null)) {
    if (this._id) {
      // For existing documents without userId, generate one based on creation date or current time
      // Try to extract date from _id if it's ObjectId, otherwise use current time
      let baseDate = new Date();
      if (this._id && this._id.getTimestamp) {
        baseDate = this._id.getTimestamp();
      }
      const year = baseDate.getFullYear();
      const month = String(baseDate.getMonth() + 1).padStart(2, '0');
      const day = String(baseDate.getDate()).padStart(2, '0');
      const hours = String(baseDate.getHours()).padStart(2, '0');
      const minutes = String(baseDate.getMinutes()).padStart(2, '0');
      const seconds = String(baseDate.getSeconds()).padStart(2, '0');
      this.userId = `${year}${month}${day}${hours}${minutes}${seconds}`;
    }
  }
  
  // Update timestamp on every save
  if (this.isModified() || this.isNew) {
    this.updatedAt = Date.now();
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output and use userId as id
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  delete obj.emailVerificationToken;
  // Use userId as id in responses
  obj.id = obj.userId;
  delete obj.userId;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;

import { verifyToken } from '../utils/generateToken.js';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }

    // Find user by userId (custom ID) or _id (for backward compatibility)
    // IMPORTANT: Always select userId field to prevent it from being undefined
    let user = await User.findOne({ userId: decoded.userId }).select('-password');
    if (!user) {
      // Fallback to _id for backward compatibility
      user = await User.findById(decoded.userId).select('-password');
    }
    
    // Ensure userId exists (for backward compatibility with old documents)
    if (user && !user.userId && user._id) {
      // Generate userId for old documents that don't have it
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      user.userId = `${year}${month}${day}${hours}${minutes}${seconds}`;
      await user.save();
    }
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Authentication failed' 
    });
  }
};

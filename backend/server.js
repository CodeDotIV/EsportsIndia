import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.js';
import otpRoutes from './routes/otp.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

// Verify required environment variables
if (!process.env.MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not set in .env file');
  console.error('Please create a .env file in the backend directory with:');
  console.error('MONGODB_URI=mongodb+srv://noreplyesportsindia_db_user:2JFBXAP4HC1sYbDr@cluster0.tppbbdo.mongodb.net/esportsindia?retryWrites=true&w=majority&appName=Cluster0');
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8081',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// MongoDB Connection
const connectDB = async () => {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    // Set connection options
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      connectTimeoutMS: 10000, // 10 seconds
    };
    
    const conn = await mongoose.connect(mongoUri, options);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    if (error.message.includes('buffering timed out') || error.message.includes('Could not connect')) {
      console.error('\n🔴 IP WHITELIST ISSUE DETECTED');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('Your IP address is not whitelisted in MongoDB Atlas.');
      console.error('\n📋 To fix this:');
      console.error('1. Go to: https://cloud.mongodb.com/');
      console.error('2. Select your cluster → "Network Access"');
      console.error('3. Click "Add IP Address"');
      console.error('4. Click "Allow Access from Anywhere" (0.0.0.0/0) for development');
      console.error('   OR add your current IP address');
      console.error('5. Wait 1-2 minutes for changes to take effect');
      console.error('6. Restart the server');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } else {
      console.error('💡 Make sure your .env file contains MONGODB_URI');
      console.error('💡 Verify your MongoDB connection string is correct');
    }
    
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

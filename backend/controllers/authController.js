const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

const formatIST = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

exports.sendOtp = async (req, res) => {
  const { phone, email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your OTP for EsportsIndia',
      html: `<h2>Your OTP: <strong>${otp}</strong></h2>`
    });

    await User.findOneAndUpdate(
      { phone },
      { phone, email: email.trim().toLowerCase(), otp },
      { upsert: true, new: true }
    );

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('OTP Send Error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const user = await User.findOne({ phone, otp });
    if (!user) return res.status(401).json({ message: 'Invalid OTP' });

    const token = jwt.sign({ phone: user.phone }, process.env.JWT_SECRET, { expiresIn: '7d' });
    await User.updateOne({ phone }, { $unset: { otp: '' } });

    res.json({ token });
  } catch (error) {
    console.error('OTP Verify Error:', error);
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
};

exports.registerWithPassword = async (req, res) => {
  let { phone, email, password, name } = req.body;

  if (!phone || !password || !email || !name) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  email = email.trim().toLowerCase();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findOneAndUpdate(
      { phone },
      {
        $set: {
          email,
          name,
          password: hashedPassword,
          createdAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    const createdAtIST = formatIST(user.createdAt);

    res.json({
      message: 'Registered successfully',
      user: {
        name: user.name,
        phone: user.phone,
        email: user.email,
        createdAt: createdAtIST
      }
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    email = email.trim().toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (!user.password) {
      return res.status(400).json({ message: 'Password not set. Please complete registration first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset OTP',
      html: `<p>Your OTP: <strong>${otp}</strong></p>`
    });

    await User.findOneAndUpdate({ email: email.trim().toLowerCase() }, { otp });
    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase(), otp });
    if (!user) return res.status(400).json({ message: 'Invalid OTP' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email: email.trim().toLowerCase() }, { password: hashed, otp: null });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
};

exports.getUserByEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('-password -otp');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const createdAtIST = formatIST(user.createdAt);

    res.json({
      name: user.name || 'Not set',
      phone: user.phone || 'Not set',
      email: user.email,
      createdAt: createdAtIST
    });
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

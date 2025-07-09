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

// ✅ Send OTP
exports.sendOtp = async (req, res) => {
  const phone = req.body.phone?.trim();
  const email = req.body.email?.trim();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your OTP for EsportsIndia',
      html: `<h2>Your OTP: <strong>${otp}</strong></h2>`,
    });

    await User.findOneAndUpdate(
      { phone },
      { phone, email, otp },
      { upsert: true, new: true }
    );

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('OTP Send Error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// ✅ Verify OTP
exports.verifyOtp = async (req, res) => {
  const phone = req.body.phone?.trim();
  const otp = req.body.otp?.trim();

  try {
    const user = await User.findOne({ phone, otp });

    if (!user) return res.status(401).json({ message: 'Invalid OTP' });

    const token = jwt.sign({ phone: user.phone }, process.env.JWT_SECRET, { expiresIn: '7d' });

    await User.updateOne({ phone }, { $unset: { otp: "" } });

    res.json({ token });
  } catch (error) {
    console.error('OTP Verify Error:', error);
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
};

// ✅ Register with Password (Add Timestamp Here)
exports.registerWithPassword = async (req, res) => {
  const { phone, email, password, name } = req.body;
  if (!phone || !password) return res.status(400).json({ message: 'Phone and Password required' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.findOneAndUpdate(
    { phone },
    {
      password: hashedPassword,
      email,
      name,
      createdAt: new Date(),    // ✅ Set signup timestamp here
    },
    { upsert: true, new: true }
  );

  res.json({ message: 'Password set successfully', user });
};

// ✅ Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.json({ token });
};

// ✅ Forgot Password (Send OTP)
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset OTP',
      html: `<p>Your OTP: <strong>${otp}</strong></p>`,
    });

    await User.findOneAndUpdate({ email }, { otp });

    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// ✅ Reset Password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email, otp });

  if (!user) return res.status(400).json({ message: 'Invalid OTP' });

  const hashed = await bcrypt.hash(newPassword, 10);

  await User.updateOne({ email }, { password: hashed, otp: null });

  res.json({ message: 'Password reset successfully' });
};

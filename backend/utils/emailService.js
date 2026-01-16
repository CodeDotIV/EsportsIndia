import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service configuration error:', error);
  } else {
    console.log('✅ Email service ready');
  }
});

export const sendOtpEmail = async (email, otp, purpose = 'verification') => {
  try {
    const subject = purpose === 'password_reset' 
      ? 'Password Reset OTP - EsportsIndia'
      : 'Email Verification OTP - EsportsIndia';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">EsportsIndia</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">${purpose === 'password_reset' ? 'Password Reset' : 'Email Verification'}</h2>
          <p style="color: #666; font-size: 16px;">Your OTP code is:</p>
          <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #667eea; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 5 minutes.</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this code, please ignore this email.</p>
        </div>
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">© 2025 EsportsIndia. All Rights Reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `EsportsIndia <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    return { success: false, error: error.message };
  }
};

export const sendPasswordResetLink = async (email, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:8081'}/reset-password?token=${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">EsportsIndia</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p style="color: #666; font-size: 16px;">Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">Or copy this token and paste it in the app:</p>
          <p style="color: #667eea; font-size: 14px; word-break: break-all; font-weight: bold; padding: 10px; background: white; border-radius: 5px; margin: 10px 0;">${resetToken}</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">This token will expire in 1 hour.</p>
          <p style="color: #999; font-size: 11px; margin-top: 10px;">Note: Open the EsportsIndia app and navigate to Reset Password screen, then enter the token above.</p>
        </div>
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">© 2025 EsportsIndia. All Rights Reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `EsportsIndia <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset - EsportsIndia',
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    return { success: false, error: error.message };
  }
};

export default transporter;

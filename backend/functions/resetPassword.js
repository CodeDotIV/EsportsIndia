const nodemailer = require("nodemailer");
const admin = require("firebase-admin");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendResetPasswordLink = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Generate Firebase password reset link
    const link = await admin.auth().generatePasswordResetLink(email);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password",
      text: `Click this link to reset your password: ${link}`,
    });

    res.status(200).json({ message: "Password reset link sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send reset link" });
  }
};

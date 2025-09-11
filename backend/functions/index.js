const functions = require("firebase-functions");
const admin = require("firebase-admin");
require("dotenv").config();

admin.initializeApp();

// Import custom functions
const { sendOtp, verifyOtp } = require("./otpFunctions");
const { sendResetPasswordLink } = require("./resetPassword");

// Export as Firebase HTTPS functions
exports.sendOtp = functions.https.onRequest(sendOtp);
exports.verifyOtp = functions.https.onRequest(verifyOtp);
exports.resetPassword = functions.https.onRequest(sendResetPasswordLink);

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  phone: { type: String },
  email: { type: String },
  name: { type: String },
  password: { type: String },
  otp: { type: String },
  createdAt: { type: Date, default: Date.now }   // ✅ Add this line for timestamp
});

module.exports = mongoose.model('User', UserSchema);

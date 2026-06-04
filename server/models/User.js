const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    sparse: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    sparse: true,
    trim: true,
  },
  otp: {
    code: String,
    expiresAt: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

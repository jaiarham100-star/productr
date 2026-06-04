const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// POST /api/auth/login - Send OTP
router.post('/login', async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ message: 'Email or phone number is required' });
    }

    const isEmail = identifier.includes('@');
    const query = isEmail ? { email: identifier } : { phone: identifier };

    let user = await User.findOne(query);
    if (!user) {
      user = await User.create(isEmail ? { email: identifier } : { phone: identifier });
    }

    const otp = generateOTP();
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    };
    await user.save();

    // In production, send OTP via email/SMS
    // For dev, return it directly
    console.log(`OTP for ${identifier}: ${otp}`);

    res.json({
      message: 'OTP sent successfully',
      // Remove this in production:
      otp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    if (!identifier || !otp) {
      return res.status(400).json({ message: 'Identifier and OTP are required' });
    }

    const isEmail = identifier.includes('@');
    const query = isEmail ? { email: identifier } : { phone: identifier };
    const user = await User.findOne(query);

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.otp?.code) return res.status(400).json({ message: 'No OTP requested' });
    if (user.otp.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });
    if (user.otp.code !== otp.toString()) return res.status(400).json({ message: 'Invalid OTP' });

    user.otp = undefined;
    user.isVerified = true;
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'productr_secret_key',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, email: user.email, phone: user.phone } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/resend-otp
router.post('/resend-otp', async (req, res) => {
  try {
    const { identifier } = req.body;
    const isEmail = identifier.includes('@');
    const query = isEmail ? { email: identifier } : { phone: identifier };
    const user = await User.findOne(query);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    user.otp = { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
    await user.save();

    console.log(`Resent OTP for ${identifier}: ${otp}`);

    res.json({
      message: 'OTP resent',
      otp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

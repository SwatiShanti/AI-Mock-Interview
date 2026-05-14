/**
 * controllers/auth.controller.js — Auth endpoints
 * POST /api/auth/signup
 * POST /api/auth/login
 * GET  /api/auth/me
 */

const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// ── Register ──────────────────────────────────────────────
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill all fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        totalInterviews: user.totalInterviews,
        averageScore: user.averageScore,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Login ─────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Include password field for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        totalInterviews: user.totalInterviews,
        averageScore: user.averageScore,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Get Current User ──────────────────────────────────────
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

// ── Update Profile ────────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, getMe, updateProfile };

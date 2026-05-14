/**
 * routes/auth.routes.js — Authentication routes
 */

const express = require('express');
const router = express.Router();
const { signup, login, getMe, updateProfile } = require('../controllers/auth.controller');
const { protect } = require('../middleware/authMiddleware');
const { signupValidationRules, loginValidationRules, validate } = require('../utils/validators');

router.post('/signup', signupValidationRules(), validate, signup);
router.post('/login', loginValidationRules(), validate, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;

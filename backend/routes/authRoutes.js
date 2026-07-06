const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { auth } = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateUpdateProfile,
} = require('../middleware/validate');
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  googleLogin,
  googleCodeLogin,
  getPreferences,
  updatePreferences,
} = require('../controllers/authController');

// Strict limiter only for brute-force-sensitive routes (not Google OAuth — already protected by Google)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: 'Too many attempts from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/google', googleLogin);       // Google handles its own rate-limiting
router.post('/google/code', googleCodeLogin);
router.post('/logout', logout);
router.post('/forgot-password', authLimiter, validateForgotPassword, forgotPassword);
router.post('/reset-password', authLimiter, validateResetPassword, resetPassword);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, validateUpdateProfile, updateProfile);
router.get('/preferences', auth, getPreferences);
router.put('/preferences', auth, updatePreferences);

module.exports = router;

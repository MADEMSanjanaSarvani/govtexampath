const express = require('express');
const router = express.Router();
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

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/google', googleLogin);
router.post('/google/code', googleCodeLogin);
router.post('/logout', logout);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, validateUpdateProfile, updateProfile);
router.get('/preferences', auth, getPreferences);
router.put('/preferences', auth, updatePreferences);

module.exports = router;

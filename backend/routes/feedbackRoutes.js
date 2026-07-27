const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { auth, adminAuth } = require('../middleware/auth');
const { validateFeedback } = require('../middleware/validate');
const { submitFeedback, listFeedback, updateFeedbackStatus } = require('../controllers/feedbackController');

const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many feedback submissions, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', feedbackLimiter, validateFeedback, submitFeedback);

router.get('/', auth, adminAuth, listFeedback);
router.patch('/:id/status', auth, adminAuth, updateFeedbackStatus);

module.exports = router;

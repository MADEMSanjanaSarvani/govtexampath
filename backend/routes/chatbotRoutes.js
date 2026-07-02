const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { askChatbot } = require('../controllers/chatbotController');

const chatbotLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { success: false, error: 'Too many chatbot requests, please wait a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/ask', chatbotLimiter, askChatbot);

module.exports = router;

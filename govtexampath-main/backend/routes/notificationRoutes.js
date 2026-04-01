const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const { validateNotification } = require('../middleware/validate');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  sendNotification,
} = require('../controllers/notificationController');

// Protected routes (authenticated users)
router.get('/', auth, getNotifications);
router.get('/unread-count', auth, getUnreadCount);
router.put('/mark-all-read', auth, markAllAsRead); // Must be before /:id to avoid conflict
router.put('/:id/read', auth, markAsRead);

// Admin-only routes
router.post('/send', auth, adminAuth, validateNotification, sendNotification);

module.exports = router;

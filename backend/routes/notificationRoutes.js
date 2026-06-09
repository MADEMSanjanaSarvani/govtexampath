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
  registerFCMToken,
  removeFCMToken,
} = require('../controllers/notificationController');

// Protected routes (authenticated users)
router.get('/', auth, getNotifications);
router.get('/unread-count', auth, getUnreadCount);
router.put('/mark-all-read', auth, markAllAsRead);
router.put('/:id/read', auth, markAsRead);
router.post('/fcm-token', auth, registerFCMToken);
router.delete('/fcm-token', auth, removeFCMToken);

// Admin-only routes
router.post('/send', auth, adminAuth, validateNotification, sendNotification);

module.exports = router;

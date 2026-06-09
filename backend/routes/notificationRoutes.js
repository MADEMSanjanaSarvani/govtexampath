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
  updateNotification,
  deleteNotification,
  getAdminNotifications,
  getNotificationLogs,
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
router.get('/admin', auth, adminAuth, getAdminNotifications);
router.get('/admin/:id/logs', auth, adminAuth, getNotificationLogs);
router.post('/send', auth, adminAuth, validateNotification, sendNotification);
router.put('/admin/:id', auth, adminAuth, updateNotification);
router.delete('/admin/:id', auth, adminAuth, deleteNotification);

module.exports = router;

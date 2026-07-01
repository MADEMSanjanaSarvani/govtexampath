const Notification = require('../models/Notification');
const NotificationLog = require('../models/NotificationLog');
const User = require('../models/User');
const { getIO } = require('../config/socket');
const { sendToAllUsers, sendPushNotification } = require('../services/pushService');
const { sendNotificationEmail, buildNotificationEmailHTML } = require('../services/emailService');

const getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;
    const userId = req.user.id;
    const typeFilter = req.query.type;

    const now = new Date();
    const filter = {
      $or: [{ recipients: { $size: 0 } }, { recipients: userId }],
      isSent: true,
      $and: [
        { $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] },
      ],
    };

    if (typeFilter) filter.type = typeFilter;

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .populate('exam', 'title category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(filter),
    ]);

    const data = notifications.map((n) => ({
      ...n,
      isRead: (n.readBy || []).some((id) => id.toString() === userId.toString()),
    }));

    res.status(200).json({
      success: true,
      data: {
        notifications: data,
        pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    console.error('Get notifications error:', error.message);
    res.status(500).json({ success: false, error: 'Server error fetching notifications.' });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    const count = await Notification.countDocuments({
      $or: [{ recipients: { $size: 0 } }, { recipients: userId }],
      readBy: { $ne: userId },
      isSent: true,
      $and: [{ $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] }],
    });

    res.status(200).json({ success: true, data: { unreadCount: count } });
  } catch (error) {
    console.error('Get unread count error:', error.message);
    res.status(500).json({ success: false, error: 'Server error fetching unread count.' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found.' });
    }

    const userId = req.user.id;
    if (!notification.readBy.some((id) => id.toString() === userId.toString())) {
      notification.readBy.push(userId);
      await notification.save();
    }

    res.status(200).json({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    console.error('Mark as read error:', error.message);
    res.status(500).json({ success: false, error: 'Server error marking notification as read.' });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notification.updateMany(
      {
        $or: [{ recipients: { $size: 0 } }, { recipients: userId }],
        readBy: { $ne: userId },
        isSent: true,
      },
      { $addToSet: { readBy: userId } }
    );
    res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    console.error('Mark all as read error:', error.message);
    res.status(500).json({ success: false, error: 'Server error marking all notifications as read.' });
  }
};

const sendNotification = async (req, res) => {
  try {
    const {
      title, message, type, recipients, examId,
      targetAudience, department, year, priority,
      scheduledAt, sendEmail, expiresAt,
    } = req.body;

    const isScheduled = scheduledAt && new Date(scheduledAt) > new Date();

    const notification = await Notification.create({
      title,
      message,
      type: type || 'general',
      recipients: recipients || [],
      exam: examId || null,
      targetAudience: targetAudience || 'all',
      department: department || null,
      year: year || null,
      priority: priority || 'normal',
      scheduledAt: scheduledAt || null,
      isScheduled,
      isSent: !isScheduled,
      sendEmail: sendEmail || false,
      expiresAt: expiresAt || null,
      createdBy: req.user.id,
    });

    if (isScheduled) {
      return res.status(201).json({
        success: true,
        data: notification,
        message: `Notification scheduled for ${new Date(scheduledAt).toLocaleString()}.`,
      });
    }

    // Socket broadcast
    try {
      const io = getIO();
      io.emit('new_notification', notification);
      await NotificationLog.create({
        notification: notification._id,
        channel: 'socket',
        recipientCount: 1,
        successCount: 1,
        status: 'sent',
      });
    } catch (socketError) {
      console.error('Socket emit error:', socketError.message);
    }

    // FCM push
    try {
      const pushData = { type: type || 'general', notificationId: notification._id.toString() };
      if (recipients && recipients.length > 0) {
        const users = await User.find({
          _id: { $in: recipients },
          'fcmTokens.0': { $exists: true },
        }).select('fcmTokens');
        const tokens = users.flatMap((u) => u.fcmTokens.map((t) => t.token));
        if (tokens.length > 0) {
          const result = await sendPushNotification(tokens, title, message, pushData);
          await NotificationLog.create({
            notification: notification._id,
            channel: 'push',
            recipientCount: tokens.length,
            successCount: result.success,
            failureCount: result.failure,
            status: result.failure === 0 ? 'sent' : result.success === 0 ? 'failed' : 'partial',
          });
        }
      } else {
        await sendToAllUsers(User, title, message, pushData);
      }
    } catch (pushError) {
      console.error('Push notification error:', pushError.message);
    }

    // Email notification (respects email opt-out)
    if (sendEmail) {
      try {
        const emailFilter = { 'notificationPreferences.emailNotifications': { $ne: false } };
        let emailUsers;
        if (recipients && recipients.length > 0) {
          emailUsers = await User.find({ _id: { $in: recipients }, ...emailFilter }).select('email name');
        } else {
          emailUsers = await User.find(emailFilter).select('email name');
        }
        const htmlFn = (email) => buildNotificationEmailHTML(title, message, type || 'general', email);
        const result = await sendNotificationEmail(emailUsers, `GovtExamPath: ${title}`, htmlFn);
        await NotificationLog.create({
          notification: notification._id,
          channel: 'email',
          recipientCount: emailUsers.length,
          successCount: result.success,
          failureCount: result.failure,
          status: result.failure === 0 ? 'sent' : result.success === 0 ? 'failed' : 'partial',
        });
      } catch (emailError) {
        console.error('Email notification error:', emailError.message);
      }
    }

    res.status(201).json({
      success: true,
      data: notification,
      message: 'Notification sent successfully.',
    });
  } catch (error) {
    console.error('Send notification error:', error.message);
    res.status(500).json({ success: false, error: 'Server error sending notification.' });
  }
};

const updateNotification = async (req, res) => {
  try {
    const { title, message, type, priority, scheduledAt, expiresAt, targetAudience, sendEmail } = req.body;
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found.' });
    }

    if (notification.isSent && !notification.isScheduled) {
      return res.status(400).json({ success: false, error: 'Cannot edit a notification that has already been sent.' });
    }

    if (title) notification.title = title;
    if (message) notification.message = message;
    if (type) notification.type = type;
    if (priority) notification.priority = priority;
    if (targetAudience) notification.targetAudience = targetAudience;
    if (sendEmail !== undefined) notification.sendEmail = sendEmail;
    if (expiresAt !== undefined) notification.expiresAt = expiresAt;
    if (scheduledAt) {
      notification.scheduledAt = scheduledAt;
      notification.isScheduled = new Date(scheduledAt) > new Date();
      notification.isSent = !notification.isScheduled;
    }
    await notification.save();
    res.status(200).json({ success: true, data: notification, message: 'Notification updated.' });
  } catch (error) {
    console.error('Update notification error:', error.message);
    res.status(500).json({ success: false, error: 'Server error updating notification.' });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found.' });
    }
    await NotificationLog.deleteMany({ notification: req.params.id });
    res.status(200).json({ success: true, message: 'Notification deleted.' });
  } catch (error) {
    console.error('Delete notification error:', error.message);
    res.status(500).json({ success: false, error: 'Server error deleting notification.' });
  }
};

const getAdminNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;
    const typeFilter = req.query.type;
    const statusFilter = req.query.status;

    const filter = {};
    if (typeFilter) filter.type = typeFilter;
    if (statusFilter === 'scheduled') { filter.isScheduled = true; filter.isSent = false; }
    if (statusFilter === 'sent') filter.isSent = true;

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        notifications,
        pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    console.error('Admin get notifications error:', error.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

const getNotificationLogs = async (req, res) => {
  try {
    const logs = await NotificationLog.find({ notification: req.params.id })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error('Get logs error:', error.message);
    res.status(500).json({ success: false, error: 'Server error fetching logs.' });
  }
};

const registerFCMToken = async (req, res) => {
  try {
    const { token, device } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, error: 'FCM token is required.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    const existing = user.fcmTokens.find((t) => t.token === token);
    if (!existing) {
      user.fcmTokens.push({ token, device: device || 'android' });
      await user.save();
    }

    res.status(200).json({ success: true, message: 'FCM token registered.' });
  } catch (error) {
    console.error('Register FCM token error:', error.message);
    res.status(500).json({ success: false, error: 'Server error registering token.' });
  }
};

const removeFCMToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, error: 'FCM token is required.' });
    }
    await User.findByIdAndUpdate(req.user.id, { $pull: { fcmTokens: { token } } });
    res.status(200).json({ success: true, message: 'FCM token removed.' });
  } catch (error) {
    console.error('Remove FCM token error:', error.message);
    res.status(500).json({ success: false, error: 'Server error removing token.' });
  }
};

const registerWebPushSubscription = async (req, res) => {
  try {
    const { subscription } = req.body;
    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return res.status(400).json({ success: false, error: 'Valid push subscription is required.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    const exists = user.webPushSubscriptions.some(
      (s) => s.subscription.endpoint === subscription.endpoint
    );
    if (!exists) {
      user.webPushSubscriptions.push({ subscription });
      await user.save();
    }

    res.status(200).json({ success: true, message: 'Web push subscription registered.' });
  } catch (error) {
    console.error('Register web push error:', error.message);
    res.status(500).json({ success: false, error: 'Server error registering subscription.' });
  }
};

const removeWebPushSubscription = async (req, res) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) {
      return res.status(400).json({ success: false, error: 'Subscription endpoint is required.' });
    }
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { webPushSubscriptions: { 'subscription.endpoint': endpoint } },
    });
    res.status(200).json({ success: true, message: 'Web push subscription removed.' });
  } catch (error) {
    console.error('Remove web push error:', error.message);
    res.status(500).json({ success: false, error: 'Server error removing subscription.' });
  }
};

const getVapidKey = async (req, res) => {
  try {
    const { getVapidPublicKey } = require('../services/webPushService');
    const key = getVapidPublicKey();
    if (!key) {
      return res.status(503).json({ success: false, error: 'Web push not configured.' });
    }
    res.status(200).json({ success: true, data: { vapidPublicKey: key } });
  } catch (error) {
    console.error('Get VAPID key error:', error.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

const generateUnsubscribeToken = (email) => {
  const crypto = require('crypto');
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return crypto.createHmac('sha256', secret).update(email).digest('hex');
};

const emailUnsubscribe = async (req, res) => {
  try {
    const { email, token } = req.query;
    if (!email || !token) {
      return res.status(400).send('<html><body><h2>Invalid unsubscribe link.</h2></body></html>');
    }

    const expectedToken = generateUnsubscribeToken(email);
    if (!expectedToken || token !== expectedToken) {
      return res.status(403).send('<html><body><h2>Invalid unsubscribe link.</h2></body></html>');
    }

    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { 'notificationPreferences.emailNotifications': false } }
    );

    res.status(200).send(`<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Arial,sans-serif;text-align:center;padding:60px 20px;background:#f3f4f6">
  <div style="max-width:400px;margin:0 auto;background:white;padding:40px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
    <h2 style="color:#059669;margin:0 0 16px">Unsubscribed Successfully</h2>
    <p style="color:#4b5563;line-height:1.6">You will no longer receive email notifications from GovtExamPath.</p>
    <p style="color:#9ca3af;font-size:13px;margin-top:24px">You can re-enable email notifications from your account settings.</p>
  </div>
</body></html>`);
  } catch (error) {
    console.error('Unsubscribe error:', error.message);
    res.status(500).send('<html><body><h2>Something went wrong. Please try again.</h2></body></html>');
  }
};

module.exports = {
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
  registerWebPushSubscription,
  removeWebPushSubscription,
  getVapidKey,
  emailUnsubscribe,
  generateUnsubscribeToken,
};

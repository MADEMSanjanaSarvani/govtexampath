const Notification = require('../models/Notification');
const NotificationLog = require('../models/NotificationLog');
const User = require('../models/User');
const { getIO } = require('../config/socket');
const { sendToAllUsers, sendPushNotification } = require('../services/pushService');
const { sendNotificationEmail, buildNotificationEmailHTML } = require('../services/emailService');

const getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
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
        .limit(limit),
      Notification.countDocuments(filter),
    ]);

    const data = notifications.map((n) => {
      const obj = n.toObject();
      obj.isRead = n.readBy.some((id) => id.toString() === userId.toString());
      return obj;
    });

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

    // Email notification
    if (sendEmail) {
      try {
        let emailUsers;
        if (recipients && recipients.length > 0) {
          emailUsers = await User.find({ _id: { $in: recipients } }).select('email name');
        } else {
          emailUsers = await User.find({}).select('email name');
        }
        const html = buildNotificationEmailHTML(title, message, type || 'general');
        const result = await sendNotificationEmail(emailUsers, `GovtExamPath: ${title}`, html);
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
    notification.updatedAt = new Date();

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
    const limit = parseInt(req.query.limit, 10) || 20;
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
};

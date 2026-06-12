const Notification = require('../models/Notification');
const NotificationLog = require('../models/NotificationLog');
const User = require('../models/User');
const { getIO } = require('../config/socket');
const { sendToAllUsers, sendPushNotification } = require('./pushService');
const { sendNotificationEmail, buildNotificationEmailHTML } = require('./emailService');

let schedulerInterval = null;

const processScheduledNotifications = async () => {
  try {
    const now = new Date();
    // Process both scheduled notifications (due now) and immediate unsent notifications
    const pendingNotifications = await Notification.find({
      isSent: false,
      $or: [
        { isScheduled: true, scheduledAt: { $lte: now } },
        { isScheduled: false, createdAt: { $gte: new Date(now.getTime() - 10 * 60 * 1000) } },
      ],
    });

    for (const notification of pendingNotifications) {
      try {
        // Mark as sent
        notification.isSent = true;
        notification.isScheduled = false;
        await notification.save();

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
        } catch (err) {
          console.error('Scheduled socket emit error:', err.message);
        }

        // FCM push
        try {
          if (notification.recipients && notification.recipients.length > 0) {
            const users = await User.find({
              _id: { $in: notification.recipients },
              'fcmTokens.0': { $exists: true },
            }).select('fcmTokens');
            const tokens = users.flatMap((u) => u.fcmTokens.map((t) => t.token));
            if (tokens.length > 0) {
              const result = await sendPushNotification(tokens, notification.title, notification.message, {
                type: notification.type,
                notificationId: notification._id.toString(),
              });
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
            await sendToAllUsers(User, notification.title, notification.message, {
              type: notification.type,
              notificationId: notification._id.toString(),
            });
          }
        } catch (err) {
          console.error('Scheduled push error:', err.message);
        }

        // Email notification
        if (notification.sendEmail) {
          try {
            let users;
            if (notification.recipients && notification.recipients.length > 0) {
              users = await User.find({ _id: { $in: notification.recipients } }).select('email name');
            } else {
              users = await User.find({}).select('email name');
            }
            const html = buildNotificationEmailHTML(notification.title, notification.message, notification.type);
            const result = await sendNotificationEmail(users, `GovtExamPath: ${notification.title}`, html);
            await NotificationLog.create({
              notification: notification._id,
              channel: 'email',
              recipientCount: users.length,
              successCount: result.success,
              failureCount: result.failure,
              status: result.failure === 0 ? 'sent' : result.success === 0 ? 'failed' : 'partial',
            });
          } catch (err) {
            console.error('Scheduled email error:', err.message);
          }
        }

        console.log(`Scheduled notification sent: ${notification.title}`);
      } catch (err) {
        console.error(`Error processing notification ${notification._id}:`, err.message);
      }
    }

    // Clean up expired notifications
    await Notification.deleteMany({
      expiresAt: { $ne: null, $lt: now },
    });
  } catch (err) {
    console.error('Scheduler error:', err.message);
  }
};

const startScheduler = () => {
  if (schedulerInterval) return;
  schedulerInterval = setInterval(processScheduledNotifications, 60 * 1000);
  console.log('Notification scheduler started (checks every 60s)');
};

const stopScheduler = () => {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
};

module.exports = { startScheduler, stopScheduler, processScheduledNotifications };

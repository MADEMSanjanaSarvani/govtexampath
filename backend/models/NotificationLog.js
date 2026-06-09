const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema({
  notification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification',
    required: true,
  },
  channel: {
    type: String,
    enum: ['socket', 'push', 'email'],
    required: true,
  },
  recipientCount: {
    type: Number,
    default: 0,
  },
  successCount: {
    type: Number,
    default: 0,
  },
  failureCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['sent', 'failed', 'partial'],
    default: 'sent',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

notificationLogSchema.index({ notification: 1 });
notificationLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('NotificationLog', notificationLogSchema);

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    default: null,
  },
  recipients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  readBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  type: {
    type: String,
    enum: [
      'exam_schedule',
      'hall_ticket',
      'result',
      'assignment',
      'fee_reminder',
      'placement',
      'announcement',
      'new_exam',
      'update',
      'reminder',
      'general',
    ],
    default: 'general',
  },
  targetAudience: {
    type: String,
    enum: ['all', 'department', 'year', 'individual'],
    default: 'all',
  },
  department: {
    type: String,
    default: null,
  },
  year: {
    type: String,
    default: null,
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
  },
  scheduledAt: {
    type: Date,
    default: null,
  },
  isScheduled: {
    type: Boolean,
    default: false,
  },
  isSent: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  sendEmail: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

notificationSchema.index({ scheduledAt: 1, isSent: 1 });
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

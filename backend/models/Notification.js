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
    enum: ['exam_schedule', 'hall_ticket', 'result', 'assignment', 'fee_reminder', 'placement', 'announcement', 'new_exam', 'update', 'reminder', 'general'],
    default: 'general',
  },
  isScheduled: {
    type: Boolean,
    default: false,
  },
  isSent: {
    type: Boolean,
    default: false,
  },
  scheduledAt: {
    type: Date,
    default: null,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  sendEmail: {
    type: Boolean,
    default: false,
  },
  targetAudience: {
    type: String,
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
});

notificationSchema.index({ isSent: 1, createdAt: -1 });
notificationSchema.index({ recipients: 1, isSent: 1 });
notificationSchema.index({ expiresAt: 1 }, { sparse: true });

module.exports = mongoose.model('Notification', notificationSchema);

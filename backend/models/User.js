const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  googleId: {
    type: String,
    sparse: true,
  },
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
    },
  ],
  avatar: {
    type: String,
    default: '',
  },
  fcmTokens: [{
    token: { type: String, required: true },
    device: { type: String, default: 'android' },
    createdAt: { type: Date, default: Date.now },
  }],
  webPushSubscriptions: [{
    subscription: {
      endpoint: { type: String, required: true },
      keys: {
        p256dh: { type: String, required: true },
        auth: { type: String, required: true },
      },
    },
    createdAt: { type: Date, default: Date.now },
  }],
  notificationPreferences: {
    examDates: { type: Boolean, default: true },
    results: { type: Boolean, default: true },
    admitCards: { type: Boolean, default: true },
    currentAffairs: { type: Boolean, default: true },
    general: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
  },
  passwordChangedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.index({ googleId: 1 }, { sparse: true });

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);

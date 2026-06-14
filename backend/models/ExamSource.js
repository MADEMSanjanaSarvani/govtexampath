const mongoose = require('mongoose');

const examSourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  conductingBody: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: [
      'SSC', 'UPSC', 'Banking', 'Railways', 'State PSC', 'Defence',
      'Teaching', 'Police', 'Insurance', 'Regulatory Bodies', 'PSU',
      'Judiciary', 'Agriculture', 'Postal', 'Healthcare', 'Miscellaneous',
    ],
    required: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  selector: {
    type: String,
    default: 'body',
  },
  lastContentHash: {
    type: String,
    default: '',
  },
  lastChecked: {
    type: Date,
    default: null,
  },
  lastChanged: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  checkIntervalHours: {
    type: Number,
    default: 6,
  },
  jsRendered: {
    type: Boolean,
    default: false,
  },
  consecutiveFailures: {
    type: Number,
    default: 0,
  },
  lastError: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

examSourceSchema.index({ isActive: 1, lastChecked: 1 });

module.exports = mongoose.model('ExamSource', examSourceSchema);

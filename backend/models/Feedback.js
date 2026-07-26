const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  subject: {
    type: String,
    enum: ['general', 'exam-info', 'eligibility', 'bug', 'feature', 'feedback'],
    default: 'general',
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: 5000,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  status: {
    type: String,
    enum: ['new', 'reviewed', 'resolved'],
    default: 'new',
  },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);

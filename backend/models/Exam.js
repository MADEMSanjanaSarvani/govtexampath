const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [300, 'Title cannot exceed 300 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'SSC',
      'UPSC',
      'Banking',
      'Railways',
      'State_PSC',
      'GATE',
      'APPSC',
      'TSPSC',
      'Defence',
      'Teaching',
      'Other',
    ],
  },
  eligibility: {
    type: String,
    default: '',
  },
  applicationLink: {
    type: String,
    default: '',
  },
  lastDate: {
    type: Date,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  importantDates: [
    {
      event: { type: String },
      date: { type: Date },
    },
  ],
  salary: {
    type: String,
    default: '',
  },
  ageLimit: {
    type: String,
    default: '',
  },
  applicationFee: {
    type: String,
    default: '',
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Text index for search functionality
examSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Exam', examSchema);

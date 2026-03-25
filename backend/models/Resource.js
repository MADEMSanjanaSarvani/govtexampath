const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [300, 'Title cannot exceed 300 characters'],
  },
  description: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    required: [true, 'Resource type is required'],
    enum: ['notes', 'pyq', 'books', 'syllabus'],
  },
  examCategory: {
    type: String,
    required: [true, 'Exam category is required'],
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
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
  },
  fileUrl: {
    type: String,
    default: '',
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Resource', resourceSchema);

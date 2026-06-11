const mongoose = require('mongoose');

const updateLogSchema = new mongoose.Schema({
  source: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamSource',
    required: true,
  },
  type: {
    type: String,
    enum: ['change_detected', 'exam_updated', 'exam_created', 'error', 'no_change'],
    required: true,
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    default: null,
  },
  details: {
    type: String,
    default: '',
  },
  changes: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

updateLogSchema.index({ createdAt: -1 });
updateLogSchema.index({ source: 1, createdAt: -1 });

module.exports = mongoose.model('UpdateLog', updateLogSchema);

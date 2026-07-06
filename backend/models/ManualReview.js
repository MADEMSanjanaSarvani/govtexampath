const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  field: String,
  currentValue: mongoose.Schema.Types.Mixed,
  suggestedValue: mongoose.Schema.Types.Mixed,
  reason: String,
}, { _id: false });

const manualReviewSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  examTitle: { type: String, required: true },
  issueType: {
    type: String,
    enum: ['past_deadline_open', 'date_logic_error', 'suspicious_date', 'wrong_status', 'missing_dates', 'other'],
    required: true,
  },
  issues: [String],
  suggestions: [suggestionSchema],
  confidence: { type: String, enum: ['medium', 'low'], default: 'medium' },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'auto_resolved'],
    default: 'pending',
  },
  runId: String,
  createdAt: { type: Date, default: Date.now },
  resolvedAt: Date,
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String,
});

manualReviewSchema.index({ status: 1, createdAt: -1 });
manualReviewSchema.index({ exam: 1, status: 1 });

module.exports = mongoose.model('ManualReview', manualReviewSchema);

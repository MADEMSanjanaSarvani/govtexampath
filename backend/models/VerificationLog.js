const mongoose = require('mongoose');

const changeSchema = new mongoose.Schema({
  field: String,
  oldValue: mongoose.Schema.Types.Mixed,
  newValue: mongoose.Schema.Types.Mixed,
}, { _id: false });

const verificationLogSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  examTitle: { type: String, required: true },
  runId: { type: String, required: true },
  issueType: {
    type: String,
    enum: ['past_deadline_open', 'future_deadline_closed', 'date_logic_error', 'suspicious_date', 'wrong_status', 'missing_dates', 'none'],
    required: true,
  },
  issues: [String],
  changes: [changeSchema],
  confidence: { type: String, enum: ['high', 'medium', 'low'], default: 'high' },
  source: { type: String, default: 'rule-based' },
  action: {
    type: String,
    enum: ['auto_fixed', 'queued_for_review', 'no_action'],
    required: true,
  },
  reason: String,
  timestamp: { type: Date, default: Date.now },
});

verificationLogSchema.index({ runId: 1 });
verificationLogSchema.index({ timestamp: -1 });
verificationLogSchema.index({ exam: 1, timestamp: -1 });
verificationLogSchema.index({ action: 1 });

module.exports = mongoose.model('VerificationLog', verificationLogSchema);

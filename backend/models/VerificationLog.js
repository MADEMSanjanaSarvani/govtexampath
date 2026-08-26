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
    // Must stay a superset of ManualReview's issueType enum. Approving a review
    // copies its issueType straight into a log here (examCorrectionService), so
    // any value this list is missing makes that approval throw. field_update,
    // new_exam_candidate and other were missing, and field_update is the value
    // safeExamUpdate assigns to every critical-field review the official-source
    // verifier queues -- so in practice approvals failed on the common path.
    enum: [
      'past_deadline_open', 'future_deadline_closed', 'date_logic_error',
      'suspicious_date', 'wrong_status', 'missing_dates', 'none',
      'field_update', 'new_exam_candidate', 'other',
    ],
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

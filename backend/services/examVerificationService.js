const crypto = require('crypto');
const Exam = require('../models/Exam');
const VerificationLog = require('../models/VerificationLog');
const ManualReview = require('../models/ManualReview');

// ── Helpers ────────────────────────────────────────────────────────────────────

function makeRunId() {
  return `vrun-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
}

function todayMidnight() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function dateStr(d) {
  return d ? new Date(d).toISOString().split('T')[0] : 'none';
}

// ── Rule-based checks ──────────────────────────────────────────────────────────

function checkExam(exam, today) {
  const issues = [];
  const fixes = {};
  let issueType = 'none';
  let confidence = 'high';

  const lastDate = exam.lastDate ? new Date(exam.lastDate) : null;
  const appStart = exam.applicationStartDate ? new Date(exam.applicationStartDate) : null;
  const twoYearsOut = new Date(today);
  twoYearsOut.setFullYear(twoYearsOut.getFullYear() + 2);

  // Rule 1: Past deadline but not closed (high-confidence auto-fix)
  if (lastDate && lastDate < today && exam.dateStatus !== 'closed') {
    issues.push(`lastDate ${dateStr(lastDate)} is past but dateStatus is '${exam.dateStatus}'`);
    fixes.dateStatus = 'closed';
    issueType = 'past_deadline_open';
    confidence = 'high';
  }

  // Rule 2: applicationStartDate is after lastDate (date logic error)
  if (appStart && lastDate && appStart > lastDate && lastDate >= today) {
    issues.push(`applicationStartDate (${dateStr(appStart)}) is after lastDate (${dateStr(lastDate)})`);
    issueType = 'date_logic_error';
    confidence = 'medium';
  }

  // Rule 3: lastDate far in the future (>2 years) — possible bad data
  if (lastDate && lastDate > twoYearsOut) {
    issues.push(`lastDate ${dateStr(lastDate)} is more than 2 years in the future`);
    issueType = 'suspicious_date';
    confidence = 'low';
  }

  // Rule 4: examDate before today but dateStatus is 'confirmed'/'tentative'
  // (exam has happened but application window might still be open — skip, let Rule 1 handle)

  return { issues, fixes, issueType, confidence };
}

// ── Main verification run ──────────────────────────────────────────────────────

async function runVerification() {
  const runId = makeRunId();
  const today = todayMidnight();

  console.log(`[Verification] Starting run ${runId}`);

  const exams = await Exam.find({ isActive: true }, {
    _id: 1, title: 1, lastDate: 1, applicationStartDate: 1, dateStatus: 1,
  }).lean();

  const stats = { runId, scanned: exams.length, autoFixed: 0, queued: 0, clean: 0 };
  const logs = [];
  const bulkUpdates = [];
  const manualItems = [];

  for (const exam of exams) {
    const { issues, fixes, issueType, confidence } = checkExam(exam, today);

    if (issues.length === 0) {
      stats.clean++;
      continue;
    }

    const changes = Object.entries(fixes).map(([field, newValue]) => ({
      field,
      oldValue: exam[field],
      newValue,
    }));

    if (confidence === 'high' && Object.keys(fixes).length > 0) {
      // Auto-fix
      bulkUpdates.push({ filter: { _id: exam._id }, update: { $set: fixes } });
      stats.autoFixed++;
      logs.push({
        exam: exam._id,
        examTitle: exam.title,
        runId,
        issueType,
        issues,
        changes,
        confidence: 'high',
        source: 'rule-based',
        action: 'auto_fixed',
        reason: `Auto-fixed: ${issues.join('; ')}`,
      });
    } else {
      // Queue for manual review (only if no pending review already exists)
      manualItems.push({ exam, issues, issueType, confidence, fixes });
      stats.queued++;
      logs.push({
        exam: exam._id,
        examTitle: exam.title,
        runId,
        issueType,
        issues,
        changes: [],
        confidence,
        source: 'rule-based',
        action: 'queued_for_review',
        reason: issues.join('; '),
      });
    }
  }

  // Apply DB fixes
  if (bulkUpdates.length > 0) {
    await Promise.all(
      bulkUpdates.map(({ filter, update }) => Exam.updateOne(filter, update))
    );
    // Auto-resolve any pending review for auto-fixed exams
    const fixedIds = bulkUpdates.map(u => u.filter._id);
    await ManualReview.updateMany(
      { exam: { $in: fixedIds }, status: 'pending' },
      { $set: { status: 'auto_resolved', resolvedAt: new Date(), notes: 'Auto-resolved by rule-based verification' } }
    );
  }

  // Create manual review entries (skip duplicates)
  if (manualItems.length > 0) {
    for (const { exam, issues, issueType, confidence, fixes } of manualItems) {
      const existing = await ManualReview.findOne({ exam: exam._id, status: 'pending' });
      if (!existing) {
        await ManualReview.create({
          exam: exam._id,
          examTitle: exam.title,
          issueType,
          issues,
          suggestions: Object.entries(fixes).map(([field, suggestedValue]) => ({
            field,
            currentValue: exam[field],
            suggestedValue,
          })),
          confidence,
          runId,
        });
      }
    }
  }

  // Persist logs
  if (logs.length > 0) {
    await VerificationLog.insertMany(logs);
  }

  console.log(
    `[Verification] Run ${runId} done — ${stats.scanned} scanned, ` +
    `${stats.autoFixed} auto-fixed, ${stats.queued} queued, ${stats.clean} clean`
  );
  return stats;
}

// ── Recent stats helper ────────────────────────────────────────────────────────

async function getVerificationStats() {
  const [totalLogs, pendingReviews, recentAutoFixed, lastRun] = await Promise.all([
    VerificationLog.countDocuments(),
    ManualReview.countDocuments({ status: 'pending' }),
    VerificationLog.countDocuments({
      action: 'auto_fixed',
      timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }),
    VerificationLog.findOne({}, { runId: 1, timestamp: 1 }).sort({ timestamp: -1 }).lean(),
  ]);

  return {
    totalLogs,
    pendingReviews,
    recentAutoFixed,
    lastRunAt: lastRun?.timestamp || null,
    lastRunId: lastRun?.runId || null,
  };
}

module.exports = { runVerification, getVerificationStats };

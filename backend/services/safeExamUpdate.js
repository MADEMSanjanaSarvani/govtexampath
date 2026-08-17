const ManualReview = require('../models/ManualReview');

// Fields a bot/verifier is allowed to write at all.
const BOT_UPDATABLE_FIELDS = [
  'lastDate', 'applicationStartDate', 'examDate', 'admitCardDate', 'resultDate',
  'importantDates', 'vacancies', 'categoryWiseVacancies', 'applicationLink',
  'notificationPdfUrl', 'officialWebsite', 'applicationFee', 'dateStatus',
  'eligibility', 'ageLimit', 'ageLimitDetails', 'qualifications', 'salary',
  'salaryRange', 'examPattern', 'examMode', 'examDuration', 'negativeMarking',
  'syllabus', 'selectionProcess', 'conductingBody', 'jobRole', 'careerGrowth',
  'applicationProcess', 'perks', 'posts', 'attempts', 'cutoffs',
  'jobLocations', 'requiredDocuments', 'previousYearPapers', 'faqs',
  'contactInfo', 'isActive', 'description',
];

// High-stakes fields. When an AI/untrusted source proposes a change to any of
// these, the change is NOT applied directly — it is queued for human review.
// eligibility and ageLimit are just as consequential as a date or fee — they
// directly determine whether someone thinks they can apply at all — but were
// missing here even though officialSourceVerifier.js was already (or is now)
// checking them via AI, meaning a wrong AI-suggested change would have gone
// live unreviewed.
const CRITICAL_FIELDS = [
  'lastDate', 'applicationStartDate', 'examDate', 'admitCardDate', 'resultDate',
  'dateStatus', 'vacancies', 'applicationFee', 'eligibility', 'ageLimit',
];

// Sources allowed to write critical fields directly (deterministic pipelines and
// admin actions). Everything else (AI verifiers) is routed through review.
const TRUSTED_CRITICAL_SOURCES = new Set([
  'date-corrections-sync',   // curated corrections file
  'github-actions-monitor',  // deterministic past-deadline closing / seeding
  'admin',                   // admin dashboard direct edit
  'admin-approved',          // an approved ManualReview being applied
  'admin-manual',
]);

// Valid enum values for fields with strict schema constraints. Invalid values
// are dropped rather than failing the whole update.
const FIELD_ENUMS = {
  dateStatus: ['confirmed', 'tentative', 'closed'],
  examMode: ['online', 'offline', 'pen-paper', 'both', ''],
};

function sanitizeValue(key, value) {
  if (FIELD_ENUMS[key] && !FIELD_ENUMS[key].includes(value)) {
    return undefined;
  }
  return value;
}

// Normalise values for change detection so a Date vs an ISO string, or two
// equal objects, don't register as spurious changes.
function normalize(v) {
  if (v === undefined || v === null) return '';
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

function isDifferent(oldVal, newVal) {
  // Treat an incoming date string as a date for comparison.
  if (oldVal instanceof Date && typeof newVal === 'string' && /^\d{4}-\d{2}-\d{2}/.test(newVal)) {
    return oldVal.toISOString().slice(0, 10) !== newVal.slice(0, 10);
  }
  return normalize(oldVal) !== normalize(newVal);
}

// Upsert a single pending "field_update" review per exam so daily re-runs merge
// into one review instead of creating duplicates.
async function upsertPendingReview(exam, suggestions, source, runId) {
  const existing = await ManualReview.findOne({
    exam: exam._id, status: 'pending', issueType: 'field_update',
  });

  if (existing) {
    const byField = new Map(existing.suggestions.map((s) => [s.field, s]));
    for (const s of suggestions) byField.set(s.field, s);
    existing.suggestions = Array.from(byField.values());
    if (runId) existing.runId = runId;
    await existing.save();
    return existing;
  }

  return ManualReview.create({
    exam: exam._id,
    examTitle: exam.title,
    issueType: 'field_update',
    issues: [`Automated verifier proposed changes to critical field(s) from "${source || 'verifier'}"`],
    suggestions,
    confidence: 'medium',
    status: 'pending',
    runId,
  });
}

/**
 * Apply a set of proposed field updates to an exam document safely.
 *
 * - Non-critical fields are applied directly.
 * - Critical fields are applied directly ONLY if the source is trusted
 *   (deterministic pipelines / admin); otherwise they are queued to the
 *   ManualReview collection for human approval and NOT applied.
 * - Always stamps lastVerifiedAt / lastVerifiedSource and saves the exam.
 *
 * The caller must pass a live (non-lean) Mongoose exam document.
 * Returns { applied: string[], queued: string[], rejected: string[] }.
 */
async function applyExamUpdatesSafely(exam, updates, { source = '', runId = '', verifiedSource = '' } = {}) {
  const applied = [];
  const rejected = [];
  const criticalSuggestions = [];
  const trusted = TRUSTED_CRITICAL_SOURCES.has(source);

  for (const [key, rawValue] of Object.entries(updates || {})) {
    if (!BOT_UPDATABLE_FIELDS.includes(key)) {
      rejected.push(key);
      continue;
    }
    const value = sanitizeValue(key, rawValue);
    if (value === undefined) {
      rejected.push(`${key} (invalid enum value: ${rawValue})`);
      continue;
    }

    if (CRITICAL_FIELDS.includes(key) && !trusted) {
      if (isDifferent(exam[key], value)) {
        criticalSuggestions.push({
          field: key,
          currentValue: exam[key],
          suggestedValue: value,
          reason: `Proposed by ${source || 'verifier'}`,
        });
      }
      // else: no real change — nothing to queue
    } else {
      exam[key] = value;
      applied.push(key);
    }
  }

  let queued = [];
  if (criticalSuggestions.length > 0) {
    await upsertPendingReview(exam, criticalSuggestions, source, runId);
    queued = criticalSuggestions.map((s) => s.field);
  }

  // Reaching here means a real comparison against a real source happened, so
  // stamping lastVerifiedAt (which users see as "Last verified") is honest.
  // lastVerifyAttemptAt is stamped alongside it so the verifiers' rotation
  // ordering stays consistent across both the success and the skipped-fetch
  // paths — see the skip branch in officialSourceVerifier.js.
  exam.lastVerifiedAt = new Date();
  exam.lastVerifyAttemptAt = exam.lastVerifiedAt;
  const stamp = verifiedSource || source;
  if (stamp) exam.lastVerifiedSource = stamp;
  await exam.save();

  return { applied, queued, rejected };
}

module.exports = {
  applyExamUpdatesSafely,
  BOT_UPDATABLE_FIELDS,
  CRITICAL_FIELDS,
  TRUSTED_CRITICAL_SOURCES,
  FIELD_ENUMS,
  sanitizeValue,
};

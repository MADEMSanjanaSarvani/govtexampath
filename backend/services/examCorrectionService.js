const Exam = require('../models/Exam');
const ManualReview = require('../models/ManualReview');
const VerificationLog = require('../models/VerificationLog');
const { isAvailable, getModel } = require('./aiExtractionService');

// ── AI-assisted correction for a single ManualReview item ─────────────────────
// Sends exam context to Gemini and asks it to suggest corrections.
// Returns { suggestions, confidence } or null if AI unavailable.

async function getAISuggestions(exam, issues) {
  if (!isAvailable()) return null;

  const model = getModel();
  const today = new Date().toISOString().split('T')[0];

  const prompt = `You are a government exam data validator for Indian government exams.
TODAY: ${today}

EXAM DATA:
Title: ${exam.title}
Category: ${exam.category}
applicationStartDate: ${exam.applicationStartDate ? new Date(exam.applicationStartDate).toISOString().split('T')[0] : 'not set'}
lastDate: ${exam.lastDate ? new Date(exam.lastDate).toISOString().split('T')[0] : 'not set'}
examDate: ${exam.examDate ? new Date(exam.examDate).toISOString().split('T')[0] : 'not set'}
dateStatus: ${exam.dateStatus}
conductingBody: ${exam.conductingBody || 'unknown'}

REPORTED ISSUES:
${issues.map((i, n) => `${n + 1}. ${i}`).join('\n')}

TASK: Analyze the issues above. Based on typical cycles for this type of exam and the data provided, suggest corrections if you are confident.

RULES:
- Do NOT invent specific dates you don't know
- Only suggest dateStatus: 'closed' if lastDate is clearly in the past relative to today
- Only suggest dateStatus: 'confirmed' if you have high confidence in the dates
- Confidence must be 'high', 'medium', or 'low'
- If unsure, return low confidence

Respond ONLY with valid JSON (no markdown):
{
  "analysis": "one-sentence assessment",
  "suggestions": [
    { "field": "dateStatus", "suggestedValue": "closed", "reason": "lastDate is past" }
  ],
  "confidence": "high|medium|low"
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const clean = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    const parsed = JSON.parse(clean);
    return {
      suggestions: parsed.suggestions || [],
      confidence: parsed.confidence || 'low',
      analysis: parsed.analysis || '',
    };
  } catch (err) {
    console.warn(`[Correction] AI suggestion failed for "${exam.title}": ${err.message}`);
    return null;
  }
}

// ── Process pending manual reviews with AI ────────────────────────────────────

async function enrichPendingReviews(limit = 20) {
  if (!isAvailable()) {
    console.log('[Correction] Gemini not available — skipping AI enrichment');
    return { processed: 0, enriched: 0 };
  }

  const reviews = await ManualReview.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  if (reviews.length === 0) {
    console.log('[Correction] No pending reviews to enrich');
    return { processed: 0, enriched: 0 };
  }

  let enriched = 0;

  for (const review of reviews) {
    const exam = await Exam.findById(review.exam, {
      title: 1, category: 1, lastDate: 1, applicationStartDate: 1,
      examDate: 1, dateStatus: 1, conductingBody: 1,
    }).lean();

    if (!exam) continue;

    const aiResult = await getAISuggestions(exam, review.issues);
    if (!aiResult || aiResult.suggestions.length === 0) continue;

    // Merge AI suggestions with existing suggestions (don't overwrite)
    const existingFields = new Set(review.suggestions.map(s => s.field));
    const newSuggestions = aiResult.suggestions.filter(s => !existingFields.has(s.field));

    if (newSuggestions.length > 0) {
      await ManualReview.updateOne(
        { _id: review._id },
        {
          $push: { suggestions: { $each: newSuggestions } },
          $set: { confidence: aiResult.confidence },
        }
      );
      enriched++;
    }
  }

  console.log(`[Correction] Enriched ${enriched}/${reviews.length} pending reviews with AI suggestions`);
  return { processed: reviews.length, enriched };
}

// ── Apply an approved manual review ──────────────────────────────────────────
// Shared by both the single-item and bulk approval paths below.

async function applyReviewDoc(review, adminUserId) {
  const exam = await Exam.findById(review.exam);
  if (!exam) throw new Error('Exam not found');

  if (review.suggestions.length === 0) {
    throw new Error('No suggestions to apply — reject this review instead');
  }

  const updateSet = {};
  const changes = [];

  for (const s of review.suggestions) {
    const oldValue = exam[s.field];
    updateSet[s.field] = s.suggestedValue;
    changes.push({ field: s.field, oldValue, newValue: s.suggestedValue });
  }

  await Exam.updateOne({ _id: exam._id }, { $set: updateSet });

  await ManualReview.updateOne(
    { _id: review._id },
    { $set: { status: 'approved', resolvedAt: new Date(), resolvedBy: adminUserId } }
  );

  await VerificationLog.create({
    exam: exam._id,
    examTitle: exam.title,
    runId: review.runId || 'manual',
    issueType: review.issueType,
    issues: review.issues,
    changes,
    confidence: review.confidence,
    source: 'admin-approved',
    action: 'auto_fixed',
    reason: `Admin approved: ${changes.map(c => `${c.field} → ${c.newValue}`).join(', ')}`,
  });

  return { exam: exam.title, changes };
}

async function applyReview(reviewId, adminUserId) {
  const review = await ManualReview.findById(reviewId);
  if (!review) throw new Error('Review not found');
  if (review.status !== 'pending') throw new Error(`Review is already ${review.status}`);
  return applyReviewDoc(review, adminUserId);
}

// ── Bulk-approve every pending review, optionally scoped to one verification run ──
// Applies each review independently so one bad exam reference doesn't block the rest.

async function applyAllPendingReviews({ runId, adminUserId } = {}) {
  const filter = { status: 'pending' };
  if (runId) filter.runId = runId;

  const reviews = await ManualReview.find(filter);
  const results = { total: reviews.length, applied: 0, failed: 0, errors: [] };

  for (const review of reviews) {
    try {
      await applyReviewDoc(review, adminUserId);
      results.applied++;
    } catch (err) {
      results.failed++;
      results.errors.push({ reviewId: review._id.toString(), examTitle: review.examTitle, message: err.message });
    }
  }

  return results;
}

// ── Group pending reviews by runId so an admin can approve one verification wave at a time ──

async function getPendingReviewSummary() {
  const summary = await ManualReview.aggregate([
    { $match: { status: 'pending' } },
    { $group: { _id: '$runId', count: { $sum: 1 }, latestCreatedAt: { $max: '$createdAt' } } },
    { $sort: { latestCreatedAt: -1 } },
  ]);
  return summary.map((s) => ({ runId: s._id || 'unknown', count: s.count, latestCreatedAt: s.latestCreatedAt }));
}

module.exports = {
  enrichPendingReviews,
  applyReview,
  applyAllPendingReviews,
  getPendingReviewSummary,
  getAISuggestions,
};

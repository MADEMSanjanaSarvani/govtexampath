const express = require('express');
const router = express.Router();
const { botAuth } = require('../middleware/botAuth');
const { botUpdateExam, botBulkUpdate, botGetExams } = require('../controllers/botController');
const { runVerification } = require('../services/examVerificationService');
const { verifyFromOfficialSources } = require('../services/officialSourceVerifier');
const { bulkVerifyDates } = require('../services/dateVerificationService');
const { discoverNewExams } = require('../services/examDiscoveryService');

router.use(botAuth);

router.get('/exams', botGetExams);
router.post('/update', botUpdateExam);
router.post('/bulk-update', botBulkUpdate);

// Triggered by GitHub Actions after data fixes to sync verification state
router.post('/trigger-verification', async (req, res) => {
  try {
    const stats = await runVerification();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verify a batch of exams against their own official websites (AI). Critical
// changes are queued for admin review; safe text fields are applied directly.
router.post('/verify-official-sources', async (req, res) => {
  try {
    const limit = parseInt(req.body?.limit, 10) || 10;
    const stats = await verifyFromOfficialSources({ limit });
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verify exam dates/vacancies against aggregator sites (AI). Critical changes
// are queued for admin review. Lets us run the reliable source on demand.
router.post('/verify-dates', async (req, res) => {
  try {
    const stats = await bulkVerifyDates();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Scan already-trusted official sources (plus aggregator sites, used only as
// a discovery signal — see examDiscoveryService.js) for exam notifications
// we don't have yet. Anything found is created inactive (isActive:false)
// with a pending ManualReview — never auto-published. An admin approves via
// the existing /admin/verification dashboard (Apply flips isActive to true).
//
// Fire-and-forget: a full scan (fetching each source, running one or two
// Gemini calls per candidate, with deliberate delays to respect rate limits)
// routinely takes longer than the ~5-minute timeout on a plain fetch() call
// from GitHub Actions — a synchronous await-then-respond here caused exactly
// that: the caller saw "fetch failed" even though the scan was still
// running fine server-side. Responding immediately and letting the scan
// continue in the background avoids tying it to any caller's timeout.
// Progress/results are visible via server logs and, ultimately, the
// ManualReview entries themselves — not the HTTP response.
router.post('/discover-exams', async (req, res) => {
  const limit = parseInt(req.body?.limit, 10) || 15;
  res.json({ success: true, data: { status: 'started', limit } });

  discoverNewExams({ limit })
    .then((stats) => {
      console.log(`[Discovery] Background run complete: sources=${stats.sourcesChecked} candidates=${stats.candidatesFound} created=${stats.created} skipped=${stats.skipped} errors=${stats.errors}`);
    })
    .catch((err) => {
      console.error(`[Discovery] Background run failed: ${err.message}`);
    });
});

module.exports = router;

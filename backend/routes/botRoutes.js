const express = require('express');
const router = express.Router();
const { botAuth } = require('../middleware/botAuth');
const { botUpdateExam, botBulkUpdate, botGetExams } = require('../controllers/botController');
const { runVerification } = require('../services/examVerificationService');
const { verifyFromOfficialSources } = require('../services/officialSourceVerifier');

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
    const limit = parseInt(req.body?.limit, 10) || 15;
    const stats = await verifyFromOfficialSources({ limit });
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

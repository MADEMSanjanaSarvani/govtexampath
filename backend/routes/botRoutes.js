const express = require('express');
const router = express.Router();
const { botAuth } = require('../middleware/botAuth');
const { botUpdateExam, botBulkUpdate, botGetExams } = require('../controllers/botController');
const { runVerification } = require('../services/examVerificationService');

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

module.exports = router;

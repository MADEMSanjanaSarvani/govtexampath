const express = require('express');
const router = express.Router();
const VerificationLog = require('../models/VerificationLog');
const ManualReview = require('../models/ManualReview');
const { runVerification, getVerificationStats } = require('../services/examVerificationService');
const { applyReview, enrichPendingReviews } = require('../services/examCorrectionService');

// GET /api/admin/verification/stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await getVerificationStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/verification/logs?page=1&limit=50&action=auto_fixed
router.get('/logs', async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 50);
    const filter = {};
    if (req.query.action)    filter.action    = req.query.action;
    if (req.query.issueType) filter.issueType = req.query.issueType;
    if (req.query.runId)     filter.runId     = req.query.runId;

    const [logs, total] = await Promise.all([
      VerificationLog.find(filter)
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      VerificationLog.countDocuments(filter),
    ]);

    res.json({ success: true, data: { logs, total, page, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/verification/reviews?status=pending
router.get('/reviews', async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page)   || 1);
    const limit  = Math.min(100, parseInt(req.query.limit) || 30);
    const status = req.query.status || 'pending';
    const filter = { status };

    const [reviews, total] = await Promise.all([
      ManualReview.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ManualReview.countDocuments(filter),
    ]);

    res.json({ success: true, data: { reviews, total, page, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/verification/run — manually trigger verification
router.post('/run', async (req, res) => {
  try {
    const stats = await runVerification();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/verification/enrich — enrich pending reviews with AI suggestions
router.post('/enrich', async (req, res) => {
  try {
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const result = await enrichPendingReviews(limit);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/verification/reviews/:id/approve
router.post('/reviews/:id/approve', async (req, res) => {
  try {
    const result = await applyReview(req.params.id, req.user._id);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/admin/verification/reviews/:id/reject
router.post('/reviews/:id/reject', async (req, res) => {
  try {
    const review = await ManualReview.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Review is already ${review.status}` });
    }

    review.status    = 'rejected';
    review.resolvedAt = new Date();
    review.resolvedBy = req.user._id;
    review.notes     = req.body.notes || '';
    await review.save();

    res.json({ success: true, data: { message: 'Review rejected', exam: review.examTitle } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

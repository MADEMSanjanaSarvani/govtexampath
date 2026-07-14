const Exam = require('../models/Exam');
const { applyExamUpdatesSafely } = require('../services/safeExamUpdate');

const botUpdateExam = async (req, res) => {
  try {
    const { title, category, updates, source, runId } = req.body;

    if (!title || !updates || typeof updates !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'title and updates object are required.',
      });
    }

    const filter = { title: { $regex: `^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } };
    if (category) filter.category = category;

    const exam = await Exam.findOne(filter);
    if (!exam) {
      return res.status(404).json({ success: false, error: `Exam not found: "${title}"` });
    }

    // Critical-field changes from untrusted (AI) sources are queued for review
    // instead of applied. See services/safeExamUpdate.js.
    const { applied, queued, rejected } = await applyExamUpdatesSafely(exam, updates, { source, runId });

    res.status(200).json({
      success: true,
      data: {
        examId: exam._id,
        title: exam.title,
        fieldsUpdated: applied,
        fieldsQueuedForReview: queued,
        fieldsRejected: rejected,
      },
    });
  } catch (error) {
    console.error('Bot update error:', error.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

const botBulkUpdate = async (req, res) => {
  try {
    const { exams } = req.body;

    if (!Array.isArray(exams) || exams.length === 0) {
      return res.status(400).json({ success: false, error: 'exams array is required.' });
    }

    if (exams.length > 50) {
      return res.status(400).json({ success: false, error: 'Maximum 50 exams per batch.' });
    }

    const results = [];

    for (const entry of exams) {
      const { title, category, updates, source, runId } = entry;
      if (!title || !updates) {
        results.push({ title: title || 'unknown', status: 'skipped', error: 'missing title or updates' });
        continue;
      }

      const filter = { title: { $regex: `^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } };
      if (category) filter.category = category;

      const exam = await Exam.findOne(filter);
      if (!exam) {
        results.push({ title, status: 'not_found' });
        continue;
      }

      const { applied, queued } = await applyExamUpdatesSafely(exam, updates, { source, runId });
      results.push({ title, status: 'updated', fieldsUpdated: applied, fieldsQueuedForReview: queued });
    }

    res.status(200).json({
      success: true,
      data: {
        total: exams.length,
        updated: results.filter(r => r.status === 'updated').length,
        notFound: results.filter(r => r.status === 'not_found').length,
        skipped: results.filter(r => r.status === 'skipped').length,
        results,
      },
    });
  } catch (error) {
    console.error('Bot bulk update error:', error.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

const botGetExams = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.active !== undefined) filter.isActive = req.query.active === 'true';

    const exams = await Exam.find(filter)
      .select('title category lastDate dateStatus isActive conductingBody vacancies officialWebsite notificationPdfUrl lastVerifiedAt lastVerifiedSource')
      .sort({ category: 1, title: 1 })
      .limit(500)
      .lean();

    res.status(200).json({ success: true, data: exams });
  } catch (error) {
    console.error('Bot get exams error:', error.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

module.exports = { botUpdateExam, botBulkUpdate, botGetExams };

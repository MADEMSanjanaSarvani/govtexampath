const Exam = require('../models/Exam');

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

const botUpdateExam = async (req, res) => {
  try {
    const { title, category, updates } = req.body;

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

    const applied = {};
    const rejected = [];

    for (const [key, value] of Object.entries(updates)) {
      if (BOT_UPDATABLE_FIELDS.includes(key)) {
        exam[key] = value;
        applied[key] = value;
      } else {
        rejected.push(key);
      }
    }

    exam.lastVerifiedAt = new Date();
    if (req.body.source) {
      exam.lastVerifiedSource = req.body.source;
    }

    await exam.save();

    res.status(200).json({
      success: true,
      data: {
        examId: exam._id,
        title: exam.title,
        fieldsUpdated: Object.keys(applied),
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
      const { title, category, updates, source } = entry;
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

      const applied = [];
      for (const [key, value] of Object.entries(updates)) {
        if (BOT_UPDATABLE_FIELDS.includes(key)) {
          exam[key] = value;
          applied.push(key);
        }
      }

      exam.lastVerifiedAt = new Date();
      if (source) exam.lastVerifiedSource = source;

      await exam.save();
      results.push({ title, status: 'updated', fieldsUpdated: applied });
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
      .select('title category lastDate dateStatus isActive conductingBody vacancies lastVerifiedAt lastVerifiedSource')
      .sort({ category: 1, title: 1 })
      .lean();

    res.status(200).json({ success: true, data: exams });
  } catch (error) {
    console.error('Bot get exams error:', error.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

module.exports = { botUpdateExam, botBulkUpdate, botGetExams };

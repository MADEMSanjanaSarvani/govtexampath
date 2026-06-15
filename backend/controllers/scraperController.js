const ExamSource = require('../models/ExamSource');
const UpdateLog = require('../models/UpdateLog');
const { checkSource, runAllChecks } = require('../services/scraper');
const { runCurrentAffairsScrape } = require('../services/currentAffairsScraper');

const getSources = async (req, res) => {
  try {
    const sources = await ExamSource.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: sources });
  } catch (error) {
    console.error('Get sources error:', error.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

const addSource = async (req, res) => {
  try {
    const { name, conductingBody, category, url, selector, checkIntervalHours } = req.body;

    if (!name || !conductingBody || !category || !url) {
      return res.status(400).json({ success: false, error: 'Name, conducting body, category, and URL are required.' });
    }

    const existing = await ExamSource.findOne({ url });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Source with this URL already exists.' });
    }

    const source = await ExamSource.create({
      name,
      conductingBody,
      category,
      url,
      selector: selector || 'body',
      checkIntervalHours: checkIntervalHours || 6,
    });

    res.status(201).json({ success: true, data: source });
  } catch (error) {
    console.error('Add source error:', error.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

const updateSource = async (req, res) => {
  try {
    const source = await ExamSource.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!source) {
      return res.status(404).json({ success: false, error: 'Source not found.' });
    }

    res.status(200).json({ success: true, data: source });
  } catch (error) {
    console.error('Update source error:', error.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

const deleteSource = async (req, res) => {
  try {
    const source = await ExamSource.findByIdAndDelete(req.params.id);
    if (!source) {
      return res.status(404).json({ success: false, error: 'Source not found.' });
    }
    res.status(200).json({ success: true, message: 'Source deleted.' });
  } catch (error) {
    console.error('Delete source error:', error.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

const triggerCheck = async (req, res) => {
  try {
    const { sourceId } = req.params;

    if (sourceId) {
      const source = await ExamSource.findById(sourceId);
      if (!source) {
        return res.status(404).json({ success: false, error: 'Source not found.' });
      }
      const result = await checkSource(source);
      return res.status(200).json({ success: true, data: result });
    }

    const results = await runAllChecks();
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error('Trigger check error:', error.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

const getLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;
    const type = req.query.type;

    const filter = {};
    if (type) filter.type = type;
    if (req.query.sourceId) filter.source = req.query.sourceId;

    const [logs, total] = await Promise.all([
      UpdateLog.find(filter)
        .populate('source', 'name conductingBody')
        .populate('exam', 'title category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      UpdateLog.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        logs,
        pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    console.error('Get logs error:', error.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

const getStats = async (req, res) => {
  try {
    const [totalSources, activeSources, totalLogs, recentChanges, recentErrors] = await Promise.all([
      ExamSource.countDocuments(),
      ExamSource.countDocuments({ isActive: true }),
      UpdateLog.countDocuments(),
      UpdateLog.countDocuments({
        type: 'change_detected',
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
      UpdateLog.countDocuments({
        type: 'error',
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
    ]);

    const lastCheck = await ExamSource.findOne({ lastChecked: { $ne: null } })
      .sort({ lastChecked: -1 })
      .select('lastChecked name');

    res.status(200).json({
      success: true,
      data: {
        totalSources,
        activeSources,
        totalLogs,
        recentChanges,
        recentErrors,
        lastCheck: lastCheck ? { at: lastCheck.lastChecked, source: lastCheck.name } : null,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

const triggerCurrentAffairsScrape = async (req, res) => {
  try {
    const result = await runCurrentAffairsScrape();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Current affairs scrape error:', error.message);
    res.status(500).json({ success: false, error: 'Scrape failed.' });
  }
};

const triggerDateVerification = async (req, res) => {
  try {
    const { bulkVerifyDates } = require('../services/dateVerificationService');
    const result = await bulkVerifyDates();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Date verification error:', error.message);
    res.status(500).json({ success: false, error: 'Date verification failed.' });
  }
};

const reapplyDateCorrections = async (req, res) => {
  try {
    const { correctExamDates } = require('../seeds/dateCorrections');
    await correctExamDates();
    const Exam = require('../models/Exam');
    await Exam.updateMany({}, { $set: { isActive: true } });
    const exams = await Exam.find()
      .select('title lastDate dateStatus isActive category vacancies')
      .sort({ category: 1, title: 1 })
      .lean();
    res.status(200).json({
      success: true,
      data: { total: exams.length, active: exams.filter(e => e.isActive).length, exams },
    });
  } catch (error) {
    console.error('Reapply corrections error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to reapply corrections.' });
  }
};

module.exports = {
  getSources,
  addSource,
  updateSource,
  deleteSource,
  triggerCheck,
  getLogs,
  getStats,
  triggerCurrentAffairsScrape,
  triggerDateVerification,
  reapplyDateCorrections,
};

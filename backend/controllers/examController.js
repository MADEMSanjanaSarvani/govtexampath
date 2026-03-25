const Exam = require('../models/Exam');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { getIO } = require('../config/socket');

/**
 * @desc    Get paginated list of exams with filters
 * @route   GET /api/exams
 * @query   page, limit, category, search
 */
const getExams = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    // Category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Active status filter (default: show only active)
    if (req.query.active !== undefined) {
      filter.isActive = req.query.active === 'true';
    } else {
      filter.isActive = true;
    }

    // Search by title or description
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [exams, total] = await Promise.all([
      Exam.find(filter)
        .populate('postedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Exam.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        exams,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get exams error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error fetching exams.',
    });
  }
};

/**
 * @desc    Get a single exam by ID
 * @route   GET /api/exams/:id
 */
const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate(
      'postedBy',
      'name email'
    );

    if (!exam) {
      return res.status(404).json({
        success: false,
        error: 'Exam not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: exam,
    });
  } catch (error) {
    console.error('Get exam by ID error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error fetching exam.',
    });
  }
};

/**
 * @desc    Create a new exam (admin only)
 * @route   POST /api/exams
 */
const createExam = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      eligibility,
      applicationLink,
      lastDate,
      importantDates,
      salary,
      ageLimit,
      applicationFee,
    } = req.body;

    const exam = await Exam.create({
      title,
      description,
      category,
      eligibility,
      applicationLink,
      lastDate,
      importantDates,
      salary,
      ageLimit,
      applicationFee,
      postedBy: req.user.id,
    });

    // Populate postedBy for the response
    await exam.populate('postedBy', 'name email');

    // Create a notification for all users (empty recipients = all)
    const notification = await Notification.create({
      title: `New Exam: ${title}`,
      message: `A new ${category} exam "${title}" has been posted. Check it out!`,
      exam: exam._id,
      type: 'new_exam',
      recipients: [], // Empty means all users
    });

    // Emit socket events to all connected clients
    try {
      const io = getIO();
      io.emit('new_exam', exam);
      io.emit('new_notification', notification);
    } catch (socketError) {
      console.error('Socket emit error:', socketError.message);
    }

    res.status(201).json({
      success: true,
      data: exam,
      message: 'Exam created successfully.',
    });
  } catch (error) {
    console.error('Create exam error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error creating exam.',
    });
  }
};

/**
 * @desc    Update an exam (admin only)
 * @route   PUT /api/exams/:id
 */
const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('postedBy', 'name email');

    if (!exam) {
      return res.status(404).json({
        success: false,
        error: 'Exam not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: exam,
      message: 'Exam updated successfully.',
    });
  } catch (error) {
    console.error('Update exam error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error updating exam.',
    });
  }
};

/**
 * @desc    Soft delete an exam (set isActive: false)
 * @route   DELETE /api/exams/:id
 */
const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!exam) {
      return res.status(404).json({
        success: false,
        error: 'Exam not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Exam deleted successfully.',
    });
  } catch (error) {
    console.error('Delete exam error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error deleting exam.',
    });
  }
};

/**
 * @desc    Toggle bookmark for current user
 * @route   POST /api/exams/:id/bookmark
 */
const bookmarkExam = async (req, res) => {
  try {
    const examId = req.params.id;

    // Verify exam exists
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({
        success: false,
        error: 'Exam not found.',
      });
    }

    const user = await User.findById(req.user.id);
    const bookmarkIndex = user.bookmarks.indexOf(examId);

    let action;
    if (bookmarkIndex > -1) {
      // Remove bookmark
      user.bookmarks.splice(bookmarkIndex, 1);
      action = 'removed';
    } else {
      // Add bookmark
      user.bookmarks.push(examId);
      action = 'added';
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: { bookmarks: user.bookmarks },
      message: `Bookmark ${action} successfully.`,
    });
  } catch (error) {
    console.error('Bookmark exam error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error toggling bookmark.',
    });
  }
};

/**
 * @desc    Get current user's bookmarked exams
 * @route   GET /api/exams/user/bookmarks
 */
const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'bookmarks',
      populate: { path: 'postedBy', select: 'name email' },
    });

    res.status(200).json({
      success: true,
      data: user.bookmarks,
    });
  } catch (error) {
    console.error('Get bookmarks error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error fetching bookmarks.',
    });
  }
};

module.exports = {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  bookmarkExam,
  getBookmarks,
};

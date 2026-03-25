const User = require('../models/User');
const Exam = require('../models/Exam');
const Notification = require('../models/Notification');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/dashboard
 */
const getDashboardStats = async (req, res) => {
  try {
    const [userCount, examCount, activeExamCount, notificationCount] =
      await Promise.all([
        User.countDocuments(),
        Exam.countDocuments(),
        Exam.countDocuments({ isActive: true }),
        Notification.countDocuments(),
      ]);

    res.status(200).json({
      success: true,
      data: {
        users: userCount,
        exams: examCount,
        activeExams: activeExamCount,
        notifications: notificationCount,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error fetching dashboard stats.',
    });
  }
};

/**
 * @desc    Get paginated user list
 * @route   GET /api/admin/users
 * @query   page, limit
 */
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get users error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error fetching users.',
    });
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot delete your own account from the admin panel.',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    console.error('Delete user error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error deleting user.',
    });
  }
};

/**
 * @desc    Toggle user role between user and admin
 * @route   PUT /api/admin/users/:id/toggle-role
 */
const toggleUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    // Prevent admin from changing their own role
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot change your own role.',
      });
    }

    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();

    res.status(200).json({
      success: true,
      data: user,
      message: `User role changed to ${user.role}.`,
    });
  } catch (error) {
    console.error('Toggle user role error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error toggling user role.',
    });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  deleteUser,
  toggleUserRole,
};

const Notification = require('../models/Notification');
const { getIO } = require('../config/socket');

/**
 * @desc    Get notifications for current user (paginated, newest first)
 * @route   GET /api/notifications
 * @query   page, limit
 */
const getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const userId = req.user.id;

    // Notifications where recipients is empty (all users) or includes current user
    const filter = {
      $or: [{ recipients: { $size: 0 } }, { recipients: userId }],
    };

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .populate('exam', 'title category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments(filter),
    ]);

    // Add isRead field for the current user
    const data = notifications.map((n) => {
      const obj = n.toObject();
      obj.isRead = n.readBy.some(
        (id) => id.toString() === userId.toString()
      );
      return obj;
    });

    res.status(200).json({
      success: true,
      data: {
        notifications: data,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get notifications error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error fetching notifications.',
    });
  }
};

/**
 * @desc    Get unread notification count for current user
 * @route   GET /api/notifications/unread-count
 */
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Notification.countDocuments({
      $or: [{ recipients: { $size: 0 } }, { recipients: userId }],
      readBy: { $ne: userId },
    });

    res.status(200).json({
      success: true,
      data: { unreadCount: count },
    });
  } catch (error) {
    console.error('Get unread count error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error fetching unread count.',
    });
  }
};

/**
 * @desc    Mark a single notification as read
 * @route   PUT /api/notifications/:id/read
 */
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found.',
      });
    }

    // Add user to readBy if not already present
    const userId = req.user.id;
    if (!notification.readBy.some((id) => id.toString() === userId.toString())) {
      notification.readBy.push(userId);
      await notification.save();
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
    });
  } catch (error) {
    console.error('Mark as read error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error marking notification as read.',
    });
  }
};

/**
 * @desc    Mark all notifications as read for current user
 * @route   PUT /api/notifications/mark-all-read
 */
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all unread notifications for this user and add to readBy
    await Notification.updateMany(
      {
        $or: [{ recipients: { $size: 0 } }, { recipients: userId }],
        readBy: { $ne: userId },
      },
      { $addToSet: { readBy: userId } }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.',
    });
  } catch (error) {
    console.error('Mark all as read error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error marking all notifications as read.',
    });
  }
};

/**
 * @desc    Send a custom notification (admin only)
 * @route   POST /api/notifications/send
 */
const sendNotification = async (req, res) => {
  try {
    const { title, message, type, recipients, examId } = req.body;

    const notification = await Notification.create({
      title,
      message,
      type: type || 'general',
      recipients: recipients || [],
      exam: examId || null,
    });

    // Emit socket event to all connected clients
    try {
      const io = getIO();
      io.emit('new_notification', notification);
    } catch (socketError) {
      console.error('Socket emit error:', socketError.message);
    }

    res.status(201).json({
      success: true,
      data: notification,
      message: 'Notification sent successfully.',
    });
  } catch (error) {
    console.error('Send notification error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error sending notification.',
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  sendNotification,
};

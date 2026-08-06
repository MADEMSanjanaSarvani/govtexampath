const User = require('../models/User');
const Exam = require('../models/Exam');

/**
 * Resolves which users should receive an exam-linked notification, respecting
 * each user's category subscriptions (Manage Subscriptions page). Users who
 * haven't set any category preference yet are included by default, so existing
 * users don't silently stop receiving notifications.
 *
 * Returns null when the exam/category can't be determined, so callers can fall
 * back to their previous "send to everyone" behavior for non-exam-specific
 * notifications (e.g. general site announcements).
 */
const resolveCategoryRecipients = async (examId) => {
  if (!examId) return null;
  const exam = await Exam.findById(examId).select('category');
  if (!exam?.category) return null;

  const subscribedUsers = await User.find({
    $or: [
      { subscribedCategories: exam.category },
      { subscribedCategories: { $size: 0 } },
    ],
  }).select('_id');

  return subscribedUsers.map((u) => u._id);
};

module.exports = { resolveCategoryRecipients };

const Exam = require('../models/Exam');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { getIO } = require('../config/socket');
const { sendPushNotification } = require('./pushService');
const { sendWebPushToAll } = require('./webPushService');
const { sendNotificationEmail, buildNotificationEmailHTML } = require('./emailService');
const { resolveCategoryRecipients } = require('./notificationTargeting');

// Reminders fire N days *before* the date — e.g. 1 means "tomorrow is the
// last date", not "today is the last date", so users still have time to act.
const APPLY_DEADLINE_THRESHOLDS = [7, 3, 1];
const EXAM_DAY_THRESHOLDS = [3, 1];

// Returns the [start, end) UTC range for the calendar day `daysFromNow` days
// from today. Exam dates are stored as plain dates (no meaningful time
// component), so day-granularity UTC comparison is accurate enough here.
function dayRange(daysFromNow) {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() + daysFromNow);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

function startOfToday() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

async function resolveInterestedRecipients(examId) {
  const [bookmarkers, categoryRecipients] = await Promise.all([
    User.find({ bookmarks: examId }).select('_id'),
    resolveCategoryRecipients(examId),
  ]);
  const ids = new Set([
    ...bookmarkers.map((u) => u._id.toString()),
    ...(categoryRecipients || []).map((id) => id.toString()),
  ]);
  return [...ids];
}

async function alreadySentToday(examId, title) {
  const existing = await Notification.findOne({
    exam: examId,
    type: 'exam_schedule',
    title,
    createdAt: { $gte: startOfToday() },
  }).select('_id');
  return !!existing;
}

async function dispatchReminder(examId, title, message, recipientIds) {
  if (recipientIds.length === 0) return;
  if (await alreadySentToday(examId, title)) return;

  const notification = await Notification.create({
    title,
    message,
    type: 'exam_schedule',
    exam: examId,
    recipients: recipientIds,
    isSent: true,
    sendEmail: true,
    priority: 'high',
  });

  try {
    getIO().emit('new_notification', notification);
  } catch (err) {
    console.error('[DeadlineReminder] Socket emit error:', err.message);
  }

  try {
    const users = await User.find({
      _id: { $in: recipientIds },
      'fcmTokens.0': { $exists: true },
      'notificationPreferences.examDates': { $ne: false },
    }).select('fcmTokens');
    const tokens = users.flatMap((u) => u.fcmTokens.map((t) => t.token));
    if (tokens.length > 0) {
      await sendPushNotification(tokens, title, message, {
        type: 'exam_schedule',
        notificationId: notification._id.toString(),
      });
    }
  } catch (err) {
    console.error('[DeadlineReminder] Push error:', err.message);
  }

  try {
    await sendWebPushToAll(title, message, {
      type: 'exam_schedule',
      notificationId: notification._id.toString(),
    }, recipientIds);
  } catch (err) {
    console.error('[DeadlineReminder] Web push error:', err.message);
  }

  try {
    const emailUsers = await User.find({
      _id: { $in: recipientIds },
      'notificationPreferences.examDates': { $ne: false },
      'notificationPreferences.emailNotifications': { $ne: false },
    }).select('email name');
    if (emailUsers.length > 0) {
      const htmlFn = (email) => buildNotificationEmailHTML(title, message, 'exam_schedule', email);
      await sendNotificationEmail(emailUsers, `GovtExamPath: ${title}`, htmlFn);
    }
  } catch (err) {
    console.error('[DeadlineReminder] Email error:', err.message);
  }
}

function applyDeadlineCopy(examTitle, daysLeft) {
  if (daysLeft === 1) {
    return {
      title: `Last day to apply: ${examTitle}`,
      message: `Tomorrow is the last date to apply for ${examTitle}. Don't miss it — submit your application today.`,
    };
  }
  return {
    title: `${daysLeft} days left to apply: ${examTitle}`,
    message: `Only ${daysLeft} days left to apply for ${examTitle}. Make sure your application is submitted before the deadline.`,
  };
}

function examDayCopy(examTitle, daysLeft) {
  if (daysLeft === 1) {
    return {
      title: `Exam tomorrow: ${examTitle}`,
      message: `Your ${examTitle} exam is tomorrow. Get your admit card and essentials ready.`,
    };
  }
  return {
    title: `Exam in ${daysLeft} days: ${examTitle}`,
    message: `${examTitle} is coming up in ${daysLeft} days. Time for a final revision push.`,
  };
}

async function sendDeadlineReminders() {
  let applySent = 0;
  let examDaySent = 0;

  for (const daysLeft of APPLY_DEADLINE_THRESHOLDS) {
    const { start, end } = dayRange(daysLeft);
    const exams = await Exam.find({
      isActive: true,
      lastDate: { $gte: start, $lt: end },
    }).select('_id title');

    for (const exam of exams) {
      const recipients = await resolveInterestedRecipients(exam._id);
      const { title, message } = applyDeadlineCopy(exam.title, daysLeft);
      await dispatchReminder(exam._id, title, message, recipients);
      applySent++;
    }
  }

  for (const daysLeft of EXAM_DAY_THRESHOLDS) {
    const { start, end } = dayRange(daysLeft);
    const exams = await Exam.find({
      isActive: true,
      examDate: { $gte: start, $lt: end },
    }).select('_id title');

    for (const exam of exams) {
      const recipients = await resolveInterestedRecipients(exam._id);
      const { title, message } = examDayCopy(exam.title, daysLeft);
      await dispatchReminder(exam._id, title, message, recipients);
      examDaySent++;
    }
  }

  return { applyDeadlinesChecked: applySent, examDaysChecked: examDaySent };
}

module.exports = { sendDeadlineReminders };

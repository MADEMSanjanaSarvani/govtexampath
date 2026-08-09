const jwt = require('jsonwebtoken');
const Feedback = require('../models/Feedback');
const { sendNotificationEmail } = require('../services/emailService');

const escapeHtml = (str) => String(str)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/**
 * @desc    Submit feedback / contact form (public — works whether or not the user is logged in)
 * @route   POST /api/feedback
 */
const submitFeedback = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Best-effort: attach the submitting user if a valid token was sent, but never reject the
    // submission over an auth problem — this endpoint must work for anonymous visitors too.
    let userId = null;
    const authHeader = req.headers.authorization;
    const rawToken = req.cookies?.token
      || (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);
    if (rawToken) {
      try {
        const decoded = jwt.verify(rawToken, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch {
        // Invalid/expired token — treat as anonymous submission
      }
    }

    const feedback = await Feedback.create({ name, email, subject, message, user: userId });

    const adminEmail = process.env.FEEDBACK_NOTIFY_EMAIL || 'govtexampath@gmail.com';
    sendNotificationEmail(
      [{ email: adminEmail, name: 'GovtExamPath Admin' }],
      `New ${subject || 'general'} feedback from ${name}`,
      `<div style="font-family:Arial,sans-serif;font-size:14px;color:#1f2937">
        <p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
        <p><strong>Topic:</strong> ${escapeHtml(subject || 'general')}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>`
    ).catch((err) => console.error('Feedback notification email failed:', err.message));

    res.status(201).json({ success: true, data: { id: feedback._id } });
  } catch (error) {
    console.error('Submit feedback error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to submit feedback. Please try again.' });
  }
};

/**
 * @desc    List feedback submissions (admin only)
 * @route   GET /api/feedback
 */
const listFeedback = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [items, total] = await Promise.all([
      Feedback.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('user', 'name email'),
      Feedback.countDocuments(filter),
    ]);

    res.status(200).json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('List feedback error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to load feedback.' });
  }
};

/**
 * @desc    Update a feedback submission's status (admin only)
 * @route   PATCH /api/feedback/:id/status
 */
const updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'reviewed', 'resolved'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status.' });
    }
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!feedback) {
      return res.status(404).json({ success: false, error: 'Feedback not found.' });
    }
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    console.error('Update feedback status error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to update feedback.' });
  }
};

module.exports = { submitFeedback, listFeedback, updateFeedbackStatus };

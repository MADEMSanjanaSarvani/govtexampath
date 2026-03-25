const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const { validateExam } = require('../middleware/validate');
const {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  bookmarkExam,
  getBookmarks,
} = require('../controllers/examController');

// Public routes
router.get('/', getExams);
router.get('/user/bookmarks', auth, getBookmarks); // Must be before /:id to avoid conflict
router.get('/:id', getExamById);

// Admin-only routes
router.post('/', auth, adminAuth, validateExam, createExam);
router.put('/:id', auth, adminAuth, updateExam);
router.delete('/:id', auth, adminAuth, deleteExam);

// Protected routes (authenticated users)
router.post('/:id/bookmark', auth, bookmarkExam);

module.exports = router;

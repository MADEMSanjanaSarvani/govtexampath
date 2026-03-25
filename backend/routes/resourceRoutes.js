const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
  getResources,
  getResourceById,
  getByExam,
  createResource,
  updateResource,
  deleteResource,
} = require('../controllers/resourceController');

// Public routes
router.get('/', getResources);
router.get('/exam/:examId', getByExam);
router.get('/:id', getResourceById);

// Admin routes
router.post('/', auth, adminAuth, createResource);
router.put('/:id', auth, adminAuth, updateResource);
router.delete('/:id', auth, adminAuth, deleteResource);

module.exports = router;

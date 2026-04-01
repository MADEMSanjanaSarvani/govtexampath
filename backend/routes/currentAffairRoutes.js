const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
  getCurrentAffairs,
  getCurrentAffairById,
  getByCategory,
  createCurrentAffair,
  updateCurrentAffair,
  deleteCurrentAffair,
} = require('../controllers/currentAffairController');

// Public routes
router.get('/', getCurrentAffairs);
router.get('/category/:category', getByCategory);
router.get('/:id', getCurrentAffairById);

// Admin routes
router.post('/', auth, adminAuth, createCurrentAffair);
router.put('/:id', auth, adminAuth, updateCurrentAffair);
router.delete('/:id', auth, adminAuth, deleteCurrentAffair);

module.exports = router;

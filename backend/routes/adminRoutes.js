const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
  getDashboardStats,
  getUsers,
  deleteUser,
  toggleUserRole,
} = require('../controllers/adminController');

// All admin routes require authentication and admin privileges
router.use(auth, adminAuth);

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/toggle-role', toggleUserRole);

module.exports = router;

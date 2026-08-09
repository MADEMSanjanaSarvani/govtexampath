const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
  getDashboardStats,
  getUsers,
  deleteUser,
  toggleUserRole,
  runDeadlineReminders,
} = require('../controllers/adminController');
const verificationRoutes = require('./verificationRoutes');

// All admin routes require authentication and admin privileges
router.use(auth, adminAuth);

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/toggle-role', toggleUserRole);
router.post('/deadline-reminders/run', runDeadlineReminders);

router.use('/verification', verificationRoutes);

module.exports = router;

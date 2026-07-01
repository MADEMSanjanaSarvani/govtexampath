const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verify JWT token from Authorization header.
 * Sets req.user with the decoded payload (id, role, email).
 */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Reject tokens issued before password was last changed (invalidates reused reset tokens)
    const user = await User.findById(decoded.id).select('passwordChangedAt').lean();
    if (user?.passwordChangedAt && decoded.iat * 1000 < user.passwordChangedAt.getTime()) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token.',
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token.',
    });
  }
};

/**
 * Admin authorization middleware.
 * Must be used after the auth middleware.
 */
const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    error: 'Access denied. Admin privileges required.',
  });
};

module.exports = { auth, adminAuth };

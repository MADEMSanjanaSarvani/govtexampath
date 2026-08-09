const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verify the session JWT — read from the httpOnly cookie (the normal path
 * for the website and app), falling back to an Authorization header if
 * present (e.g. for any non-browser API consumer that can't hold cookies).
 * Sets req.user with the decoded payload (id, role, email).
 */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies?.token
      || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Reject tokens issued before password was last changed (invalidates reused reset tokens)
    const user = await User.findById(decoded.id).select('passwordChangedAt role').lean();
    if (user?.passwordChangedAt && decoded.iat * 1000 < user.passwordChangedAt.getTime()) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token.',
      });
    }

    // Always use DB role — JWT role can lag after role changes
    req.user = { ...decoded, role: user?.role ?? decoded.role };
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

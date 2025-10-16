const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (req.user.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'Your account is not active. Please contact admin.'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or expired'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Optional authentication - doesn't fail if no token, just sets req.user if valid token exists
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token, just continue without setting req.user
    if (!token) {
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      // If user not found or inactive, just continue without req.user
      if (!req.user || req.user.status !== 'active') {
        req.user = null;
      }
    } catch (error) {
      // Token invalid, just continue without req.user
      req.user = null;
    }

    next();
  } catch (error) {
    // Don't fail on error, just continue without req.user
    next();
  }
};

// Role-based authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated. Please login first.'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route. Required role(s): ${roles.join(', ')}`,
        yourRole: req.user.role,
        requiredRoles: roles,
        suggestion: req.user.role === 'tenant' && roles.includes('landlord') 
          ? 'You are logged in as a tenant. Please logout and login with your landlord account.'
          : req.user.role === 'landlord' && roles.includes('tenant')
          ? 'You are logged in as a landlord. Please logout and login with your tenant account.'
          : 'Please login with the correct account type.'
      });
    }
    next();
  };
};

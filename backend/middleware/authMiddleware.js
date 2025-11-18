const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ========================================
// PROTECT ROUTES - Authentication
// ========================================
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// ========================================
// ADMIN ONLY - Authorization
// ========================================
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      message: '⛔ Access denied. Administrator privileges required.' 
    });
  }
};

// ========================================
// DRIVER ONLY - Authorization
// ========================================
const driverOnly = (req, res, next) => {
  if (req.user && req.user.role === 'driver') {
    next();
  } else {
    res.status(403).json({ 
      message: '⛔ Access denied. Driver privileges required.' 
    });
  }
};

// ========================================
// ADMIN OR DRIVER - Authorization
// ========================================
const adminOrDriver = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'driver')) {
    next();
  } else {
    res.status(403).json({ 
      message: '⛔ Access denied. Admin or Driver privileges required.' 
    });
  }
};

// ========================================
// CHECK ROLE - Flexible role checking
// ========================================
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ 
        message: `⛔ Access denied. Required role: ${roles.join(' or ')}` 
      });
    }
  };
};

module.exports = { 
  protect, 
  adminOnly, 
  driverOnly, 
  adminOrDriver,
  checkRole 
};
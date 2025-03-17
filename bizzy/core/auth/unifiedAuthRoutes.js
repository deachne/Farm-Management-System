/**
 * Unified Authentication Routes
 * 
 * This file defines the routes for authentication-related endpoints.
 * It includes routes for login, registration, logout, token verification, etc.
 */

const express = require('express');
const router = express.Router();
const {
  loginController,
  registrationController,
  logoutController,
  verifyTokenController,
  refreshTokenController,
  verifyTwoFactorController,
} = require('./unifiedAuthController');
const { unifiedAuthMiddleware, requireAdmin } = require('./unifiedAuthMiddleware');
const { isEnabled } = require('../../core/librechat/api/server/utils');

// Public routes (no authentication required)
router.post('/login', loginController);
router.post('/register', (req, res, next) => {
  // Check if registration is allowed
  if (isEnabled(process.env.ALLOW_REGISTRATION)) {
    next();
  } else {
    return res.status(403).json({
      message: 'Registration is not allowed.',
    });
  }
}, registrationController);
router.post('/refresh-token', refreshTokenController);
router.post('/verify-2fa', verifyTwoFactorController);

// Protected routes (authentication required)
router.use(unifiedAuthMiddleware);
router.post('/logout', logoutController);
router.get('/verify-token', verifyTokenController);
router.get('/me', (req, res) => {
  // Return the user object without sensitive data
  const user = req.user;
  return res.status(200).json(user);
});

// Admin routes (admin role required)
router.use('/admin', requireAdmin);
router.get('/admin/users', (req, res) => {
  // This is a placeholder for an admin endpoint
  // In a real implementation, this would return a list of users
  return res.status(200).json({ message: 'Admin endpoint' });
});

module.exports = router; 
/**
 * Unified Authentication Middleware
 * 
 * This middleware validates authentication for both AnythingLLM and LibreChat systems.
 * It extracts the JWT token from the request header and verifies it against both systems.
 */

const { verifyToken } = require('./unifiedAuthService');
const { SystemSettings } = require('../../core/anythingllm/server/models/systemSettings');
const { logger } = require('../../core/librechat/api/config');

/**
 * Middleware to validate requests for both AnythingLLM and LibreChat
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const unifiedAuthMiddleware = async (req, res, next) => {
  try {
    // Check if multi-user mode is enabled in AnythingLLM
    const multiUserMode = await SystemSettings.isMultiUserMode();
    res.locals.multiUserMode = multiUserMode;

    // When in development passthrough auth token for ease of development.
    // Or if the user simply did not set an Auth token or JWT Secret
    if (
      process.env.NODE_ENV === 'development' ||
      !process.env.JWT_SECRET
    ) {
      next();
      return;
    }

    // Extract token from Authorization header
    const auth = req.header('Authorization');
    const token = auth ? auth.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({
        error: 'No auth token found.',
      });
    }

    // Verify token and get unified user
    const user = await verifyToken(token);

    if (!user) {
      return res.status(401).json({
        error: 'Invalid auth token.',
      });
    }

    // Check if user is suspended in AnythingLLM
    if (user.anythingLLMUser && user.anythingLLMUser.suspended) {
      return res.status(401).json({
        error: 'User is suspended from system',
      });
    }

    // Set user in request and response locals for both systems
    req.user = user;
    res.locals.user = user;
    
    next();
  } catch (error) {
    logger.error('[unifiedAuthMiddleware] Error validating token:', error);
    return res.status(401).json({
      error: 'Authentication failed',
    });
  }
};

/**
 * Middleware to check if user has admin role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  } catch (error) {
    logger.error('[requireAdmin] Error checking admin role:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Middleware to validate API key for both systems
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateApiKey = async (req, res, next) => {
  try {
    // Check if multi-user mode is enabled in AnythingLLM
    const multiUserMode = await SystemSettings.isMultiUserMode();
    res.locals.multiUserMode = multiUserMode;

    // Extract API key from Authorization header
    const auth = req.header('Authorization');
    const apiKey = auth ? auth.split(' ')[1] : null;

    if (!apiKey) {
      return res.status(403).json({
        error: 'No valid API key found.',
      });
    }

    // Check API key in AnythingLLM
    const { ApiKey } = require('../../core/anythingllm/server/models/apiKeys');
    const anythingLLMApiKey = await ApiKey.get({ secret: apiKey });

    if (!anythingLLMApiKey) {
      // If not found in AnythingLLM, check in LibreChat
      // This would need to be implemented based on LibreChat's API key system
      // For now, we'll just return an error
      return res.status(403).json({
        error: 'No valid API key found.',
      });
    }

    next();
  } catch (error) {
    logger.error('[validateApiKey] Error validating API key:', error);
    return res.status(403).json({
      error: 'API key validation failed',
    });
  }
};

/**
 * Optional authentication middleware that doesn't require authentication
 * but will set the user object if a valid token is provided
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const auth = req.header('Authorization');
    const token = auth ? auth.split(' ')[1] : null;

    if (token) {
      // Verify token and get unified user
      const user = await verifyToken(token);

      if (user) {
        // Set user in request and response locals for both systems
        req.user = user;
        res.locals.user = user;
      }
    }

    next();
  } catch (error) {
    // Just continue without setting user
    next();
  }
};

module.exports = {
  unifiedAuthMiddleware,
  requireAdmin,
  validateApiKey,
  optionalAuth,
}; 
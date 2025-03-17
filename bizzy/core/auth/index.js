/**
 * Unified Authentication System
 * 
 * This module provides a unified authentication system for both AnythingLLM and LibreChat.
 * It includes services, middleware, controllers, and routes for authentication.
 */

const unifiedAuthService = require('./unifiedAuthService');
const unifiedAuthMiddleware = require('./unifiedAuthMiddleware');
const unifiedAuthController = require('./unifiedAuthController');
const unifiedAuthRoutes = require('./unifiedAuthRoutes');

module.exports = {
  service: unifiedAuthService,
  middleware: unifiedAuthMiddleware,
  controller: unifiedAuthController,
  routes: unifiedAuthRoutes,
}; 
/**
 * BizzyPerson Extension API
 * 
 * This module provides the main entry point for the BizzyPerson Extension API.
 */

// Import the extension API hooks and registry
const hooks = require('./hooks');
const registry = require('./registry');
const lifecycle = require('./extension-lifecycle');

// Combine all exports
module.exports = {
  ...hooks,
  lifecycle,
  registry
}; 
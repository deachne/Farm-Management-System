/**
 * Extension API Hooks
 * 
 * This module provides the extension registration system for BizzyPerson.
 * It allows extensions to register with the platform and integrate with
 * various subsystems.
 */

const documentProcessing = require('../shared/document-processing');

// Store registered extensions
const extensions = new Map();

/**
 * Register an extension with the platform
 * 
 * @param {object} extension - Extension configuration
 */
function register(extension) {
  try {
    console.log(`Registering extension: ${extension.name} v${extension.version}`);
    
    // Validate extension
    if (!extension.name) {
      throw new Error('Extension must have a name');
    }
    
    // Check if extension is already registered
    if (extensions.has(extension.name)) {
      console.warn(`Extension ${extension.name} is already registered. Overwriting...`);
    }
    
    // Initialize document processing if provided
    if (typeof extension.initializeDocumentProcessing === 'function') {
      const documentProcessingExtension = extension.initializeDocumentProcessing(documentProcessing);
      extension.documentProcessingExtension = documentProcessingExtension;
    }
    
    // Initialize other subsystems as needed
    // ...
    
    // Store extension
    extensions.set(extension.name, extension);
    
    console.log(`Extension ${extension.name} registered successfully`);
  } catch (error) {
    console.error(`Error registering extension ${extension.name}:`, error);
    throw error;
  }
}

/**
 * Get a registered extension by name
 * 
 * @param {string} name - Extension name
 * @returns {object|null} Extension or null if not found
 */
function getExtension(name) {
  return extensions.get(name) || null;
}

/**
 * Get all registered extensions
 * 
 * @returns {Array} Array of registered extensions
 */
function getAllExtensions() {
  return Array.from(extensions.values());
}

/**
 * Check if an extension is registered
 * 
 * @param {string} name - Extension name
 * @returns {boolean} True if extension is registered
 */
function hasExtension(name) {
  return extensions.has(name);
}

/**
 * Unregister an extension
 * 
 * @param {string} name - Extension name
 * @returns {boolean} True if extension was unregistered
 */
function unregister(name) {
  return extensions.delete(name);
}

module.exports = {
  register,
  getExtension,
  getAllExtensions,
  hasExtension,
  unregister
}; 
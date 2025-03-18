/**
 * Extension Registry
 * 
 * This module provides the enhanced extension registration system for BizzyPerson.
 * It manages the lifecycle of extensions and tracks their capabilities.
 */

const EventEmitter = require('events');
const semver = require('semver');

// Extension registry event emitter
class ExtensionRegistry extends EventEmitter {
  constructor() {
    super();
    
    // Store extensions by name
    this.extensions = new Map();
    
    // Store capabilities
    this.capabilities = {
      documentProcessors: new Map(),
      chatTools: new Map(),
      uiComponents: new Map(),
      dataModels: new Map(),
      anythingLLMIntegrations: new Map(),
      libreChatIntegrations: new Map()
    };
    
    // Store extension hooks
    this.hooks = new Map();
    
    // Extension states
    this.states = new Map();
    
    // Track extension dependencies
    this.dependencies = new Map();
  }
  
  /**
   * Register an extension with the platform
   * 
   * @param {object} extension - Extension object
   * @returns {object} Registered extension
   */
  register(extension) {
    if (!extension) {
      throw new Error('Cannot register null or undefined extension');
    }
    
    // Validate required fields
    this._validateExtension(extension);
    
    const extensionName = extension.name;
    const extensionVersion = extension.version;
    
    // Check if extension is already registered
    if (this.extensions.has(extensionName)) {
      // If the version is the same, don't re-register
      const existingExtension = this.extensions.get(extensionName);
      if (semver.eq(existingExtension.version, extensionVersion)) {
        return existingExtension;
      }
      
      this.emit('extension:replace', extensionName, existingExtension, extension);
    }
    
    // Emit registration events
    this.emit('extension:before-register', extensionName, extension);
    
    // Register hooks
    this._registerHooks(extensionName, extension);
    
    // Register capabilities
    this._registerCapabilities(extensionName, extension);
    
    // Add extension to registry
    this.extensions.set(extensionName, extension);
    
    // Set extension state to registered
    this.states.set(extensionName, {
      state: 'registered',
      timestamp: Date.now()
    });
    
    // Store dependencies
    if (extension.dependencies) {
      for (const [depName, versionRange] of Object.entries(extension.dependencies)) {
        if (depName === 'core') continue;
        
        // Track extensions that depend on this one
        if (!this.dependencies.has(depName)) {
          this.dependencies.set(depName, new Map());
        }
        this.dependencies.get(depName).set(extensionName, versionRange);
      }
    }
    
    // Emit registration events
    this.emit('extension:registered', extensionName, extension);
    
    return extension;
  }
  
  /**
   * Unregister an extension
   * 
   * @param {string} extensionName - Extension name
   * @returns {boolean} True if extension was unregistered
   */
  unregister(extensionName) {
    if (!this.extensions.has(extensionName)) {
      return false;
    }
    
    const extension = this.extensions.get(extensionName);
    
    // Emit unregister events
    this.emit('extension:before-unregister', extensionName, extension);
    
    // Remove hooks
    this._unregisterHooks(extensionName);
    
    // Remove capabilities
    this._unregisterCapabilities(extensionName);
    
    // Remove extension from registry
    this.extensions.delete(extensionName);
    
    // Remove extension state
    this.states.delete(extensionName);
    
    // Clean up dependency references
    for (const [depName, dependents] of this.dependencies.entries()) {
      dependents.delete(extensionName);
    }
    
    // Emit unregistered event
    this.emit('extension:unregistered', extensionName, extension);
    
    return true;
  }
  
  /**
   * Get a registered extension by name
   * 
   * @param {string} name - Extension name
   * @returns {object|null} Extension or null if not found
   */
  getExtension(name) {
    return this.extensions.get(name) || null;
  }
  
  /**
   * Get all registered extensions
   * 
   * @returns {Array} Array of registered extensions
   */
  getAllExtensions() {
    return Array.from(this.extensions.values());
  }
  
  /**
   * Check if an extension is registered
   * 
   * @param {string} name - Extension name
   * @returns {boolean} True if extension is registered
   */
  hasExtension(name) {
    return this.extensions.has(name);
  }
  
  /**
   * Get all extensions that provide a specific capability
   * 
   * @param {string} capabilityType - Type of capability (e.g., 'documentProcessors')
   * @returns {Array} Array of extensions that provide the capability
   */
  getExtensionsByCapability(capabilityType) {
    if (!this.capabilities[capabilityType]) {
      return [];
    }
    
    return Array.from(this.capabilities[capabilityType].keys())
      .map(name => this.getExtension(name))
      .filter(Boolean);
  }
  
  /**
   * Get a specific capability from an extension
   * 
   * @param {string} extensionName - Extension name
   * @param {string} capabilityType - Type of capability
   * @param {string} capabilityName - Name of specific capability
   * @returns {*} The capability or null if not found
   */
  getCapability(extensionName, capabilityType, capabilityName) {
    if (!this.capabilities[capabilityType]) {
      return null;
    }
    
    const extensionCapabilities = this.capabilities[capabilityType].get(extensionName);
    if (!extensionCapabilities) {
      return null;
    }
    
    return capabilityName ? extensionCapabilities[capabilityName] || null : extensionCapabilities;
  }
  
  /**
   * Get all extensions that depend on a specific extension
   * 
   * @param {string} extensionName - Extension name
   * @returns {Map} Map of dependent extensions with their required version ranges
   */
  getDependentExtensions(extensionName) {
    return this.dependencies.get(extensionName) || new Map();
  }
  
  /**
   * Check if all dependencies of an extension are satisfied
   * 
   * @param {object} extension - Extension object
   * @returns {object} Result with satisfied flag and missing dependencies
   */
  checkDependencies(extension) {
    const result = {
      satisfied: true,
      missing: []
    };
    
    if (!extension.dependencies) {
      return result;
    }
    
    for (const [depName, versionRange] of Object.entries(extension.dependencies)) {
      // Special case for core dependency
      if (depName === 'core') {
        // TODO: Check core version
        continue;
      }
      
      const depExtension = this.getExtension(depName);
      
      if (!depExtension) {
        result.satisfied = false;
        result.missing.push({
          name: depName,
          versionRange,
          reason: 'extension not found'
        });
        continue;
      }
      
      if (!semver.satisfies(depExtension.version, versionRange)) {
        result.satisfied = false;
        result.missing.push({
          name: depName,
          versionRange,
          actualVersion: depExtension.version,
          reason: 'version mismatch'
        });
      }
    }
    
    return result;
  }
  
  /**
   * Get the state of an extension
   * 
   * @param {string} extensionName - Extension name
   * @returns {object} Extension state
   */
  getExtensionState(extensionName) {
    return this.states.get(extensionName) || { state: 'unknown' };
  }
  
  /**
   * Get all extension states
   * 
   * @returns {object} Object mapping extension names to states
   */
  getAllExtensionStates() {
    const states = {};
    for (const [name, state] of this.states.entries()) {
      states[name] = state;
    }
    return states;
  }
  
  /**
   * Initialize an extension
   * 
   * @param {string} extensionName - Extension name
   * @returns {Promise<boolean>} True if initialization was successful
   */
  async initializeExtension(extensionName) {
    if (!this.hasExtension(extensionName)) {
      throw new Error(`Extension not found: ${extensionName}`);
    }
    
    const extension = this.getExtension(extensionName);
    
    // Check if already initialized
    const state = this.getExtensionState(extensionName);
    if (state.state === 'initialized') {
      return true;
    }
    
    // Set state to initializing
    this.states.set(extensionName, {
      state: 'initializing',
      timestamp: Date.now()
    });
    
    // Emit initialization events
    this.emit('extension:before-initialize', extensionName, extension);
    
    try {
      // Call initialize method if available
      if (typeof extension.initialize === 'function') {
        await extension.initialize({
          registry: this,
          hooks: this.hooks.get(extensionName) || {},
          capabilities: this._getExtensionCapabilities(extensionName)
        });
      }
      
      // Set state to initialized
      this.states.set(extensionName, {
        state: 'initialized',
        timestamp: Date.now()
      });
      
      // Emit initialization events
      this.emit('extension:initialized', extensionName, extension);
      
      return true;
    } catch (error) {
      // Set state to error
      this.states.set(extensionName, {
        state: 'error',
        error: error.message,
        timestamp: Date.now()
      });
      
      // Emit error event
      this.emit('extension:error', extensionName, error);
      
      throw error;
    }
  }
  
  /**
   * Validate an extension object
   * 
   * @private
   * @param {object} extension - Extension object
   */
  _validateExtension(extension) {
    // Required fields
    if (!extension.name) {
      throw new Error('Extension must have a name');
    }
    
    if (!extension.version) {
      throw new Error('Extension must have a version');
    }
    
    // Validate version format
    if (!semver.valid(extension.version)) {
      throw new Error(`Invalid version format: ${extension.version}`);
    }
  }
  
  /**
   * Register hooks for an extension
   * 
   * @private
   * @param {string} extensionName - Extension name
   * @param {object} extension - Extension object
   */
  _registerHooks(extensionName, extension) {
    const hooks = {};
    
    // Document processing hook
    if (typeof extension.initializeDocumentProcessing === 'function') {
      hooks.documentProcessing = extension.initializeDocumentProcessing;
    }
    
    // Chat hook
    if (typeof extension.initializeChat === 'function') {
      hooks.chat = extension.initializeChat;
    }
    
    // UI hook
    if (typeof extension.initializeUI === 'function') {
      hooks.ui = extension.initializeUI;
    }
    
    // AnythingLLM hook
    if (typeof extension.initializeAnythingLLM === 'function') {
      hooks.anythingLLM = extension.initializeAnythingLLM;
    }
    
    // LibreChat hook
    if (typeof extension.initializeLibreChat === 'function') {
      hooks.libreChat = extension.initializeLibreChat;
    }
    
    // Store hooks
    if (Object.keys(hooks).length > 0) {
      this.hooks.set(extensionName, hooks);
    }
  }
  
  /**
   * Unregister hooks for an extension
   * 
   * @private
   * @param {string} extensionName - Extension name
   */
  _unregisterHooks(extensionName) {
    this.hooks.delete(extensionName);
  }
  
  /**
   * Register capabilities for an extension
   * 
   * @private
   * @param {string} extensionName - Extension name
   * @param {object} extension - Extension object
   */
  _registerCapabilities(extensionName, extension) {
    // Document processors
    if (extension.documentProcessingExtension) {
      this.capabilities.documentProcessors.set(extensionName, extension.documentProcessingExtension);
    }
    
    // Chat tools
    if (extension.chatTools) {
      this.capabilities.chatTools.set(extensionName, extension.chatTools);
    }
    
    // UI components
    if (extension.uiComponents) {
      this.capabilities.uiComponents.set(extensionName, extension.uiComponents);
    }
    
    // Data models
    if (extension.dataModels) {
      this.capabilities.dataModels.set(extensionName, extension.dataModels);
    }
    
    // AnythingLLM integrations
    if (extension.anythingLLMIntegration) {
      this.capabilities.anythingLLMIntegrations.set(extensionName, extension.anythingLLMIntegration);
    }
    
    // LibreChat integrations
    if (extension.libreChatIntegration) {
      this.capabilities.libreChatIntegrations.set(extensionName, extension.libreChatIntegration);
    }
  }
  
  /**
   * Unregister capabilities for an extension
   * 
   * @private
   * @param {string} extensionName - Extension name
   */
  _unregisterCapabilities(extensionName) {
    for (const capabilityMap of Object.values(this.capabilities)) {
      capabilityMap.delete(extensionName);
    }
  }
  
  /**
   * Get all capabilities for an extension
   * 
   * @private
   * @param {string} extensionName - Extension name
   * @returns {object} Extension capabilities
   */
  _getExtensionCapabilities(extensionName) {
    const capabilities = {};
    
    for (const [type, capabilityMap] of Object.entries(this.capabilities)) {
      const capability = capabilityMap.get(extensionName);
      if (capability) {
        capabilities[type] = capability;
      }
    }
    
    return capabilities;
  }
}

// Create singleton registry instance
const registry = new ExtensionRegistry();

module.exports = registry; 
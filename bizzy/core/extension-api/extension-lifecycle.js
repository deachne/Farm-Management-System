/**
 * Extension Lifecycle Management
 * 
 * This module provides a comprehensive lifecycle management system for BizzyPerson extensions.
 * It handles extension installation, activation, deactivation, suspension, updating, and uninstallation.
 */

const path = require('path');
const fs = require('fs').promises;
const semver = require('semver');
const registry = require('./registry');

// Extension lifecycle states
const LifecycleState = {
  INSTALLED: 'installed',     // Extension is installed but not active
  ACTIVE: 'active',           // Extension is installed and active
  INACTIVE: 'inactive',       // Extension is intentionally disabled
  SUSPENDED: 'suspended',     // Extension is temporarily disabled due to errors or conflicts
  UPDATABLE: 'updatable',     // Extension has an update available
  UPDATING: 'updating',       // Extension is in the process of updating
  UNINSTALLING: 'uninstalling', // Extension is being uninstalled
  ERROR: 'error'              // Extension is in an error state
};

// Lifecycle state transitions
const allowedTransitions = {
  [LifecycleState.INSTALLED]: [LifecycleState.ACTIVE, LifecycleState.UNINSTALLING, LifecycleState.UPDATING, LifecycleState.ERROR],
  [LifecycleState.ACTIVE]: [LifecycleState.INACTIVE, LifecycleState.SUSPENDED, LifecycleState.UNINSTALLING, LifecycleState.UPDATING, LifecycleState.ERROR],
  [LifecycleState.INACTIVE]: [LifecycleState.ACTIVE, LifecycleState.UNINSTALLING, LifecycleState.UPDATING, LifecycleState.ERROR],
  [LifecycleState.SUSPENDED]: [LifecycleState.ACTIVE, LifecycleState.INACTIVE, LifecycleState.UNINSTALLING, LifecycleState.ERROR],
  [LifecycleState.UPDATABLE]: [LifecycleState.UPDATING, LifecycleState.ACTIVE, LifecycleState.INACTIVE, LifecycleState.ERROR],
  [LifecycleState.UPDATING]: [LifecycleState.ACTIVE, LifecycleState.INACTIVE, LifecycleState.ERROR],
  [LifecycleState.UNINSTALLING]: [LifecycleState.ERROR],
  [LifecycleState.ERROR]: [LifecycleState.INSTALLED, LifecycleState.INACTIVE, LifecycleState.SUSPENDED, LifecycleState.UNINSTALLING]
};

// Track the detailed lifecycle state of extensions
const lifecycleStates = new Map();

/**
 * Get the current lifecycle state of an extension
 * 
 * @param {string} extensionName - Name of the extension
 * @returns {object|null} The lifecycle state object or null if not found
 */
function getLifecycleState(extensionName) {
  // Get from lifecycle states if available
  if (lifecycleStates.has(extensionName)) {
    return lifecycleStates.get(extensionName);
  }
  
  // Try to derive from registry state
  if (registry.hasExtension(extensionName)) {
    const registryState = registry.getExtensionState(extensionName);
    let derivedState;
    
    switch (registryState.state) {
      case 'registered':
        derivedState = LifecycleState.INSTALLED;
        break;
      case 'initialized':
        derivedState = LifecycleState.ACTIVE;
        break;
      case 'initializing':
        derivedState = LifecycleState.INSTALLED;
        break;
      case 'error':
        derivedState = LifecycleState.ERROR;
        break;
      default:
        derivedState = LifecycleState.INSTALLED;
    }
    
    const lifecycleState = {
      state: derivedState,
      timestamp: registryState.timestamp || Date.now(),
      reason: registryState.error || null
    };
    
    // Cache the derived state
    lifecycleStates.set(extensionName, lifecycleState);
    
    return lifecycleState;
  }
  
  return null;
}

/**
 * Update the lifecycle state of an extension
 * 
 * @param {string} extensionName - Name of the extension
 * @param {string} newState - New lifecycle state
 * @param {string} reason - Reason for the state change
 * @returns {boolean} True if state was updated successfully
 */
function updateLifecycleState(extensionName, newState, reason = null) {
  // Check if extension exists
  if (!registry.hasExtension(extensionName)) {
    console.error(`Cannot update lifecycle state for extension ${extensionName}: Extension not found`);
    return false;
  }
  
  // Get current state
  const currentStateObj = getLifecycleState(extensionName) || { state: LifecycleState.INSTALLED };
  const currentState = currentStateObj.state;
  
  // Check if transition is allowed
  if (!allowedTransitions[currentState]?.includes(newState)) {
    console.error(`Invalid state transition for extension ${extensionName}: ${currentState} -> ${newState}`);
    return false;
  }
  
  // Update lifecycle state
  const updatedState = {
    state: newState,
    timestamp: Date.now(),
    reason: reason,
    previousState: currentState
  };
  
  lifecycleStates.set(extensionName, updatedState);
  
  // Emit state change event
  registry.emit('extension:lifecycle-change', extensionName, updatedState);
  
  console.log(`Extension ${extensionName} lifecycle state changed: ${currentState} -> ${newState}`);
  
  return true;
}

/**
 * Install an extension from a directory
 * 
 * @param {string} extensionPath - Path to the extension
 * @param {object} options - Installation options
 * @returns {Promise<object>} Installation result
 */
async function installExtension(extensionPath, options = {}) {
  try {
    console.log(`Installing extension from ${extensionPath}...`);
    
    // Validate extension path
    const stats = await fs.stat(extensionPath);
    if (!stats.isDirectory()) {
      throw new Error(`Extension path is not a directory: ${extensionPath}`);
    }
    
    // Check for manifest
    const manifestPath = path.join(extensionPath, 'manifest.json');
    let manifest;
    
    try {
      const manifestContent = await fs.readFile(manifestPath, 'utf8');
      manifest = JSON.parse(manifestContent);
    } catch (error) {
      throw new Error(`Failed to read manifest: ${error.message}`);
    }
    
    // Validate manifest
    if (!manifest.name || !manifest.version) {
      throw new Error('Invalid manifest: missing name or version');
    }
    
    const extensionName = manifest.name;
    const installDir = path.join(process.cwd(), 'extensions', extensionName);
    
    // Check if extension already exists
    if (registry.hasExtension(extensionName)) {
      // Get existing version
      const existingExtension = registry.getExtension(extensionName);
      
      if (options.upgrade) {
        // Check if new version is greater
        if (!semver.gt(manifest.version, existingExtension.version)) {
          throw new Error(`Cannot upgrade to version ${manifest.version}: Version is not greater than current version ${existingExtension.version}`);
        }
        
        console.log(`Upgrading extension ${extensionName} from ${existingExtension.version} to ${manifest.version}`);
        
        // Update lifecycle state
        updateLifecycleState(extensionName, LifecycleState.UPDATING, `Upgrading from ${existingExtension.version} to ${manifest.version}`);
        
        // Deactivate before upgrading
        await deactivateExtension(extensionName);
      } else {
        throw new Error(`Extension ${extensionName} is already installed. Use upgrade option to upgrade.`);
      }
    }
    
    // Create extension directory
    try {
      await fs.mkdir(installDir, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create extension directory: ${error.message}`);
    }
    
    // Copy extension files
    async function copyDir(src, dest) {
      // Create destination directory
      await fs.mkdir(dest, { recursive: true });
      
      // Read source directory
      const entries = await fs.readdir(src, { withFileTypes: true });
      
      // Copy each entry
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
          await copyDir(srcPath, destPath);
        } else {
          await fs.copyFile(srcPath, destPath);
        }
      }
    }
    
    await copyDir(extensionPath, installDir);
    
    // Set lifecycle state to installed
    lifecycleStates.set(extensionName, {
      state: LifecycleState.INSTALLED,
      timestamp: Date.now(),
      version: manifest.version,
      installPath: installDir
    });
    
    // Emit installation event
    registry.emit('extension:installed', extensionName, manifest);
    
    console.log(`Extension ${extensionName} installed successfully`);
    
    // Activate if requested
    if (options.activate !== false) {
      await activateExtension(extensionName);
    }
    
    return {
      name: extensionName,
      version: manifest.version,
      path: installDir,
      success: true
    };
  } catch (error) {
    console.error(`Error installing extension: ${error.message}`);
    
    // Emit installation failed event
    registry.emit('extension:installation-failed', error);
    
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Uninstall an extension
 * 
 * @param {string} extensionName - Name of the extension
 * @returns {Promise<object>} Uninstallation result
 */
async function uninstallExtension(extensionName) {
  try {
    console.log(`Uninstalling extension ${extensionName}...`);
    
    // Check if extension exists
    if (!registry.hasExtension(extensionName)) {
      throw new Error(`Extension ${extensionName} is not installed`);
    }
    
    // Update lifecycle state
    updateLifecycleState(extensionName, LifecycleState.UNINSTALLING);
    
    // Deactivate extension
    await deactivateExtension(extensionName);
    
    // Get extension directory
    const extensionDir = path.join(process.cwd(), 'extensions', extensionName);
    
    // Remove extension from registry
    registry.unregister(extensionName);
    
    // Remove lifecycle state
    lifecycleStates.delete(extensionName);
    
    // Remove extension directory
    try {
      await fs.rm(extensionDir, { recursive: true, force: true });
    } catch (error) {
      console.error(`Failed to remove extension directory: ${error.message}`);
      // Continue with uninstallation even if directory removal fails
    }
    
    // Emit uninstallation event
    registry.emit('extension:uninstalled', extensionName);
    
    console.log(`Extension ${extensionName} uninstalled successfully`);
    
    return {
      name: extensionName,
      success: true
    };
  } catch (error) {
    console.error(`Error uninstalling extension: ${error.message}`);
    
    // Update lifecycle state to error
    if (registry.hasExtension(extensionName)) {
      updateLifecycleState(extensionName, LifecycleState.ERROR, error.message);
    }
    
    // Emit uninstallation failed event
    registry.emit('extension:uninstallation-failed', extensionName, error);
    
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Activate an extension
 * 
 * @param {string} extensionName - Name of the extension
 * @returns {Promise<boolean>} True if activation was successful
 */
async function activateExtension(extensionName) {
  try {
    console.log(`Activating extension ${extensionName}...`);
    
    // Check if extension exists
    if (!registry.hasExtension(extensionName)) {
      throw new Error(`Extension ${extensionName} is not installed`);
    }
    
    // Get current lifecycle state
    const currentState = getLifecycleState(extensionName);
    if (currentState.state === LifecycleState.ACTIVE) {
      console.log(`Extension ${extensionName} is already active`);
      return true;
    }
    
    // Check for dependency issues
    const extension = registry.getExtension(extensionName);
    const depCheck = registry.checkDependencies(extension);
    
    if (!depCheck.satisfied) {
      throw new Error(`Dependencies not satisfied: ${JSON.stringify(depCheck.missing)}`);
    }
    
    // Update lifecycle state
    updateLifecycleState(extensionName, LifecycleState.ACTIVE);
    
    // Initialize extension
    await registry.initializeExtension(extensionName);
    
    // Emit activation event
    registry.emit('extension:activated', extensionName, extension);
    
    console.log(`Extension ${extensionName} activated successfully`);
    
    return true;
  } catch (error) {
    console.error(`Error activating extension ${extensionName}: ${error.message}`);
    
    // Update lifecycle state to error
    updateLifecycleState(extensionName, LifecycleState.ERROR, error.message);
    
    // Emit activation failed event
    registry.emit('extension:activation-failed', extensionName, error);
    
    return false;
  }
}

/**
 * Deactivate an extension
 * 
 * @param {string} extensionName - Name of the extension
 * @param {object} options - Deactivation options
 * @returns {Promise<boolean>} True if deactivation was successful
 */
async function deactivateExtension(extensionName, options = {}) {
  try {
    console.log(`Deactivating extension ${extensionName}...`);
    
    // Check if extension exists
    if (!registry.hasExtension(extensionName)) {
      throw new Error(`Extension ${extensionName} is not installed`);
    }
    
    // Get extension
    const extension = registry.getExtension(extensionName);
    
    // Check for dependent extensions
    const dependents = registry.getDependentExtensions(extensionName);
    
    if (dependents.size > 0 && !options.force) {
      const dependentNames = Array.from(dependents.keys()).join(', ');
      throw new Error(`Cannot deactivate extension ${extensionName}: It is required by ${dependentNames}`);
    }
    
    // Call deactivate method if available
    if (typeof extension.deactivate === 'function') {
      try {
        await extension.deactivate();
      } catch (deactivateError) {
        console.error(`Error in extension deactivate method: ${deactivateError.message}`);
        // Continue with deactivation even if deactivate method fails
      }
    }
    
    // Update lifecycle state
    const newState = options.suspended ? LifecycleState.SUSPENDED : LifecycleState.INACTIVE;
    updateLifecycleState(extensionName, newState, options.reason);
    
    // Emit deactivation event
    registry.emit('extension:deactivated', extensionName, extension);
    
    console.log(`Extension ${extensionName} deactivated successfully`);
    
    return true;
  } catch (error) {
    console.error(`Error deactivating extension ${extensionName}: ${error.message}`);
    
    // Emit deactivation failed event
    registry.emit('extension:deactivation-failed', extensionName, error);
    
    return false;
  }
}

/**
 * Suspend an extension due to errors or conflicts
 * 
 * @param {string} extensionName - Name of the extension
 * @param {string} reason - Reason for suspension
 * @returns {Promise<boolean>} True if suspension was successful
 */
async function suspendExtension(extensionName, reason) {
  console.log(`Suspending extension ${extensionName}: ${reason}`);
  
  return await deactivateExtension(extensionName, {
    suspended: true,
    reason
  });
}

/**
 * Resume a suspended extension
 * 
 * @param {string} extensionName - Name of the extension
 * @returns {Promise<boolean>} True if resumption was successful
 */
async function resumeExtension(extensionName) {
  try {
    console.log(`Resuming extension ${extensionName}...`);
    
    // Check if extension exists
    if (!registry.hasExtension(extensionName)) {
      throw new Error(`Extension ${extensionName} is not installed`);
    }
    
    // Get current lifecycle state
    const currentState = getLifecycleState(extensionName);
    if (currentState.state !== LifecycleState.SUSPENDED) {
      throw new Error(`Extension ${extensionName} is not suspended`);
    }
    
    // Activate the extension
    return await activateExtension(extensionName);
  } catch (error) {
    console.error(`Error resuming extension ${extensionName}: ${error.message}`);
    
    // Emit resumption failed event
    registry.emit('extension:resumption-failed', extensionName, error);
    
    return false;
  }
}

/**
 * Check for extension updates
 * 
 * @param {string} extensionName - Name of the extension
 * @returns {Promise<object>} Update check result
 */
async function checkForUpdate(extensionName) {
  try {
    console.log(`Checking for updates for extension ${extensionName}...`);
    
    // Check if extension exists
    if (!registry.hasExtension(extensionName)) {
      throw new Error(`Extension ${extensionName} is not installed`);
    }
    
    // Get extension
    const extension = registry.getExtension(extensionName);
    const currentVersion = extension.version;
    
    // TODO: Implement update source checking
    // This would typically involve checking a repository or update server
    // For now, we'll just return no update available
    
    return {
      name: extensionName,
      currentVersion,
      hasUpdate: false,
      latestVersion: currentVersion
    };
  } catch (error) {
    console.error(`Error checking for updates for extension ${extensionName}: ${error.message}`);
    
    return {
      name: extensionName,
      success: false,
      error: error.message
    };
  }
}

/**
 * Get all extensions with their lifecycle states
 * 
 * @returns {Array<object>} Array of extensions with lifecycle states
 */
function getAllExtensionsWithStates() {
  const extensions = registry.getAllExtensions();
  
  return extensions.map(extension => {
    const lifecycleState = getLifecycleState(extension.name) || { state: LifecycleState.INSTALLED };
    
    return {
      ...extension,
      lifecycleState
    };
  });
}

// Set up event listeners
registry.on('extension:registered', (name, extension) => {
  console.log(`Extension registered event received: ${name} v${extension.version}`);
  
  // Set initial lifecycle state if not already set
  if (!lifecycleStates.has(name)) {
    lifecycleStates.set(name, {
      state: LifecycleState.INSTALLED,
      timestamp: Date.now(),
      version: extension.version
    });
  }
});

registry.on('extension:initialized', (name, extension) => {
  console.log(`Extension initialized event received: ${name} v${extension.version}`);
  
  // Update lifecycle state
  updateLifecycleState(name, LifecycleState.ACTIVE);
});

registry.on('extension:error', (name, error) => {
  console.error(`Extension error event received: ${name} - ${error.message}`);
  
  // Update lifecycle state
  updateLifecycleState(name, LifecycleState.ERROR, error.message);
});

// Export the lifecycle management functions
module.exports = {
  LifecycleState,
  getLifecycleState,
  updateLifecycleState,
  installExtension,
  uninstallExtension,
  activateExtension,
  deactivateExtension,
  suspendExtension,
  resumeExtension,
  checkForUpdate,
  getAllExtensionsWithStates
}; 
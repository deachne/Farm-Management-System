/**
 * Extension API Hooks
 * 
 * This module provides the extension registration system for BizzyPerson.
 * It allows extensions to register with the platform and integrate with
 * various subsystems.
 */

const documentProcessing = require('../shared/document-processing');
const path = require('path');
const fs = require('fs').promises;
const semver = require('semver');
const registry = require('./registry');

// Extension state enum
const ExtensionState = {
  PENDING: 'pending',
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error'
};

// Map legacy extension states to new format
const mapLegacyState = (legacyState) => {
  switch (legacyState) {
    case ExtensionState.PENDING: return 'registered';
    case ExtensionState.LOADING: return 'initializing';
    case ExtensionState.LOADED: return 'initialized';
    case ExtensionState.ERROR: return 'error';
    default: return 'unknown';
  }
};

// Track extension states during loading
const extensionStates = new Map();

/**
 * Register an extension with the platform
 * 
 * @param {object} extension - Extension configuration
 * @returns {object} The registered extension
 */
function register(extension) {
  try {
    console.log(`Registering extension: ${extension.name} v${extension.version}`);
    
    // Initialize document processing if provided
    if (typeof extension.initializeDocumentProcessing === 'function') {
      const documentProcessingExtension = extension.initializeDocumentProcessing(documentProcessing);
      extension.documentProcessingExtension = documentProcessingExtension;
    }
    
    // Register with the registry
    const registeredExtension = registry.register(extension);
    
    console.log(`Extension ${extension.name} registered successfully`);
    return registeredExtension;
  } catch (error) {
    console.error(`Error registering extension ${extension.name}:`, error);
    extensionStates.set(extension.name, {
      state: ExtensionState.ERROR,
      error: error.message
    });
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
  return registry.getExtension(name);
}

/**
 * Get all registered extensions
 * 
 * @returns {Array} Array of registered extensions
 */
function getAllExtensions() {
  return registry.getAllExtensions();
}

/**
 * Check if an extension is registered
 * 
 * @param {string} name - Extension name
 * @returns {boolean} True if extension is registered
 */
function hasExtension(name) {
  return registry.hasExtension(name);
}

/**
 * Unregister an extension
 * 
 * @param {string} name - Extension name
 * @returns {boolean} True if extension was unregistered
 */
function unregister(name) {
  return registry.unregister(name);
}

/**
 * Parse extension manifest
 * 
 * @param {string} manifestPath - Path to manifest.json
 * @returns {Promise<object>} Parsed manifest
 */
async function parseManifest(manifestPath) {
  try {
    const manifestContent = await fs.readFile(manifestPath, 'utf8');
    return JSON.parse(manifestContent);
  } catch (error) {
    throw new Error(`Failed to parse manifest at ${manifestPath}: ${error.message}`);
  }
}

/**
 * Check if extension dependencies are satisfied
 * 
 * @param {object} manifest - Extension manifest
 * @returns {Promise<{satisfied: boolean, missing: Array}>} Result of dependency check
 */
async function checkDependencies(manifest) {
  // Create extension object from manifest for registry compatibility
  const extension = {
    name: manifest.name,
    version: manifest.version,
    dependencies: manifest.dependencies
  };
  
  return registry.checkDependencies(extension);
}

/**
 * Load extension from path
 * 
 * @param {string} extensionDir - Extension directory name
 * @param {string} extensionsDir - Base extensions directory
 * @returns {Promise<object>} Loaded extension or null if failed
 */
async function loadExtension(extensionDir, extensionsDir) {
  const extensionPath = path.join(extensionsDir, extensionDir);
  const extensionName = path.basename(extensionDir);
  
  // Track extension state
  extensionStates.set(extensionName, { state: ExtensionState.PENDING });
  
  try {
    // Check for manifest
    const manifestPath = path.join(extensionPath, 'manifest.json');
    const manifestExists = await fs.stat(manifestPath).then(() => true).catch(() => false);
    
    if (!manifestExists) {
      throw new Error(`No manifest.json found in ${extensionPath}`);
    }
    
    // Parse manifest
    const manifest = await parseManifest(manifestPath);
    
    // Set extension state to loading
    extensionStates.set(extensionName, { 
      state: ExtensionState.LOADING,
      manifest
    });
    
    // Check dependencies
    const depCheck = await checkDependencies(manifest);
    if (!depCheck.satisfied) {
      throw new Error(`Dependency check failed: ${JSON.stringify(depCheck.missing)}`);
    }
    
    // Load extension module
    let extensionModule;
    
    // Try to load TypeScript or JavaScript entry point
    const indexJsPath = path.join(extensionPath, 'index.js');
    const indexTsPath = path.join(extensionPath, 'index.ts');
    
    const jsExists = await fs.stat(indexJsPath).then(() => true).catch(() => false);
    const tsExists = await fs.stat(indexTsPath).then(() => true).catch(() => false);
    
    if (jsExists) {
      extensionModule = require(indexJsPath);
    } else if (tsExists) {
      // For TypeScript extensions, we need to ensure TypeScript is available and compiled
      try {
        // Check if ts-node is available
        require.resolve('ts-node');
        
        // Register ts-node
        require('ts-node').register({
          transpileOnly: true,
          compilerOptions: {
            module: 'commonjs',
            target: 'es2020',
            esModuleInterop: true
          }
        });
        
        extensionModule = require(indexTsPath);
      } catch (err) {
        throw new Error(`Failed to load TypeScript extension. Is ts-node installed? Error: ${err.message}`);
      }
    } else {
      throw new Error(`No index.js or index.ts found in ${extensionPath}`);
    }
    
    // Initialize the extension
    const extensionObject = registry.getExtension(extensionName);
    if (extensionObject) {
      await registry.initializeExtension(extensionName);
      
      // Store successfully loaded extension
      extensionStates.set(extensionName, { 
        state: ExtensionState.LOADED,
        manifest
      });
    } else {
      // If the extension wasn't registered, something went wrong
      throw new Error(`Extension ${extensionName} was not properly registered`);
    }
    
    // Return the registered extension
    return extensionModule;
  } catch (error) {
    console.error(`Error loading extension ${extensionName}:`, error);
    extensionStates.set(extensionName, {
      state: ExtensionState.ERROR,
      error: error.message
    });
    
    // Update registry state as well
    if (registry.hasExtension(extensionName)) {
      registry.states.set(extensionName, {
        state: 'error',
        error: error.message,
        timestamp: Date.now()
      });
    }
    
    return null;
  }
}

/**
 * Sort extensions by dependency order
 * 
 * @param {Array<string>} extensionDirs - Extension directory names
 * @param {string} extensionsDir - Base extensions directory
 * @returns {Promise<Array<string>>} Sorted extension directory names
 */
async function sortExtensionsByDependency(extensionDirs, extensionsDir) {
  const dependencyGraph = new Map();
  const manifestCache = new Map();
  
  // Build dependency graph
  for (const dir of extensionDirs) {
    try {
      const manifestPath = path.join(extensionsDir, dir, 'manifest.json');
      const manifest = await parseManifest(manifestPath);
      manifestCache.set(dir, manifest);
      
      const deps = new Set();
      if (manifest.dependencies) {
        for (const depName of Object.keys(manifest.dependencies)) {
          if (depName !== 'core') {
            deps.add(depName);
          }
        }
      }
      
      dependencyGraph.set(manifest.name, deps);
    } catch (error) {
      console.warn(`Failed to load manifest for ${dir}:`, error);
      dependencyGraph.set(dir, new Set());
    }
  }
  
  // Topological sort
  const result = [];
  const visited = new Set();
  const temp = new Set();
  
  function visit(node) {
    if (temp.has(node)) {
      throw new Error(`Circular dependency detected involving ${node}`);
    }
    
    if (visited.has(node)) {
      return;
    }
    
    temp.add(node);
    
    const deps = dependencyGraph.get(node) || new Set();
    for (const dep of deps) {
      visit(dep);
    }
    
    temp.delete(node);
    visited.add(node);
    result.push(node);
  }
  
  // Visit all nodes
  for (const node of dependencyGraph.keys()) {
    if (!visited.has(node)) {
      visit(node);
    }
  }
  
  // Map sorted extension names back to directory names
  const dirMap = new Map();
  for (const [dir, manifest] of manifestCache.entries()) {
    dirMap.set(manifest.name, dir);
  }
  
  return result
    .map(name => dirMap.get(name))
    .filter(Boolean); // Filter out any nulls
}

/**
 * Get extension loading status
 * 
 * @returns {object} Extension loading states
 */
function getExtensionLoadingStatus() {
  // Merge legacy states with registry states
  const states = {};
  
  // First add the legacy states
  for (const [name, state] of extensionStates.entries()) {
    states[name] = {
      state: state.state,
      error: state.error
    };
  }
  
  // Then add registry states, which take precedence
  const registryStates = registry.getAllExtensionStates();
  for (const [name, state] of Object.entries(registryStates)) {
    states[name] = {
      state: state.state,
      error: state.error,
      timestamp: state.timestamp
    };
  }
  
  return states;
}

/**
 * Get extensions that depend on the specified extension
 * 
 * @param {string} extensionName - Extension name
 * @returns {Array<string>} Names of dependent extensions
 */
function getDependentExtensions(extensionName) {
  const dependents = registry.getDependentExtensions(extensionName);
  return Array.from(dependents.keys());
}

/**
 * Get all extensions that provide a specific capability
 * 
 * @param {string} capabilityType - Type of capability (e.g., 'documentProcessors')
 * @returns {Array} Array of extensions that provide the capability
 */
function getExtensionsByCapability(capabilityType) {
  return registry.getExtensionsByCapability(capabilityType);
}

/**
 * Get a specific capability from an extension
 * 
 * @param {string} extensionName - Extension name
 * @param {string} capabilityType - Type of capability
 * @param {string} capabilityName - Name of specific capability
 * @returns {*} The capability or null if not found
 */
function getCapability(extensionName, capabilityType, capabilityName) {
  return registry.getCapability(extensionName, capabilityType, capabilityName);
}

// Set up registry event listeners
registry.on('extension:registered', (name, extension) => {
  console.log(`Event: Extension registered - ${name} v${extension.version}`);
});

registry.on('extension:initialized', (name, extension) => {
  console.log(`Event: Extension initialized - ${name} v${extension.version}`);
});

registry.on('extension:error', (name, error) => {
  console.error(`Event: Extension error - ${name}: ${error.message}`);
});

module.exports = {
  register,
  getExtension,
  getAllExtensions,
  hasExtension,
  unregister,
  loadExtension,
  parseManifest,
  checkDependencies,
  sortExtensionsByDependency,
  getExtensionLoadingStatus,
  getDependentExtensions,
  getExtensionsByCapability,
  getCapability,
  ExtensionState,
  // Export registry for advanced usage
  registry
}; 
/**
 * Extension Permissions System
 * 
 * This module provides a comprehensive permissions system for BizzyPerson extensions,
 * allowing fine-grained control over what resources and capabilities extensions can access.
 */

const path = require('path');
const fs = require('fs').promises;
const registry = require('./registry');
const EventEmitter = require('events');

// Define permission categories
const ResourcePermissions = [
  'read-documents',
  'write-documents',
  'delete-documents',
  'read-chats',
  'write-chats',
  'user-data',
  'system-settings'
];

const ActionPermissions = [
  'network-access',
  'file-system',
  'use-chat',
  'use-tools',
  'use-embeddings',
  'use-ui',
  'store-data'
];

const ContextPermissions = [
  'run-on-startup',
  'run-in-background',
  'run-on-schedule',
  'intercept-requests'
];

// All valid permissions
const AllPermissions = [
  ...ResourcePermissions,
  ...ActionPermissions,
  ...ContextPermissions
];

// Permissions that are considered dangerous and require special attention
const DangerousPermissions = [
  'file-system',
  'system-settings',
  'network-access',
  'intercept-requests'
];

// Default permission requirements for various capabilities
const CapabilityPermissionRequirements = {
  'document-processor': ['read-documents'],
  'chat-tool': ['use-chat'],
  'ui-component': ['use-ui'],
  'data-model': ['store-data'],
  'anythingllm-integration': ['read-documents', 'write-documents'],
  'librechat-integration': ['use-chat']
};

// Default permission policies
const DefaultPermissionPolicies = {
  globalDenyList: [],
  requireApprovalFor: DangerousPermissions,
  autoGrantSafe: true,
  rememberDecisions: true
};

/**
 * Permission manager class for controlling extension permissions
 */
class PermissionManager extends EventEmitter {
  constructor() {
    super();
    this.permissions = new Map(); // Maps extension IDs to granted permissions
    this.policies = { ...DefaultPermissionPolicies };
    this.permissionHistory = new Map(); // Maps extension IDs to permission history
    this.permissionStorage = null;
    
    // Initialize from storage when available
    this.initialized = this.initialize();
  }
  
  /**
   * Initialize the permission manager
   */
  async initialize() {
    try {
      // Try to load permissions from storage
      await this.loadPermissions();
      
      // Listen for extension registration events
      registry.on('extension:registered', this.handleExtensionRegistered.bind(this));
      registry.on('extension:unregistered', this.handleExtensionUnregistered.bind(this));
      
      return true;
    } catch (error) {
      console.error('Failed to initialize permission manager:', error);
      return false;
    }
  }
  
  /**
   * Load permissions from storage
   */
  async loadPermissions() {
    try {
      const storagePath = path.join(process.cwd(), 'data', 'permissions.json');
      
      try {
        const data = await fs.readFile(storagePath, 'utf8');
        const storage = JSON.parse(data);
        
        // Load policies
        if (storage.policies) {
          this.policies = {
            ...DefaultPermissionPolicies,
            ...storage.policies
          };
        }
        
        // Load extension permissions
        if (storage.extensions) {
          for (const [extensionId, extensionPerms] of Object.entries(storage.extensions)) {
            if (extensionPerms.grantedPermissions) {
              this.permissions.set(
                extensionId, 
                new Set(extensionPerms.grantedPermissions)
              );
            }
            
            if (extensionPerms.permissionHistory) {
              this.permissionHistory.set(
                extensionId,
                extensionPerms.permissionHistory
              );
            }
          }
        }
        
        this.permissionStorage = storage;
        return true;
      } catch (err) {
        if (err.code !== 'ENOENT') {
          throw err;
        }
        
        // File doesn't exist, create default storage
        this.permissionStorage = {
          extensions: {},
          policies: this.policies
        };
        
        await this.savePermissions();
        return true;
      }
    } catch (error) {
      console.error('Failed to load permissions:', error);
      return false;
    }
  }
  
  /**
   * Save permissions to storage
   */
  async savePermissions() {
    try {
      const storagePath = path.join(process.cwd(), 'data', 'permissions.json');
      const storageDir = path.dirname(storagePath);
      
      // Create directory if it doesn't exist
      try {
        await fs.mkdir(storageDir, { recursive: true });
      } catch (err) {
        if (err.code !== 'EEXIST') {
          throw err;
        }
      }
      
      // Prepare storage object
      const storage = {
        extensions: {},
        policies: this.policies
      };
      
      // Convert permissions map to storage format
      for (const [extensionId, permissions] of this.permissions.entries()) {
        storage.extensions[extensionId] = {
          grantedPermissions: Array.from(permissions),
          permissionHistory: this.permissionHistory.get(extensionId) || []
        };
      }
      
      // Write to file
      await fs.writeFile(
        storagePath, 
        JSON.stringify(storage, null, 2), 
        'utf8'
      );
      
      this.permissionStorage = storage;
      return true;
    } catch (error) {
      console.error('Failed to save permissions:', error);
      return false;
    }
  }
  
  /**
   * Handle extension registration
   */
  async handleExtensionRegistered(extensionName, extension) {
    try {
      // Check for permissions in manifest
      const requiredPermissions = extension.manifest?.permissions || [];
      const optionalPermissions = extension.manifest?.optionalPermissions || [];
      
      // Validate permissions
      const validationResult = this.validatePermissions([
        ...requiredPermissions,
        ...optionalPermissions
      ]);
      
      if (!validationResult.valid) {
        console.warn(`Extension ${extensionName} has invalid permissions:`, 
          validationResult.invalidPermissions);
      }
      
      // If dangerous permissions are requested, log them
      if (validationResult.dangerousPermissions.length > 0) {
        console.warn(`Extension ${extensionName} requests dangerous permissions:`, 
          validationResult.dangerousPermissions);
      }
      
      // If auto-grant is enabled for safe permissions, grant them
      if (this.policies.autoGrantSafe) {
        const safePermissions = requiredPermissions.filter(
          p => !this.policies.requireApprovalFor.includes(p)
        );
        
        for (const permission of safePermissions) {
          if (validationResult.invalidPermissions.includes(permission)) {
            continue;
          }
          
          this.grantPermission(extensionName, permission);
          
          // Record in history
          this.addPermissionHistory(extensionName, permission, 'granted', 
            'Auto-granted safe permission');
        }
      }
      
      // Emit event
      this.emit('extension:permissions-checked', extensionName, {
        requiredPermissions,
        optionalPermissions,
        validationResult
      });
      
      // Save updated permissions
      await this.savePermissions();
    } catch (error) {
      console.error(`Error handling extension registration for ${extensionName}:`, error);
    }
  }
  
  /**
   * Handle extension unregistration
   */
  async handleExtensionUnregistered(extensionName) {
    // Clear permissions for the unregistered extension
    this.clearPermissions(extensionName);
    
    // Save updated permissions
    await this.savePermissions();
  }
  
  /**
   * Add an entry to the permission history for an extension
   */
  addPermissionHistory(extensionId, permission, action, reason = null) {
    if (!this.permissionHistory.has(extensionId)) {
      this.permissionHistory.set(extensionId, []);
    }
    
    const history = this.permissionHistory.get(extensionId);
    history.push({
      permission,
      action,
      timestamp: new Date().toISOString(),
      reason
    });
    
    // Keep history at a reasonable size
    if (history.length > 100) {
      history.shift();
    }
  }
  
  /**
   * Validate a list of permissions
   */
  validatePermissions(permissions) {
    const invalidPermissions = [];
    const dangerousPermissions = [];
    
    for (const permission of permissions) {
      if (!AllPermissions.includes(permission)) {
        invalidPermissions.push(permission);
      }
      
      if (DangerousPermissions.includes(permission)) {
        dangerousPermissions.push(permission);
      }
    }
    
    return {
      valid: invalidPermissions.length === 0,
      invalidPermissions,
      dangerousPermissions
    };
  }
  
  /**
   * Get permission requirements for a capability
   */
  getPermissionsByCapability(capability) {
    return CapabilityPermissionRequirements[capability] || [];
  }
  
  /**
   * Check if an extension has the required permissions for a capability
   */
  hasPermissionRequirement(extensionName, capability) {
    const requiredPermissions = this.getPermissionsByCapability(capability);
    
    for (const permission of requiredPermissions) {
      if (!this.hasPermission(extensionName, permission)) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Grant a permission to an extension
   */
  grantPermission(extensionId, permission) {
    // Check if permission is valid
    if (!AllPermissions.includes(permission)) {
      console.error(`Invalid permission: ${permission}`);
      return false;
    }
    
    // Check if permission is in global deny list
    if (this.policies.globalDenyList.includes(permission)) {
      console.error(`Permission ${permission} is in global deny list`);
      return false;
    }
    
    // Initialize extension permissions if not present
    if (!this.permissions.has(extensionId)) {
      this.permissions.set(extensionId, new Set());
    }
    
    // Grant the permission
    this.permissions.get(extensionId).add(permission);
    
    // Record in history
    this.addPermissionHistory(extensionId, permission, 'granted');
    
    // Emit event
    this.emit('permission:granted', extensionId, permission);
    
    return true;
  }
  
  /**
   * Check if an extension has a permission
   */
  hasPermission(extensionId, permission) {
    // Check if extension exists
    if (!this.permissions.has(extensionId)) {
      return false;
    }
    
    // Check if permission is granted
    return this.permissions.get(extensionId).has(permission);
  }
  
  /**
   * Revoke a permission from an extension
   */
  revokePermission(extensionId, permission) {
    // Check if extension exists
    if (!this.permissions.has(extensionId)) {
      return false;
    }
    
    // Revoke the permission
    const result = this.permissions.get(extensionId).delete(permission);
    
    if (result) {
      // Record in history
      this.addPermissionHistory(extensionId, permission, 'revoked');
      
      // Emit event
      this.emit('permission:revoked', extensionId, permission);
    }
    
    return result;
  }
  
  /**
   * Get all permissions for an extension
   */
  getPermissions(extensionId) {
    // Check if extension exists
    if (!this.permissions.has(extensionId)) {
      return [];
    }
    
    // Return permissions as array
    return Array.from(this.permissions.get(extensionId));
  }
  
  /**
   * Clear all permissions for an extension
   */
  clearPermissions(extensionId) {
    const result = this.permissions.delete(extensionId);
    
    if (result) {
      // Record in history
      this.addPermissionHistory(extensionId, 'all', 'cleared');
      
      // Emit event
      this.emit('permissions:cleared', extensionId);
    }
    
    return result;
  }
  
  /**
   * Request a permission from the user
   */
  async requestPermission(extensionId, permission, options = {}) {
    // Check if permission is valid
    if (!AllPermissions.includes(permission)) {
      console.error(`Invalid permission: ${permission}`);
      return false;
    }
    
    // Check if already granted
    if (this.hasPermission(extensionId, permission)) {
      return true;
    }
    
    // Check if in global deny list
    if (this.policies.globalDenyList.includes(permission)) {
      console.error(`Permission ${permission} is in global deny list`);
      return false;
    }
    
    try {
      // TODO: Implement user interaction for permission requests
      // For now, we'll simply log the request and auto-grant non-dangerous permissions
      
      console.log(`Extension ${extensionId} is requesting permission: ${permission}`);
      if (options.reason) {
        console.log(`Reason: ${options.reason}`);
      }
      
      // Auto-grant if not requiring approval
      if (!this.policies.requireApprovalFor.includes(permission)) {
        return this.grantPermission(extensionId, permission);
      }
      
      // For dangerous permissions, we'll deny for now until UI is implemented
      console.log(`Permission ${permission} requires user approval`);
      
      // Record in history
      this.addPermissionHistory(
        extensionId, 
        permission, 
        'requested', 
        options.reason || 'Extension requested at runtime'
      );
      
      // Emit event
      this.emit('permission:requested', extensionId, permission, options);
      
      // Auto-deny dangerous permissions for now
      return false;
    } catch (error) {
      console.error(`Error requesting permission for ${extensionId}:`, error);
      return false;
    }
  }
  
  /**
   * Request user approval for required and optional permissions
   */
  async requestUserApproval(extensionName, requiredPermissions, optionalPermissions = []) {
    try {
      // TODO: Implement user interaction for approval
      // For now, we'll auto-grant non-dangerous permissions
      
      console.log(`Extension ${extensionName} requesting approval for permissions:`, {
        required: requiredPermissions,
        optional: optionalPermissions
      });
      
      const allPermissions = [...requiredPermissions, ...optionalPermissions];
      const validationResult = this.validatePermissions(allPermissions);
      
      if (!validationResult.valid) {
        return {
          granted: false,
          deniedPermissions: validationResult.invalidPermissions,
          error: 'Invalid permissions requested'
        };
      }
      
      const deniedPermissions = [];
      
      // Auto-grant non-dangerous required permissions
      for (const permission of requiredPermissions) {
        if (this.policies.requireApprovalFor.includes(permission)) {
          // This is a dangerous permission, we'll deny for now
          deniedPermissions.push(permission);
          
          // Record in history
          this.addPermissionHistory(
            extensionName, 
            permission, 
            'denied', 
            'Dangerous permission auto-denied'
          );
        } else {
          // Non-dangerous permission, auto-grant
          this.grantPermission(extensionName, permission);
        }
      }
      
      // Don't auto-grant optional permissions for now
      deniedPermissions.push(...optionalPermissions);
      
      // Save updated permissions
      await this.savePermissions();
      
      return {
        granted: deniedPermissions.length === 0,
        deniedPermissions
      };
    } catch (error) {
      console.error(`Error requesting user approval for ${extensionName}:`, error);
      
      return {
        granted: false,
        deniedPermissions: [...requiredPermissions, ...optionalPermissions],
        error: error.message
      };
    }
  }
  
  /**
   * Get all permission policies
   */
  getPermissionPolicies() {
    return { ...this.policies };
  }
  
  /**
   * Set a permission policy
   */
  setPermissionPolicy(policyName, value) {
    if (!(policyName in this.policies)) {
      console.error(`Invalid policy name: ${policyName}`);
      return false;
    }
    
    this.policies[policyName] = value;
    
    // Emit event
    this.emit('policy:updated', policyName, value);
    
    // Save updated policies
    this.savePermissions();
    
    return true;
  }
}

// Create permission manager instance
const permissionManager = new PermissionManager();

/**
 * Create a permission API for a specific extension
 */
function createPermissionAPI(extensionName) {
  return {
    hasPermission(permission) {
      return permissionManager.hasPermission(extensionName, permission);
    },
    
    async requestPermission(permission, options = {}) {
      return permissionManager.requestPermission(extensionName, permission, options);
    },
    
    withPermissions(permissions, api) {
      const wrappedApi = {};
      
      for (const [key, value] of Object.entries(api)) {
        if (typeof value === 'function') {
          // Create a wrapped function that checks permissions
          wrappedApi[key] = (...args) => {
            // Check if extension has all required permissions
            for (const permission of permissions) {
              if (!permissionManager.hasPermission(extensionName, permission)) {
                const error = new Error(`Permission denied: ${permission} is required`);
                error.code = 'PERMISSION_DENIED';
                error.permission = permission;
                throw error;
              }
            }
            
            // If all permissions are granted, call the original function
            return value(...args);
          };
        } else {
          // For non-functions, just copy the value
          wrappedApi[key] = value;
        }
      }
      
      return wrappedApi;
    }
  };
}

module.exports = {
  // Permission manager for system use
  permissionManager,
  
  // Permission categories
  ResourcePermissions,
  ActionPermissions,
  ContextPermissions,
  AllPermissions,
  DangerousPermissions,
  
  // Permission factory for extensions
  createPermissionAPI,
  
  // Helper functions
  validatePermissions: permissionManager.validatePermissions.bind(permissionManager),
  getPermissionsByCapability: permissionManager.getPermissionsByCapability.bind(permissionManager),
  hasPermissionRequirement: permissionManager.hasPermissionRequirement.bind(permissionManager),
  getPermissionPolicies: permissionManager.getPermissionPolicies.bind(permissionManager),
  setPermissionPolicy: permissionManager.setPermissionPolicy.bind(permissionManager),
  requestUserApproval: permissionManager.requestUserApproval.bind(permissionManager)
}; 
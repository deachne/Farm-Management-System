#!/usr/bin/env node

/**
 * Extension Permissions Test Script
 * 
 * This script tests the extension permissions system to demonstrate its functionality.
 */

const path = require('path');
const extensionApi = require('../core/extension-api');
const { permissionManager } = extensionApi.permissions;

console.log('=== Extension Permissions Test ===\n');

// Set up event listeners
permissionManager.on('permission:granted', (extensionName, permission) => {
  console.log(`[EVENT] Permission granted: ${extensionName} -> ${permission}`);
});

permissionManager.on('permission:revoked', (extensionName, permission) => {
  console.log(`[EVENT] Permission revoked: ${extensionName} -> ${permission}`);
});

permissionManager.on('permission:requested', (extensionName, permission, options) => {
  console.log(`[EVENT] Permission requested: ${extensionName} -> ${permission}`, options);
});

permissionManager.on('permissions:cleared', (extensionName) => {
  console.log(`[EVENT] All permissions cleared for ${extensionName}`);
});

permissionManager.on('extension:permissions-checked', (extensionName, result) => {
  console.log(`[EVENT] Extension permissions checked: ${extensionName}`, result);
});

permissionManager.on('policy:updated', (policyName, value) => {
  console.log(`[EVENT] Permission policy updated: ${policyName} -> ${JSON.stringify(value)}`);
});

// Test the permissions system
async function runTest() {
  try {
    // Get the example extension path
    const extensionPath = path.resolve(__dirname, '../extensions/example-extension');
    const extensionName = 'example-extension';
    
    console.log('1. Testing permission validation...');
    
    // Valid permissions
    const validPermissions = ['read-documents', 'write-documents', 'use-chat'];
    let result = extensionApi.permissions.validatePermissions(validPermissions);
    console.log('Valid permissions result:', result);
    
    // Invalid permissions
    const invalidPermissions = ['read-documents', 'invalid-permission', 'another-invalid'];
    result = extensionApi.permissions.validatePermissions(invalidPermissions);
    console.log('Invalid permissions result:', result);
    
    // Dangerous permissions
    const dangerousPermissions = ['read-documents', 'file-system', 'network-access'];
    result = extensionApi.permissions.validatePermissions(dangerousPermissions);
    console.log('Dangerous permissions result:', result);
    
    console.log('\n2. Testing basic permission management...');
    
    // Grant permission
    let granted = permissionManager.grantPermission(extensionName, 'read-documents');
    console.log(`Permission 'read-documents' granted: ${granted}`);
    
    // Check permission
    let has = permissionManager.hasPermission(extensionName, 'read-documents');
    console.log(`Has permission 'read-documents': ${has}`);
    
    // Get all permissions
    let permissions = permissionManager.getPermissions(extensionName);
    console.log('All permissions:', permissions);
    
    // Revoke permission
    let revoked = permissionManager.revokePermission(extensionName, 'read-documents');
    console.log(`Permission 'read-documents' revoked: ${revoked}`);
    
    // Check permission after revocation
    has = permissionManager.hasPermission(extensionName, 'read-documents');
    console.log(`Has permission 'read-documents' after revocation: ${has}`);
    
    // Grant multiple permissions
    granted = permissionManager.grantPermission(extensionName, 'read-documents');
    granted = permissionManager.grantPermission(extensionName, 'write-documents');
    granted = permissionManager.grantPermission(extensionName, 'use-chat');
    console.log('Granted multiple permissions');
    
    // Get all permissions
    permissions = permissionManager.getPermissions(extensionName);
    console.log('All permissions after multiple grants:', permissions);
    
    // Clear all permissions
    let cleared = permissionManager.clearPermissions(extensionName);
    console.log(`All permissions cleared: ${cleared}`);
    
    // Get all permissions after clearing
    permissions = permissionManager.getPermissions(extensionName);
    console.log('All permissions after clearing:', permissions);
    
    console.log('\n3. Testing permission requests...');
    
    // Request safe permission
    let requestResult = await permissionManager.requestPermission(
      extensionName,
      'read-documents',
      { reason: 'Need to read documents for testing' }
    );
    console.log(`Safe permission request result: ${requestResult}`);
    
    // Request dangerous permission
    requestResult = await permissionManager.requestPermission(
      extensionName,
      'file-system',
      { reason: 'Need to access file system for testing' }
    );
    console.log(`Dangerous permission request result: ${requestResult}`);
    
    console.log('\n4. Testing user approval workflow...');
    
    // Request user approval
    let approvalResult = await permissionManager.requestUserApproval(
      extensionName,
      ['read-documents', 'use-chat'],
      ['write-documents', 'network-access']
    );
    console.log('User approval result:', approvalResult);
    
    console.log('\n5. Testing permission policies...');
    
    // Get current policies
    let policies = permissionManager.getPermissionPolicies();
    console.log('Current policies:', policies);
    
    // Update a policy
    let policyUpdated = permissionManager.setPermissionPolicy('autoGrantSafe', false);
    console.log(`Policy updated: ${policyUpdated}`);
    
    // Get updated policies
    policies = permissionManager.getPermissionPolicies();
    console.log('Updated policies:', policies);
    
    console.log('\n6. Testing capability permission requirements...');
    
    // Grant required permissions for a capability
    permissionManager.grantPermission(extensionName, 'read-documents');
    
    // Check permission requirement
    let hasRequirement = permissionManager.hasPermissionRequirement(
      extensionName,
      'document-processor'
    );
    console.log(`Has document-processor permission requirement: ${hasRequirement}`);
    
    // Get permissions by capability
    let requiredPermissions = permissionManager.getPermissionsByCapability('document-processor');
    console.log('document-processor required permissions:', requiredPermissions);
    
    console.log('\n7. Testing permission API for extensions...');
    
    // Create permission API for the extension
    const permissionAPI = extensionApi.permissions.createPermissionAPI(extensionName);
    
    // Check if extension has permission
    let hasPermission = permissionAPI.hasPermission('read-documents');
    console.log(`Extension API - has read-documents permission: ${hasPermission}`);
    
    // Create a permission-aware API
    const testApi = {
      readDocument: () => console.log('Reading document...'),
      writeDocument: () => console.log('Writing document...')
    };
    
    const protectedApi = permissionAPI.withPermissions(['read-documents'], {
      readDocument: testApi.readDocument
    });
    
    console.log('Calling protected API with granted permission:');
    try {
      protectedApi.readDocument();
    } catch (error) {
      console.error('Error:', error.message);
    }
    
    // Revoke permission and try again
    permissionManager.revokePermission(extensionName, 'read-documents');
    
    console.log('Calling protected API without permission:');
    try {
      protectedApi.readDocument();
    } catch (error) {
      console.error('Error:', error.message);
    }
    
    console.log('\n8. Testing extension API integration...');
    
    // Create a test extension with permissions manifest
    const testExtension = {
      name: 'test-extension',
      version: '1.0.0',
      description: 'Test extension for permissions',
      author: 'BizzyPerson',
      manifest: {
        permissions: ['read-documents', 'use-chat'],
        optionalPermissions: ['network-access']
      },
      initialize: async (context) => {
        console.log('Extension initialized with permissions API:', !!context.permissions);
        
        // Test hasPermission
        const hasReadDocs = context.permissions.hasPermission('read-documents');
        console.log(`Has read-documents permission: ${hasReadDocs}`);
        
        // Test requestPermission
        try {
          const granted = await context.permissions.requestPermission('network-access', {
            reason: 'Need to fetch data from the internet'
          });
          console.log(`Optional permission request result: ${granted}`);
        } catch (error) {
          console.error('Error requesting permission:', error);
        }
      }
    };
    
    // Register the test extension
    extensionApi.register(testExtension);
    
    // Clear permissions for the test extension before initialization
    permissionManager.clearPermissions('test-extension');
    
    // Grant required permissions
    permissionManager.grantPermission('test-extension', 'read-documents');
    permissionManager.grantPermission('test-extension', 'use-chat');
    
    // Initialize the extension
    try {
      await extensionApi.registry.initializeExtension('test-extension');
      console.log('Test extension initialized successfully');
    } catch (error) {
      console.error('Error initializing test extension:', error);
    }
    
    console.log('\nExtension permissions test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTest(); 
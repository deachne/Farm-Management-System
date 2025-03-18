#!/usr/bin/env node

/**
 * Extension Lifecycle Management Test Script
 * 
 * This script tests the extension lifecycle management system to demonstrate its functionality.
 */

const path = require('path');
const extensionApi = require('../core/extension-api');
const { lifecycle, registry } = extensionApi;

console.log('=== Extension Lifecycle Management Test ===\n');

// Set up event listeners
registry.on('extension:lifecycle-change', (name, state) => {
  console.log(`[EVENT] Extension lifecycle state changed: ${name} -> ${state.state}`);
});

registry.on('extension:installed', (name, manifest) => {
  console.log(`[EVENT] Extension installed: ${name} v${manifest.version}`);
});

registry.on('extension:uninstalled', (name) => {
  console.log(`[EVENT] Extension uninstalled: ${name}`);
});

registry.on('extension:activated', (name, extension) => {
  console.log(`[EVENT] Extension activated: ${name} v${extension.version}`);
});

registry.on('extension:deactivated', (name, extension) => {
  console.log(`[EVENT] Extension deactivated: ${name} v${extension.version}`);
});

registry.on('extension:error', (name, error) => {
  console.error(`[EVENT] Extension error: ${name} - ${error.message}`);
});

// Test the lifecycle management system
async function runTest() {
  try {
    // Get the example extension path
    const extensionPath = path.resolve(__dirname, '../extensions/example-extension');
    
    console.log('Testing extension lifecycle management...\n');
    
    // Load the example extension
    console.log('1. Loading example extension...');
    const extensionDir = path.basename(extensionPath);
    const extensionsDir = path.dirname(extensionPath);
    const extension = await extensionApi.loadExtension(extensionDir, extensionsDir);
    
    if (!extension) {
      throw new Error('Failed to load example extension');
    }
    
    const extensionName = 'example-extension';
    console.log(`Extension loaded: ${extensionName}`);
    
    // Get and log current lifecycle state
    const initialState = lifecycle.getLifecycleState(extensionName);
    console.log('Current lifecycle state:', initialState ? initialState.state : 'unknown');
    
    // Deactivate the extension
    console.log('\n2. Deactivating extension...');
    const deactivated = await lifecycle.deactivateExtension(extensionName);
    console.log(`Extension deactivated: ${deactivated}`);
    
    // Get and log updated lifecycle state
    const deactivatedState = lifecycle.getLifecycleState(extensionName);
    console.log('Updated lifecycle state:', deactivatedState ? deactivatedState.state : 'unknown');
    
    // Activate the extension
    console.log('\n3. Activating extension...');
    const activated = await lifecycle.activateExtension(extensionName);
    console.log(`Extension activated: ${activated}`);
    
    // Get and log updated lifecycle state
    const activatedState = lifecycle.getLifecycleState(extensionName);
    console.log('Updated lifecycle state:', activatedState ? activatedState.state : 'unknown');
    
    // Suspend the extension
    console.log('\n4. Suspending extension...');
    const suspended = await lifecycle.suspendExtension(extensionName, 'Testing suspension');
    console.log(`Extension suspended: ${suspended}`);
    
    // Get and log updated lifecycle state
    const suspendedState = lifecycle.getLifecycleState(extensionName);
    console.log('Updated lifecycle state:', suspendedState ? suspendedState.state : 'unknown');
    
    // Resume the extension
    console.log('\n5. Resuming extension...');
    const resumed = await lifecycle.resumeExtension(extensionName);
    console.log(`Extension resumed: ${resumed}`);
    
    // Get and log updated lifecycle state
    const resumedState = lifecycle.getLifecycleState(extensionName);
    console.log('Updated lifecycle state:', resumedState ? resumedState.state : 'unknown');
    
    // Check for updates
    console.log('\n6. Checking for updates...');
    const updateCheck = await lifecycle.checkForUpdate(extensionName);
    console.log('Update check result:', updateCheck);
    
    // Get all extensions with their lifecycle states
    console.log('\n7. Getting all extensions with lifecycle states...');
    const allExtensions = lifecycle.getAllExtensionsWithStates();
    allExtensions.forEach(ext => {
      console.log(`- ${ext.name} v${ext.version}: ${ext.lifecycleState.state}`);
    });
    
    // Test install/uninstall in a dry-run mode (comment out in real tests)
    console.log('\n(Skipping install/uninstall tests in this demonstration)');
    /*
    // Test installation
    console.log('\n8. Testing installation (dry run)...');
    const installResult = await lifecycle.installExtension(extensionPath, { activate: true });
    console.log('Installation result:', installResult);
    
    // Test uninstallation
    console.log('\n9. Testing uninstallation (dry run)...');
    const uninstallResult = await lifecycle.uninstallExtension(extensionName);
    console.log('Uninstallation result:', uninstallResult);
    */
    
    console.log('\nExtension lifecycle test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTest(); 
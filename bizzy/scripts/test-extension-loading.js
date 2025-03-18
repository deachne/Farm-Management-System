#!/usr/bin/env node

/**
 * Test Extension Loading
 * 
 * This script tests the extension loading mechanism by loading all extensions
 * and verifying they are properly registered and initialized.
 */

const path = require('path');
const { loadExtension, getAllExtensions, getExtensionLoadingStatus, ExtensionState } = require('../core/extension-api/hooks');

async function testExtensionLoading() {
  console.log('Testing extension loading mechanism...');
  
  // Get extensions directory path
  const extensionsDir = path.join(__dirname, '../extensions');
  
  // Track test results
  const results = {
    total: 0,
    success: 0,
    failed: 0,
    details: []
  };
  
  try {
    // Get list of extensions from filesystem
    const fs = require('fs').promises;
    const extensionDirs = (await fs.readdir(extensionsDir, { withFileTypes: true }))
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    results.total = extensionDirs.length;
    
    console.log(`Found ${extensionDirs.length} extensions to test.`);
    
    // Test each extension
    for (const extensionDir of extensionDirs) {
      console.log(`\nTesting extension: ${extensionDir}`);
      
      try {
        // Attempt to load the extension
        const extensionModule = await loadExtension(extensionDir, extensionsDir);
        
        if (extensionModule) {
          console.log(`✅ Successfully loaded ${extensionDir}`);
          results.success++;
          results.details.push({
            name: extensionDir,
            success: true
          });
        } else {
          console.error(`❌ Failed to load ${extensionDir}`);
          results.failed++;
          results.details.push({
            name: extensionDir,
            success: false,
            error: 'Extension module not returned'
          });
        }
      } catch (error) {
        console.error(`❌ Error loading ${extensionDir}:`, error);
        results.failed++;
        results.details.push({
          name: extensionDir,
          success: false,
          error: error.message
        });
      }
    }
    
    // Get extension loading status
    const loadingStatus = getExtensionLoadingStatus();
    console.log('\nExtension Loading Status:');
    for (const [name, status] of Object.entries(loadingStatus)) {
      const statusSymbol = status.state === ExtensionState.LOADED ? '✅' : 
                         status.state === ExtensionState.ERROR ? '❌' : '⚠️';
      console.log(`${statusSymbol} ${name}: ${status.state}`);
      
      if (status.state === ExtensionState.ERROR && status.error) {
        console.log(`   Error: ${status.error}`);
      }
    }
    
    // Print registered extensions
    const registeredExtensions = getAllExtensions();
    console.log(`\nRegistered Extensions: ${registeredExtensions.length}`);
    for (const extension of registeredExtensions) {
      console.log(`- ${extension.name} v${extension.version}`);
    }
    
    // Print summary
    console.log('\nTest Results:');
    console.log(`Total: ${results.total}`);
    console.log(`Success: ${results.success}`);
    console.log(`Failed: ${results.failed}`);
    
    if (results.failed > 0) {
      console.log('\nFailed Extensions:');
      for (const result of results.details.filter(r => !r.success)) {
        console.log(`- ${result.name}: ${result.error}`);
      }
    }
    
    // Exit with appropriate code
    process.exit(results.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Error testing extension loading:', error);
    process.exit(1);
  }
}

// Run the test
testExtensionLoading(); 
#!/usr/bin/env node

/**
 * Extension List Script
 * 
 * This script lists all installed extensions and their status.
 */

const path = require('path');
const fs = require('fs').promises;
const { parseManifest } = require('../core/extension-api/hooks');

async function listExtensions() {
  try {
    console.log('Listing installed extensions...\n');
    
    // Get extensions directory path
    const extensionsDir = path.join(__dirname, '../extensions');
    
    // Check if extensions directory exists
    try {
      await fs.access(extensionsDir);
    } catch (error) {
      console.error('Extensions directory not found.');
      return;
    }
    
    // Get extension directories
    const extensionDirs = (await fs.readdir(extensionsDir, { withFileTypes: true }))
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    console.log(`Found ${extensionDirs.length} extension directories.\n`);
    
    // Table header
    console.log('| Name | Version | Description | Dependencies | Hooks |');
    console.log('|------|---------|-------------|--------------|-------|');
    
    // Process each extension
    for (const extensionDir of extensionDirs) {
      try {
        const extensionPath = path.join(extensionsDir, extensionDir);
        const manifestPath = path.join(extensionPath, 'manifest.json');
        
        // Check if manifest exists
        try {
          await fs.access(manifestPath);
        } catch (error) {
          console.log(`| ${extensionDir} | - | No manifest.json found | - | - |`);
          continue;
        }
        
        // Parse manifest
        const manifest = await parseManifest(manifestPath);
        
        // Check for entry point files
        const indexJsPath = path.join(extensionPath, 'index.js');
        const indexTsPath = path.join(extensionPath, 'index.ts');
        
        const jsExists = await fs.access(indexJsPath).then(() => true).catch(() => false);
        const tsExists = await fs.access(indexTsPath).then(() => true).catch(() => false);
        
        const entryPoint = jsExists ? 'index.js' : (tsExists ? 'index.ts' : 'missing');
        
        // Format dependencies
        const deps = manifest.dependencies ? 
          Object.entries(manifest.dependencies)
            .map(([name, version]) => `${name}:${version}`)
            .join(', ') : 
          'none';
        
        // Format hooks
        const hooks = manifest.hooks ? manifest.hooks.join(', ') : 'none';
        
        // Add row to table
        console.log(`| ${manifest.name} | ${manifest.version} | ${manifest.description} | ${deps} | ${hooks} |`);
      } catch (error) {
        console.log(`| ${extensionDir} | - | Error: ${error.message} | - | - |`);
      }
    }
    
    console.log('\nDone listing extensions.');
  } catch (error) {
    console.error('Error listing extensions:', error);
  }
}

// Run the function
listExtensions(); 
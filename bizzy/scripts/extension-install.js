#!/usr/bin/env node

/**
 * Extension Install Script
 * 
 * This script installs an extension from a URL or local path.
 */

const path = require('path');
const fs = require('fs').promises;
const { execSync } = require('child_process');
const os = require('os');

// Get command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: npm run extensions:install [--local path/to/extension] [--url git-repository-url]');
  process.exit(1);
}

async function installExtension() {
  try {
    let source = null;
    let sourcePath = null;
    
    // Parse arguments
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--local') {
        source = 'local';
        sourcePath = args[i + 1];
        i++;
      } else if (args[i] === '--url') {
        source = 'url';
        sourcePath = args[i + 1];
        i++;
      }
    }
    
    if (!source || !sourcePath) {
      console.error('Must specify either --local or --url with a valid path or URL');
      process.exit(1);
    }
    
    // Get extensions directory path
    const extensionsDir = path.join(__dirname, '../extensions');
    
    // Check if extensions directory exists, create if not
    try {
      await fs.access(extensionsDir);
    } catch (error) {
      console.log('Creating extensions directory...');
      await fs.mkdir(extensionsDir, { recursive: true });
    }
    
    if (source === 'local') {
      // Install from local path
      await installFromLocal(sourcePath, extensionsDir);
    } else if (source === 'url') {
      // Install from URL
      await installFromUrl(sourcePath, extensionsDir);
    }
    
    console.log('Extension installation completed.');
  } catch (error) {
    console.error('Error installing extension:', error);
    process.exit(1);
  }
}

async function installFromLocal(sourcePath, extensionsDir) {
  try {
    console.log(`Installing extension from local path: ${sourcePath}`);
    
    // Resolve the source path
    const resolvedSourcePath = path.resolve(sourcePath);
    
    // Check if source exists
    try {
      await fs.access(resolvedSourcePath);
    } catch (error) {
      throw new Error(`Source path does not exist: ${resolvedSourcePath}`);
    }
    
    // Check if it's a directory
    const stats = await fs.stat(resolvedSourcePath);
    if (!stats.isDirectory()) {
      throw new Error(`Source path is not a directory: ${resolvedSourcePath}`);
    }
    
    // Check for manifest.json
    const manifestPath = path.join(resolvedSourcePath, 'manifest.json');
    try {
      await fs.access(manifestPath);
    } catch (error) {
      throw new Error(`No manifest.json found in ${resolvedSourcePath}`);
    }
    
    // Parse manifest to get extension name
    const manifestContent = await fs.readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    if (!manifest.name) {
      throw new Error('Manifest does not contain a name property');
    }
    
    const extensionName = manifest.name;
    const targetPath = path.join(extensionsDir, extensionName);
    
    // Check if extension already exists
    try {
      await fs.access(targetPath);
      console.log(`Extension ${extensionName} already exists. Overwriting...`);
      await fs.rm(targetPath, { recursive: true, force: true });
    } catch (error) {
      // Target doesn't exist, which is fine
    }
    
    // Copy extension files
    console.log(`Copying extension to ${targetPath}...`);
    await copyDirectory(resolvedSourcePath, targetPath);
    
    // Install dependencies if package.json exists
    const packageJsonPath = path.join(targetPath, 'package.json');
    try {
      await fs.access(packageJsonPath);
      console.log('Installing dependencies...');
      execSync('npm install', { cwd: targetPath, stdio: 'inherit' });
    } catch (error) {
      console.log('No package.json found, skipping dependency installation.');
    }
    
    console.log(`Extension ${extensionName} installed successfully.`);
  } catch (error) {
    throw new Error(`Failed to install from local path: ${error.message}`);
  }
}

async function installFromUrl(url, extensionsDir) {
  try {
    console.log(`Installing extension from URL: ${url}`);
    
    // Create temporary directory
    const tempDir = path.join(os.tmpdir(), 'bizzy-extension-' + Date.now());
    await fs.mkdir(tempDir, { recursive: true });
    
    try {
      // Clone the repository
      console.log(`Cloning repository to ${tempDir}...`);
      execSync(`git clone ${url} ${tempDir}`, { stdio: 'inherit' });
      
      // Check for manifest.json
      const manifestPath = path.join(tempDir, 'manifest.json');
      try {
        await fs.access(manifestPath);
      } catch (error) {
        throw new Error(`No manifest.json found in cloned repository`);
      }
      
      // Parse manifest to get extension name
      const manifestContent = await fs.readFile(manifestPath, 'utf8');
      const manifest = JSON.parse(manifestContent);
      
      if (!manifest.name) {
        throw new Error('Manifest does not contain a name property');
      }
      
      const extensionName = manifest.name;
      const targetPath = path.join(extensionsDir, extensionName);
      
      // Check if extension already exists
      try {
        await fs.access(targetPath);
        console.log(`Extension ${extensionName} already exists. Overwriting...`);
        await fs.rm(targetPath, { recursive: true, force: true });
      } catch (error) {
        // Target doesn't exist, which is fine
      }
      
      // Copy extension files
      console.log(`Copying extension to ${targetPath}...`);
      await copyDirectory(tempDir, targetPath);
      
      // Install dependencies if package.json exists
      const packageJsonPath = path.join(targetPath, 'package.json');
      try {
        await fs.access(packageJsonPath);
        console.log('Installing dependencies...');
        execSync('npm install', { cwd: targetPath, stdio: 'inherit' });
      } catch (error) {
        console.log('No package.json found, skipping dependency installation.');
      }
      
      console.log(`Extension ${extensionName} installed successfully.`);
    } finally {
      // Clean up temporary directory
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  } catch (error) {
    throw new Error(`Failed to install from URL: ${error.message}`);
  }
}

async function copyDirectory(source, target) {
  // Create target directory
  await fs.mkdir(target, { recursive: true });
  
  // Get all files in source directory
  const entries = await fs.readdir(source, { withFileTypes: true });
  
  // Process each entry
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    
    // Skip .git directory
    if (entry.name === '.git') {
      continue;
    }
    
    if (entry.isDirectory()) {
      // Recursively copy subdirectory
      await copyDirectory(sourcePath, targetPath);
    } else {
      // Copy file
      await fs.copyFile(sourcePath, targetPath);
    }
  }
}

// Run the function
installExtension(); 
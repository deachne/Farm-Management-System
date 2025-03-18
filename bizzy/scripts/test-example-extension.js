#!/usr/bin/env node

/**
 * Example Extension Test Script
 * 
 * This script tests the example extension to demonstrate the extension registration and loading system.
 */

const path = require('path');
const { extensionLoader } = require('../core/extension-loader');
const { registry } = require('../core/extension-api');

console.log('=== Example Extension Test ===\n');

// Set up event listeners
registry.on('extension:registered', (name, extension) => {
  console.log(`[EVENT] Extension registered: ${name}`);
});

registry.on('extension:initialized', (name, extension) => {
  console.log(`[EVENT] Extension initialized: ${name}`);
});

// Load example extension
async function runTest() {
  try {
    console.log('Loading example extension...');
    
    const extensionDirectory = path.resolve(__dirname, '../extensions/example-extension');
    const extension = await extensionLoader.loadExtension(extensionDirectory);
    
    console.log('\nExtension loaded successfully:', extension.name);
    console.log('- Version:', extension.version);
    console.log('- Description:', extension.description);
    console.log('- Author:', extension.author);
    
    // Initialize the extension
    console.log('\nInitializing extension...');
    await extensionLoader.initializeExtension(extension.name, {
      hooks: {
        'document-processor': true,
        'chat-tool': true,
        'ui-component': true
      },
      capabilities: {
        'read-documents': true,
        'write-documents': true,
        'use-chat': true
      }
    });
    
    // Test document processing
    console.log('\nTesting document processor...');
    const documentProcessor = extension.getHook('document-processor');
    if (documentProcessor) {
      const result = await documentProcessor.process({
        text: 'This is a test document for the example extension.',
        metadata: { source: 'test' }
      });
      
      console.log('Processed document result:');
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log('Document processor hook not found');
    }
    
    // Test chat tool
    console.log('\nTesting chat tool...');
    const chatTool = extension.getHook('chat-tool');
    if (chatTool) {
      const result = await chatTool.processQuery({
        query: 'Tell me about the example extension',
        session: { id: 'test-session' }
      });
      
      console.log('Chat tool result:');
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log('Chat tool hook not found');
    }
    
    // Test UI components
    console.log('\nTesting UI components...');
    const uiComponents = extension.getHook('ui-component');
    if (uiComponents && uiComponents.components) {
      console.log('Available UI components:');
      Object.keys(uiComponents.components).forEach(key => {
        console.log(`- ${key}`);
      });
      
      // Render example component (simulated)
      const component = uiComponents.components['example-card']({});
      console.log('\nComponent structure:');
      console.log(JSON.stringify(component, null, 2));
    } else {
      console.log('UI component hook not found');
    }
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTest(); 
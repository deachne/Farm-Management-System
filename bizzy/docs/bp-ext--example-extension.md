# Example Extension

This documentation describes the example extension that demonstrates the extension registration system in BizzyPerson.

## Overview

The example extension serves as a practical demonstration of how to implement an extension using the BizzyPerson extension framework. It shows the integration with various hooks and provides examples of how to create document processors, chat tools, UI components, and integration with both AnythingLLM and LibreChat.

## Extension Structure

The example extension has the following structure:

```
extensions/example-extension/
├── manifest.json   # Extension metadata and requirements
└── index.js        # Main extension implementation
```

### Manifest File

The manifest file (`manifest.json`) defines the extension's metadata and requirements:

```json
{
  "name": "example-extension",
  "version": "1.0.0",
  "description": "An example extension that demonstrates the extension registration system",
  "author": "BizzyPerson Team",
  "license": "MIT",
  "dependencies": {
    "core": ">=0.1.0"
  },
  "hooks": [
    "document-processor",
    "chat-tool",
    "ui-component"
  ],
  "permissions": [
    "read-documents",
    "write-documents",
    "use-chat"
  ]
}
```

### Main Implementation

The main implementation (`index.js`) contains:

1. Importing the extension API
2. Setting up event listeners
3. Creating hook implementations (document processor, chat tool, UI components)
4. Defining integration points with AnythingLLM and LibreChat
5. Registering the extension using the `register` function

## Implemented Hooks

### Document Processor

The document processor hook enhances documents by adding metadata:

```javascript
function createDocumentProcessor() {
  return {
    process: async (document) => {
      console.log('Example extension processing document...');
      
      // Add metadata
      const enhancedMetadata = {
        ...document.metadata,
        example: {
          processed: true,
          timestamp: Date.now(),
          wordCount: document.text.split(/\s+/).length
        }
      };
      
      // Return the processed document
      return {
        text: document.text,
        metadata: enhancedMetadata
      };
    }
  };
}
```

### Chat Tool

The chat tool hook provides responses for queries specifically about the example extension:

```javascript
function createChatTool() {
  return {
    processQuery: async (context) => {
      console.log('Example extension processing chat query:', context.query);
      
      // Only handle queries about the example extension
      if (context.query.toLowerCase().includes('example extension')) {
        return {
          type: 'text',
          content: 'This is the example extension. It demonstrates the extension registration system.'
        };
      }
      
      // Pass through to other handlers
      return null;
    }
  };
}
```

### UI Components

The UI components hook defines a simple card component:

```javascript
function createUIComponents() {
  return {
    components: {
      'example-card': (props) => {
        return {
          type: 'div',
          className: 'example-card',
          children: [
            {
              type: 'h2',
              content: 'Example Extension'
            },
            {
              type: 'p',
              content: 'This is a UI component from the example extension.'
            }
          ]
        };
      }
    }
  };
}
```

## Integration with AnythingLLM and LibreChat

The extension demonstrates integration with both AnythingLLM and LibreChat:

### AnythingLLM Integration

```javascript
function createAnythingLLMIntegration(api) {
  return {
    documentProcessors: [
      {
        name: 'example-processor',
        process: async (document) => {
          console.log('Example extension processing document for AnythingLLM...');
          return document;
        }
      }
    ]
  };
}
```

### LibreChat Integration

```javascript
function createLibreChatIntegration(api) {
  return {
    chatTools: [
      {
        name: 'example-tool',
        description: 'An example tool from the example extension',
        execute: async (params) => {
          console.log('Example extension executing LibreChat tool...');
          return {
            content: 'This is a result from the example extension tool.'
          };
        }
      }
    ]
  };
}
```

## Testing the Extension

The example extension can be tested using the provided test script:

```bash
npm run extensions:test-example
```

This script:

1. Loads the example extension
2. Initializes the extension with the required hooks and capabilities
3. Tests the document processor hook with a sample document
4. Tests the chat tool hook with a sample query
5. Tests the UI components hook by listing available components and simulating rendering
6. Reports the test results

## Usage in Your Project

You can use this example extension as a template for creating your own extensions:

1. Copy the example extension directory to a new location
2. Modify the manifest.json to reflect your extension's metadata
3. Update the hooks and implementations in index.js
4. Test your extension with the provided scripts
5. Deploy your extension to your BizzyPerson instance

## Best Practices

When creating your own extensions based on this example:

1. Keep your hooks focused on specific functionality
2. Use clear naming conventions for your components and methods
3. Provide thorough documentation for your extension
4. Test each hook thoroughly before deployment
5. Follow the extension system's event-driven approach
6. Handle errors gracefully and provide feedback
7. Respect the permissions system and only request what you need 
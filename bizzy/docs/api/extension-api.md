# BizzyPerson Extension API

## Overview

The BizzyPerson Extension API allows developers to create industry-specific extensions that integrate seamlessly with the core platform. This document outlines the API structure and usage.

## Extension Structure

An extension must follow this basic structure:

```
extension-name/
├── manifest.json        # Extension metadata and requirements
├── index.js             # Main entry point
├── data-models/         # Custom data models
├── tools/               # Custom tools and agents
├── ui-components/       # Custom UI components
└── knowledge-templates/ # Domain-specific knowledge templates
```

## Manifest File

The manifest.json file defines the extension metadata:

```json
{
  "name": "extension-name",
  "version": "1.0.0",
  "description": "Extension description",
  "author": "Author name",
  "license": "MIT",
  "dependencies": {
    "core": ">=1.0.0"
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

## Extension API

### Registration

Extensions register with the core platform through the `register` function:

```javascript
const { register } = require('@bizzy/extension-api');

register({
  name: 'extension-name',
  version: '1.0.0',
  hooks: {
    'document-processor': async (document, context) => {
      // Process document
      return processedDocument;
    },
    'chat-tool': async (query, context) => {
      // Implement custom chat tool
      return response;
    },
    'ui-component': (props) => {
      // Return custom UI component
      return component;
    }
  }
});
```

### Tools

Tools are specialized functions that can be used in chat:

```javascript
tools: [
  {
    name: 'tool-name',
    description: 'Tool description',
    parameters: {
      // Tool parameters
    },
    execute: async (params, context) => {
      // Tool implementation
      return result;
    }
  }
]
```

### Data Models

Data models define industry-specific data structures:

```javascript
dataModels: [
  {
    name: 'model-name',
    schema: {
      // Model schema
    },
    methods: {
      // Model methods
    }
  }
]
```

## Usage Example

Here's a simple example of an extension that adds a custom document processor:

```javascript
const { register } = require('@bizzy/extension-api');

register({
  name: 'example-extension',
  version: '1.0.0',
  hooks: {
    'document-processor': async (document, context) => {
      if (document.type === 'special-type') {
        // Special processing for this document type
        return {
          ...document,
          processed: true,
          extractedData: extractData(document)
        };
      }
      return document;
    }
  }
});
```

## Best Practices

1. **Respect Core Functionality**: Don't override core functionality unless necessary
2. **Minimize Dependencies**: Keep extensions lightweight
3. **Handle Errors Gracefully**: Don't let extension errors crash the core platform
4. **Follow Naming Conventions**: Use consistent naming for extension components
5. **Document Everything**: Provide clear documentation for your extension 
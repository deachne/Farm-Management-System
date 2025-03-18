# BizzyPerson Extension Loading Mechanism

## Overview

The BizzyPerson Extension Loading Mechanism provides a robust framework for dynamically loading extensions when the system starts. It supports both JavaScript and TypeScript extensions, handles dependencies between extensions, and provides proper error handling if extensions fail to load.

## Architecture

The extension loading system consists of several components:

1. **Extension Registry**: Manages the registration and tracking of extensions
2. **Extension Loader**: Handles the dynamic loading of extension modules
3. **Dependency Resolver**: Ensures extensions are loaded in the correct order
4. **Extension Manager**: Provides utilities for installing and managing extensions

## Extension Structure

An extension must follow this standard structure:

```
extension-name/
├── manifest.json        # Extension metadata and requirements
├── index.js/index.ts    # Main entry point (JS or TS)
├── package.json         # Node.js package configuration (optional)
├── data-models/         # Custom data models
├── tools/               # Custom tools and agents
├── ui-components/       # Custom UI components
└── knowledge-templates/ # Domain-specific knowledge templates
```

### Manifest File

The manifest.json file defines the extension metadata:

```json
{
  "name": "extension-name",
  "version": "1.0.0",
  "description": "Extension description",
  "author": "Author name",
  "license": "MIT",
  "dependencies": {
    "core": ">=1.0.0",
    "other-extension": ">=0.5.0"
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

### Entry Point File

The main entry point file (index.js or index.ts) must register the extension using the register function:

```javascript
// JavaScript Example
const { register } = require('../../core/extension-api/hooks');

register({
  name: 'extension-name',
  version: '1.0.0',
  
  // Extension initialization hooks
  initializeDocumentProcessing: () => { /* ... */ },
  initializeChat: () => { /* ... */ },
  initializeUI: () => { /* ... */ }
});
```

```typescript
// TypeScript Example
import { register } from '../../core/extension-api/hooks';

register({
  name: 'extension-name',
  version: '1.0.0',
  
  // Extension initialization hooks
  initializeDocumentProcessing: () => { /* ... */ },
  initializeChat: () => { /* ... */ },
  initializeUI: () => { /* ... */ }
});
```

## Extension Loading Process

The extension loading process follows these steps:

1. **Discovery**: The system scans the extensions directory to find installed extensions
2. **Dependency Resolution**: Extensions are sorted based on their dependencies
3. **Loading**: Each extension is loaded in the correct order
4. **Registration**: Extensions register with the system through their entry point
5. **Initialization**: Extension hooks are initialized with the appropriate subsystems

### Extension States

During loading, extensions can be in one of these states:

- **PENDING**: Extension discovered but not yet loaded
- **LOADING**: Extension is currently being loaded
- **LOADED**: Extension successfully loaded and registered
- **ERROR**: Extension failed to load due to an error

## Dependency Management

The system handles dependencies between extensions:

1. **Dependency Declaration**: Extensions declare their dependencies in the manifest.json file
2. **Version Checking**: The system checks that the correct versions of dependencies are available
3. **Loading Order**: Extensions are loaded in the correct order to satisfy dependencies
4. **Circular Detection**: The system detects and reports circular dependencies

## TypeScript Support

The system supports TypeScript extensions with the following features:

1. **Automatic Compilation**: TypeScript files are automatically compiled at runtime
2. **Type Safety**: TypeScript extensions benefit from full type checking
3. **Integration**: TypeScript extensions work seamlessly with JavaScript extensions

To use TypeScript:

1. Create an index.ts file as the entry point
2. Ensure ts-node is installed (included in the extension-api package)
3. Use proper TypeScript types for extension interfaces

## Integration with AnythingLLM and LibreChat

Extensions can integrate with both AnythingLLM and LibreChat through specialized hooks:

1. **AnythingLLM Integration**: Extensions can provide document processors, knowledge base extensions, and UI components
2. **LibreChat Integration**: Extensions can add chat tools, multi-modal capabilities, and UI enhancements

Example hook for AnythingLLM integration:

```javascript
register({
  // ...
  initializeAnythingLLM: (api) => {
    return {
      documentProcessors: [/* ... */],
      knowledgeBaseExtensions: [/* ... */]
    };
  }
});
```

Example hook for LibreChat integration:

```javascript
register({
  // ...
  initializeLibreChat: (api) => {
    return {
      chatTools: [/* ... */],
      multiModalHandlers: [/* ... */]
    };
  }
});
```

## Error Handling

The system provides robust error handling during extension loading:

1. **Validation Errors**: Errors in manifest.json are caught and reported
2. **Loading Errors**: Errors during module loading are caught and don't crash the system
3. **Dependency Errors**: Missing or incompatible dependencies are detected and reported
4. **Runtime Errors**: Extensions are isolated to prevent one extension's failure from affecting others

## Extension Management Tools

The system includes command-line tools for managing extensions:

1. **List Extensions**: `npm run extensions:list` shows installed extensions and their status
2. **Install Extension**: `npm run extensions:install --url <repository-url>` installs an extension from a Git repository
3. **Install Local Extension**: `npm run extensions:install --local <path>` installs an extension from a local directory

## API Reference

### Extension Registry API

```javascript
const {
  register,                  // Register an extension
  getExtension,              // Get an extension by name
  getAllExtensions,          // Get all registered extensions
  hasExtension,              // Check if an extension is registered
  unregister,                // Unregister an extension
  loadExtension,             // Load an extension from a path
  parseManifest,             // Parse a manifest.json file
  checkDependencies,         // Check if dependencies are satisfied
  sortExtensionsByDependency, // Sort extensions by dependency order
  getExtensionLoadingStatus, // Get the loading status of extensions
  getDependentExtensions,    // Get extensions dependent on a specific extension
  ExtensionState             // Enum of extension states
} = require('../core/extension-api/hooks');
```

## Best Practices

1. **Declare Dependencies**: Always declare dependencies in the manifest.json file
2. **Version Constraints**: Use semver ranges for dependencies to ensure compatibility
3. **Error Handling**: Implement proper error handling in extension code
4. **Initialization**: Use the appropriate initialization hooks for subsystems
5. **TypeScript**: Use TypeScript for type safety when possible
6. **Testing**: Test extensions with different versions of dependencies

## Troubleshooting

Common issues and solutions:

1. **Extension Not Loading**: Check manifest.json and ensure dependencies are satisfied
2. **TypeScript Errors**: Ensure ts-node is installed and TypeScript syntax is correct
3. **Dependency Issues**: Check for circular dependencies or missing extensions
4. **Hook Errors**: Verify that hooks are correctly implemented

## Future Enhancements

Planned enhancements for the extension loading mechanism:

1. **Hot Reloading**: Support for reloading extensions without system restart
2. **Version Compatibility**: Enhanced version checking for core compatibility
3. **Extension Marketplace**: Web interface for discovering and installing extensions
4. **Sandboxing**: Better isolation for extensions to prevent system impact 
# BizzyPerson Extensions

This directory contains industry-specific extensions for the BizzyPerson platform. Each extension adds specialized functionality for a particular industry or use case.

## Extension Structure

Each extension follows a standard structure:

```
extension-name/
├── manifest.json        # Extension metadata and requirements
├── index.js             # Main entry point
├── data-models/         # Custom data models
├── tools/               # Custom tools and agents
├── ui-components/       # Custom UI components
└── knowledge-templates/ # Domain-specific knowledge templates
```

For detailed information about the extension API and development guidelines, see [Extension API Documentation](../docs/api/extension-api.md).

## Available Extensions

### BizzyFarmer

The BizzyFarmer extension provides specialized tools for agricultural management:
- Field management and mapping
- Crop planning and rotation
- Equipment scheduling
- Weather integration
- Yield calculation

For details, see [BF01: Extension Overview](../docs/bf01-Extension-Overview.md).

## Developing Extensions

To create a new extension:

1. Create a new directory with your extension name
2. Create a `manifest.json` file with extension metadata
3. Implement the required hooks in `index.js`
4. Add custom data models, tools, and UI components

Example `manifest.json`:
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

For a complete example, see the [BizzyFarmer extension](./farmer/).

## Extension Registration

Extensions are registered with the core platform through the `register` function:

```javascript
const { register } = require('@bizzy/extension-api');

register({
  name: 'extension-name',
  version: '1.0.0',
  hooks: {
    // Implement hooks here
  }
});
```

## Extension Documentation

Each extension should have corresponding documentation in the `docs` directory with the appropriate prefix:
- BizzyFarmer: `bf` prefix (e.g., `bf01-Extension-Overview.md`)
- BizzyAccounting: `ba` prefix
- BizzyConstruction: `bc` prefix

Follow the [Documentation Guidelines](../docs/bp05-Documentation-Guidelines.md) when creating extension documentation. 
# BizzyPerson Extension API (BP04)

## Overview

The BizzyPerson Extension API provides a flexible framework for creating industry-specific extensions that leverage the core platform capabilities. This document outlines the API structure, integration points, and implementation guidelines, with a particular focus on the Model Context Protocol (MCP) integration that enables powerful AI-driven tools for extensions.

## Extension Architecture

Extensions in BizzyPerson follow a modular architecture that allows them to:

1. **Register with the core platform**
2. **Define custom data models**
3. **Implement specialized UI components**
4. **Integrate with external services**
5. **Provide domain-specific AI tools**

The extension system is designed to be non-invasive, allowing extensions to enhance the platform without modifying core code.

```
┌─────────────────────────────────────────────────────────────┐
│                    BizzyPerson Platform                     │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Core      │  │  Extension  │  │      Extension      │  │
│  │  Platform   │◄─┤  Registry   │◄─┤   Registration API  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│         ▲                                      ▲            │
└─────────┼──────────────────────────────────────┼────────────┘
          │                                      │
┌─────────┼──────────────────────────────────────┼────────────┐
│         │                                      │            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Extension  │  │  Extension  │  │     Extension       │  │
│  │    Data     │  │     UI      │  │   MCP Integration   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                             │
│                  BizzyPerson Extension                      │
└─────────────────────────────────────────────────────────────┘
```

## Extension Registration

Extensions register with the platform through a standardized registration process:

```javascript
// In extensions/[extension-name]/index.js
const { register } = require('../../core/extension-api/hooks');

register({
  name: 'extension-name',
  version: '1.0.0',
  description: 'Description of the extension',
  author: 'Author Name',
  
  // Extension initialization
  initialize: async (context) => {
    // Initialize extension
    return {
      // Extension API
    };
  },
  
  // MCP initialization
  initializeMCP: (mcpRegistry) => {
    // Register MCP plugins
    return {
      // MCP API
    };
  }
});
```

## MCP Integration

### Overview

The Model Context Protocol (MCP) integration is a key component of the Extension API, allowing extensions to provide specialized AI tools. Based on our revised approach, we leverage LibreChat's existing MCP client implementation rather than building our own from scratch.

### LibreChat MCP Architecture

LibreChat implements MCP through several key components:

#### MCPManager

The `MCPManager` class handles the registration and management of MCP connections:

```javascript
class MCPManager {
  constructor() {
    this.connections = new Map();
    this.transports = new Map();
  }

  registerConnection(id, connection) {
    this.connections.set(id, connection);
  }

  removeConnection(id) {
    this.connections.delete(id);
  }

  getConnection(id) {
    return this.connections.get(id);
  }

  registerTransport(type, transportClass) {
    this.transports.set(type, transportClass);
  }

  createTransport(type, options) {
    const TransportClass = this.transports.get(type);
    if (!TransportClass) {
      throw new Error(`Transport type '${type}' not registered`);
    }
    return new TransportClass(options);
  }
}
```

#### MCPConnection

The `MCPConnection` class manages individual connections to MCP servers:

```javascript
class MCPConnection {
  constructor(options) {
    this.id = options.id;
    this.name = options.name;
    this.description = options.description;
    this.transport = options.transport;
    this.enabled = options.enabled || false;
    this.tools = options.tools || [];
    
    this.transport.onMessage(this.handleMessage.bind(this));
  }

  async connect() {
    await this.transport.connect();
  }

  async disconnect() {
    await this.transport.disconnect();
  }

  async sendMessage(message) {
    await this.transport.sendMessage(message);
  }

  handleMessage(message) {
    // Process incoming messages
  }
}
```

### Plugin Registry System

BizzyPerson extends LibreChat's MCP implementation with a plugin registry system that allows extensions to register and manage MCP plugins:

```javascript
class MCPPluginRegistry {
  constructor() {
    this.mcpManager = new MCPManager();
    this.availablePlugins = new Map();
    this.installedPlugins = new Map();
  }

  // Register a plugin in the registry
  registerPlugin(plugin) {
    this.availablePlugins.set(plugin.id, plugin);
  }

  // Install a plugin from the registry
  async installPlugin(pluginId) {
    const plugin = this.availablePlugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin '${pluginId}' not found in registry`);
    }

    // Create transport for the plugin
    const transport = this.mcpManager.createTransport(plugin.transportType, plugin.transportOptions);

    // Create MCP connection
    const connection = new MCPConnection({
      id: plugin.id,
      name: plugin.name,
      description: plugin.description,
      transport,
      enabled: false,
      tools: plugin.tools
    });

    // Register the connection
    this.mcpManager.registerConnection(plugin.id, connection);
    this.installedPlugins.set(plugin.id, {
      ...plugin,
      connection,
      enabled: false
    });

    return plugin;
  }

  // Enable an installed plugin
  async enablePlugin(pluginId) {
    const plugin = this.installedPlugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin '${pluginId}' not installed`);
    }

    await plugin.connection.connect();
    plugin.enabled = true;
    return plugin;
  }

  // Disable an installed plugin
  async disablePlugin(pluginId) {
    const plugin = this.installedPlugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin '${pluginId}' not installed`);
    }

    await plugin.connection.disconnect();
    plugin.enabled = false;
    return plugin;
  }

  // Get all available plugins
  getAvailablePlugins() {
    return Array.from(this.availablePlugins.values());
  }

  // Get all installed plugins
  getInstalledPlugins() {
    return Array.from(this.installedPlugins.values());
  }

  // Get enabled plugins
  getEnabledPlugins() {
    return Array.from(this.installedPlugins.values())
      .filter(plugin => plugin.enabled);
  }
}
```

### Extension MCP Integration

Extensions can integrate with the MCP system by implementing the `initializeMCP` method in their registration:

```javascript
// In extensions/[extension-name]/index.js
const { register } = require('../../core/extension-api/hooks');
const { createMCPAdapter } = require('./mcp-adapter');

register({
  // ... other registration properties
  
  initializeMCP: (mcpRegistry) => {
    // Create MCP adapter
    const adapter = createMCPAdapter();
    
    // Register MCP plugin
    mcpRegistry.registerPlugin({
      id: 'extension-mcp-plugin',
      name: 'Extension MCP Plugin',
      description: 'MCP plugin for the extension',
      transportType: 'sse',
      transportOptions: {
        url: 'https://extension-mcp.example.com/events'
      },
      tools: adapter.getTools()
    });
    
    return {
      // MCP API
    };
  }
});
```

### MCP Update Management

To handle updates to LibreChat's MCP implementation, we follow a "fork and merge" approach:

1. **Fork Synchronization**:
   ```bash
   git remote add upstream https://github.com/danny-avila/LibreChat.git
   git fetch upstream
   git checkout -b sync-YYYY-MM-DD
   git merge upstream/main
   ```

2. **MCP Client Update Process**:
   - Identify changed files in `packages/mcp/` directory
   - Extract core changes
   - Apply to our implementation
   - Test integration

3. **Configurable Timeouts**:
   Extensions can configure timeouts for MCP server connections, which is particularly important for reliability in rural areas with poor connectivity:

   ```javascript
   mcpRegistry.registerPlugin({
     // ... other plugin properties
     transportOptions: {
       url: 'https://extension-mcp.example.com/events',
       timeout: 30000 // 30 seconds
     }
   });
   ```

## Creating Extension-Specific Adapters

Extensions can create specialized adapters for domain-specific data sources. Here's an example of an agricultural adapter for Climate FieldView:

```javascript
class FieldViewMCPAdapter {
  constructor(apiKey, apiSecret) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.accessToken = null;
  }

  async authenticate() {
    // Authenticate with Climate FieldView API
    const response = await fetch('https://api.climate.com/api/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.apiKey,
        client_secret: this.apiSecret
      })
    });

    const data = await response.json();
    this.accessToken = data.access_token;
  }

  // Define tool functions for accessing FieldView data
  getTools() {
    return [
      {
        name: 'getFieldData',
        description: 'Get field data from Climate FieldView',
        parameters: {
          type: 'object',
          properties: {
            fieldId: {
              type: 'string',
              description: 'The ID of the field'
            },
            season: {
              type: 'string',
              description: 'The growing season (e.g., "2023")'
            }
          },
          required: ['fieldId']
        },
        execute: this.getFieldData.bind(this)
      },
      {
        name: 'getPlantingData',
        description: 'Get planting data from Climate FieldView',
        parameters: {
          type: 'object',
          properties: {
            fieldId: {
              type: 'string',
              description: 'The ID of the field'
            },
            season: {
              type: 'string',
              description: 'The growing season (e.g., "2023")'
            }
          },
          required: ['fieldId', 'season']
        },
        execute: this.getPlantingData.bind(this)
      }
    ];
  }

  async getFieldData(params) {
    if (!this.accessToken) {
      await this.authenticate();
    }

    // Implement field data retrieval
  }

  async getPlantingData(params) {
    if (!this.accessToken) {
      await this.authenticate();
    }

    // Implement planting data retrieval
  }
}
```

## Extension Data Models

Extensions can define custom data models that extend the core platform's data capabilities:

```javascript
// In extensions/[extension-name]/models/index.js
const { defineModel } = require('../../../core/extension-api/models');

const FieldModel = defineModel('Field', {
  name: {
    type: 'string',
    required: true
  },
  boundary: {
    type: 'geojson',
    required: true
  },
  area: {
    type: 'number',
    required: true
  },
  soil_type: {
    type: 'string'
  },
  // Other field properties
});

module.exports = {
  FieldModel
};
```

## Extension UI Components

Extensions can provide custom UI components that integrate with the core platform:

```javascript
// In extensions/[extension-name]/ui/index.js
const { registerComponent } = require('../../../core/extension-api/ui');

// Register a custom component
registerComponent('FieldMap', {
  component: require('./components/FieldMap'),
  props: {
    // Component props
  }
});

// Register a custom page
registerComponent('FieldsPage', {
  component: require('./pages/FieldsPage'),
  route: '/fields',
  navigation: {
    label: 'Fields',
    icon: 'Map'
  }
});
```

## Best Practices

When developing extensions using the BizzyPerson Extension API, follow these best practices:

1. **Modular Design**: Keep extension components modular and focused on specific functionality.
2. **Error Handling**: Implement robust error handling for all external integrations.
3. **Configuration Management**: Store sensitive information like API keys in environment variables.
4. **Documentation**: Document all extension components and their usage.
5. **Testing**: Write tests for all extension functionality.
6. **Performance**: Optimize performance, especially for mobile and low-bandwidth scenarios.
7. **Security**: Follow security best practices for all API integrations.

## Conclusion

The BizzyPerson Extension API provides a powerful framework for creating industry-specific extensions that leverage the core platform capabilities. By following the guidelines in this document, developers can create extensions that seamlessly integrate with the platform and provide valuable functionality to users. 
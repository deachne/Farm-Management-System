# Revised MCP Integration Strategy

## Overview

This document outlines our revised approach to integrating Model Context Protocol (MCP) capabilities into the Farm Management System. Based on recent analysis and discussions, we've decided to leverage LibreChat's existing MCP client implementation rather than building our own from scratch. This approach will allow us to focus on agricultural-specific extensions while benefiting from LibreChat's robust MCP infrastructure.

## Key Changes from Previous Approach

Our original approach (documented in `06-MCP-Integration.md`) involved building a custom MCP client and server implementation specifically for agricultural use cases. The revised strategy:

1. **Leverages LibreChat's MCP Client**: Uses LibreChat's existing `MCPManager` and `MCPConnection` classes
2. **Implements a Plugin Registry**: Creates a system for managing MCP plugins
3. **Focuses on Agricultural Adapters**: Develops specialized adapters for agricultural data sources
4. **Enables Third-Party MCPs**: Allows farmers to use pre-made MCPs for various purposes

## LibreChat MCP Architecture

LibreChat implements MCP through several key components:

### MCPManager

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

### MCPConnection

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

### Transport Classes

LibreChat supports multiple transport mechanisms for MCP:

```javascript
class SSETransport {
  constructor(options) {
    this.url = options.url;
    this.eventSource = null;
    this.messageHandlers = [];
  }

  async connect() {
    this.eventSource = new EventSource(this.url);
    this.eventSource.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messageHandlers.forEach(handler => handler(message));
    };
  }

  async disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  onMessage(handler) {
    this.messageHandlers.push(handler);
  }

  async sendMessage(message) {
    // SSE is one-way, so implement a separate channel for sending
    await fetch(`${this.url}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
  }
}
```

## FMS Plugin Registry System

We'll implement a plugin registry system to manage MCP connections:

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

## Agricultural MCP Adapters

We'll create specialized adapters for agricultural data sources:

### Climate FieldView Adapter

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

    const response = await fetch(`https://api.climate.com/api/fields/${params.fieldId}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/json'
      }
    });

    return await response.json();
  }

  async getPlantingData(params) {
    if (!this.accessToken) {
      await this.authenticate();
    }

    const response = await fetch(
      `https://api.climate.com/api/fields/${params.fieldId}/plantings?season=${params.season}`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json'
        }
      }
    );

    return await response.json();
  }
}
```

## User Interface for MCP Plugins

We'll create a React component for managing MCP plugins:

```jsx
import React, { useState, useEffect } from 'react';
import { Button, Card, Switch, Tabs } from '@/components/ui';

const MCPPluginManager = () => {
  const [installedPlugins, setInstalledPlugins] = useState([]);
  const [availablePlugins, setAvailablePlugins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load installed and available plugins
    const loadPlugins = async () => {
      try {
        const [installed, available] = await Promise.all([
          fetch('/api/mcp/plugins/installed').then(res => res.json()),
          fetch('/api/mcp/plugins/available').then(res => res.json())
        ]);
        
        setInstalledPlugins(installed);
        setAvailablePlugins(available);
        setLoading(false);
      } catch (error) {
        console.error('Error loading plugins:', error);
        setLoading(false);
      }
    };

    loadPlugins();
  }, []);

  const handleInstall = async (pluginId) => {
    try {
      const response = await fetch('/api/mcp/plugins/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pluginId })
      });
      
      const plugin = await response.json();
      setInstalledPlugins([...installedPlugins, plugin]);
      setAvailablePlugins(availablePlugins.filter(p => p.id !== pluginId));
    } catch (error) {
      console.error('Error installing plugin:', error);
    }
  };

  const handleToggleEnabled = async (pluginId, enabled) => {
    try {
      const url = enabled 
        ? '/api/mcp/plugins/enable' 
        : '/api/mcp/plugins/disable';
      
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pluginId })
      });
      
      setInstalledPlugins(installedPlugins.map(plugin => 
        plugin.id === pluginId ? { ...plugin, enabled } : plugin
      ));
    } catch (error) {
      console.error(`Error ${enabled ? 'enabling' : 'disabling'} plugin:`, error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">MCP Plugin Manager</h1>
      
      <Tabs defaultValue="installed">
        <Tabs.List>
          <Tabs.Trigger value="installed">Installed Plugins</Tabs.Trigger>
          <Tabs.Trigger value="available">Available Plugins</Tabs.Trigger>
        </Tabs.List>
        
        <Tabs.Content value="installed">
          {loading ? (
            <p>Loading installed plugins...</p>
          ) : installedPlugins.length === 0 ? (
            <p>No plugins installed. Check the Available Plugins tab to install some.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {installedPlugins.map(plugin => (
                <Card key={plugin.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{plugin.name}</h3>
                    <Switch 
                      checked={plugin.enabled}
                      onCheckedChange={(checked) => handleToggleEnabled(plugin.id, checked)}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{plugin.description}</p>
                  <div className="text-xs text-gray-500">
                    <p>Version: {plugin.version}</p>
                    <p>Author: {plugin.author}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Tabs.Content>
        
        <Tabs.Content value="available">
          {loading ? (
            <p>Loading available plugins...</p>
          ) : availablePlugins.length === 0 ? (
            <p>No additional plugins available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {availablePlugins.map(plugin => (
                <Card key={plugin.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{plugin.name}</h3>
                    <Button 
                      size="sm" 
                      onClick={() => handleInstall(plugin.id)}
                    >
                      Install
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{plugin.description}</p>
                  <div className="text-xs text-gray-500">
                    <p>Version: {plugin.version}</p>
                    <p>Author: {plugin.author}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Tabs.Content>
      </Tabs>
    </div>
  );
};

export default MCPPluginManager;
```

## Implementation Plan

### Phase 1: Foundation (Weeks 1-2)

1. **LibreChat MCP Analysis**
   - Analyze LibreChat's MCP implementation
   - Document key components and interfaces
   - Identify extension points

2. **Plugin Registry Implementation**
   - Implement MCPPluginRegistry class
   - Create API endpoints for plugin management
   - Develop basic UI for plugin management

### Phase 2: Agricultural Adapters (Weeks 3-4)

1. **Climate FieldView Integration**
   - Implement FieldView MCP adapter
   - Create authentication flow
   - Develop field data access tools

2. **Weather Data Integration**
   - Implement Weather MCP adapter
   - Create location-based weather queries
   - Develop forecast visualization

### Phase 3: Enhanced Features (Weeks 5-6)

1. **Plugin Discovery System**
   - Implement plugin marketplace
   - Create plugin verification system
   - Develop plugin rating and reviews

2. **Advanced Tool Integration**
   - Implement tool chaining
   - Create tool result visualization
   - Develop agricultural-specific tool UI

## Benefits of Revised Approach

1. **Faster Implementation**: Leveraging LibreChat's existing MCP client reduces development time
2. **Robust Foundation**: Building on a tested implementation improves reliability
3. **Extensibility**: Plugin registry enables easy addition of new capabilities
4. **User Customization**: Farmers can add MCPs that meet their specific needs
5. **Future-Proof**: Compatible with evolving MCP ecosystem

## Integration with AnythingLLM

The MCP system will integrate with AnythingLLM through:

1. **Agent Framework Extension**: MCP tools will be available to AnythingLLM agents
2. **Chat Interface Integration**: MCP responses will be rendered in the chat interface
3. **Document Processing Enhancement**: MCP servers can assist with document processing
4. **Agricultural Context Enrichment**: MCP data will enhance context for queries

## Conclusion

This revised MCP integration strategy leverages LibreChat's existing implementation while focusing our development efforts on agricultural-specific adapters and a robust plugin system. By building on LibreChat's foundation, we can deliver a more reliable and extensible system that allows farmers to customize their experience with specialized MCP plugins. 
# BizzyPerson MCP Integration (BP10)

## Overview

This document outlines the integration of Model Context Protocol (MCP) capabilities into the BizzyPerson platform. The integration leverages LibreChat's existing MCP client implementation while extending it with agricultural-specific features and tools. This approach allows us to focus on domain-specific extensions while benefiting from LibreChat's robust MCP infrastructure.

## LibreChat MCP Architecture

LibreChat implements MCP through several key components that we'll leverage in our integration:

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

LibreChat supports multiple transport mechanisms for MCP, which is particularly important for agricultural settings with varying connectivity options:

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
    // SSE is one-way, so we need to use a separate channel for sending
    await fetch(`${this.url}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
  }
}

class WebSocketTransport {
  constructor(options) {
    this.url = options.url;
    this.socket = null;
    this.messageHandlers = [];
  }

  async connect() {
    this.socket = new WebSocket(this.url);
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messageHandlers.forEach(handler => handler(message));
    };
  }

  async disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  onMessage(handler) {
    this.messageHandlers.push(handler);
  }

  async sendMessage(message) {
    this.socket.send(JSON.stringify(message));
  }
}
```

## BizzyPerson MCP Extensions

Building on LibreChat's MCP foundation, we're implementing several extensions specific to the BizzyPerson platform:

### 1. Plugin Registry System

The Plugin Registry System manages MCP plugins and their lifecycle:

```javascript
class MCPPluginRegistry {
  constructor() {
    this.availablePlugins = new Map();
    this.installedPlugins = new Map();
  }

  registerPlugin(plugin) {
    this.availablePlugins.set(plugin.id, plugin);
  }

  async installPlugin(pluginId, options = {}) {
    const plugin = this.availablePlugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin '${pluginId}' not found in registry`);
    }
    
    const instance = await plugin.install(options);
    this.installedPlugins.set(pluginId, {
      plugin,
      instance,
      enabled: false,
      options
    });
    
    return instance;
  }

  async enablePlugin(pluginId) {
    const entry = this.installedPlugins.get(pluginId);
    if (!entry) {
      throw new Error(`Plugin '${pluginId}' not installed`);
    }
    
    await entry.instance.enable();
    entry.enabled = true;
  }

  async disablePlugin(pluginId) {
    const entry = this.installedPlugins.get(pluginId);
    if (!entry) {
      throw new Error(`Plugin '${pluginId}' not installed`);
    }
    
    await entry.instance.disable();
    entry.enabled = false;
  }
}
```

### 2. Agricultural Adapters

Agricultural adapters provide specialized interfaces for farm-specific data sources:

```javascript
class FieldViewAdapter {
  constructor(options) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || 'https://api.climate.com/api/v2';
  }

  async fetchFields() {
    // Fetch fields from Climate FieldView API
  }

  async fetchFieldData(fieldId) {
    // Fetch specific field data
  }

  async fetchPlantings(fieldId) {
    // Fetch planting data for a field
  }

  async fetchYieldData(fieldId) {
    // Fetch yield data for a field
  }
}

class SoilTestAdapter {
  constructor(options) {
    this.labProvider = options.labProvider;
    this.credentials = options.credentials;
  }

  async fetchRecentTests() {
    // Fetch recent soil tests
  }

  async fetchTestDetails(testId) {
    // Fetch detailed soil test results
  }

  async analyzeResults(testId) {
    // Analyze soil test results and provide recommendations
  }
}
```

### 3. MCP Tool Implementations

BizzyPerson implements several MCP tools for agricultural use cases:

```javascript
const fieldAnalyzerTool = {
  name: 'field_analyzer',
  description: 'Analyzes field data and provides insights',
  parameters: {
    type: 'object',
    properties: {
      field_id: {
        type: 'string',
        description: 'ID of the field to analyze'
      },
      analysis_type: {
        type: 'string',
        enum: ['soil', 'yield', 'planting', 'weather'],
        description: 'Type of analysis to perform'
      }
    },
    required: ['field_id']
  },
  execute: async ({ field_id, analysis_type = 'soil' }) => {
    // Perform field analysis
  }
};

const cropPlannerTool = {
  name: 'crop_planner',
  description: 'Plans crop rotations and planting schedules',
  parameters: {
    type: 'object',
    properties: {
      field_id: {
        type: 'string',
        description: 'ID of the field to plan for'
      },
      season: {
        type: 'string',
        description: 'Season to plan for (e.g., "Spring 2025")'
      },
      crop_type: {
        type: 'string',
        description: 'Type of crop to plan'
      }
    },
    required: ['field_id', 'season']
  },
  execute: async ({ field_id, season, crop_type }) => {
    // Generate crop plan
  }
};

const weatherForecastTool = {
  name: 'weather_forecast',
  description: 'Retrieves weather forecasts for agricultural planning',
  parameters: {
    type: 'object',
    properties: {
      location: {
        type: 'object',
        properties: {
          lat: { type: 'number' },
          lon: { type: 'number' }
        },
        description: 'Location coordinates'
      },
      days: {
        type: 'number',
        description: 'Number of days to forecast'
      }
    },
    required: ['location']
  },
  execute: async ({ location, days = 7 }) => {
    // Retrieve weather forecast
  }
};
```

## Integration with LibreChat

### Tool Registration

We register our agricultural tools with LibreChat's MCP system:

```javascript
// In bizzy/core/librechat/tools/index.js

import { fieldAnalyzerTool, cropPlannerTool, weatherForecastTool } from './agricultural-tools';

export function registerAgricultureTools(mcpManager) {
  // Get the default connection or create one for our tools
  const connection = mcpManager.getConnection('default') || 
    mcpManager.createConnection({
      id: 'agriculture',
      name: 'Agriculture Tools',
      description: 'Tools for agricultural planning and analysis',
      transport: mcpManager.createTransport('http', {
        url: process.env.BIZZY_API_URL
      })
    });
  
  // Register our tools
  connection.registerTool(fieldAnalyzerTool);
  connection.registerTool(cropPlannerTool);
  connection.registerTool(weatherForecastTool);
  
  // Enable the connection if it's new
  if (!mcpManager.getConnection('agriculture')) {
    mcpManager.registerConnection('agriculture', connection);
    connection.enable();
  }
}
```

### System Prompts

We provide specialized system prompts for agricultural use cases:

```javascript
// In bizzy/core/librechat/prompts/agriculture.js

export const agricultureSystemPrompt = `You are an agricultural assistant with access to specialized tools for farm management.

Available tools:
1. field_analyzer: Analyzes field data and provides insights about soil health, yield potential, and more.
2. crop_planner: Plans crop rotations and planting schedules based on field conditions and goals.
3. weather_forecast: Retrieves weather forecasts for agricultural planning.

When helping with farm management:
- Use field_analyzer to understand current field conditions
- Use crop_planner to make planting recommendations
- Use weather_forecast to check upcoming conditions that might affect operations
- Consider seasonal timing for all recommendations
- Reference soil test results when available
- Provide practical, actionable advice

Remember that farming operations are highly dependent on local conditions, timing, and resources.`;
```

## Fork Management Strategy

To handle upstream changes to LibreChat's MCP implementation, we use a "fork and merge" approach:

```
LibreChat Main Repo
       ↓
Our LibreChat Fork
       ↓
FMS Integration Branch
       ↓
Feature-Specific Branches
```

### Steps for Fork Synchronization:

1. **Add Upstream Remote**:
   ```bash
   git remote add upstream https://github.com/danny-avila/LibreChat.git
   ```

2. **Fetch Upstream Changes**:
   ```bash
   git fetch upstream
   ```

3. **Merge Changes into Our Fork**:
   ```bash
   git checkout main
   git merge upstream/main
   ```

4. **Resolve Conflicts**:
   ```bash
   # Resolve any conflicts
   git add .
   git commit -m "Merge upstream changes"
   ```

5. **Update Integration Branch**:
   ```bash
   git checkout fms-integration
   git merge main
   ```

### Handling MCP Updates

When LibreChat updates its MCP implementation, we follow these steps:

1. **Review Changes**: Analyze the changes to understand their impact on our integration
2. **Update Our Extensions**: Modify our extensions to accommodate the changes
3. **Test Integration**: Thoroughly test the integration to ensure compatibility
4. **Update Documentation**: Update this document and other relevant documentation

## Recent LibreChat MCP Updates

From the March 2025 updates, several changes directly impact our MCP integration:

1. **Configurable MCP Server Timeouts** (PR #6199)
   - Added ability to configure timeouts for MCP server connections
   - Important for reliability in rural areas with poor connectivity

2. **MCP SDK Updates** (PR #6203)
   - Updated the MCP SDK with new capabilities
   - Improved error handling and connection management

3. **Weather Data Tool** (PR #5246)
   - Added OpenWeather tool for weather data retrieval
   - Highly relevant for agricultural planning

### Implementation of Recent Updates

To incorporate these updates, we've made the following changes:

1. **Timeout Configuration**:
   ```javascript
   // In bizzy/core/librechat/config/mcp.js
   
   export const mcpConfig = {
     defaultTimeout: 30000, // 30 seconds default
     ruralTimeout: 60000,   // 60 seconds for rural areas
     
     getTimeout: (connectionType) => {
       if (connectionType === 'rural') {
         return mcpConfig.ruralTimeout;
       }
       return mcpConfig.defaultTimeout;
     }
   };
   ```

2. **Updated SDK Integration**:
   ```javascript
   // In bizzy/core/librechat/mcp/client.js
   
   import { MCPClient } from '@librechat/mcp-sdk';
   
   export function createMCPClient(options) {
     const client = new MCPClient({
       ...options,
       errorHandler: (error) => {
         console.error('MCP Error:', error);
         // Additional error handling
       }
     });
     
     return client;
   }
   ```

3. **Weather Tool Integration**:
   ```javascript
   // In bizzy/core/librechat/tools/weather.js
   
   import { openWeatherTool } from '@librechat/tools';
   
   export const enhancedWeatherTool = {
     ...openWeatherTool,
     execute: async (params) => {
       const baseResult = await openWeatherTool.execute(params);
       
       // Enhance with agricultural context
       return {
         ...baseResult,
         farmingImplications: analyzeFarmingImplications(baseResult)
       };
     }
   };
   
   function analyzeFarmingImplications(weatherData) {
     // Analyze weather data for farming implications
     // e.g., planting conditions, harvest windows, etc.
   }
   ```

## Conclusion

Our MCP integration strategy leverages LibreChat's robust implementation while extending it with agricultural-specific features. By using this approach, we can focus on domain-specific extensions while benefiting from ongoing improvements to the underlying MCP infrastructure.

The integration is designed to be resilient to upstream changes through our fork management strategy, allowing us to incorporate new features and improvements from LibreChat while maintaining our agricultural extensions. 
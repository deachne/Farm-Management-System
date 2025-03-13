# BizzyPerson MCP Tools (BP05)

## Overview

This document outlines the Model Context Protocol (MCP) tools available in the BizzyPerson platform. MCP tools enable AI assistants to perform specialized tasks by connecting to external services and APIs. This integration is particularly valuable for agricultural applications, where domain-specific tools can significantly enhance the AI's capabilities.

## MCP Architecture

The MCP system in BizzyPerson is built on LibreChat's implementation, with extensions for agricultural use cases. The architecture consists of:

1. **MCP Client**: Manages connections to MCP servers and handles tool execution
2. **Plugin Registry**: Manages available and installed MCP plugins
3. **Tool Definitions**: Specifications for individual tools
4. **Adapters**: Domain-specific implementations for external services

```
┌─────────────────────────────────────────────────────────────┐
│                    BizzyPerson Platform                     │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   MCP       │  │   Plugin    │  │       Tool          │  │
│  │  Client     │◄─┤  Registry   │◄─┤     Definitions     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│         ▲                                      ▲            │
└─────────┼──────────────────────────────────────┼────────────┘
          │                                      │
┌─────────┼──────────────────────────────────────┼────────────┐
│         │                                      │            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  External   │  │  Domain     │  │     Specialized     │  │
│  │  Services   │  │  Adapters   │  │       Tools         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                             │
│                  MCP Implementation                         │
└─────────────────────────────────────────────────────────────┘
```

## Core MCP Components

### MCP Client

The MCP client is responsible for managing connections to MCP servers and executing tools:

```javascript
// Example of using the MCP client
const mcpManager = new MCPManager();

// Register transport types
mcpManager.registerTransport('sse', SSETransport);
mcpManager.registerTransport('websocket', WebSocketTransport);

// Create a transport
const transport = mcpManager.createTransport('sse', { 
  url: 'https://fieldview-mcp.example.com/events',
  timeout: 30000 // 30 seconds timeout
});

// Create a connection
const connection = new MCPConnection({
  id: 'fieldview-mcp',
  name: 'FieldView MCP',
  description: 'MCP for Climate FieldView integration',
  transport,
  enabled: false
});

// Connect to the MCP server
await connection.connect({
  onError: (error) => handleConnectionError('fieldview-mcp', error),
  retryAttempts: 3
});
```

### Plugin Registry

The plugin registry manages MCP plugins and their lifecycle:

```javascript
class MCPPluginRegistry {
  constructor() {
    this.mcpManager = new MCPManager();
    this.availablePlugins = new Map();
    this.installedPlugins = new Map();
    this.defaultTimeout = 30000; // 30 seconds default timeout
    this.eventEmitter = new EventEmitter();
    
    // Register transport types
    this.registerTransports();
  }
  
  // Register all available transport types
  registerTransports() {
    this.mcpManager.registerTransport('sse', SSETransport);
    this.mcpManager.registerTransport('websocket', WebSocketTransport);
    
    // Add new transport types if available
    if (HTTPPollingTransport) {
      this.mcpManager.registerTransport('http-polling', HTTPPollingTransport);
    }
  }

  // Register a plugin in the registry
  registerPlugin(plugin) {
    // Validate plugin schema
    const validatedPlugin = {
      ...plugin,
      transportOptions: {
        ...plugin.transportOptions,
        timeout: plugin.transportOptions.timeout || this.defaultTimeout
      }
    };
    
    this.availablePlugins.set(validatedPlugin.id, validatedPlugin);
  }

  // Install a plugin from the registry
  async installPlugin(pluginId) {
    const plugin = this.availablePlugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin '${pluginId}' not found in registry`);
    }

    // Create transport for the plugin
    const transport = this.mcpManager.createTransport(
      plugin.transportType, 
      plugin.transportOptions
    );

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
    try {
      const plugin = this.installedPlugins.get(pluginId);
      if (!plugin) {
        throw new Error(`Plugin '${pluginId}' not installed`);
      }

      // Use new connection method with error handling
      await plugin.connection.connect({
        onError: (error) => this.handleConnectionError(pluginId, error),
        retryAttempts: 3
      });
      
      plugin.enabled = true;
      return plugin;
    } catch (error) {
      console.error(`Error enabling plugin ${pluginId}:`, error);
      throw error;
    }
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
  
  // Handle connection errors
  handleConnectionError(pluginId, error) {
    // Log error
    console.error(`Connection error for plugin ${pluginId}:`, error);
    
    // Update plugin status
    const plugin = this.installedPlugins.get(pluginId);
    if (plugin) {
      plugin.connectionError = error.message;
      plugin.enabled = false;
    }
    
    // Notify UI if applicable
    this.eventEmitter.emit('plugin:error', { pluginId, error: error.message });
  }
}
```

## Agricultural MCP Tools

BizzyPerson provides several specialized MCP tools for agricultural applications:

### Climate FieldView Tools

Tools for integrating with Climate FieldView:

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
      },
      {
        name: 'getHarvestData',
        description: 'Get harvest data from Climate FieldView',
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
        execute: this.getHarvestData.bind(this)
      }
    ];
  }

  async getFieldData(params) {
    if (!this.accessToken) {
      await this.authenticate();
    }

    // Implement field data retrieval
    const { fieldId, season } = params;
    
    const response = await fetch(
      `https://api.climate.com/api/fields/${fieldId}?season=${season || 'current'}`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      }
    );
    
    return await response.json();
  }

  async getPlantingData(params) {
    if (!this.accessToken) {
      await this.authenticate();
    }

    // Implement planting data retrieval
    const { fieldId, season } = params;
    
    const response = await fetch(
      `https://api.climate.com/api/fields/${fieldId}/planting?season=${season}`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      }
    );
    
    return await response.json();
  }
  
  async getHarvestData(params) {
    if (!this.accessToken) {
      await this.authenticate();
    }

    // Implement harvest data retrieval
    const { fieldId, season } = params;
    
    const response = await fetch(
      `https://api.climate.com/api/fields/${fieldId}/harvest?season=${season}`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      }
    );
    
    return await response.json();
  }
}
```

### Weather Tools

Tools for accessing weather data:

```javascript
class WeatherMCPAdapter {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }
  
  getTools() {
    return [
      {
        name: 'getCurrentWeather',
        description: 'Get current weather for a location',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'The location to get weather for (city name, coordinates, etc.)'
            },
            units: {
              type: 'string',
              enum: ['metric', 'imperial'],
              description: 'Units of measurement'
            }
          },
          required: ['location']
        },
        execute: this.getCurrentWeather.bind(this)
      },
      {
        name: 'getForecast',
        description: 'Get weather forecast for a location',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'The location to get forecast for'
            },
            days: {
              type: 'number',
              description: 'Number of days to forecast'
            },
            units: {
              type: 'string',
              enum: ['metric', 'imperial'],
              description: 'Units of measurement'
            }
          },
          required: ['location']
        },
        execute: this.getForecast.bind(this)
      },
      {
        name: 'getFieldWeather',
        description: 'Get weather for a specific field',
        parameters: {
          type: 'object',
          properties: {
            fieldId: {
              type: 'string',
              description: 'The ID of the field'
            },
            units: {
              type: 'string',
              enum: ['metric', 'imperial'],
              description: 'Units of measurement'
            }
          },
          required: ['fieldId']
        },
        execute: this.getFieldWeather.bind(this)
      }
    ];
  }
  
  async getCurrentWeather(params) {
    const { location, units = 'metric' } = params;
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=${units}&appid=${this.apiKey}`
    );
    
    return await response.json();
  }
  
  async getForecast(params) {
    const { location, days = 5, units = 'metric' } = params;
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&cnt=${days * 8}&units=${units}&appid=${this.apiKey}`
    );
    
    return await response.json();
  }
  
  async getFieldWeather(params) {
    const { fieldId, units = 'metric' } = params;
    
    // Get field coordinates from database
    const field = await getFieldById(fieldId);
    
    if (!field || !field.boundary || !field.boundary.center) {
      throw new Error(`Field ${fieldId} not found or has no coordinates`);
    }
    
    const { lat, lon } = field.boundary.center;
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${this.apiKey}`
    );
    
    return await response.json();
  }
}
```

### Soil Test Tools

Tools for processing and analyzing soil test results:

```javascript
class SoilTestMCPAdapter {
  constructor() {
    // Initialize soil test database connection
  }
  
  getTools() {
    return [
      {
        name: 'analyzeSoilTest',
        description: 'Analyze soil test results and provide recommendations',
        parameters: {
          type: 'object',
          properties: {
            soilTestId: {
              type: 'string',
              description: 'The ID of the soil test to analyze'
            },
            cropType: {
              type: 'string',
              description: 'The crop type for recommendations'
            }
          },
          required: ['soilTestId']
        },
        execute: this.analyzeSoilTest.bind(this)
      },
      {
        name: 'getSoilTestHistory',
        description: 'Get soil test history for a field',
        parameters: {
          type: 'object',
          properties: {
            fieldId: {
              type: 'string',
              description: 'The ID of the field'
            },
            years: {
              type: 'number',
              description: 'Number of years of history to retrieve'
            }
          },
          required: ['fieldId']
        },
        execute: this.getSoilTestHistory.bind(this)
      }
    ];
  }
  
  async analyzeSoilTest(params) {
    const { soilTestId, cropType } = params;
    
    // Retrieve soil test data
    const soilTest = await getSoilTestById(soilTestId);
    
    if (!soilTest) {
      throw new Error(`Soil test ${soilTestId} not found`);
    }
    
    // Analyze soil test data
    const analysis = {
      ph: this.analyzePH(soilTest.ph, cropType),
      nutrients: this.analyzeNutrients(soilTest.nutrients, cropType),
      organicMatter: this.analyzeOrganicMatter(soilTest.organicMatter),
      recommendations: this.generateRecommendations(soilTest, cropType)
    };
    
    return analysis;
  }
  
  async getSoilTestHistory(params) {
    const { fieldId, years = 5 } = params;
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - years);
    
    // Retrieve soil test history
    const history = await getSoilTestsByFieldId(fieldId, startDate, endDate);
    
    return history;
  }
  
  // Helper methods for soil test analysis
  analyzePH(ph, cropType) {
    // Implement pH analysis logic
  }
  
  analyzeNutrients(nutrients, cropType) {
    // Implement nutrient analysis logic
  }
  
  analyzeOrganicMatter(organicMatter) {
    // Implement organic matter analysis logic
  }
  
  generateRecommendations(soilTest, cropType) {
    // Implement recommendation generation logic
  }
}
```

## MCP Update Management

To handle updates to LibreChat's MCP implementation, we follow a "fork and merge" approach:

### Fork Synchronization

```bash
git remote add upstream https://github.com/danny-avila/LibreChat.git
git fetch upstream
git checkout -b sync-YYYY-MM-DD
git merge upstream/main
```

### MCP Client Update Process

1. **Identify Changed Files**:
   - Monitor `packages/mcp/` directory
   - Track changes to `MCPManager`, `MCPConnection`, and transport classes
   - Note any API changes or new capabilities

2. **Extract Core Changes**:
   - Create a patch of essential changes
   - Focus on functionality over styling or minor tweaks
   - Document the purpose of each significant change

3. **Apply to Our Implementation**:
   - Update our `MCPPluginRegistry` class to accommodate changes
   - Modify agricultural adapters as needed
   - Ensure backward compatibility where possible

4. **Test Integration**:
   - Verify all MCP connections still work
   - Test with agricultural data sources
   - Confirm plugin management functionality

### Recent Updates

Recent updates to the MCP implementation include:

1. **Configurable MCP Server Timeouts**:
   - Added ability to configure timeouts for MCP server connections
   - Important for reliability in rural areas with poor connectivity

2. **MCP SDK Updates**:
   - Updated the MCP SDK with new capabilities
   - Improved error handling and connection management

3. **Weather Data Tool**:
   - Added OpenWeather tool for weather data retrieval
   - Highly relevant for agricultural planning

## User Interface

The MCP tools are integrated into the BizzyPerson UI through a plugin management interface:

```jsx
// Example MCP Plugin Manager component
function MCPPluginManager() {
  const [availablePlugins, setAvailablePlugins] = useState([]);
  const [installedPlugins, setInstalledPlugins] = useState([]);
  
  useEffect(() => {
    // Load available and installed plugins
    async function loadPlugins() {
      const available = await api.getAvailablePlugins();
      const installed = await api.getInstalledPlugins();
      
      setAvailablePlugins(available);
      setInstalledPlugins(installed);
    }
    
    loadPlugins();
  }, []);
  
  async function handleInstall(pluginId) {
    try {
      await api.installPlugin(pluginId);
      // Refresh installed plugins
      const installed = await api.getInstalledPlugins();
      setInstalledPlugins(installed);
    } catch (error) {
      console.error('Error installing plugin:', error);
    }
  }
  
  async function handleEnable(pluginId) {
    try {
      await api.enablePlugin(pluginId);
      // Refresh installed plugins
      const installed = await api.getInstalledPlugins();
      setInstalledPlugins(installed);
    } catch (error) {
      console.error('Error enabling plugin:', error);
    }
  }
  
  async function handleDisable(pluginId) {
    try {
      await api.disablePlugin(pluginId);
      // Refresh installed plugins
      const installed = await api.getInstalledPlugins();
      setInstalledPlugins(installed);
    } catch (error) {
      console.error('Error disabling plugin:', error);
    }
  }
  
  return (
    <div className="mcp-plugin-manager">
      <h2>Available Plugins</h2>
      <div className="plugin-list">
        {availablePlugins.map(plugin => (
          <div key={plugin.id} className="plugin-card">
            <h3>{plugin.name}</h3>
            <p>{plugin.description}</p>
            <button onClick={() => handleInstall(plugin.id)}>Install</button>
          </div>
        ))}
      </div>
      
      <h2>Installed Plugins</h2>
      <div className="plugin-list">
        {installedPlugins.map(plugin => (
          <div key={plugin.id} className="plugin-card">
            <h3>{plugin.name}</h3>
            <p>{plugin.description}</p>
            {plugin.enabled ? (
              <button onClick={() => handleDisable(plugin.id)}>Disable</button>
            ) : (
              <button onClick={() => handleEnable(plugin.id)}>Enable</button>
            )}
            {plugin.connectionError && (
              <div className="error-message">
                Error: {plugin.connectionError}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Best Practices

When developing MCP tools for BizzyPerson, follow these best practices:

1. **Error Handling**: Implement robust error handling for all tool functions.
2. **Timeouts**: Configure appropriate timeouts for MCP connections, especially for rural areas with poor connectivity.
3. **Retry Logic**: Implement retry logic for transient failures.
4. **Authentication**: Securely manage API keys and tokens.
5. **Validation**: Validate all input parameters before making API calls.
6. **Documentation**: Document all tool functions and their parameters.
7. **Testing**: Test tools with realistic agricultural data.
8. **Performance**: Optimize performance for mobile and low-bandwidth scenarios.

## Conclusion

The MCP tools in BizzyPerson provide powerful capabilities for agricultural applications. By leveraging LibreChat's MCP implementation and extending it with domain-specific adapters, we enable AI assistants to perform specialized tasks that are valuable for farmers and agricultural professionals. 
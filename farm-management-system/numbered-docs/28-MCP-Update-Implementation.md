# MCP Update Implementation Plan

## Overview

This document outlines our practical implementation plan for handling LibreChat MCP updates in the Farm Management System. It focuses on the specific steps needed to integrate recent changes while maintaining the stability of our agricultural extensions.

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

## Implementation Approach

### 1. Fork Management Strategy

We'll use a "fork and merge" approach to handle upstream changes:

```
LibreChat Main Repo
       ↓
Our LibreChat Fork
       ↓
FMS Integration Branch
       ↓
Feature-Specific Branches
```

#### Steps for Fork Synchronization:

1. **Add Upstream Remote**:
   ```bash
   git remote add upstream https://github.com/danny-avila/LibreChat.git
   ```

2. **Fetch Upstream Changes**:
   ```bash
   git fetch upstream
   ```

3. **Create Sync Branch**:
   ```bash
   git checkout -b sync-YYYY-MM-DD
   git merge upstream/main
   ```

4. **Resolve Conflicts**:
   - Focus on MCP-related files first
   - Preserve our agricultural extensions
   - Document any significant conflict resolutions

5. **Test Synchronized Code**:
   - Run the test suite
   - Verify MCP functionality
   - Check agricultural extensions

6. **Merge to Our Main Branch**:
   ```bash
   git checkout main
   git merge sync-YYYY-MM-DD
   ```

### 2. MCP Client Update Process

For the MCP client specifically, we'll follow this process:

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

### 3. Specific Update Implementation Plan

#### 3.1 Configurable MCP Server Timeouts

**Priority**: High (Critical for rural connectivity)

**Implementation Steps**:

1. Update our `MCPPluginRegistry` to support timeout configuration:

```javascript
// Add timeout configuration to plugin schema
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
```

2. Add timeout configuration to the UI:

```jsx
// Add to MCPPluginManager component
const [timeout, setTimeout] = useState(plugin.transportOptions?.timeout || 30000);

// Add to form
<FormField
  label="Connection Timeout (ms)"
  name="timeout"
  type="number"
  value={timeout}
  onChange={(e) => setTimeout(parseInt(e.target.value))}
  min={5000}
  max={120000}
  step={1000}
/>
```

3. Update API endpoints to handle timeout configuration:

```javascript
// In API route handler
app.post('/api/mcp/plugins/install', (req, res) => {
  const { pluginId, timeout } = req.body;
  
  // Apply timeout to plugin configuration
  const plugin = availablePlugins.get(pluginId);
  plugin.transportOptions.timeout = timeout || 30000;
  
  // Continue with installation
  // ...
});
```

#### 3.2 MCP SDK Updates

**Priority**: High (Core functionality)

**Implementation Steps**:

1. Update our imports to use the latest SDK:

```javascript
// Update imports
import { MCPManager, MCPConnection, SSETransport } from '@librechat/mcp-sdk';
```

2. Review and adapt to any API changes:

```javascript
// Example adaptation for new error handling
class MCPPluginRegistry {
  // ...
  
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

3. Update our transport handling for any new transport types:

```javascript
// Register all available transport types
registerTransports() {
  this.mcpManager.registerTransport('sse', SSETransport);
  this.mcpManager.registerTransport('websocket', WebSocketTransport);
  
  // Add new transport types if available
  if (HTTPPollingTransport) {
    this.mcpManager.registerTransport('http-polling', HTTPPollingTransport);
  }
}
```

#### 3.3 Weather Data Tool Integration

**Priority**: High (Agricultural relevance)

**Implementation Steps**:

1. Create a Weather MCP adapter:

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
}
```

2. Add weather visualization components:

```jsx
// Weather visualization component
const WeatherVisualization = ({ data }) => {
  if (!data) return null;
  
  return (
    <div className="weather-visualization">
      <div className="current-conditions">
        <h3>{data.name}</h3>
        <div className="temperature">{Math.round(data.main.temp)}°C</div>
        <div className="description">{data.weather[0].description}</div>
        <div className="details">
          <div>Humidity: {data.main.humidity}%</div>
          <div>Wind: {data.wind.speed} m/s</div>
        </div>
      </div>
    </div>
  );
};

// Add to artifact renderers
const ArtifactRenderer = ({ artifact }) => {
  switch (artifact.type) {
    case 'weather':
      return <WeatherVisualization data={artifact.data} />;
    // Other artifact types...
    default:
      return null;
  }
};
```

3. Integrate with field management:

```javascript
// Field weather integration
async function getFieldWeather(fieldId) {
  const field = await getFieldById(fieldId);
  
  if (!field.location) {
    throw new Error('Field location not available');
  }
  
  const { latitude, longitude } = JSON.parse(field.location);
  
  const weatherAdapter = new WeatherMCPAdapter(process.env.OPENWEATHER_API_KEY);
  
  return await weatherAdapter.getCurrentWeather({
    location: `${latitude},${longitude}`,
    units: 'metric'
  });
}
```

## Testing Strategy

### 1. Unit Tests

Create specific tests for MCP functionality:

```javascript
// Example test for MCPPluginRegistry
describe('MCPPluginRegistry', () => {
  let registry;
  
  beforeEach(() => {
    registry = new MCPPluginRegistry();
  });
  
  test('should register a plugin', () => {
    const plugin = {
      id: 'test-plugin',
      name: 'Test Plugin',
      description: 'A test plugin',
      transportType: 'sse',
      transportOptions: {
        url: 'https://example.com/events'
      }
    };
    
    registry.registerPlugin(plugin);
    
    expect(registry.getAvailablePlugins()).toContainEqual(expect.objectContaining({
      id: 'test-plugin'
    }));
  });
  
  test('should handle timeouts correctly', async () => {
    // Test timeout configuration
    // ...
  });
});
```

### 2. Integration Tests

Test the complete flow from plugin installation to usage:

```javascript
describe('MCP Integration', () => {
  test('should install and enable a plugin', async () => {
    // Setup test environment
    // ...
    
    // Register a test plugin
    await request(app)
      .post('/api/mcp/plugins/register')
      .send(testPlugin)
      .expect(200);
    
    // Install the plugin
    await request(app)
      .post('/api/mcp/plugins/install')
      .send({ pluginId: 'test-plugin' })
      .expect(200);
    
    // Enable the plugin
    await request(app)
      .post('/api/mcp/plugins/enable')
      .send({ pluginId: 'test-plugin' })
      .expect(200);
    
    // Verify the plugin is enabled
    const response = await request(app)
      .get('/api/mcp/plugins/installed')
      .expect(200);
    
    const installedPlugin = response.body.find(p => p.id === 'test-plugin');
    expect(installedPlugin.enabled).toBe(true);
  });
});
```

### 3. Field Testing

Create specific scenarios for agricultural use cases:

1. **Rural Connectivity Test**:
   - Test with simulated poor connectivity
   - Verify timeout handling works correctly
   - Confirm data integrity after reconnection

2. **Weather Integration Test**:
   - Test weather data retrieval for specific fields
   - Verify visualization in the field management interface
   - Confirm integration with planning tools

## Rollout Plan

### 1. Phased Deployment

1. **Development Environment** (Week 1)
   - Implement and test all changes
   - Document any issues or workarounds

2. **Staging Environment** (Week 2)
   - Deploy to staging with test data
   - Conduct thorough testing with real agricultural data
   - Verify all integrations work correctly

3. **Production Environment** (Week 3)
   - Deploy to production
   - Monitor for any issues
   - Be prepared to rollback if necessary

### 2. Documentation Updates

1. **Update Integration Documentation**:
   - Document new timeout configuration options
   - Explain weather data integration
   - Provide examples of agricultural use cases

2. **Update User Guide**:
   - Add section on weather data visualization
   - Explain how to configure MCP plugins for optimal field use
   - Provide troubleshooting tips for connectivity issues

### 3. Training and Communication

1. **Developer Training**:
   - Conduct session on MCP updates
   - Review integration points and potential issues
   - Discuss future update strategies

2. **User Communication**:
   - Announce new weather integration features
   - Highlight improved reliability in rural areas
   - Provide guidance on optimal settings

## Conclusion

This implementation plan provides a structured approach to integrating LibreChat MCP updates into our Farm Management System. By focusing on agricultural relevance and carefully managing the integration process, we can maintain alignment with upstream improvements while ensuring our specialized agricultural functionality remains stable and effective. 
# Farm Management System - MCP Integration

This document outlines the integration of Model Context Protocol (MCP) servers with our agricultural knowledge management system, enabling specialized processing for farm-specific tasks.

## MCP Overview

The Model Context Protocol (MCP) is a standardized way for AI systems to communicate with specialized processing servers. In our agricultural system, MCP servers provide domain-specific capabilities that enhance AnythingLLM's core functionality.

### Key Benefits of MCP Integration

1. **Specialized Processing** - Dedicated servers for agricultural tasks like soil analysis
2. **Extensibility** - Easy addition of new capabilities without modifying core system
3. **Distributed Computing** - Offloading complex processing to specialized servers
4. **Domain Expertise** - Encapsulation of agricultural knowledge in purpose-built servers

## MCP Architecture

The system implements MCP integration through a client-server architecture:

```
┌─────────────────────────┐                 ┌─────────────────────────┐
│                         │                 │                         │
│    AnythingLLM Core     │                 │    MCP Server Layer     │
│                         │                 │                         │
│  ┌─────────────────┐    │                 │  ┌─────────────────┐    │
│  │                 │    │    MCP Client   │  │                 │    │
│  │  Chat System    │◄───┼─────Interface───┼─►│  Price Quote    │    │
│  │                 │    │                 │  │  MCP Server     │    │
│  └─────────────────┘    │                 │  └─────────────────┘    │
│                         │                 │                         │
│  ┌─────────────────┐    │                 │  ┌─────────────────┐    │
│  │                 │    │                 │  │                 │    │
│  │  Vector Store   │◄───┼─────────────────┼─►│  Field Data     │    │
│  │                 │    │                 │  │  MCP Server     │    │
│  └─────────────────┘    │                 │  └─────────────────┘    │
│                         │                 │                         │
│  ┌─────────────────┐    │                 │  ┌─────────────────┐    │
│  │                 │    │                 │  │                 │    │
│  │  Agent System   │◄───┼─────────────────┼─►│  Soil Test      │    │
│  │                 │    │                 │  │  MCP Server     │    │
│  └─────────────────┘    │                 │  └─────────────────┘    │
│                         │                 │                         │
└─────────────────────────┘                 └─────────────────────────┘
```

## MCP Client Implementation

The system implements an MCP client that connects to specialized agricultural servers:

```javascript
// MCP Client implementation in server/utils/mcpClient.js
class MCPClient {
  constructor(config) {
    this.servers = config.servers || {};
    this.defaultTimeout = config.timeout || 30000;
    this.apiKeys = config.apiKeys || {};
  }
  
  async query(serverName, message, context, options = {}) {
    const server = this.servers[serverName];
    if (!server) {
      throw new Error(`MCP server "${serverName}" not configured`);
    }
    
    const timeout = options.timeout || this.defaultTimeout;
    const apiKey = this.apiKeys[serverName];
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(`${server.url}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiKey ? `Bearer ${apiKey}` : undefined
        },
        body: JSON.stringify({
          message,
          context
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`MCP server error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`MCP client error for server ${serverName}:`, error);
      throw error;
    }
  }
  
  registerServer(name, url, apiKey) {
    this.servers[name] = { url };
    if (apiKey) {
      this.apiKeys[name] = apiKey;
    }
  }
  
  removeServer(name) {
    delete this.servers[name];
    delete this.apiKeys[name];
  }
}

module.exports = new MCPClient({
  servers: {
    'price-quote-mcp': { url: process.env.PRICE_QUOTE_MCP_URL },
    'field-data-mcp': { url: process.env.FIELD_DATA_MCP_URL },
    'soil-test-mcp': { url: process.env.SOIL_TEST_MCP_URL }
  },
  apiKeys: {
    'price-quote-mcp': process.env.PRICE_QUOTE_MCP_KEY,
    'field-data-mcp': process.env.FIELD_DATA_MCP_KEY,
    'soil-test-mcp': process.env.SOIL_TEST_MCP_KEY
  },
  timeout: parseInt(process.env.MCP_TIMEOUT || '30000')
});
```

## MCP Server Integration

The system integrates with these specialized agricultural MCP servers:

### 1. Price Quote MCP Server

This server specializes in processing and analyzing input price quotes:

```javascript
// Price Quote MCP Server API
const priceQuoteMCP = {
  // Normalize prices across different units
  normalizePrices: async (quotes) => {
    return await mcpClient.query('price-quote-mcp', {
      action: 'normalize',
      quotes
    });
  },
  
  // Compare quotes from different suppliers
  compareQuotes: async (quotes, requirements) => {
    return await mcpClient.query('price-quote-mcp', {
      action: 'compare',
      quotes,
      requirements
    });
  },
  
  // Analyze price trends over time
  analyzeTrends: async (product, timeRange) => {
    return await mcpClient.query('price-quote-mcp', {
      action: 'trends',
      product,
      timeRange
    });
  },
  
  // Generate purchase recommendations
  recommendPurchases: async (quotes, requirements, constraints) => {
    return await mcpClient.query('price-quote-mcp', {
      action: 'recommend',
      quotes,
      requirements,
      constraints
    });
  }
};
```

### 2. Field Data MCP Server

This server specializes in processing field observations and spatial data:

```javascript
// Field Data MCP Server API
const fieldDataMCP = {
  // Process field observations
  processObservation: async (observation, fieldContext) => {
    return await mcpClient.query('field-data-mcp', {
      action: 'process-observation',
      observation,
      fieldContext
    });
  },
  
  // Analyze field history
  analyzeFieldHistory: async (fieldId, timeRange, filters) => {
    return await mcpClient.query('field-data-mcp', {
      action: 'field-history',
      fieldId,
      timeRange,
      filters
    });
  },
  
  // Identify potential issues
  identifyIssues: async (observation, fieldHistory) => {
    return await mcpClient.query('field-data-mcp', {
      action: 'identify-issues',
      observation,
      fieldHistory
    });
  },
  
  // Generate field recommendations
  generateRecommendations: async (fieldId, issues, constraints) => {
    return await mcpClient.query('field-data-mcp', {
      action: 'recommendations',
      fieldId,
      issues,
      constraints
    });
  }
};
```

### 3. Soil Test MCP Server

This server specializes in analyzing soil test results and generating recommendations:

```javascript
// Soil Test MCP Server API
const soilTestMCP = {
  // Analyze soil test results
  analyzeSoilTest: async (soilTest, fieldContext) => {
    return await mcpClient.query('soil-test-mcp', {
      action: 'analyze',
      soilTest,
      fieldContext
    });
  },
  
  // Generate fertilizer recommendations
  generateFertilizerPlan: async (soilTest, crop, yieldGoal) => {
    return await mcpClient.query('soil-test-mcp', {
      action: 'fertilizer-plan',
      soilTest,
      crop,
      yieldGoal
    });
  },
  
  // Calculate application rates
  calculateRates: async (recommendations, equipment, constraints) => {
    return await mcpClient.query('soil-test-mcp', {
      action: 'calculate-rates',
      recommendations,
      equipment,
      constraints
    });
  },
  
  // Track soil health trends
  trackSoilHealth: async (fieldId, timeRange) => {
    return await mcpClient.query('soil-test-mcp', {
      action: 'soil-health-trends',
      fieldId,
      timeRange
    });
  }
};
```

## Integration with AnythingLLM

The MCP servers are integrated with AnythingLLM through several key components:

### 1. Agent System Integration

The system extends AnythingLLM's agent system to route queries to appropriate MCP servers:

```javascript
// Extension of AgentHandler in server/utils/agents/index.js
class AgriculturalAgentHandler extends AgentHandler {
  async handleQuery(message, options) {
    // Determine if agricultural MCP is needed
    const needsMCP = this.needsAgriculturalMCP(message, options);
    
    if (needsMCP) {
      // Route to appropriate MCP server
      return await this.routeToMCP(message, options);
    } else {
      // Use standard agent processing
      return await super.handleQuery(message, options);
    }
  }
  
  needsAgriculturalMCP(message, options) {
    // Check message content for agricultural terms
    const hasAgriculturalTerms = containsAgriculturalTerms(message);
    
    // Check if context includes field or farm data
    const hasAgriculturalContext = options.context && (
      options.context.fieldId || 
      options.context.farmData ||
      options.context.soilTest
    );
    
    return hasAgriculturalTerms || hasAgriculturalContext;
  }
  
  async routeToMCP(message, options) {
    // Select appropriate MCP server
    const mcpServer = this.selectMCPServer(message, options);
    
    // Prepare context for MCP
    const mcpContext = this.prepareMCPContext(options);
    
    // Query MCP server
    return await mcpClient.query(mcpServer, message, mcpContext);
  }
  
  selectMCPServer(message, options) {
    // Logic to select appropriate MCP server based on message and context
    if (message.includes('soil test') || options.context.soilTest) {
      return 'soil-test-mcp';
    } else if (message.includes('price') || message.includes('quote')) {
      return 'price-quote-mcp';
    } else if (options.context.fieldId || message.includes('field')) {
      return 'field-data-mcp';
    } else {
      // Default to field data MCP for general agricultural queries
      return 'field-data-mcp';
    }
  }
  
  prepareMCPContext(options) {
    // Extract relevant context for MCP server
    return {
      fieldId: options.context.fieldId,
      farmData: options.context.farmData,
      soilTest: options.context.soilTest,
      weather: options.context.weather,
      season: options.context.season,
      user: options.context.user
    };
  }
}
```

### 2. Chat System Integration

The system extends AnythingLLM's chat system to incorporate MCP responses:

```javascript
// Extension of chat system in server/endpoints/chat.js
router.post('/api/chat/agricultural', async (req, res) => {
  const { message, workspaceId, threadId, fieldId, season } = req.body;
  
  try {
    // Prepare agricultural context
    const context = {
      fieldId,
      season,
      weather: await getWeatherData(fieldId),
      farmData: await getFarmData(req.user.id)
    };
    
    // Get relevant documents from vector store
    const relevantDocs = await vectorStore.relevantDocumentsForQuery(
      message,
      workspaceId,
      { filter: { fieldId } }
    );
    
    // Determine if MCP processing is needed
    const mcpHandler = new AgriculturalAgentHandler();
    const needsMCP = mcpHandler.needsAgriculturalMCP(message, { context });
    
    let response;
    if (needsMCP) {
      // Process with MCP
      response = await mcpHandler.routeToMCP(message, {
        context,
        relevantDocs
      });
    } else {
      // Process with standard chat system
      response = await processStandardChat(
        message,
        workspaceId,
        threadId,
        relevantDocs,
        context
      );
    }
    
    // Save chat history
    await saveChatHistory(req.user.id, workspaceId, threadId, message, response);
    
    return res.status(200).json({ success: true, response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
});
```

### 3. UI Integration

The system extends AnythingLLM's UI to display specialized agricultural visualizations from MCP servers:

```javascript
// React component for MCP visualization in frontend/src/components/MCPVisualization/index.jsx
import React from 'react';
import SoilTestVisualization from './SoilTestVisualization';
import PriceComparisonVisualization from './PriceComparisonVisualization';
import FieldObservationVisualization from './FieldObservationVisualization';

const MCPVisualization = ({ response }) => {
  // Check if response includes MCP visualization data
  if (!response || !response.visualization) {
    return null;
  }
  
  // Render appropriate visualization based on type
  switch (response.visualization.type) {
    case 'soil-test':
      return <SoilTestVisualization data={response.visualization.data} />;
    case 'price-comparison':
      return <PriceComparisonVisualization data={response.visualization.data} />;
    case 'field-observation':
      return <FieldObservationVisualization data={response.visualization.data} />;
    default:
      return null;
  }
};

export default MCPVisualization;
```

## MCP Server Implementation

The system includes these MCP server implementations:

### 1. Price Quote MCP Server

```javascript
// Price Quote MCP Server implementation
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Authentication middleware
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  if (token !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  next();
});

// Main query endpoint
app.post('/query', async (req, res) => {
  const { message, context } = req.body;
  
  try {
    // Parse the query to determine the action
    const action = parseAction(message);
    
    // Process based on action
    let result;
    switch (action.type) {
      case 'normalize':
        result = await normalizeQuotes(action.quotes);
        break;
      case 'compare':
        result = await compareQuotes(action.quotes, context);
        break;
      case 'trend':
        result = await analyzeTrends(action.product, action.timeRange);
        break;
      case 'recommend':
        result = await recommendPurchases(action.quotes, context);
        break;
      default:
        // General query processing
        result = await processGeneralQuery(message, context);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Price Quote MCP Server running on port ${port}`);
});
```

### 2. Field Data MCP Server

```javascript
// Field Data MCP Server implementation
const express = require('express');
const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

// Authentication middleware
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  if (token !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  next();
});

// Main query endpoint
app.post('/query', async (req, res) => {
  const { message, context } = req.body;
  
  try {
    // Parse the query to determine the action
    const action = parseAction(message);
    
    // Process based on action
    let result;
    switch (action.type) {
      case 'process-observation':
        result = await processObservation(action.observation, context);
        break;
      case 'field-history':
        result = await getFieldHistory(action.fieldId, action.timeRange, context);
        break;
      case 'identify-issues':
        result = await identifyIssues(action.observation, context);
        break;
      case 'recommendations':
        result = await generateRecommendations(action.fieldId, action.issues, context);
        break;
      default:
        // General query processing
        result = await processGeneralQuery(message, context);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Field Data MCP Server running on port ${port}`);
});
```

## Configuration and Deployment

### MCP Server Configuration

The system uses environment variables for MCP server configuration:

```
# MCP Server URLs
PRICE_QUOTE_MCP_URL=http://price-quote-mcp:3001
FIELD_DATA_MCP_URL=http://field-data-mcp:3002
SOIL_TEST_MCP_URL=http://soil-test-mcp:3003

# MCP API Keys
PRICE_QUOTE_MCP_KEY=your-price-quote-api-key
FIELD_DATA_MCP_KEY=your-field-data-api-key
SOIL_TEST_MCP_KEY=your-soil-test-api-key

# MCP Configuration
MCP_TIMEOUT=30000
```

### Deployment Options

The MCP servers can be deployed in several configurations:

1. **Docker Containers**:
   ```yaml
   # docker-compose.yml excerpt
   services:
     anythingllm:
       # AnythingLLM configuration
       depends_on:
         - price-quote-mcp
         - field-data-mcp
         - soil-test-mcp
     
     price-quote-mcp:
       build: ./mcp-servers/price-quote
       ports:
         - "3001:3001"
       environment:
         - API_KEY=${PRICE_QUOTE_MCP_KEY}
     
     field-data-mcp:
       build: ./mcp-servers/field-data
       ports:
         - "3002:3002"
       environment:
         - API_KEY=${FIELD_DATA_MCP_KEY}
     
     soil-test-mcp:
       build: ./mcp-servers/soil-test
       ports:
         - "3003:3003"
       environment:
         - API_KEY=${SOIL_TEST_MCP_KEY}
   ```

2. **Serverless Functions**:
   - Deploy MCP servers as AWS Lambda functions
   - Use API Gateway for endpoint management
   - Configure environment variables in Lambda settings

3. **Kubernetes Deployment**:
   - Deploy MCP servers as Kubernetes services
   - Use ConfigMaps for configuration
   - Implement service discovery for dynamic scaling

## Security Considerations

The MCP integration implements these security measures:

1. **Authentication**:
   - API key authentication for all MCP server requests
   - Token validation for each request
   - Rate limiting to prevent abuse

2. **Data Protection**:
   - Encryption of data in transit (HTTPS)
   - Sanitization of inputs to prevent injection attacks
   - Validation of request parameters

3. **Error Handling**:
   - Graceful error handling to prevent information leakage
   - Logging of errors for monitoring
   - Fallback mechanisms for server failures

## Testing and Monitoring

The MCP integration includes comprehensive testing and monitoring:

1. **Unit Tests**:
   - Test MCP client functionality
   - Validate request formatting
   - Verify error handling

2. **Integration Tests**:
   - Test end-to-end communication
   - Verify correct routing of queries
   - Validate response processing

3. **Monitoring**:
   - Track MCP server health
   - Monitor response times
   - Alert on server failures
   - Log usage patterns

## Future Extensions

The MCP architecture is designed for extensibility with these planned additions:

1. **Weather Analysis MCP Server**:
   - Process weather data and forecasts
   - Generate field-specific weather impacts
   - Provide operational recommendations based on weather

2. **Market Intelligence MCP Server**:
   - Track commodity prices and trends
   - Analyze market news and reports
   - Generate marketing recommendations

3. **Equipment Optimization MCP Server**:
   - Analyze equipment usage patterns
   - Optimize maintenance schedules
   - Recommend equipment configurations for operations 
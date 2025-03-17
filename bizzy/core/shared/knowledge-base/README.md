# Knowledge Base Integration

This module integrates AnythingLLM's knowledge base with LibreChat's RAG capabilities, providing a unified interface for accessing and querying the knowledge base.

## Overview

The knowledge base integration connects AnythingLLM's vector store with LibreChat's RAG capabilities, allowing:

1. Querying AnythingLLM's vector store from LibreChat
2. Syncing AnythingLLM documents with LibreChat's RAG system
3. Using LibreChat's advanced chat capabilities with AnythingLLM's knowledge

## Architecture

The integration consists of three main components:

1. **Shared Knowledge Base** (`bizzy/core/shared/knowledge-base/index.js`)
   - Core integration layer that provides a unified interface
   - Handles communication between AnythingLLM and LibreChat
   - Manages document synchronization and querying

2. **AnythingLLM Integration** (`bizzy/core/anythingllm/knowledge-base-integration.js`)
   - Extends AnythingLLM's vector search with LibreChat RAG capabilities
   - Adds UI components for LibreChat integration
   - Manages synchronization of workspaces with LibreChat

3. **LibreChat Integration** (`bizzy/core/librechat/knowledge-base-integration.js`)
   - Provides a RAG plugin for LibreChat to access AnythingLLM's vector store
   - Handles RAG queries and document synchronization
   - Creates LibreChat tools for AnythingLLM integration

## Usage

### Initialization

The knowledge base integration is automatically initialized when the BizzyPerson platform starts:

```javascript
const bizzyPerson = require('bizzy/core');

// Initialize the BizzyPerson platform
await bizzyPerson.initialize();
```

### Querying the Knowledge Base

You can query the knowledge base from anywhere in the application:

```javascript
const bizzyPerson = require('bizzy/core');

// Query the knowledge base
const results = await bizzyPerson.queryKnowledgeBase('What is sustainable farming?', {
  workspaceId: 'workspace-123',
  limit: 5,
  threshold: 0.7
});
```

### Syncing with LibreChat

You can sync an AnythingLLM workspace with LibreChat's RAG system:

```javascript
const bizzyPerson = require('bizzy/core');

// Sync workspace with LibreChat RAG
const result = await bizzyPerson.syncWorkspaceWithLibreChatRag('workspace-123');
```

## API Reference

### Shared Knowledge Base

- `initialize()` - Initialize the knowledge base integration
- `query(query, options)` - Query the knowledge base
- `syncWithLibreChat(workspaceId)` - Sync AnythingLLM knowledge base with LibreChat RAG
- `getWorkspaceDocuments(workspaceId)` - Get workspace documents from AnythingLLM
- `getDocument(documentId)` - Get document by ID from AnythingLLM

### AnythingLLM Integration

- `initialize()` - Initialize the AnythingLLM knowledge base integration
- `extendVectorSearch(app)` - Extend AnythingLLM's vector search with LibreChat RAG capabilities
- `addLibreChatRagButton(app)` - Add LibreChat RAG button to AnythingLLM workspace UI
- `syncWorkspaceWithLibreChatRag(workspaceId)` - Sync workspace with LibreChat RAG
- `getLibreChatRagStatus(workspaceId)` - Get LibreChat RAG status for a workspace

### LibreChat Integration

- `initialize()` - Initialize the LibreChat knowledge base integration
- `registerRagPlugin()` - Register the RAG plugin with LibreChat
- `handleRagQuery(req, res)` - Handle RAG query from LibreChat
- `handleRagSync(req, res)` - Handle RAG sync from LibreChat
- `createRagTool(workspaceId)` - Create a LibreChat RAG tool for AnythingLLM

## Configuration

The knowledge base integration can be configured through environment variables:

- `ANYTHINGLLM_BASE_URL` - AnythingLLM base URL (default: http://localhost:3001)
- `LIBRECHAT_BASE_URL` - LibreChat base URL (default: http://localhost:3080)
- `LIBRECHAT_RAG_API_URL` - LibreChat RAG API URL (default: http://localhost:3001)

## Extension Points

The knowledge base integration provides several extension points for industry-specific customizations:

1. Custom query processors
2. Domain-specific document synchronization
3. Specialized RAG tools for different industries
4. Custom UI components for knowledge base interaction

Extensions can extend the knowledge base integration by providing their own implementations of these components. 
# Shared State Management

This module provides shared state management between AnythingLLM and LibreChat. It synchronizes state between the two systems and provides a unified interface for accessing and updating shared state.

## Features

- Synchronizes user state between AnythingLLM and LibreChat
- Synchronizes settings between the two systems
- Provides access to workspaces from AnythingLLM
- Provides access to conversations from LibreChat
- Exposes a unified API for accessing and updating shared state
- Includes a React hook for using shared state in frontend components

## Architecture

The shared state management system consists of the following components:

1. **Shared State Manager**: A Node.js module that synchronizes state between AnythingLLM and LibreChat.
2. **Shared State API**: Express routes for accessing and updating shared state.
3. **Shared State Hook**: A React hook for using shared state in frontend components.

## Usage

### Backend

```javascript
const sharedState = require('./shared/state');

// Initialize shared state
await sharedState.initialize();

// Get current state
const state = sharedState.getState();

// Update LLM settings
await sharedState.updateLLMSettings({
  provider: 'openai',
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 4096
});

// Listen for state changes
sharedState.on('sync', (state) => {
  console.log('State synced:', state);
});

// Stop shared state manager
sharedState.stop();
```

### API

To use the shared state API, mount the router in your Express app:

```javascript
const express = require('express');
const { createSharedStateRouter } = require('./shared/state/api');

const app = express();

// Mount shared state API
app.use('/api/shared-state', createSharedStateRouter());
```

### Frontend

```jsx
import React from 'react';
import { useSharedState } from './shared/state/useSharedState';

function MyComponent() {
  const {
    state,
    loading,
    error,
    syncState,
    updateLLMSettings,
    updateUISettings,
    getWorkspace,
    getConversation
  } = useSharedState();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {state.user?.username}</h1>
      
      <h2>LLM Settings</h2>
      <p>Provider: {state.settings.llm.provider}</p>
      <p>Model: {state.settings.llm.model}</p>
      
      <h2>Workspaces</h2>
      <ul>
        {state.workspaces.map(workspace => (
          <li key={workspace.id}>{workspace.name}</li>
        ))}
      </ul>
      
      <h2>Conversations</h2>
      <ul>
        {state.conversations.map(conversation => (
          <li key={conversation.id}>{conversation.title}</li>
        ))}
      </ul>
      
      <button onClick={() => syncState()}>Sync State</button>
      
      <button
        onClick={() =>
          updateLLMSettings({
            provider: 'anthropic',
            model: 'claude-2',
            temperature: 0.8,
            maxTokens: 8192
          })
        }
      >
        Switch to Claude
      </button>
    </div>
  );
}
```

## API Reference

### Shared State Manager

- `initialize()`: Initialize the shared state manager.
- `stop()`: Stop the shared state manager.
- `syncState()`: Sync state between AnythingLLM and LibreChat.
- `syncUserState()`: Sync user state.
- `syncSettings()`: Sync settings.
- `syncWorkspaces()`: Sync workspaces.
- `syncConversations()`: Sync conversations.
- `getState()`: Get the current state.
- `updateLLMSettings(settings)`: Update LLM settings.

### Shared State Hook

- `useSharedState(options)`: React hook for using shared state.
  - `options.autoSync`: Whether to automatically sync state (default: `true`).
  - `options.syncInterval`: Interval for automatic sync in ms (default: `30000`).
  - Returns:
    - `state`: Current state.
    - `loading`: Whether state is loading.
    - `error`: Error if any.
    - `syncState()`: Function to sync state.
    - `updateLLMSettings(settings)`: Function to update LLM settings.
    - `updateUISettings(settings)`: Function to update UI settings.
    - `getWorkspace(workspaceId)`: Function to get a workspace by ID.
    - `getConversation(conversationId)`: Function to get a conversation by ID.

## Testing

To run tests:

```bash
npm test -- --testPathPattern=shared/state
``` 
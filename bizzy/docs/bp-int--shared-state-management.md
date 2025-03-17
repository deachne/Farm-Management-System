# Shared State Management Integration

This document describes the implementation of shared state management between AnythingLLM and LibreChat in the BizzyPerson platform.

## Overview

The shared state management system synchronizes state between AnythingLLM and LibreChat, providing a unified interface for accessing and updating shared state. This enables consistent user experiences across both systems and allows for seamless integration of features.

## Architecture

The shared state management system consists of the following components:

1. **Shared State Manager**: A Node.js module that synchronizes state between AnythingLLM and LibreChat.
2. **Shared State API**: Express routes for accessing and updating shared state.
3. **Shared State Hook**: A React hook for using shared state in frontend components.

![Shared State Architecture](../assets/documentation/shared-state-architecture.png)

## Implementation Details

### Shared State Manager

The shared state manager is implemented as a Node.js module that uses the EventEmitter pattern to emit events when state changes. It synchronizes the following state between AnythingLLM and LibreChat:

- User state (username, email, role, etc.)
- Settings (LLM provider, model, temperature, etc.)
- Workspaces (from AnythingLLM)
- Conversations (from LibreChat)

The manager periodically syncs state between the two systems and provides methods for updating state.

```javascript
// Example of shared state manager usage
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
```

### Shared State API

The shared state API provides RESTful endpoints for accessing and updating shared state. It includes the following endpoints:

- `GET /api/shared-state`: Get the current shared state
- `POST /api/shared-state/llm-settings`: Update LLM settings
- `POST /api/shared-state/ui-settings`: Update UI settings
- `GET /api/shared-state/workspaces`: Get all workspaces
- `GET /api/shared-state/conversations`: Get all conversations
- `GET /api/shared-state/user`: Get the current user
- `GET /api/shared-state/settings`: Get all settings

### Shared State Hook

The shared state hook provides a React hook for using shared state in frontend components. It includes the following features:

- Automatic state synchronization
- Loading and error states
- Methods for updating state
- Utility methods for accessing workspaces and conversations

```jsx
// Example of shared state hook usage
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
  
  // Use shared state in component
}
```

## State Synchronization

The shared state manager synchronizes state between AnythingLLM and LibreChat using the following approach:

1. **User State**: Merges user data from both systems, preferring AnythingLLM data when available.
2. **Settings**: Merges settings from both systems, with specific rules for each setting type.
3. **Workspaces**: Gets workspaces from AnythingLLM.
4. **Conversations**: Gets conversations from LibreChat.

The manager syncs state periodically (default: every 30 seconds) and emits events when state changes.

## Integration with AnythingLLM

The shared state manager integrates with AnythingLLM through its API. It uses the following endpoints:

- `GET /api/me`: Get the current user
- `GET /api/system/settings`: Get system settings
- `POST /api/system/update`: Update system settings
- `GET /api/workspaces`: Get all workspaces

## Integration with LibreChat

The shared state manager integrates with LibreChat through its API. It uses the following endpoints:

- `GET /api/user/me`: Get the current user
- `GET /api/user/settings`: Get user settings
- `POST /api/user/settings`: Update user settings
- `GET /api/conversations`: Get all conversations

## Testing

The shared state manager includes unit tests for all its functionality. The tests use axios-mock-adapter to mock API responses and verify that the manager correctly synchronizes state.

## Future Enhancements

- Add support for more state types (e.g., documents, tools)
- Implement real-time state synchronization using WebSockets
- Add support for offline mode with state caching
- Implement conflict resolution for concurrent state updates
- Add support for multi-user environments with user-specific state

## Conclusion

The shared state management system provides a robust foundation for integrating AnythingLLM and LibreChat. It enables consistent user experiences across both systems and allows for seamless integration of features. 
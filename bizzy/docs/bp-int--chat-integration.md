# Chat Integration (BP-INT-05)

## Overview

The Chat Integration (BP-INT-05) connects AnythingLLM's knowledge base with LibreChat's advanced chat capabilities. This integration enables users to leverage LibreChat's multi-modal chat interface, tool framework, and artifact system while maintaining access to AnythingLLM's document processing and knowledge base.

## Architecture

The chat integration follows a layered architecture:

```
┌─────────────────────────────────────┐
│           AnythingLLM Core          │
│                                     │
│  ┌─────────────┐    ┌─────────────┐ │
│  │  Document   │    │ Vectorstore │ │
│  │ Processing  │    │             │ │
│  └─────────────┘    └─────────────┘ │
│                                     │
│  ┌─────────────┐    ┌─────────────┐ │
│  │    Agent    │    │    Chat     │ │
│  │  Framework  │    │  Interface  │ │
│  └─────────────┘    └─────────────┘ │
└───────────┬─────────────────┬───────┘
            │                 │
┌───────────▼─────────────────▼───────┐
│        Integration Layer            │
│                                     │
│  ┌─────────────┐    ┌─────────────┐ │
│  │    Chat     │    │   Message   │ │
│  │   Adapter   │    │  Formatter  │ │
│  └─────────────┘    └─────────────┘ │
│                                     │
│  ┌─────────────┐    ┌─────────────┐ │
│  │  Artifact   │    │ Conversation│ │
│  │   Handler   │    │   Manager   │ │
│  └─────────────┘    └─────────────┘ │
└───────────┬─────────────────┬───────┘
            │                 │
┌───────────▼─────────────────▼───────┐
│           LibreChat Core            │
│                                     │
│  ┌─────────────┐    ┌─────────────┐ │
│  │  Multi-Modal│    │    Tool     │ │
│  │    Chat     │    │  Framework  │ │
│  └─────────────┘    └─────────────┘ │
│                                     │
│  ┌─────────────┐    ┌─────────────┐ │
│  │  Artifact   │    │    MCP      │ │
│  │   System    │    │   Client    │ │
│  └─────────────┘    └─────────────┘ │
└─────────────────────────────────────┘
```

## Components

### Shared Chat Module

The shared chat module (`bizzy/core/shared/chat/index.js`) provides common functionality for both AnythingLLM and LibreChat:

- Message formatting
- Conversation management
- Artifact handling
- System prompt formatting with context

### AnythingLLM Chat Integration

The AnythingLLM chat integration (`bizzy/core/anythingllm/chat-integration.js`) extends AnythingLLM's chat interface with LibreChat capabilities:

- Forwards chat messages to LibreChat
- Retrieves context from AnythingLLM's knowledge base
- Manages LibreChat conversations
- Adds LibreChat button to AnythingLLM UI

### LibreChat Chat Integration

The LibreChat chat integration (`bizzy/core/librechat/chat-integration.js`) integrates LibreChat with AnythingLLM's knowledge base:

- Registers a chat plugin with LibreChat
- Provides context from AnythingLLM's knowledge base
- Creates tools for AnythingLLM workspaces
- Formats context results for display

## Integration Points

The chat integration connects with both AnythingLLM and LibreChat at several points:

### AnythingLLM Integration Points

1. **Chat Interface**: Extends AnythingLLM's chat interface
2. **Workspace UI**: Adds LibreChat button to workspace UI
3. **Knowledge Base**: Retrieves context from AnythingLLM's knowledge base

### LibreChat Integration Points

1. **Plugin System**: Registers a chat plugin with LibreChat
2. **Tool Framework**: Creates tools for AnythingLLM integration
3. **Conversation Management**: Manages conversations with AnythingLLM context

## API

### Core API

```javascript
// Initialize the BizzyPerson platform
const bizzy = require('./core');
await bizzy.initialize();

// Send a chat message
const response = await bizzy.sendChatMessage('What is sustainable farming?', {
  workspaceId: 'workspace-123',
  conversationId: 'conversation-456',
  systemPrompt: 'You are a helpful farming assistant.'
});
```

### AnythingLLM Chat API

```javascript
// Extend AnythingLLM's chat interface
const express = require('express');
const app = express();
const anythingLLMChat = require('./core/anythingllm/chat-integration');

anythingLLMChat.extendChatInterface(app);
anythingLLMChat.addLibreChatButton(app);

// Forward a chat message to LibreChat
const response = await anythingLLMChat.forwardChatToLibreChat(
  'workspace-123',
  'What is sustainable farming?',
  'conversation-456',
  'You are a helpful farming assistant.'
);
```

### LibreChat Chat API

```javascript
// Register the chat plugin with LibreChat
const libreChatChat = require('./core/librechat/chat-integration');
await libreChatChat.registerChatPlugin();

// Create a LibreChat tool for AnythingLLM workspaces
const workspaceTool = libreChatChat.createWorkspaceTool();

// Create a LibreChat tool for AnythingLLM context
const contextTool = libreChatChat.createContextTool('workspace-123');
```

## Configuration

The chat integration can be configured through environment variables:

- `ANYTHINGLLM_BASE_URL`: AnythingLLM base URL (default: http://localhost:3001)
- `LIBRECHAT_BASE_URL`: LibreChat base URL (default: http://localhost:3080)

## Usage Examples

### Example 1: Basic Chat with Context

```javascript
// Send a chat message with context from AnythingLLM
const response = await bizzy.sendChatMessage('What is sustainable farming?', {
  workspaceId: 'workspace-123'
});

console.log('Response:', response.response.text);
console.log('Context:', response.context);
```

### Example 2: Conversation Management

```javascript
// Create a new conversation
const conversation = bizzy.chat.createConversation({
  title: 'Farming Discussion',
  workspaceId: 'workspace-123'
});

// Add a user message
const updatedConversation = bizzy.chat.addMessageToConversation(conversation, {
  role: 'user',
  content: 'What is sustainable farming?'
});

// Send the message and add the response
const response = await bizzy.sendChatMessage('What is sustainable farming?', {
  workspaceId: 'workspace-123',
  conversationId: conversation.id
});

const finalConversation = bizzy.chat.addMessageToConversation(updatedConversation, {
  role: 'assistant',
  content: response.response.text
});
```

### Example 3: Using LibreChat Tools

```javascript
// Create a LibreChat tool for AnythingLLM context
const contextTool = bizzy.libreChatChat.createContextTool('workspace-123');

// Use the tool
const result = await contextTool.function('What is sustainable farming?');
console.log(result.content);
```

## Extension Points

The chat integration provides several extension points for industry-specific customizations:

1. **Custom Message Formatters**: Extensions can provide custom message formatting for specific domains
2. **Specialized Chat Tools**: Extensions can create specialized chat tools for different industries
3. **Custom UI Components**: Extensions can provide custom UI components for chat interaction
4. **Domain-Specific Prompts**: Extensions can implement domain-specific system prompts

## Testing Strategy

The chat integration includes a comprehensive testing strategy:

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test the integration between components
3. **End-to-End Tests**: Test the complete chat flow
4. **Performance Tests**: Test the performance of chat operations
5. **Compatibility Tests**: Test compatibility with different versions of AnythingLLM and LibreChat

## Future Enhancements

Potential future enhancements for the chat integration include:

1. **Multi-Modal Support**: Add support for images, audio, and video in chat
2. **Advanced Tool Integration**: Create more sophisticated tools for domain-specific tasks
3. **Real-Time Collaboration**: Enable real-time collaboration in chat
4. **Offline Support**: Implement offline chat capabilities
5. **Mobile Optimization**: Optimize chat for mobile devices

## Conclusion

The Chat Integration (BP-INT-05) provides a powerful foundation for connecting AnythingLLM's knowledge management capabilities with LibreChat's advanced chat features. By providing a unified chat experience, it enables seamless knowledge sharing between systems and lays the groundwork for industry-specific extensions. 
# BizzyPerson Core

This directory contains the core components of the BizzyPerson platform, including the AnythingLLM and LibreChat integrations, shared components, and the extension API.

## Directory Structure

```
core/
├── anythingllm/     # AnythingLLM integration
├── librechat/       # LibreChat integration
├── shared/          # Shared components
└── extension-api/   # Extension framework
```

## Components

### AnythingLLM Integration

The AnythingLLM integration provides document processing and knowledge management capabilities:
- Document ingestion and vectorization
- Knowledge base management
- Retrieval-augmented generation
- Document search and retrieval

### LibreChat Integration

The LibreChat integration provides chat and multi-modal capabilities:
- Multi-modal chat interface
- Tool framework for AI agents
- MCP (Model Context Protocol) client
- Artifact system for rich responses

### Shared Components

Shared components used across the platform:
- Authentication system
- Document processing utilities
- UI components
- State management

### Extension API

The extension API allows for the creation of industry-specific extensions:
- Extension registration
- Hooks for custom functionality
- Data model integration
- UI component integration

## Integration Layer

The integration layer connects AnythingLLM and LibreChat through:

1. **Unified Authentication**
   - Single sign-on across both systems
   - Synchronized user management
   - Role-based access control

2. **Shared Document Processing**
   - Document ingestion through AnythingLLM
   - Document retrieval for LibreChat context
   - Unified document storage and management

3. **Knowledge Base Integration**
   - AnythingLLM vectorstore accessible to LibreChat
   - Context augmentation for chat responses
   - Knowledge base management through unified interface

4. **Chat Integration**
   - LibreChat interface with AnythingLLM knowledge
   - Tool integration for document operations
   - Artifact rendering for document visualization

For detailed information about the integration architecture, see [Integration Architecture](../docs/architecture/integration-architecture.md).

## Development

To work on the core components:

1. Familiarize yourself with both AnythingLLM and LibreChat
2. Understand the integration architecture
3. Follow the coding standards in [CONTRIBUTING.md](../CONTRIBUTING.md)
4. Test changes against both systems

## Documentation

For more information about the core components, see:

- [BP01: System Overview](../docs/bp01-System-Overview.md)
- [BP02: Architecture Diagram](../docs/bp02-Architecture-Diagram.md)
- [Integration Architecture](../docs/architecture/integration-architecture.md)
- [Extension API](../docs/api/extension-api.md) 
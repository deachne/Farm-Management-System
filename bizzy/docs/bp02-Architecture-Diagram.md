# BizzyPerson - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BizzyPerson Platform                          │
│                                                                      │
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐    │
│  │   User Interface│   │  API Gateway    │   │  Authentication │    │
│  └────────┬────────┘   └────────┬────────┘   └────────┬────────┘    │
│           │                     │                     │              │
│           └──────────┬──────────┴──────────┬─────────┘              │
│                      │                     │                         │
│  ┌──────────────────▼─────────────────────▼───────────────────┐     │
│  │                    Core Platform                            │     │
│  │                                                             │     │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │     │
│  │  │ AnythingLLM │  │  LibreChat  │  │ Extension Framework │ │     │
│  │  │ Integration │  │ Integration │  │                     │ │     │
│  │  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │     │
│  │         │                │                    │            │     │
│  │  ┌──────▼────────────────▼────────────────────▼─────────┐ │     │
│  │  │                Shared Components                      │ │     │
│  │  │                                                       │ │     │
│  │  │  ┌───────────┐  ┌───────────┐  ┌───────────────────┐ │ │     │
│  │  │  │ Document  │  │   Chat    │  │ Plugin Registry   │ │ │     │
│  │  │  │ Processing│  │ Interface │  │                   │ │ │     │
│  │  │  └───────────┘  └───────────┘  └───────────────────┘ │ │     │
│  │  │                                                       │ │     │
│  │  └───────────────────────────────────────────────────────┘ │     │
│  │                                                             │     │
│  └─────────────────────────────────────────────────────────────┘     │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐     │
│  │                     Extension Layer                          │     │
│  │                                                              │     │
│  │  ┌────────────┐   ┌────────────┐   ┌────────────┐           │     │
│  │  │BizzyFarmer │   │BizzyAccount│   │Other       │           │     │
│  │  │Extension   │   │Extension   │   │Extensions  │           │     │
│  │  └────────────┘   └────────────┘   └────────────┘           │     │
│  │                                                              │     │
│  └─────────────────────────────────────────────────────────────┘     │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐     │
│  │                      Plugin Layer                            │     │
│  │                                                              │     │
│  │  ┌────────────┐   ┌────────────┐   ┌────────────┐           │     │
│  │  │MCP Plugins │   │Tool Plugins│   │UI Plugins  │           │     │
│  │  └────────────┘   └────────────┘   └────────────┘           │     │
│  │                                                              │     │
│  └─────────────────────────────────────────────────────────────┘     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Interactions

```
┌───────────┐      ┌───────────┐      ┌───────────┐
│  User     │      │ BizzyPerson│      │ Extensions│
│ Interface │◄────►│   Core    │◄────►│           │
└───────────┘      └─────┬─────┘      └───────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │ AnythingLLM │
                  │ & LibreChat │
                  └─────────────┘
```

## Data Flow

1. **Document Processing Flow**
   ```
   Document Upload → Type Detection → OCR (if needed) → Text Extraction → 
   Vectorization → Knowledge Base Storage → Retrieval during Chat
   ```

2. **Chat Interaction Flow**
   ```
   User Query → Context Retrieval → Tool Selection → 
   MCP Plugin Execution (if needed) → Response Generation → 
   Artifact Rendering → User Display
   ```

3. **Extension Loading Flow**
   ```
   System Startup → Extension Discovery → Dependency Resolution → 
   Extension Registration → UI Integration → Feature Availability
   ```

## Key Components

### Core Platform

- **AnythingLLM Integration**: Document processing, vectorization, knowledge management
- **LibreChat Integration**: Chat interface, tool framework, MCP client
- **Extension Framework**: Extension loading, lifecycle management, dependency resolution
- **Shared Components**: Common utilities, UI components, data models

### Extension Layer

- **BizzyFarmer**: Agricultural management extension
- **BizzyAccounting**: Financial management extension
- **Other Extensions**: Additional industry-specific extensions

### Plugin Layer

- **MCP Plugins**: Model Context Protocol plugins for specialized tasks
- **Tool Plugins**: Tool implementations for various functions
- **UI Plugins**: User interface components and visualizations

## Technology Stack

- **Frontend**: React, TypeScript, Shadcn/UI
- **Backend**: Node.js, Express, PostgreSQL
- **AI Integration**: OpenAI API, Anthropic API
- **Document Processing**: Tesseract OCR, PDF.js
- **Vectorization**: Various embedding models
- **Authentication**: JWT, OAuth 
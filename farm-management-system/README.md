# Farm Management System

A specialized farm management system that integrates with AnythingLLM and LibreChat to provide enhanced document understanding, contextual retrieval, and intelligent query processing for agricultural applications.

## Overview

This project extends AnythingLLM's document storage capabilities to support rich, industry-specific metadata and document relationships for agricultural applications. It also integrates with LibreChat through specialized MCP tools to provide a seamless user experience.

## Project Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Core Metadata System | ✅ Completed |
| 2 | Document Processing Pipeline | 🚧 In Progress |
| 3 | Contextual Retrieval System | 🔄 Planned |
| 4 | LibreChat Integration | 🔄 Planned |

## Features

- ✅ Enhanced metadata system for agricultural documents
- 🚧 Advanced document processing pipeline for farm-specific data (In Progress)
- 🔄 Contextual retrieval system for intelligent query processing (Coming Soon)
- 🔄 LibreChat integration through MCP tools (Coming Soon)
- 🔄 Mobile-friendly interfaces for field use (Coming Soon)

## Project Structure

```
farm-management-system/
├── src/
│   ├── metadata/            # Enhanced metadata system
│   ├── document-processing/ # Document processing pipeline
│   ├── retrieval/           # Contextual retrieval system
│   └── librechat-integration/ # LibreChat MCP tools
├── docs/                    # Documentation
│   ├── 01-Core-Metadata-System.md
│   ├── 02-Document-Processing-Pipeline.md
│   ├── phase-completions/   # Phase completion reports
│   └── phase-transition-checklist.md
├── tests/                   # Tests
├── scripts/                 # Development scripts
├── package.json             # Dependencies
└── README.md                # This file
```

## Setup

### Prerequisites

- Node.js 18+
- AnythingLLM instance
- LibreChat instance
- PostgreSQL database (recommended for production)

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables:
   ```
   cp .env.example .env
   ```
4. Edit `.env` with your AnythingLLM and LibreChat configuration
5. Run database migrations:
   ```
   npx prisma migrate dev
   ```
6. Start the development server:
   ```
   npm run dev
   ```

## Development

This project follows a phased implementation approach:

1. **Phase 1**: Core Metadata System ✅
   - Extended database schema with document relationships
   - Metadata abstraction layer
   - Document relationship tracking
   - Metadata query API

2. **Phase 2**: Document Processing Pipeline 🚧
   - Pipeline architecture design
   - Core document processors
   - Extension points for custom processors
   - Metadata extraction system
   - Chunking strategies

3. **Phase 3**: Contextual Retrieval System 🔄
   - Multi-stage retrieval architecture
   - Query planning system
   - Result ranking algorithms
   - Custom retrieval strategies

4. **Phase 4**: LibreChat Integration 🔄
   - Document tool interfaces
   - Core document tools
   - Extension-specific tool registration
   - System prompts for agentic RAG

For more details on each phase, see the [documentation](./docs/README.md).

## Documentation

See the `docs/` directory for detailed documentation on each component:

- [Core Metadata System](./docs/01-Core-Metadata-System.md)
- [Document Processing Pipeline](./docs/02-Document-Processing-Pipeline.md)
- [Phase Transition Checklist](./docs/phase-transition-checklist.md)
- [Phase 1 Completion Report](./docs/phase-completions/phase-1-completion.md)

## Scripts

The project includes several development scripts to help with common tasks:

- `npm run dev`: Start the development server
- `npm run test`: Run tests
- `npm run build`: Build the project for production
- `npm run lint`: Lint the codebase
- `npm run docs`: Generate documentation

See the [scripts documentation](./scripts/README.md) for more details.

## License

MIT

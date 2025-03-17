# BizzyPerson

A flexible AI-powered knowledge management platform integrating AnythingLLM and LibreChat with extensible industry-specific modules.

## Overview

BizzyPerson provides a core platform with:
- Document processing and knowledge management
- Multi-modal chat and AI assistance
- Extension framework for industry-specific features
- Mobile-friendly interface for field use
- Plugin system for specialized tools

## Documentation

All project documentation is available in the [docs](./docs) directory, organized with a consistent prefix system:

- **BP prefix**: BizzyPerson core documentation (e.g., `bp01-System-Overview.md`)
- **BF prefix**: BizzyFarmer extension documentation (e.g., `bf01-Extension-Overview.md`)

Key documentation files:
- [BP01: System Overview](./docs/bp01-System-Overview.md) - System architecture and components
- [BP04: Project Checklist](./docs/bp04-Project-Checklist.md) - Current implementation status
- [BP05: Documentation Guidelines](./docs/bp05-Documentation-Guidelines.md) - Documentation standards
- [BP07: Environment Variables](./docs/bp07-Environment-Variables.md) - Environment configuration
- [BF01: Extension Overview](./docs/bf01-Extension-Overview.md) - BizzyFarmer extension details

See the [docs README](./docs/README.md) for a complete list of documentation files.

## Project Structure

```
bizzy/
├── core/                # BizzyPerson core platform
│   ├── anythingllm/     # AnythingLLM integration
│   ├── librechat/       # LibreChat integration
│   ├── shared/          # Shared components
│   └── extension-api/   # Extension framework
├── extensions/          # Industry-specific extensions
│   └── farmer/          # BizzyFarmer agricultural extension
├── docs/                # Documentation (BP/BF prefixed files)
├── assets/              # Static assets
├── config/              # Configuration files
├── tests/               # Test files
└── scripts/             # Utility scripts
```

## Getting Started

1. Clone the repository
2. Install dependencies
3. Configure environment variables:
   - Copy `.env.example` to `.env` in the project root
   - Edit the `.env` file with your configuration
   - Run `node scripts/setup-env.js` to propagate settings to subsystems
4. Run development server

For detailed setup instructions, see [BP03: Next Steps](./docs/bp03-Next-Steps.md).

## Environment Configuration

BizzyPerson uses a centralized environment variables approach:

1. A single `.env` file in the project root contains all configuration
2. The `setup-env.js` script propagates settings to AnythingLLM and LibreChat
3. Environment variables follow a namespaced approach (e.g., `ANYTHINGLLM_*`, `LIBRECHAT_*`)

For detailed environment configuration, see [BP07: Environment Variables](./docs/bp07-Environment-Variables.md).

## Development

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines and [BP05: Documentation Guidelines](./docs/bp05-Documentation-Guidelines.md) for documentation standards.

## Core Components

- **AnythingLLM Integration**: Document processing and knowledge management
- **LibreChat Integration**: Advanced chat and multi-modal capabilities
- **Extension Framework**: System for building industry-specific modules
- **Plugin Registry**: Management of MCP and tool plugins

For detailed architecture information, see [BP01: System Overview](./docs/bp01-System-Overview.md) and [BP02: Architecture Diagram](./docs/bp02-Architecture-Diagram.md).

## Extensions

### BizzyFarmer (Agricultural Management)

The BizzyFarmer extension provides specialized tools for agricultural management:
- Field management and mapping
- Crop planning and rotation
- Equipment scheduling
- Weather integration
- Yield calculation

For details, see [BF01: Extension Overview](./docs/bf01-Extension-Overview.md).

### Planned Extensions

- **BizzyAccounting**: Financial management extension
- **BizzyConstruction**: Construction management extension

## License

[License details to be added] 
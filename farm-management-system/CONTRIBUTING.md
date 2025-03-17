# Contributing to Farm Management System

Thank you for considering contributing to the Farm Management System! This document outlines the process for contributing to the project.

## Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Code Standards

- Follow the existing code style
- Write clear, concise commit messages
- Include tests for new features
- Update documentation as needed

## Project Structure

- `src/metadata/`: Enhanced metadata system
- `src/document-processing/`: Document processing pipeline
- `src/retrieval/`: Contextual retrieval system
- `src/librechat-integration/`: LibreChat MCP tools
- `docs/`: Documentation
- `tests/`: Tests

## Testing

Run tests with:

```
npm test
```

## Documentation

Please update the documentation when making changes to the codebase. Documentation is located in the `docs/` directory.

## Pull Request Process

1. Ensure your code follows the project's coding standards
2. Update the README.md or documentation with details of changes if appropriate
3. The PR will be merged once it has been reviewed and approved

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

## Development Guidelines

### Code Standards
- Use TypeScript for frontend components
- Follow separation of concerns principles
- Store sensitive information in environment variables
- Follow AnythingLLM and LibreChat coding conventions

### Component Library
- Use Shadcn/UI as primary component library
- Maintain accessibility standards
- Follow theming system guidelines
- Create agricultural-specific extensions as needed

### Integration Requirements
- Maintain compatibility with AnythingLLM and LibreChat
- Document all integration points
- Follow existing patterns for vectorization and embedding
- Test against latest versions of both systems

### Documentation
- Keep documentation clear and concise
- Update project checklist when completing items
- Document API endpoints and data structures
- Include implementation details in specialized docs

### Testing
- Write comprehensive tests
- Include agricultural-specific scenarios
- Test offline functionality
- Maintain separate test suites for different components

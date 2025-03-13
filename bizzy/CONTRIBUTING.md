# Contributing to BizzyPerson

Thank you for your interest in contributing to BizzyPerson! This document provides guidelines and instructions for contributing to the project.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bizzy-person.git
   cd bizzy-person
   ```

2. **Initialize the project**
   ```bash
   npm run init
   ```
   This will clone the AnythingLLM and LibreChat repositories and set up the project structure.

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update the variables as needed

4. **Start development**
   - Follow the specific instructions for the component you're working on

## Project Structure

```
bizzy/
├── core/                # BizzyPerson core platform
│   ├── anythingllm/     # AnythingLLM integration
│   ├── librechat/       # LibreChat integration
│   ├── shared/          # Shared components
│   └── extension-api/   # Extension framework
├── extensions/          # Industry-specific extensions
├── docs/                # Documentation
├── assets/              # Static assets
├── config/              # Configuration files
├── tests/               # Test files
└── scripts/             # Utility scripts
```

## Coding Standards

- Use consistent indentation (2 spaces)
- Follow the existing code style
- Write clear, descriptive commit messages
- Document your code with comments
- Write tests for new features

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Extension Development

When developing extensions for BizzyPerson:

1. Create a new directory in the `extensions/` folder
2. Follow the extension API documentation
3. Implement the required interfaces
4. Document your extension thoroughly
5. Include tests for your extension

## License

By contributing to BizzyPerson, you agree that your contributions will be licensed under the project's license. 
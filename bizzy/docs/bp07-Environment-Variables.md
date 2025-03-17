# BP07: Environment Variables Setup

## Overview

This document describes the environment variables configuration for the BizzyPerson project, which integrates AnythingLLM and LibreChat. The environment variables are managed through a centralized `.env` file in the project root, with a setup script that propagates the relevant variables to each system.

## Environment Variables Structure

The BizzyPerson project uses a hierarchical approach to environment variables:

1. **Core BizzyPerson Variables**: Configuration specific to the BizzyPerson integration layer
2. **AnythingLLM Variables**: Configuration for the AnythingLLM system
3. **LibreChat Variables**: Configuration for the LibreChat system
4. **Shared Variables**: Common configuration used by multiple systems (e.g., API keys)

## Main Environment Variables File

The main `.env` file is located in the `bizzy/` directory and contains all the environment variables needed for the project. This file serves as the single source of truth for configuration.

### Core Configuration

```
NODE_ENV=development
PORT=3000
DEBUG=bizzy:*

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bizzy
DB_USER=postgres
DB_PASSWORD=password

# Authentication
JWT_SECRET=your-jwt-secret-change-this-in-production
JWT_EXPIRATION=24h
```

### AnythingLLM Configuration

```
ANYTHINGLLM_URL=http://localhost:3001
ANYTHINGLLM_API_KEY=your-anythingllm-api-key

# AnythingLLM Server Configuration
ANYTHINGLLM_SERVER_PORT=3001
ANYTHINGLLM_JWT_SECRET="change-this-random-string-for-seeding" 
ANYTHINGLLM_SIG_KEY="change-this-random-string-at-least-32-chars"
ANYTHINGLLM_SIG_SALT="change-this-random-string-at-least-32-chars"

# AnythingLLM LLM Provider Configuration
ANYTHINGLLM_LLM_PROVIDER="openai"
ANYTHINGLLM_OPEN_AI_KEY=your-openai-api-key
ANYTHINGLLM_OPEN_MODEL_PREF="gpt-4o"

# AnythingLLM Embedding Configuration
ANYTHINGLLM_EMBEDDING_ENGINE="openai"
ANYTHINGLLM_EMBEDDING_MODEL_PREF="text-embedding-3-small"
ANYTHINGLLM_EMBEDDING_BATCH_SIZE=512

# AnythingLLM Vector Database Configuration
ANYTHINGLLM_VECTOR_DB="lancedb"
ANYTHINGLLM_STORAGE_DIR="./storage"
```

### LibreChat Configuration

```
LIBRECHAT_URL=http://localhost:3080
LIBRECHAT_API_KEY=your-librechat-api-key

# LibreChat Server Configuration
LIBRECHAT_HOST=localhost
LIBRECHAT_PORT=3080
LIBRECHAT_MONGO_URI=mongodb://127.0.0.1:27017/LibreChat
LIBRECHAT_DOMAIN_CLIENT=http://localhost:3080
LIBRECHAT_DOMAIN_SERVER=http://localhost:3080

# LibreChat Debug Configuration
LIBRECHAT_DEBUG_LOGGING=true
LIBRECHAT_DEBUG_CONSOLE=false

# LibreChat Endpoints Configuration
LIBRECHAT_ENDPOINTS=openAI,assistants,azureOpenAI,google,gptPlugins,anthropic

# LibreChat Authentication Configuration
LIBRECHAT_JWT_SECRET=your-librechat-jwt-secret-change-this
LIBRECHAT_JWT_REFRESH_SECRET=your-librechat-refresh-secret-change-this
```

### Shared AI Provider Configuration

```
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### Extension Configuration

```
EXTENSION_DIR=./extensions
ENABLE_EXTENSIONS=true
```

### Logging Configuration

```
LOG_LEVEL=info
LOG_FILE=./logs/bizzy.log
```

## Environment Setup Script

The project includes a setup script that propagates the environment variables from the main `.env` file to the individual systems. This script is located at `bizzy/scripts/setup-env.js`.

### Usage

```bash
cd bizzy
node scripts/setup-env.js
```

### What the Script Does

1. Reads the main `.env` file from the project root
2. Creates a `.env` file in the AnythingLLM server directory with the relevant variables
3. Creates a `.env` file in the LibreChat directory with the relevant variables
4. Provides feedback on the setup process

### Error Handling

The script includes error handling for common issues:
- Missing `.env` file in the project root
- Missing AnythingLLM or LibreChat directories
- Permission issues when writing the `.env` files

## Security Considerations

- The `.env` file contains sensitive information and should never be committed to version control
- In production, use strong, randomly generated values for secrets and keys
- Consider using a secrets management system for production deployments
- Rotate API keys and secrets regularly

## Integration with Docker Compose

When using Docker Compose for development or deployment, the environment variables can be passed to the containers in two ways:

1. **Using the `env_file` directive**: Point to the main `.env` file
2. **Using the `environment` directive**: Specify individual environment variables

Example Docker Compose configuration:

```yaml
version: '3'
services:
  bizzy:
    build: .
    env_file:
      - .env
    ports:
      - "${PORT}:${PORT}"
    depends_on:
      - anythingllm
      - librechat
      - postgres

  anythingllm:
    build: ./core/anythingllm
    env_file:
      - ./core/anythingllm/server/.env
    ports:
      - "${ANYTHINGLLM_SERVER_PORT}:${ANYTHINGLLM_SERVER_PORT}"

  librechat:
    build: ./core/librechat
    env_file:
      - ./core/librechat/.env
    ports:
      - "${LIBRECHAT_PORT}:${LIBRECHAT_PORT}"
    depends_on:
      - mongodb

  postgres:
    image: postgres:14
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "${DB_PORT}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  postgres_data:
  mongodb_data:
```

## Troubleshooting

### Common Issues

1. **Environment variables not being applied**: Make sure to run the setup script after making changes to the main `.env` file
2. **Connection issues between systems**: Verify that the URL and port variables are correctly set
3. **Authentication failures**: Check that the JWT secrets and API keys are correctly configured
4. **Database connection issues**: Verify the database connection strings and credentials

### Debugging

For debugging environment variable issues:

1. Check the logs for each system for environment-related errors
2. Verify that the `.env` files were correctly generated in each system directory
3. Use the `DEBUG=bizzy:*` variable to enable detailed logging in the BizzyPerson integration layer

## Conclusion

The environment variables setup is a critical component of the BizzyPerson project, enabling the integration of AnythingLLM and LibreChat. By centralizing the configuration in a single `.env` file and using a setup script to propagate the variables, we ensure consistency and ease of management across the systems. 
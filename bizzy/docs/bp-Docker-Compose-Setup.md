# BP08: Docker Compose Setup for Development

## Overview

This document describes the Docker Compose configuration for the BizzyPerson project, which integrates AnythingLLM and LibreChat. The Docker Compose setup provides a consistent development environment that ensures all components work together seamlessly.

## Docker Compose Structure

The BizzyPerson Docker Compose configuration consists of the following services:

1. **bizzy**: The core BizzyPerson service that integrates AnythingLLM and LibreChat
2. **anythingllm**: The AnythingLLM service
3. **librechat**: The LibreChat service
4. **postgres**: PostgreSQL database for BizzyPerson
5. **mongodb**: MongoDB database for LibreChat
6. **meilisearch**: Meilisearch service for LibreChat
7. **vectordb**: Vector database for LibreChat RAG
8. **rag_api**: RAG API service for LibreChat

## Prerequisites

Before using the Docker Compose setup, ensure you have:

1. Docker and Docker Compose installed on your system
2. The BizzyPerson repository cloned
3. The `.env` file configured with the necessary environment variables

## Getting Started

### Setting Up Environment Variables

Before starting the Docker Compose services, make sure your environment variables are properly configured:

1. Copy the `.env.example` file to `.env` in the `bizzy/` directory
2. Update the values in the `.env` file with your configuration
3. Run the setup-env script to propagate the environment variables to the individual systems:

```bash
cd bizzy
node scripts/setup-env.js
```

### Starting the Services

To start all services, run:

```bash
cd bizzy
docker-compose up
```

To start the services in detached mode (background):

```bash
docker-compose up -d
```

### Accessing the Services

Once the services are running, you can access them at:

- BizzyPerson: http://localhost:3000
- AnythingLLM: http://localhost:3001
- LibreChat: http://localhost:3080

### Stopping the Services

To stop the services:

```bash
docker-compose down
```

To stop the services and remove the volumes:

```bash
docker-compose down -v
```

## Service Configuration

### BizzyPerson Core Service

The BizzyPerson core service is built from the Dockerfile in the `bizzy/` directory. It depends on the AnythingLLM, LibreChat, and PostgreSQL services.

```yaml
bizzy:
  build:
    context: .
    dockerfile: Dockerfile
  container_name: bizzy-core
  ports:
    - "${PORT:-3000}:${PORT:-3000}"
  depends_on:
    - anythingllm
    - librechat
    - postgres
  env_file:
    - .env
  volumes:
    - ./:/app
    - /app/node_modules
  networks:
    - bizzyperson-network
```

### AnythingLLM Service

The AnythingLLM service is built from the Dockerfile in the `core/anythingllm/docker/` directory.

```yaml
anythingllm:
  build:
    context: ./core/anythingllm
    dockerfile: ./docker/Dockerfile
    args:
      ARG_UID: ${UID:-1000}
      ARG_GID: ${GID:-1000}
  container_name: bizzy-anythingllm
  cap_add:
    - SYS_ADMIN
  volumes:
    - "./core/anythingllm/.env:/app/server/.env"
    - "./core/anythingllm/server/storage:/app/server/storage"
    - "./core/anythingllm/collector/hotdir/:/app/collector/hotdir"
    - "./core/anythingllm/collector/outputs/:/app/collector/outputs"
  user: "${UID:-1000}:${GID:-1000}"
  ports:
    - "${ANYTHINGLLM_SERVER_PORT:-3001}:${ANYTHINGLLM_SERVER_PORT:-3001}"
  env_file:
    - ./core/anythingllm/.env
  networks:
    - bizzyperson-network
```

### LibreChat Service

The LibreChat service is built from the Dockerfile in the `core/librechat/` directory.

```yaml
librechat:
  build:
    context: ./core/librechat
    dockerfile: Dockerfile
  container_name: bizzy-librechat
  ports:
    - "${LIBRECHAT_PORT:-3080}:${LIBRECHAT_PORT:-3080}"
  depends_on:
    - mongodb
    - meilisearch
    - vectordb
    - rag_api
  env_file:
    - ./core/librechat/.env
  environment:
    - HOST=0.0.0.0
    - MONGO_URI=mongodb://mongodb:27017/LibreChat
    - MEILI_HOST=http://meilisearch:7700
    - RAG_PORT=${RAG_PORT:-8000}
    - RAG_API_URL=http://rag_api:${RAG_PORT:-8000}
  volumes:
    - ./core/librechat/images:/app/client/public/images
    - ./core/librechat/uploads:/app/uploads
    - ./core/librechat/logs:/app/api/logs
  networks:
    - bizzyperson-network
```

## Database Services

### PostgreSQL

PostgreSQL is used as the database for the BizzyPerson core service.

```yaml
postgres:
  image: postgres:14
  container_name: bizzy-postgres
  environment:
    POSTGRES_USER: ${DB_USER:-postgres}
    POSTGRES_PASSWORD: ${DB_PASSWORD:-password}
    POSTGRES_DB: ${DB_NAME:-bizzy}
  ports:
    - "${DB_PORT:-5432}:5432"
  volumes:
    - postgres_data:/var/lib/postgresql/data
  networks:
    - bizzyperson-network
```

### MongoDB

MongoDB is used as the database for the LibreChat service.

```yaml
mongodb:
  image: mongo:6
  container_name: bizzy-mongodb
  restart: always
  user: "${UID:-1000}:${GID:-1000}"
  volumes:
    - mongodb_data:/data/db
  command: mongod --noauth
  ports:
    - "27017:27017"
  networks:
    - bizzyperson-network
```

## Additional Services

### Meilisearch

Meilisearch is used for search functionality in LibreChat.

```yaml
meilisearch:
  image: getmeili/meilisearch:v1.12.3
  container_name: bizzy-meilisearch
  restart: always
  user: "${UID:-1000}:${GID:-1000}"
  environment:
    - MEILI_HOST=http://meilisearch:7700
    - MEILI_NO_ANALYTICS=true
    - MEILI_MASTER_KEY=${MEILI_MASTER_KEY:-masterKey}
  volumes:
    - meili_data:/meili_data
  networks:
    - bizzyperson-network
```

### Vector Database

The vector database is used for RAG functionality in LibreChat.

```yaml
vectordb:
  image: ankane/pgvector:latest
  container_name: bizzy-vectordb
  environment:
    POSTGRES_DB: ${LIBRECHAT_VECTORDB_DB:-mydatabase}
    POSTGRES_USER: ${LIBRECHAT_VECTORDB_USER:-myuser}
    POSTGRES_PASSWORD: ${LIBRECHAT_VECTORDB_PASSWORD:-mypassword}
  restart: always
  volumes:
    - vectordb_data:/var/lib/postgresql/data
  networks:
    - bizzyperson-network
```

### RAG API

The RAG API service is used for RAG functionality in LibreChat.

```yaml
rag_api:
  image: ghcr.io/danny-avila/librechat-rag-api-dev-lite:latest
  container_name: bizzy-rag-api
  environment:
    - DB_HOST=vectordb
    - RAG_PORT=${RAG_PORT:-8000}
  restart: always
  depends_on:
    - vectordb
  env_file:
    - ./core/librechat/.env
  networks:
    - bizzyperson-network
```

## Volumes

The Docker Compose configuration uses the following volumes:

- **postgres_data**: Stores PostgreSQL data
- **mongodb_data**: Stores MongoDB data
- **meili_data**: Stores Meilisearch data
- **vectordb_data**: Stores vector database data

## Networks

All services are connected to the `bizzyperson-network` network, which allows them to communicate with each other.

## Troubleshooting

### Common Issues

1. **Services not starting**: Check the Docker logs for error messages
2. **Connection issues between services**: Verify that the services are on the same network
3. **Environment variable issues**: Make sure the environment variables are correctly propagated to each service
4. **Volume permission issues**: Check that the volumes have the correct permissions

### Debugging

For debugging Docker Compose issues:

1. Run `docker-compose logs` to view the logs of all services
2. Run `docker-compose logs <service>` to view the logs of a specific service
3. Run `docker-compose ps` to check the status of all services

## Development Workflow

When developing with Docker Compose:

1. Make changes to the code
2. Rebuild the affected services: `docker-compose up -d --build <service>`
3. Check the logs to ensure the services are running correctly

## Conclusion

The Docker Compose setup provides a consistent development environment for the BizzyPerson project, ensuring that all components work together seamlessly. By following the instructions in this document, you can easily set up and manage the development environment for the project. 
#!/bin/bash

# Docker Compose Setup Script for BizzyPerson
# This script helps set up the Docker Compose environment for BizzyPerson

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print header
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}   BizzyPerson Docker Compose Setup      ${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed.${NC}"
    echo "Please install Docker before continuing."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed.${NC}"
    echo "Please install Docker Compose before continuing."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Warning: .env file not found.${NC}"
    echo "Creating .env file from .env.example..."
    
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}Created .env file from .env.example.${NC}"
        echo "Please edit the .env file with your configuration."
    else
        echo -e "${RED}Error: .env.example file not found.${NC}"
        exit 1
    fi
fi

# Run setup-env.js to propagate environment variables
echo "Propagating environment variables to subsystems..."
node scripts/setup-env.js

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to propagate environment variables.${NC}"
    exit 1
fi

echo -e "${GREEN}Environment variables propagated successfully.${NC}"

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p core/anythingllm/server/storage
mkdir -p core/anythingllm/collector/hotdir
mkdir -p core/anythingllm/collector/outputs
mkdir -p core/librechat/images
mkdir -p core/librechat/uploads
mkdir -p core/librechat/logs

echo -e "${GREEN}Directories created successfully.${NC}"

# Start Docker Compose
echo "Starting Docker Compose services..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to start Docker Compose services.${NC}"
    exit 1
fi

echo -e "${GREEN}Docker Compose services started successfully.${NC}"
echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}   BizzyPerson Services                  ${NC}"
echo -e "${GREEN}=========================================${NC}"
echo -e "BizzyPerson: ${YELLOW}http://localhost:3000${NC}"
echo -e "AnythingLLM: ${YELLOW}http://localhost:3001${NC}"
echo -e "LibreChat:   ${YELLOW}http://localhost:3080${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "To stop the services, run: docker-compose down"
echo "To view logs, run: docker-compose logs -f"
echo ""
echo -e "${GREEN}Setup complete!${NC}" 
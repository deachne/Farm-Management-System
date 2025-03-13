#!/bin/bash

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Initializing BizzyPerson project...${NC}"

# Create necessary directories
echo -e "${GREEN}Creating project directories...${NC}"
mkdir -p core/anythingllm core/librechat core/shared core/extension-api extensions docs assets config tests

# Check if git is available
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: git is not installed${NC}"
    exit 1
fi

# Clone AnythingLLM
echo -e "${GREEN}Cloning AnythingLLM repository...${NC}"
if [ -d "core/anythingllm/.git" ]; then
    echo -e "${YELLOW}AnythingLLM repository already exists. Skipping clone.${NC}"
else
    rm -rf core/anythingllm
    git clone https://github.com/Mintplex-Labs/anything-llm.git core/anythingllm
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to clone AnythingLLM repository${NC}"
        exit 1
    fi
    echo -e "${GREEN}AnythingLLM repository cloned successfully.${NC}"
fi

# Clone LibreChat
echo -e "${GREEN}Cloning LibreChat repository...${NC}"
if [ -d "core/librechat/.git" ]; then
    echo -e "${YELLOW}LibreChat repository already exists. Skipping clone.${NC}"
else
    rm -rf core/librechat
    git clone https://github.com/danny-avila/LibreChat.git core/librechat
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to clone LibreChat repository${NC}"
        exit 1
    fi
    echo -e "${GREEN}LibreChat repository cloned successfully.${NC}"
fi

echo -e "${GREEN}BizzyPerson project initialized successfully.${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "${YELLOW}1. Configure environment variables${NC}"
echo -e "${YELLOW}2. Begin integration of AnythingLLM and LibreChat${NC}"
echo -e "${YELLOW}3. Develop core integration layer${NC}"

exit 0 
#!/bin/bash

# Script to update LibreChat to the latest version

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting LibreChat update process...${NC}"

# Navigate to the LibreChat directory
cd "$(dirname "$0")/../core/librechat" || {
    echo -e "${RED}Error: Could not navigate to LibreChat directory${NC}"
    exit 1
}

# Check if git is available
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: git is not installed${NC}"
    exit 1
}

# Store current version
CURRENT_VERSION=$(git describe --tags --abbrev=0 2>/dev/null || echo "unknown")
echo -e "${YELLOW}Current LibreChat version: ${CURRENT_VERSION}${NC}"

# Fetch the latest changes
echo -e "${GREEN}Fetching latest changes...${NC}"
git fetch --tags || {
    echo -e "${RED}Error: Failed to fetch latest changes${NC}"
    exit 1
}

# Get the latest tag
LATEST_TAG=$(git describe --tags `git rev-list --tags --max-count=1` 2>/dev/null || echo "unknown")
echo -e "${YELLOW}Latest LibreChat version: ${LATEST_TAG}${NC}"

if [ "$CURRENT_VERSION" == "$LATEST_TAG" ]; then
    echo -e "${GREEN}LibreChat is already at the latest version.${NC}"
    exit 0
fi

# Checkout the latest tag
echo -e "${GREEN}Updating to latest version...${NC}"
git checkout $LATEST_TAG || {
    echo -e "${RED}Error: Failed to checkout latest version${NC}"
    exit 1
}

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm install || {
    echo -e "${RED}Error: Failed to install dependencies${NC}"
    exit 1
}

echo -e "${GREEN}LibreChat updated successfully to version ${LATEST_TAG}${NC}"
echo -e "${YELLOW}Please run integration tests to ensure compatibility with BizzyPerson core.${NC}"

exit 0 
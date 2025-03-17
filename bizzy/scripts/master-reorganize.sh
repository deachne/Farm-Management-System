#!/bin/bash

# BizzyPerson Documentation Master Reorganization Script
# This script runs all the reorganization scripts in the correct order

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting BizzyPerson documentation reorganization...${NC}"

# Make sure all scripts are executable
chmod +x ./reorganize-docs.sh
chmod +x ./update-task-ids.sh
chmod +x ./update-doc-references.sh

# Step 1: Run the documentation reorganization script
echo -e "${YELLOW}Step 1: Running documentation reorganization script...${NC}"
./reorganize-docs.sh
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Documentation reorganization failed${NC}"
  exit 1
fi
echo -e "${GREEN}Documentation reorganization completed successfully.${NC}"

# Step 2: Run the task ID update script
echo -e "${YELLOW}Step 2: Running task ID update script...${NC}"
./update-task-ids.sh
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Task ID update failed${NC}"
  exit 1
fi
echo -e "${GREEN}Task ID update completed successfully.${NC}"

# Step 3: Run the documentation references update script
echo -e "${YELLOW}Step 3: Running documentation references update script...${NC}"
./update-doc-references.sh
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Documentation references update failed${NC}"
  exit 1
fi
echo -e "${GREEN}Documentation references update completed successfully.${NC}"

echo -e "${GREEN}BizzyPerson documentation reorganization completed successfully.${NC}"
echo -e "${YELLOW}Please review the changes to ensure they are correct.${NC}"
echo -e "${YELLOW}Backups of the original files have been created.${NC}"

exit 0 
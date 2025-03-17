#!/bin/bash

# BizzyPerson Task ID Update Script
# This script updates task IDs in the checklist files to match the new naming convention

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Set the docs directory
DOCS_DIR="../docs"

# Check if the docs directory exists
if [ ! -d "$DOCS_DIR" ]; then
  echo -e "${RED}Error: Docs directory not found at $DOCS_DIR${NC}"
  echo "Please run this script from the scripts directory"
  exit 1
fi

echo -e "${GREEN}Starting task ID update...${NC}"

# Define the mapping of old to new task IDs
declare -A task_id_mapping=(
  ["BP-CORE-"]="BP-CORE-"
  ["BP-INT-"]="BP-INT-"
  ["BP-EXT-"]="BP-EXT-"
  ["BP-UI-"]="BP-UI-"
  ["BP-PM-"]="BP-PM-"
  ["BP-TECH-"]="BP-TECH-"
)

# Function to update task IDs in a file
update_task_ids() {
  local file="$1"
  
  # Check if the file exists
  if [ ! -f "$file" ]; then
    echo -e "${RED}Error: File $file not found${NC}"
    return 1
  fi
  
  echo -e "${YELLOW}Updating task IDs in $file${NC}"
  
  # Create a backup of the file
  cp "$file" "${file}.bak"
  
  # Update task IDs in the file
  for old_prefix in "${!task_id_mapping[@]}"; do
    new_prefix="${task_id_mapping[$old_prefix]}"
    
    # No change needed for these prefixes, but we'll keep the code for future updates
    sed -i.tmp "s|\[$old_prefix|\[$new_prefix|g" "$file"
  done
  
  # Remove temporary files
  rm -f "${file}.tmp"
  
  echo -e "${GREEN}Updated task IDs in $file${NC}"
}

# Update task IDs in the master checklist
update_task_ids "$DOCS_DIR/bp-pm-01-master-checklist.md"

# Update task IDs in the implementation checklist
update_task_ids "$DOCS_DIR/bp-pm-03-implementation-checklist.md"

# Update task IDs in the next steps file
update_task_ids "$DOCS_DIR/bp-pm-02-next-steps.md"

# Update task IDs in the checklist usage guide
update_task_ids "$DOCS_DIR/bp-pm-05-checklist-usage-guide.md"

# Update task IDs in the checklist organization file
update_task_ids "$DOCS_DIR/bp-pm-06-checklist-organization.md"

echo -e "${GREEN}Task ID update complete.${NC}"
echo -e "${YELLOW}Please review the changes to ensure they are correct.${NC}"
echo -e "${YELLOW}Backups of the original files have been created with .bak extension.${NC}"

exit 0 
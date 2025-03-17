#!/bin/bash

# BizzyPerson Documentation Reorganization Script
# This script implements the reorganization plan for the BizzyPerson documentation

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

echo -e "${GREEN}Starting documentation reorganization...${NC}"

# Create a backup of the docs directory
BACKUP_DIR="../docs_backup_$(date +%Y%m%d_%H%M%S)"
echo -e "${YELLOW}Creating backup of docs directory at $BACKUP_DIR${NC}"
cp -r "$DOCS_DIR" "$BACKUP_DIR"

# Create symbolic links directory if it doesn't exist
SYMLINKS_DIR="$DOCS_DIR/symlinks"
if [ ! -d "$SYMLINKS_DIR" ]; then
  echo -e "${YELLOW}Creating symlinks directory at $SYMLINKS_DIR${NC}"
  mkdir -p "$SYMLINKS_DIR"
fi

# Function to rename a file and create a symbolic link
rename_file() {
  local old_file="$1"
  local new_file="$2"
  local category="$3"
  
  # Check if the old file exists
  if [ ! -f "$DOCS_DIR/$old_file" ]; then
    echo -e "${RED}Error: File $old_file not found${NC}"
    return 1
  fi
  
  # Create the new file with a redirect notice
  echo -e "${YELLOW}Creating new file $new_file${NC}"
  
  # Get the first line of the old file (the title)
  local title=$(head -n 1 "$DOCS_DIR/$old_file")
  
  # Create a temporary file with the redirect notice
  cat > "$DOCS_DIR/temp.md" << EOF
$title

> **Note:** This file was renamed from \`$old_file\` to \`$new_file\` as part of the documentation reorganization.
> It is now categorized under **$category**.

$(tail -n +2 "$DOCS_DIR/$old_file")
EOF
  
  # Move the temporary file to the new file
  mv "$DOCS_DIR/temp.md" "$DOCS_DIR/$new_file"
  
  # Create a symbolic link from the old file to the new file
  echo -e "${YELLOW}Creating symbolic link from $old_file to $new_file${NC}"
  ln -sf "$new_file" "$DOCS_DIR/symlinks/$old_file"
  
  # Create a redirect file at the old location
  cat > "$DOCS_DIR/$old_file" << EOF
# Redirected: $old_file

> **Note:** This file has been moved to [$new_file](./$new_file) as part of the documentation reorganization.
> Please update your bookmarks and references.
> 
> This redirect file will be removed after the transition period.

[Go to new location](./$new_file)
EOF
  
  echo -e "${GREEN}Successfully renamed $old_file to $new_file${NC}"
}

# Rename files according to the plan
echo -e "${GREEN}Renaming files according to the plan...${NC}"

# Project Management Documentation
rename_file "bp00-Project-Checklist.md" "bp-pm-01-master-checklist.md" "Project Management"
rename_file "bp03-Next-Steps.md" "bp-pm-02-next-steps.md" "Project Management"
rename_file "bp04-Project-Checklist.md" "bp-pm-03-implementation-checklist.md" "Project Management"
rename_file "bp05-Documentation-Guidelines.md" "bp-pm-04-documentation-guidelines.md" "Project Management"
rename_file "bp06-Checklist-Usage-Guide.md" "bp-pm-05-checklist-usage-guide.md" "Project Management"
rename_file "bp07-Checklist-Organization.md" "bp-pm-06-checklist-organization.md" "Project Management"
rename_file "bp08-Documentation-Reference-Map.md" "bp-pm-07-documentation-reference-map.md" "Project Management"
rename_file "bp09-Content-Verification-Matrix.md" "bp-pm-08-content-verification-matrix.md" "Project Management"

# Core Platform Documentation
rename_file "bp01-System-Overview.md" "bp-core-01-system-overview.md" "Core Platform"
rename_file "bp02-Architecture-Diagram.md" "bp-core-02-architecture-diagram.md" "Core Platform"
rename_file "bp06-Testing-Strategy.md" "bp-core-03-testing-strategy.md" "Core Platform"
rename_file "bp07-Environment-Variables.md" "bp-core-04-environment-variables.md" "Core Platform"
rename_file "bp08-Docker-Compose-Setup.md" "bp-core-05-docker-compose-setup.md" "Core Platform"

# Integration Documentation
rename_file "bp05-Unified-Authentication-System.md" "bp-int-01-unified-authentication.md" "Integration"
rename_file "bp10-MCP-Integration.md" "bp-int-02-mcp-integration.md" "Integration"
rename_file "bp-int-04-knowledge-base-integration.md" "bp-int-03-knowledge-base-integration.md" "Integration"

# Extension Framework Documentation
rename_file "bp04-Extension-API.md" "bp-ext-01-extension-api.md" "Extension Framework"

# User Interface Documentation
rename_file "bp08-Unified-UI-Integration.md" "bp-ui-01-unified-ui-integration.md" "User Interface"

# Technical Documentation
rename_file "bp05-MCP-Tools.md" "bp-tech-01-mcp-tools.md" "Technical"
rename_file "bp06-RAG-Enhancements.md" "bp-tech-02-rag-enhancements.md" "Technical"
rename_file "bp07-Efficient-RAG-Architecture.md" "bp-tech-03-efficient-rag-architecture.md" "Technical"

echo -e "${GREEN}File renaming complete.${NC}"

# Update the README.md file
echo -e "${YELLOW}Updating README.md with new file names...${NC}"

# Create a temporary file with the updated README
cat > "$DOCS_DIR/temp_README.md" << 'EOF'
# BizzyPerson Documentation

This directory contains documentation for the BizzyPerson project, including system architecture, component descriptions, and development guidelines.

## Documentation Structure

### Core Platform Documentation (BP-CORE-XX)

| File | Description |
|------|-------------|
| [bp-core-01-system-overview.md](bp-core-01-system-overview.md) | System architecture and component overview |
| [bp-core-02-architecture-diagram.md](bp-core-02-architecture-diagram.md) | Visual representation of system architecture |
| [bp-core-03-testing-strategy.md](bp-core-03-testing-strategy.md) | Testing strategy and framework |
| [bp-core-04-environment-variables.md](bp-core-04-environment-variables.md) | Environment variables configuration guide |
| [bp-core-05-docker-compose-setup.md](bp-core-05-docker-compose-setup.md) | Docker Compose development environment setup |

### Integration Documentation (BP-INT-XX)

| File | Description |
|------|-------------|
| [bp-int-01-unified-authentication.md](bp-int-01-unified-authentication.md) | Unified authentication system |
| [bp-int-02-mcp-integration.md](bp-int-02-mcp-integration.md) | MCP integration architecture |
| [bp-int-03-knowledge-base-integration.md](bp-int-03-knowledge-base-integration.md) | Knowledge base integration between AnythingLLM and LibreChat |

### Extension Framework Documentation (BP-EXT-XX)

| File | Description |
|------|-------------|
| [bp-ext-01-extension-api.md](bp-ext-01-extension-api.md) | Extension API documentation |

### User Interface Documentation (BP-UI-XX)

| File | Description |
|------|-------------|
| [bp-ui-01-unified-ui-integration.md](bp-ui-01-unified-ui-integration.md) | Approach for integrating AnythingLLM and LibreChat into a unified UI |

### Project Management Documentation (BP-PM-XX)

| File | Description |
|------|-------------|
| [bp-pm-01-master-checklist.md](bp-pm-01-master-checklist.md) | Master project checklist with detailed phases and timelines |
| [bp-pm-02-next-steps.md](bp-pm-02-next-steps.md) | Immediate next steps and priorities |
| [bp-pm-03-implementation-checklist.md](bp-pm-03-implementation-checklist.md) | Simplified implementation status checklist |
| [bp-pm-04-documentation-guidelines.md](bp-pm-04-documentation-guidelines.md) | Documentation standards and guidelines |
| [bp-pm-05-checklist-usage-guide.md](bp-pm-05-checklist-usage-guide.md) | Guide for using and maintaining project checklists |
| [bp-pm-06-checklist-organization.md](bp-pm-06-checklist-organization.md) | Explanation of checklist organization and task ID system |
| [bp-pm-07-documentation-reference-map.md](bp-pm-07-documentation-reference-map.md) | Reference map between documentation files |
| [bp-pm-08-content-verification-matrix.md](bp-pm-08-content-verification-matrix.md) | Content verification matrix |

### Technical Documentation (BP-TECH-XX)

| File | Description |
|------|-------------|
| [bp-tech-01-mcp-tools.md](bp-tech-01-mcp-tools.md) | MCP tools documentation |
| [bp-tech-02-rag-enhancements.md](bp-tech-02-rag-enhancements.md) | RAG enhancements documentation |
| [bp-tech-03-efficient-rag-architecture.md](bp-tech-03-efficient-rag-architecture.md) | Efficient RAG architecture documentation |

### BizzyFarmer Extension Documentation (BF prefix)

| File | Description |
|------|-------------|
| [bf01-Extension-Overview.md](bf01-Extension-Overview.md) | BizzyFarmer extension overview |
| [bf02-Data-Models.md](bf02-Data-Models.md) | Agricultural data models documentation |
| [bf03-Tools.md](bf03-Tools.md) | Agricultural tools documentation |

### Categorized Reference Documentation

| Directory | Description |
|-----------|-------------|
| [api/](api/) | API documentation |
| [architecture/](architecture/) | Detailed architecture documentation |
| [extensions/](extensions/) | Extension development documentation |
| [symlinks/](symlinks/) | Symbolic links to renamed files (temporary) |

## File Naming Convention

The BizzyPerson documentation uses a category-based prefix system that aligns with the task ID system:

1. **Core Platform Documentation (BP-CORE-XX)**
   - Project structure, setup, environment
   - Docker, deployment, configuration

2. **Integration Documentation (BP-INT-XX)**
   - AnythingLLM and LibreChat integration
   - Authentication, knowledge base, chat

3. **Extension Framework Documentation (BP-EXT-XX)**
   - Extension API, hooks, lifecycle
   - Data models, registration

4. **User Interface Documentation (BP-UI-XX)**
   - UI components, design system
   - Navigation, layouts

5. **Project Management Documentation (BP-PM-XX)**
   - Checklists, roadmaps, guidelines
   - Documentation standards

6. **Technical Documentation (BP-TECH-XX)**
   - RAG architecture, MCP tools
   - Technical specifications

7. **BizzyFarmer Extension Documentation (BF prefix)**
   - Agricultural extension documentation

## Legacy File Names

For backward compatibility, the following symbolic links are maintained:

| Legacy File | New File |
|-------------|----------|
| [bp00-Project-Checklist.md](symlinks/bp00-Project-Checklist.md) | [bp-pm-01-master-checklist.md](bp-pm-01-master-checklist.md) |
| [bp01-System-Overview.md](symlinks/bp01-System-Overview.md) | [bp-core-01-system-overview.md](bp-core-01-system-overview.md) |
| [bp02-Architecture-Diagram.md](symlinks/bp02-Architecture-Diagram.md) | [bp-core-02-architecture-diagram.md](bp-core-02-architecture-diagram.md) |
| [bp03-Next-Steps.md](symlinks/bp03-Next-Steps.md) | [bp-pm-02-next-steps.md](bp-pm-02-next-steps.md) |
| [bp04-Project-Checklist.md](symlinks/bp04-Project-Checklist.md) | [bp-pm-03-implementation-checklist.md](bp-pm-03-implementation-checklist.md) |
| [bp04-Extension-API.md](symlinks/bp04-Extension-API.md) | [bp-ext-01-extension-api.md](bp-ext-01-extension-api.md) |
| [bp05-Documentation-Guidelines.md](symlinks/bp05-Documentation-Guidelines.md) | [bp-pm-04-documentation-guidelines.md](bp-pm-04-documentation-guidelines.md) |
| [bp05-MCP-Tools.md](symlinks/bp05-MCP-Tools.md) | [bp-tech-01-mcp-tools.md](bp-tech-01-mcp-tools.md) |
| [bp05-Unified-Authentication-System.md](symlinks/bp05-Unified-Authentication-System.md) | [bp-int-01-unified-authentication.md](bp-int-01-unified-authentication.md) |
| [bp06-RAG-Enhancements.md](symlinks/bp06-RAG-Enhancements.md) | [bp-tech-02-rag-enhancements.md](bp-tech-02-rag-enhancements.md) |
| [bp06-Checklist-Usage-Guide.md](symlinks/bp06-Checklist-Usage-Guide.md) | [bp-pm-05-checklist-usage-guide.md](bp-pm-05-checklist-usage-guide.md) |
| [bp06-Testing-Strategy.md](symlinks/bp06-Testing-Strategy.md) | [bp-core-03-testing-strategy.md](bp-core-03-testing-strategy.md) |
| [bp07-Environment-Variables.md](symlinks/bp07-Environment-Variables.md) | [bp-core-04-environment-variables.md](bp-core-04-environment-variables.md) |
| [bp07-Checklist-Organization.md](symlinks/bp07-Checklist-Organization.md) | [bp-pm-06-checklist-organization.md](bp-pm-06-checklist-organization.md) |
| [bp07-Efficient-RAG-Architecture.md](symlinks/bp07-Efficient-RAG-Architecture.md) | [bp-tech-03-efficient-rag-architecture.md](bp-tech-03-efficient-rag-architecture.md) |
| [bp08-Docker-Compose-Setup.md](symlinks/bp08-Docker-Compose-Setup.md) | [bp-core-05-docker-compose-setup.md](bp-core-05-docker-compose-setup.md) |
| [bp08-Unified-UI-Integration.md](symlinks/bp08-Unified-UI-Integration.md) | [bp-ui-01-unified-ui-integration.md](bp-ui-01-unified-ui-integration.md) |
| [bp08-Documentation-Reference-Map.md](symlinks/bp08-Documentation-Reference-Map.md) | [bp-pm-07-documentation-reference-map.md](bp-pm-07-documentation-reference-map.md) |
| [bp09-Content-Verification-Matrix.md](symlinks/bp09-Content-Verification-Matrix.md) | [bp-pm-08-content-verification-matrix.md](bp-pm-08-content-verification-matrix.md) |
| [bp10-MCP-Integration.md](symlinks/bp10-MCP-Integration.md) | [bp-int-02-mcp-integration.md](bp-int-02-mcp-integration.md) |

## Using This Documentation

### For New Users

If you're new to the BizzyPerson project, we recommend reading the documentation in this order:

1. [bp-core-01-system-overview.md](bp-core-01-system-overview.md) - Understand the system architecture
2. [bp-pm-03-implementation-checklist.md](bp-pm-03-implementation-checklist.md) - See the current implementation status
3. [bf01-Extension-Overview.md](bf01-Extension-Overview.md) - Learn about the BizzyFarmer extension

### For Developers

If you're contributing to the project, these documents are essential:

1. [bp-pm-04-documentation-guidelines.md](bp-pm-04-documentation-guidelines.md) - Learn how to maintain documentation
2. [bp-pm-05-checklist-usage-guide.md](bp-pm-05-checklist-usage-guide.md) - Understand how to track progress
3. [bp-pm-06-checklist-organization.md](bp-pm-06-checklist-organization.md) - Learn about task IDs and checklist structure
4. [bp-ui-01-unified-ui-integration.md](bp-ui-01-unified-ui-integration.md) - Understand the UI integration approach
5. [architecture/integration-architecture.md](architecture/integration-architecture.md) - Understand the integration architecture
6. [api/extension-api.md](api/extension-api.md) - Learn about the extension API

### For Project Managers

If you're managing the project, focus on these documents:

1. [bp-pm-01-master-checklist.md](bp-pm-01-master-checklist.md) - Comprehensive project plan
2. [bp-pm-02-next-steps.md](bp-pm-02-next-steps.md) - Immediate priorities
3. [bp-pm-03-implementation-checklist.md](bp-pm-03-implementation-checklist.md) - Current implementation status

## Contributing to Documentation

Before contributing to the documentation, please read [bp-pm-04-documentation-guidelines.md](bp-pm-04-documentation-guidelines.md) to understand our documentation standards and processes.

When updating checklists, please follow the guidelines in [bp-pm-05-checklist-usage-guide.md](bp-pm-05-checklist-usage-guide.md) and [bp-pm-06-checklist-organization.md](bp-pm-06-checklist-organization.md) to maintain consistency between the master and implementation checklists and to use the task ID system correctly.
EOF

# Move the temporary README to the README.md file
mv "$DOCS_DIR/temp_README.md" "$DOCS_DIR/README.md"

echo -e "${GREEN}README.md updated successfully.${NC}"

# Update the documentation guidelines
echo -e "${YELLOW}Updating documentation guidelines with new naming convention...${NC}"

# Create a temporary file with the updated documentation guidelines
cat > "$DOCS_DIR/temp_guidelines.md" << 'EOF'
# BizzyPerson Documentation Guidelines (BP-PM-04)

> **Note:** This file was renamed from `bp05-Documentation-Guidelines.md` to `bp-pm-04-documentation-guidelines.md` as part of the documentation reorganization.
> It is now categorized under **Project Management**.

## Documentation Structure

BizzyPerson uses a structured documentation system with the following naming conventions:

### Category-Based Prefix System

The BizzyPerson documentation uses a category-based prefix system that aligns with the task ID system:

1. **Core Platform Documentation (BP-CORE-XX)**
   - Project structure, setup, environment
   - Docker, deployment, configuration

2. **Integration Documentation (BP-INT-XX)**
   - AnythingLLM and LibreChat integration
   - Authentication, knowledge base, chat

3. **Extension Framework Documentation (BP-EXT-XX)**
   - Extension API, hooks, lifecycle
   - Data models, registration

4. **User Interface Documentation (BP-UI-XX)**
   - UI components, design system
   - Navigation, layouts

5. **Project Management Documentation (BP-PM-XX)**
   - Checklists, roadmaps, guidelines
   - Documentation standards

6. **Technical Documentation (BP-TECH-XX)**
   - RAG architecture, MCP tools
   - Technical specifications

7. **BizzyFarmer Extension Documentation (BF prefix)**
   - Agricultural extension documentation

### Documentation Categories

1. **BizzyPerson Core Documentation (BP-XXX-XX prefix)**
   - `bp-pm-01-master-checklist.md` - Master project checklist with detailed phases and timelines
   - `bp-core-01-system-overview.md` - System architecture and component overview
   - `bp-core-02-architecture-diagram.md` - Visual representation of system architecture
   - `bp-pm-02-next-steps.md` - Immediate next steps and priorities
   - `bp-pm-03-implementation-checklist.md` - Simplified implementation status checklist
   - `bp-pm-04-documentation-guidelines.md` - This file, explaining documentation standards

2. **BizzyFarmer Extension Documentation (BF prefix)**
   - `bf01-Extension-Overview.md` - BizzyFarmer extension overview
   - `bf02-Data-Models.md` - Agricultural data models documentation
   - `bf03-Tools.md` - Agricultural tools documentation
   - Additional BF-prefixed files for specific extension components

3. **Categorized Reference Documentation (in subdirectories)**
   - `api/` - API documentation
   - `architecture/` - Detailed architecture documentation
   - `extensions/` - Extension development documentation

## File Referencing Guidelines

When referencing documentation files in code, comments, or other documentation, use the following format:

```
[BP-CORE-01: System Overview](../docs/bp-core-01-system-overview.md)
```

For specific sections within a document, use:

```
[BP-CORE-01: System Overview - Core Components](../docs/bp-core-01-system-overview.md#core-components)
```

## Checklist Management

The project uses two complementary checklist files:

1. **Master Checklist (`bp-pm-01-master-checklist.md`)**
   - Contains comprehensive project phases and detailed subtasks
   - Includes timeline estimates and dependencies
   - Serves as the authoritative project planning document
   - Updated during major planning sessions and milestone reviews

2. **Implementation Checklist (`bp-pm-03-implementation-checklist.md`)**
   - Simplified, actionable checklist focused on implementation status
   - Provides quick overview of completed and pending tasks
   - Updated regularly during development
   - Used for day-to-day tracking and progress updates

### Task ID System

To maintain consistency between the two checklist files, each task should have a unique identifier:

```
[BP-CORE-01] Create project directory structure
```

Where:
- `BP` indicates BizzyPerson project
- `CORE` indicates the component (CORE, INT for Integration, EXT for Extension, etc.)
- `01` is a sequential number

This ID should be used in both checklist files, commit messages, and related documentation.

## Documentation Update Process

1. **Adding New Documentation**
   - Assign the next available number in the appropriate category prefix series
   - Follow the established format and structure
   - Add references to existing documentation where relevant
   - Update the main README.md with links to new documentation

2. **Updating Existing Documentation**
   - Maintain the same file name and number
   - Add a revision history section if significant changes are made
   - Update any cross-references in other documentation files

3. **Checklist Updates**
   - Update `bp-pm-03-implementation-checklist.md` as tasks are completed
   - Periodically synchronize with `bp-pm-01-master-checklist.md` during milestone reviews
   - Ensure task IDs are consistent between both files

## Documentation Standards

1. **Markdown Formatting**
   - Use ATX-style headers (`#` for main headers)
   - Use fenced code blocks with language specification
   - Use tables for structured data
   - Use bullet points for lists of items
   - Use numbered lists for sequential steps

2. **Content Guidelines**
   - Begin each document with a clear purpose statement
   - Include diagrams where appropriate
   - Provide examples for complex concepts
   - Link to related documentation
   - Include code snippets where helpful

3. **File Organization**
   - Keep files focused on a single topic
   - Use clear, descriptive file names
   - Organize content with logical headers
   - Include a table of contents for longer documents
   - Store images in the appropriate assets directory

## Legacy File Names

For backward compatibility, symbolic links are maintained from the old file names to the new file names. These links will be removed after the transition period (3 months).

The mapping between old and new file names is documented in the [README.md](README.md#legacy-file-names) file.
EOF

# Move the temporary guidelines to the new file
mv "$DOCS_DIR/temp_guidelines.md" "$DOCS_DIR/bp-pm-04-documentation-guidelines.md"

echo -e "${GREEN}Documentation guidelines updated successfully.${NC}"

# Create a rename script for the project root
echo -e "${YELLOW}Creating rename script for the project root...${NC}"

cat > "./update-doc-references.sh" << 'EOF'
#!/bin/bash

# BizzyPerson Documentation References Update Script
# This script updates references to documentation files in the project root

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Updating documentation references in project files...${NC}"

# Define the mapping of old to new file names
declare -A file_mapping=(
  ["bp00-Project-Checklist.md"]="bp-pm-01-master-checklist.md"
  ["bp01-System-Overview.md"]="bp-core-01-system-overview.md"
  ["bp02-Architecture-Diagram.md"]="bp-core-02-architecture-diagram.md"
  ["bp03-Next-Steps.md"]="bp-pm-02-next-steps.md"
  ["bp04-Project-Checklist.md"]="bp-pm-03-implementation-checklist.md"
  ["bp04-Extension-API.md"]="bp-ext-01-extension-api.md"
  ["bp05-Documentation-Guidelines.md"]="bp-pm-04-documentation-guidelines.md"
  ["bp05-MCP-Tools.md"]="bp-tech-01-mcp-tools.md"
  ["bp05-Unified-Authentication-System.md"]="bp-int-01-unified-authentication.md"
  ["bp06-RAG-Enhancements.md"]="bp-tech-02-rag-enhancements.md"
  ["bp06-Checklist-Usage-Guide.md"]="bp-pm-05-checklist-usage-guide.md"
  ["bp06-Testing-Strategy.md"]="bp-core-03-testing-strategy.md"
  ["bp07-Environment-Variables.md"]="bp-core-04-environment-variables.md"
  ["bp07-Checklist-Organization.md"]="bp-pm-06-checklist-organization.md"
  ["bp07-Efficient-RAG-Architecture.md"]="bp-tech-03-efficient-rag-architecture.md"
  ["bp08-Docker-Compose-Setup.md"]="bp-core-05-docker-compose-setup.md"
  ["bp08-Unified-UI-Integration.md"]="bp-ui-01-unified-ui-integration.md"
  ["bp08-Documentation-Reference-Map.md"]="bp-pm-07-documentation-reference-map.md"
  ["bp09-Content-Verification-Matrix.md"]="bp-pm-08-content-verification-matrix.md"
  ["bp10-MCP-Integration.md"]="bp-int-02-mcp-integration.md"
  ["bp-int-04-knowledge-base-integration.md"]="bp-int-03-knowledge-base-integration.md"
)

# Find all markdown files in the project root
find .. -type f -name "*.md" -not -path "../docs/*" | while read -r file; do
  echo -e "${YELLOW}Checking file: $file${NC}"
  
  # Create a backup of the file
  cp "$file" "${file}.bak"
  
  # Update references in the file
  for old_name in "${!file_mapping[@]}"; do
    new_name="${file_mapping[$old_name]}"
    
    # Update references to the file
    sed -i.tmp "s|docs/$old_name|docs/$new_name|g" "$file"
    sed -i.tmp "s|$old_name|$new_name|g" "$file"
    
    # Update references to the file title
    old_title=$(echo "$old_name" | sed 's/\.md$//' | sed 's/-/ /g')
    new_title=$(echo "$new_name" | sed 's/\.md$//' | sed 's/-/ /g')
    sed -i.tmp "s|$old_title|$new_title|g" "$file"
  done
  
  # Remove temporary files
  rm -f "${file}.tmp"
  
  echo -e "${GREEN}Updated references in $file${NC}"
done

echo -e "${GREEN}Documentation references updated successfully.${NC}"
EOF

# Make the script executable
chmod +x "./update-doc-references.sh"

echo -e "${GREEN}Rename script created successfully.${NC}"

echo -e "${GREEN}Documentation reorganization complete.${NC}"
echo -e "${YELLOW}Please review the changes and run the update-doc-references.sh script to update references in other files.${NC}"
echo -e "${YELLOW}The original files have been backed up to $BACKUP_DIR${NC}"
echo -e "${YELLOW}Symbolic links have been created in $SYMLINKS_DIR${NC}"
echo -e "${YELLOW}Redirect files have been created at the original locations${NC}"

exit 0 
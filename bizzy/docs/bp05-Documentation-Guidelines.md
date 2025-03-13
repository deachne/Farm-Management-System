# BizzyPerson Documentation Guidelines (BP05)

## Documentation Structure

BizzyPerson uses a structured documentation system with the following naming conventions:

1. **BizzyPerson Core Documentation (BP prefix)**
   - `bp00-Project-Checklist.md` - Master project checklist with detailed phases and timelines
   - `bp01-System-Overview.md` - System architecture and component overview
   - `bp02-Architecture-Diagram.md` - Visual representation of system architecture
   - `bp03-Next-Steps.md` - Immediate next steps and priorities
   - `bp04-Project-Checklist.md` - Simplified implementation status checklist
   - `bp05-Documentation-Guidelines.md` - This file, explaining documentation standards

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
[BP01: System Overview](../docs/bp01-System-Overview.md)
```

For specific sections within a document, use:

```
[BP01: System Overview - Core Components](../docs/bp01-System-Overview.md#core-components)
```

## Checklist Management

The project uses two complementary checklist files:

1. **Master Checklist (`bp00-Project-Checklist.md`)**
   - Contains comprehensive project phases and detailed subtasks
   - Includes timeline estimates and dependencies
   - Serves as the authoritative project planning document
   - Updated during major planning sessions and milestone reviews

2. **Implementation Checklist (`bp04-Project-Checklist.md`)**
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
   - Assign the next available number in the appropriate prefix series
   - Follow the established format and structure
   - Add references to existing documentation where relevant
   - Update the main README.md with links to new documentation

2. **Updating Existing Documentation**
   - Maintain the same file name and number
   - Add a revision history section if significant changes are made
   - Update any cross-references in other documentation files

3. **Checklist Updates**
   - Update `bp04-Project-Checklist.md` as tasks are completed
   - Periodically synchronize with `bp00-Project-Checklist.md` during milestone reviews
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
# BizzyPerson Documentation Reorganization Plan

## Current Issues

The BizzyPerson documentation currently has duplicate BP file numbers across several files, which can lead to confusion and referencing issues. Specifically:

1. **BP04 duplicates**:
   - `bp04-Project-Checklist.md`
   - `bp04-Extension-API.md`

2. **BP05 duplicates**:
   - `bp05-Documentation-Guidelines.md`
   - `bp05-MCP-Tools.md`
   - `bp05-Unified-Authentication-System.md`

3. **BP06 duplicates**:
   - `bp06-RAG-Enhancements.md`
   - `bp06-Checklist-Usage-Guide.md`
   - `bp06-Testing-Strategy.md`

4. **BP07 duplicates**:
   - `bp07-Environment-Variables.md`
   - `bp07-Checklist-Organization.md`
   - `bp07-Efficient-RAG-Architecture.md`

5. **BP08 duplicates**:
   - `bp08-Docker-Compose-Setup.md`
   - `bp08-Unified-UI-Integration.md`
   - `bp08-Documentation-Reference-Map.md`

## Reorganization Approach

We will implement a category-based prefix system that aligns with the task ID system (BP-CORE-XX, BP-INT-XX, etc.). This will:

1. Maintain the BP/BF distinction for BizzyPerson vs. BizzyFarmer documentation
2. Eliminate duplicate file numbers by using category prefixes
3. Make it easier to locate related documentation
4. Improve scalability for future documentation additions
5. Align with the existing task ID system for better traceability

## New Naming Convention

The new naming convention will use the following categories:

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
   - Agricultural extension documentation (unchanged)

## File Renaming Plan

| Current File | New File | Category |
|--------------|----------|----------|
| `bp00-Project-Checklist.md` | `bp-pm-01-master-checklist.md` | Project Management |
| `bp01-System-Overview.md` | `bp-core-01-system-overview.md` | Core Platform |
| `bp02-Architecture-Diagram.md` | `bp-core-02-architecture-diagram.md` | Core Platform |
| `bp03-Next-Steps.md` | `bp-pm-02-next-steps.md` | Project Management |
| `bp04-Project-Checklist.md` | `bp-pm-03-implementation-checklist.md` | Project Management |
| `bp04-Extension-API.md` | `bp-ext-01-extension-api.md` | Extension Framework |
| `bp05-Documentation-Guidelines.md` | `bp-pm-04-documentation-guidelines.md` | Project Management |
| `bp05-MCP-Tools.md` | `bp-tech-01-mcp-tools.md` | Technical |
| `bp05-Unified-Authentication-System.md` | `bp-int-01-unified-authentication.md` | Integration |
| `bp06-RAG-Enhancements.md` | `bp-tech-02-rag-enhancements.md` | Technical |
| `bp06-Checklist-Usage-Guide.md` | `bp-pm-05-checklist-usage-guide.md` | Project Management |
| `bp06-Testing-Strategy.md` | `bp-core-03-testing-strategy.md` | Core Platform |
| `bp07-Environment-Variables.md` | `bp-core-04-environment-variables.md` | Core Platform |
| `bp07-Checklist-Organization.md` | `bp-pm-06-checklist-organization.md` | Project Management |
| `bp07-Efficient-RAG-Architecture.md` | `bp-tech-03-efficient-rag-architecture.md` | Technical |
| `bp08-Docker-Compose-Setup.md` | `bp-core-05-docker-compose-setup.md` | Core Platform |
| `bp08-Unified-UI-Integration.md` | `bp-ui-01-unified-ui-integration.md` | User Interface |
| `bp08-Documentation-Reference-Map.md` | `bp-pm-07-documentation-reference-map.md` | Project Management |
| `bp09-Content-Verification-Matrix.md` | `bp-pm-08-content-verification-matrix.md` | Project Management |
| `bp10-MCP-Integration.md` | `bp-int-02-mcp-integration.md` | Integration |
| `bp-int-04-knowledge-base-integration.md` | `bp-int-03-knowledge-base-integration.md` | Integration |

## Implementation Scripts

To implement this reorganization plan, we have created the following scripts in the `bizzy/scripts` directory:

### master-reorganize.sh

The main script that runs all the reorganization scripts in the correct order. This is the only script you need to run.

```bash
./master-reorganize.sh
```

### reorganize-docs.sh

This script performs the actual file renaming according to the reorganization plan. It:

1. Creates a backup of the docs directory
2. Renames files according to the new naming convention
3. Creates symbolic links from old file names to new file names
4. Creates redirect files at the original locations
5. Updates the README.md file with the new file names

### update-task-ids.sh

This script updates task IDs in the checklist files to match the new naming convention. It:

1. Updates task IDs in the master checklist
2. Updates task IDs in the implementation checklist
3. Updates task IDs in other related files

### update-doc-references.sh

This script updates references to documentation files in other project files. It:

1. Finds all markdown files in the project root
2. Updates references to the old file names with the new file names
3. Updates references to the old file titles with the new file titles

## Implementation Steps

1. **Documentation Updates**
   - Create this reorganization plan document
   - Update documentation guidelines to reflect the new naming convention
   - Create a mapping between old and new file names

2. **Script Creation**
   - Create scripts to automate the renaming process
   - Create scripts to update references in other files
   - Create scripts to update task IDs in checklist files

3. **Execution**
   - Run the master reorganization script
   - Verify that all files have been renamed correctly
   - Check that symbolic links and redirect files work properly
   - Ensure that references to documentation files have been updated

4. **Verification**
   - Test navigation between documentation files
   - Verify that all task IDs have been updated correctly
   - Check for any broken links or references

5. **Communication**
   - Inform the team about the reorganization
   - Provide guidance on the new naming convention
   - Explain the transition period and backward compatibility measures

## Backward Compatibility

To maintain backward compatibility during the transition period:

1. **Symbolic Links**
   - Create symbolic links from old file names to new file names
   - Store these in a dedicated `symlinks` directory

2. **Redirect Files**
   - Create redirect files at the original locations
   - Include a notice about the file being moved
   - Provide a link to the new location

3. **Documentation**
   - Update the README.md with a mapping between old and new file names
   - Include guidance for both new and existing users

4. **Transition Period**
   - Maintain symbolic links and redirect files for 3 months
   - After the transition period, remove the symbolic links and redirect files

## Timeline

1. **Planning Phase (1 day)**
   - Create reorganization plan
   - Get approval from stakeholders

2. **Implementation Phase (1 day)**
   - Create and test scripts
   - Execute reorganization
   - Verify results

3. **Verification Phase (1 day)**
   - Test navigation and references
   - Fix any issues

4. **Transition Phase (3 months)**
   - Maintain backward compatibility
   - Monitor for any issues
   - Remove symbolic links and redirect files after transition period

## Conclusion

This reorganization will create a more structured and scalable documentation system that aligns with the task ID system. It will eliminate duplicate file numbers and improve navigation and reference clarity within the documentation.

The implementation scripts will automate the process and ensure consistency across the documentation. The backward compatibility measures will minimize disruption during the transition period. 
# BizzyPerson Documentation Reorganization Scripts

This directory contains scripts for reorganizing the BizzyPerson documentation to follow a more structured and scalable naming convention.

## Overview

The reorganization addresses the issue of duplicate file numbers (e.g., multiple BP04, BP05, etc. files) by implementing a category-based prefix system that aligns with the task ID system (BP-CORE-XX, BP-INT-XX, etc.).

## Scripts

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

## Backup and Recovery

All scripts create backups of the original files before making changes. If something goes wrong, you can restore the backups:

- The docs directory is backed up to `../docs_backup_YYYYMMDD_HHMMSS`
- Individual files are backed up with a `.bak` extension

## Transition Period

For backward compatibility, the reorganization maintains:

1. Symbolic links from old file names to new file names in the `docs/symlinks` directory
2. Redirect files at the original locations

These will be removed after the transition period (3 months).

## Verification

After running the scripts, you should:

1. Verify that all files have been renamed correctly
2. Check that symbolic links and redirect files work properly
3. Ensure that references to documentation files in other project files have been updated
4. Test the navigation between documentation files

## Manual Updates

Some references may not be automatically updated by the scripts. You may need to manually update:

1. References in code comments
2. References in non-markdown files
3. References in external documentation or tools

## Contact

If you encounter any issues with the reorganization, please contact the documentation team. 
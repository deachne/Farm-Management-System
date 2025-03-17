# Linting Issues Tracker

This document tracks linting issues that need to be addressed in the codebase. These issues have been identified during development but have been deferred to be fixed at a more appropriate time.

## Current Linting Issues

### 1. Missing Dependencies

- **Issue**: Missing type declarations for dependencies like `clsx` and `tailwind-merge`
- **Files Affected**: 
  - `bizzy/core/shared/ui/utils/shared-styling.ts`
- **Resolution**: Install the required dependencies and their type declarations:
  ```bash
  npm install clsx tailwind-merge
  npm install --save-dev @types/clsx
  ```

### 2. Module Resolution Issues

- **Issue**: Cannot find module 'librechat-data-provider' or its corresponding type declarations
- **Files Affected**:
  - Multiple files in `bizzy/core/librechat/client/src/components/`
- **Resolution**: 
  - Create proper type declarations for the `librechat-data-provider` module
  - Ensure path aliases in `tsconfig.json` are correctly configured

### 3. TypeScript Configuration Issues

- **Issue**: TypeScript configuration causes file overwrite errors
- **Files Affected**:
  - `bizzy/core/librechat/client/tsconfig.json`
- **Resolution**:
  - Update the `noEmit` setting to `true` to prevent file generation
  - Adjust the `include` and `exclude` patterns to avoid conflicts

### 4. Component Type Issues

- **Issue**: Type mismatches in component props
- **Files Affected**:
  - `bizzy/core/librechat/client/src/components/Chat/Input/AdaptedChatForm.tsx`
  - `bizzy/core/librechat/client/src/components/Chat/Messages/ui/AdaptedMessageRender.tsx`
- **Resolution**:
  - Create proper type definitions for component props
  - Ensure compatibility between LibreChat and AnythingLLM component interfaces

## Resolution Plan

These issues will be addressed in a dedicated code quality improvement phase after the current feature implementation is complete. The approach will be:

1. **Dependency Management**:
   - Audit all dependencies and ensure they are properly installed
   - Add missing type declarations for all dependencies

2. **TypeScript Configuration**:
   - Review and update the TypeScript configuration
   - Ensure proper path alias configuration
   - Fix file generation settings

3. **Type Definitions**:
   - Create proper type definitions for all custom modules
   - Ensure component props are properly typed

4. **Code Quality**:
   - Run linting tools across the entire codebase
   - Address all remaining issues

## Priority

These issues are currently marked as **Medium Priority** as they do not prevent the functionality from working but should be addressed to ensure code quality and maintainability. 
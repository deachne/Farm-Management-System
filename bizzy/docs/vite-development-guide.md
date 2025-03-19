# Vite Development Guide for BizzyPerson

## Development Environment Setup

### Prerequisites
- Node.js (version 16+)
- npm or yarn
- A modern browser (Chrome/Firefox/Safari)

### Initial Setup
1. Clone the repository
2. Navigate to the correct directory:
   ```bash
   cd /path/to/bizzy
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Development Server

### Starting Development Mode
```bash
cd /path/to/bizzy
npm run dev
```

This launches the Vite development server, typically on port 5173.

### Environment Configuration
- Development uses `.env.development`
- Production uses `.env.production`
- Local overrides can be created in `.env.local`

## Vite Configuration

The primary Vite configuration is in `bizzy/vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/core': path.resolve(__dirname, './core'),
      '@/extensions': path.resolve(__dirname, './extensions'),
    },
  },
});
```

Key aspects:
- `@` aliases for easier imports
- React plugin for JSX support
- Path resolution for module imports

## Common Development Workflows

### 1. Component Development Flow

1. Create component in the appropriate directory
2. Create a demo implementation in `/core/admin/demo/`
3. Test in isolation
4. Integrate with the main application

### 2. Style Development Flow

1. Use Tailwind classes for styling
2. Add component-specific styles inline
3. Test responsive behavior
4. Check dark mode compatibility if applicable

### 3. Integration Testing Flow

1. Create a demo that includes multiple components
2. Test interactions between components
3. Verify state management works correctly
4. Check for design consistency

## Hot Module Replacement (HMR)

### How HMR Works
Vite provides Hot Module Replacement which updates modules in the browser without a full reload, preserving component state.

### Common HMR Issues and Solutions

#### 1. "HMR invalidate" Error Messages

**Problem**:
```
[vite] hmr invalidate /main.tsx Could not Fast Refresh ("true" export is incompatible).
```

**Solution**:
- Check for named exports consistency
- Don't mix default and named exports for components
- Restart the dev server completely

#### 2. Styles Not Updating

**Problem**: Changes to styles don't reflect in the browser

**Solution**:
- Check if Tailwind is processing the file
- Verify class names are correct
- Use browser dev tools to inspect applied styles
- Restart the dev server if issues persist

#### 3. Component Changes Not Reflecting

**Problem**: Component changes don't update in the browser

**Solution**:
- Check for syntax errors in the console
- Verify imports are correct
- Try a hard refresh (Ctrl+F5 or Cmd+Shift+R)
- Restart the dev server

## Troubleshooting Guide

### 1. White Screen / Blank Page

**Possible Causes**:
- JavaScript errors preventing render
- Missing HTML element with ID 'root'
- Routing issues

**Solutions**:
- Check browser console for errors
- Verify the root element exists
- Check render method in main.tsx

### 2. Module Resolution Errors

**Possible Causes**:
- Incorrect import paths
- Missing dependencies
- Case sensitivity issues

**Solutions**:
- Use absolute imports with alias (`@/core/...`)
- Verify file exists at the imported path
- Check package.json for dependencies

### 3. Tailwind CSS Issues

**Possible Causes**:
- Classes not included in the build
- Content configuration not including files
- Incorrect class names

**Solutions**:
- Check tailwind.config.js content patterns
- Use explicit classes rather than dynamic ones
- Add @layer directives for custom styles

### 4. Build Errors

**Possible Causes**:
- TypeScript errors
- Missing dependencies
- Environment configuration issues

**Solutions**:
- Fix all TypeScript errors
- Run with `--force` temporarily
- Check environment variable configuration

## Best Practices for Vite Development

1. **Use Fast Refresh Correctly**
   - Keep component pure
   - Don't mix default and named exports
   - Avoid side effects in module scope

2. **Optimize Imports**
   - Use aliases for cleaner imports
   - Avoid deep nesting of imports
   - Import only what's needed

3. **Handle Dev/Prod Differences**
   - Use `import.meta.env.MODE` for environment checks
   - Create environment-specific code with `import.meta.env.DEV`

4. **Troubleshooting Process**
   1. Check console for errors
   2. Verify component rendering
   3. Inspect network requests
   4. Try disabling extensions
   5. Restart dev server as last resort

## Restarting Development

If you encounter persistent issues, the most reliable fix is often a complete restart:

```bash
# Kill the current process
Ctrl+C

# Clear any caches
rm -rf node_modules/.vite

# Restart the dev server
npm run dev
```

## Reference Materials

- [Vite Documentation](https://vitejs.dev/guide/)
- [React + Vite Guide](https://vitejs.dev/guide/features.html#jsx)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

This guide should be referenced whenever encountering issues with the Vite development environment or when setting up new development workflows. 
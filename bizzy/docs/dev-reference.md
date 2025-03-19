# BizzyPerson Developer Reference Guide

## System Architecture Overview

### Core Systems
1. **BizzyPerson** - Main application with blue-themed UI
   - Location: `/bizzy/core/admin/`
   - Styling: Blue gradient, consistent component styling
   - Purpose: Administrative dashboard and management interface

2. **AnythingLLM Integration** 
   - Location: `/bizzy/core/anythingllm/`
   - Original styling: Different from BizzyPerson
   - Integration: Must preserve functionality while adapting to BizzyPerson UI

3. **LibreChat Integration**
   - Location: `/bizzy/core/librechat/`
   - Original styling: Different from BizzyPerson
   - Integration: Must preserve functionality while adapting to BizzyPerson UI

## Project Structure

```
/bizzy/
  /core/
    /admin/              # BizzyPerson core components
      /components/       # Reusable UI components 
      /demo/             # Demo implementations for testing
    /shared/
      /ui/components/    # Base UI components (Button, Input, Card, etc.)
    /anythingllm/        # AnythingLLM integration
    /librechat/          # LibreChat integration
  /extensions/           # Industry-specific extensions
  /docs/                 # Documentation files
  /main.tsx              # Main application entry point
  /vite.config.ts        # Vite configuration
```

## Development Workflow

### Running the Project
1. **Start development server**:
   ```bash
   cd /path/to/bizzy
   npm run dev
   ```
2. **Access the application**: http://localhost:5173 (or configured port)

### Common Issues and Solutions
1. **HMR Issues**: Restart the server if hot module replacement fails
2. **Style conflicts**: Use inline styles with `style={{}}` for direct fixes
3. **Component duplication**: Check existing components before creating new ones

## UI Reference

### Color Palette
- Sidebar: `bg-gradient-to-b from-blue-600 to-blue-700`
- Headers: `bg-gradient-to-r from-blue-500 to-blue-700`
- Border accents: `border-blue-300`, `border-blue-500`
- Icon colors: Various (`text-blue-300`, `text-pink-300`, etc.)
- Text: White for dark backgrounds, dark for light backgrounds

### Layout Structure
1. **Dashboard Layout**:
   - Fixed sidebar: `w-64` width
   - Main content: `marginLeft: '16rem'` and `width: calc(100% - 16rem)`
   - Content padding: `px-6 sm:px-8 lg:px-10 py-7`

2. **Section Structure**:
   ```tsx
   <section className="mb-10">
     <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
       Section Title
     </h2>
     {/* Content goes here */}
   </section>
   ```

3. **Card Structure**:
   ```tsx
   <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg hover:shadow-xl transition-all">
     <CardContent className="p-5">
       {/* Card content here */}
     </CardContent>
   </Card>
   ```

## Component Template Examples

### Page Component Template
```tsx
import React from 'react';
import { Card, CardContent } from '../../../shared/ui/components/Card';
import { Button } from '../../../shared/ui/components/Button';

interface PageNameProps {
  // Define props here
}

const PageName: React.FC<PageNameProps> = ({ /* props */ }) => {
  // State management
  const [state, setState] = React.useState(initialValue);
  
  // Event handlers
  const handleAction = () => {
    // Logic here
  };
  
  return (
    <div>
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
          Page Title
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Content cards or elements */}
          <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg">
            <CardContent className="p-5">
              {/* Card content */}
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section>
        {/* Additional sections */}
      </section>
    </div>
  );
};

export default PageName;
```

### Integration with Dashboard Demo
```tsx
// Inside DashboardDemo.tsx or similar
import React, { useState } from 'react';
import { Dashboard } from '../components';
import { PageName } from '../components';

const DashboardDemo: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'pageName'>('dashboard');
  
  // Dashboard props
  const dashboardProps = {
    // ... other props
    onNavigateToPageName: () => {
      setView('pageName');
    },
  };
  
  // Render PageName with dashboard layout
  const renderPageName = () => {
    return (
      <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 flex" style={{ margin: 0, padding: 0 }}>
        {/* Sidebar with PageName highlighted */}
        <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white h-screen fixed left-0 top-0">
          {/* Sidebar content with appropriate highlighting */}
        </aside>
        
        {/* Main Content */}
        <div style={{ marginLeft: '16rem', width: 'calc(100% - 16rem)' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg">
            <div className="px-6 sm:px-8 lg:px-10">
              <div className="flex items-center justify-between py-5">
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <span className="bg-white text-blue-600 px-3 py-1 rounded-md mr-3">BizzyPerson</span>
                  Page Name Title
                </h1>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="py-7 px-6 sm:px-8 lg:px-10">
            <PageName />
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      {view === 'dashboard' ? (
        <Dashboard {...dashboardProps} />
      ) : (
        renderPageName()
      )}
    </div>
  );
};
```

## Integration Guidelines

### Integrating AnythingLLM Components
1. Preserve core functionality
2. Apply BizzyPerson styling for consistency
3. Document any adaptations needed for integration

### Integrating LibreChat Components
1. Preserve core functionality
2. Apply BizzyPerson styling for consistency
3. Document any adaptations needed for integration

## Component Storage Strategy

### New Components Location
- **Admin UI Components**: `bizzy/core/admin/components/`
- **Shared UI Elements**: `bizzy/core/shared/ui/components/`
- **Integration-specific Components**: In respective integration directories

### Component Naming Conventions
- Use PascalCase for component names
- Use descriptive names that reflect function
- Group related components in subdirectories

## Navigation System

### Current Implementation
- State-based view switching in demo components
- Sidebar navigation triggers view changes

### Future Implementation
- Consider implementing a router-based navigation system
- Document routes and navigation patterns
- Maintain consistent UI state during navigation

## Testing Framework

### Storybook Status
- Currently configured but not actively used
- Consider reactivating for component development and documentation

### Testing Strategy
- Document how to test new components
- Establish patterns for integration testing

## Important Resources

### Documentation
- This reference file: `bizzy/docs/dev-reference.md`
- Project checklist: `bp00-Project-Checklist.md` & `bp04-Project-Checklist.md`

### External Resources
- Tailwind CSS: https://tailwindcss.com/docs
- Vite: https://vitejs.dev/guide/
- React: https://reactjs.org/docs/getting-started.html

---

This document should be referenced before beginning work on any new component or page to ensure consistency and adherence to established patterns. 
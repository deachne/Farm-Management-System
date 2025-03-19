# BizzyPerson System Integration Guide

## 1. System Differentiation Guide

BizzyPerson integrates multiple systems that each have their own visual identity and functionality. Understanding the differences is crucial for development.

### BizzyPerson Core UI

**Visual Characteristics:**
- Blue gradient sidebar: `from-blue-600 to-blue-700`
- Blue gradient headers: `from-blue-500 to-blue-700`
- White text on dark backgrounds
- Rounded corners and subtle shadows
- Consistent card-based UI elements
- Hover effects for interactive elements

**Component Examples:**
- `Dashboard` - Main layout component
- `UserManagement` - User administration
- `ExtensionCard` - Extension display and management

**Purpose:** Administrative interface for managing the entire platform, users, extensions, and settings.

### AnythingLLM Integration

**Original Visual Identity:**
- Different color scheme than BizzyPerson
- Unique layout patterns
- Specialized components for knowledge management

**Integration Approach:**
1. Preserve core AnythingLLM functionality
2. Apply BizzyPerson styling to outer containers
3. Maintain AnythingLLM component structure
4. Document explicitly which components belong to AnythingLLM
5. Use consistent props interface for integration

**Integration Components:**
- Create wrapper components in `bizzy/core/admin/components/anythingllm/`
- Use these wrappers to apply BizzyPerson styling

### LibreChat Integration

**Original Visual Identity:**
- Chat-focused interface
- Different layout and spacing
- Message-based component structure

**Integration Approach:**
1. Preserve LibreChat's chat functionality
2. Apply BizzyPerson styling to outer containers
3. Maintain LibreChat component structure
4. Document explicitly which components belong to LibreChat
5. Use consistent props interface for integration

**Integration Components:**
- Create wrapper components in `bizzy/core/admin/components/librechat/`
- Use these wrappers to apply BizzyPerson styling

## 2. Component Organization Guide

### Component Storage Strategy

```
/bizzy/
  /core/
    /admin/
      /components/               # Core BizzyPerson components
        /Dashboard/              # Dashboard components
          index.tsx              # Main component
          types.ts               # Type definitions
        /UserManagement/         # User Management components
        /Settings/               # Settings components 
        /anythingllm/           # AnythingLLM integration components
        /librechat/             # LibreChat integration components
      /demo/                    # Demo implementations
        DashboardDemo.tsx       # Dashboard demo
        UserManagementDemo.tsx  # User Management demo
    /shared/
      /ui/
        /components/            # Shared UI components
          Button.tsx
          Card.tsx
          Input.tsx
```

### New Component Creation Workflow

1. **Determine Component Type**
   - Is it a page component? → Place in `/components/[ComponentName]/`
   - Is it a shared UI element? → Place in `/shared/ui/components/`
   - Is it integration-specific? → Place in appropriate integration folder

2. **Create Component Files**
   - Main component file (index.tsx or ComponentName.tsx)
   - Types file if needed (types.ts)
   - Subcomponents in same directory if closely related

3. **Follow Templates**
   - Use templates from dev-reference.md
   - Maintain consistent prop interfaces
   - Follow established styling patterns

4. **Create Demo Implementation**
   - Create a demo component in `/demo/` directory
   - Implement with sample data for testing

5. **Document the Component**
   - Note its purpose
   - Reference any design patterns it follows
   - Document integration points

## 3. Navigation System Guide

### Current Navigation Pattern

The current navigation system uses state-based view switching:

```tsx
const [view, setView] = useState<'dashboard' | 'users' | 'settings'>('dashboard');

// Navigation handler
const navigateToUsers = () => {
  setView('users');
};

// Render based on current view
return (
  <div>
    {view === 'dashboard' && <Dashboard {...props} />}
    {view === 'users' && <UserManagementView />}
    {view === 'settings' && <SettingsView />}
  </div>
);
```

### Recommended Navigation Pattern for Future Development

For more complex applications, consider implementing a router-based approach:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Main application with routing
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UserManagementView />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="/extensions/:id" element={<ExtensionView />} />
      </Routes>
    </BrowserRouter>
  );
};
```

### Navigation Integration

When integrating with Dashboard layout:

```tsx
// Dashboard component with navigation
const Dashboard = () => {
  const navigate = useNavigate();
  
  // Navigation handlers
  const handleNavigateToUsers = () => {
    navigate('/users');
  };
  
  return (
    <div className="dashboard-layout">
      <Sidebar onNavigateToUsers={handleNavigateToUsers} />
      <main>
        {/* Content will be rendered by router */}
      </main>
    </div>
  );
};
```

### Navigation State Persistence

Important considerations:
1. Preserve form state during navigation when appropriate
2. Use URL parameters for filters and views
3. Consider using context for global state
4. Document navigation patterns for each major section

## Implementation Checklist for New Pages

When creating a new page, ensure:

1. [ ] Page component follows BizzyPerson styling guidelines
2. [ ] Component is properly organized in file structure
3. [ ] Navigation is implemented consistently
4. [ ] Demo implementation exists for testing
5. [ ] Integration with existing systems is documented
6. [ ] Sidebar highlights correct item when on this page
7. [ ] Component adapts to mobile/responsive requirements

---

This document should be referenced whenever developing components that span multiple systems or implementing new navigation patterns. 
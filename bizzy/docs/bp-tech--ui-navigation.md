# UI Navigation System

## Overview

This document describes the navigation system implemented in the BizzyPerson admin interface, specifically focusing on the navigation between the Dashboard and User Management views.

## Implementation

The navigation is implemented using a state-based approach in the `DashboardDemo` component, which serves as the main container for the admin interface. The component uses React state to track the current view and renders different components based on this state.

### Key Components

1. **DashboardDemo** (`/core/admin/demo/DashboardDemo.tsx`)
   - Main container component that renders either the Dashboard or User Management
   - Manages state: `const [view, setView] = useState<'dashboard' | 'users'>('dashboard')`
   - Provides navigation callbacks to child components

2. **Dashboard** (`/core/admin/components/Dashboard/index.tsx`)
   - Main dashboard view
   - Receives `onNavigateToUsers` callback from DashboardDemo
   - Sidebar "Users" item triggers this callback when clicked

3. **UserManagement** (`/core/admin/components/UserManagement/index.tsx`)
   - User management view displaying user table and controls
   - Embedded within a custom layout in DashboardDemo that includes sidebar navigation

### Navigation Flow

1. Initially, the DashboardDemo component renders the Dashboard view
2. When the user clicks on "Users" in the sidebar:
   - The onClick handler triggers the `onNavigateToUsers` callback
   - This callback calls `setView('users')` to update the state
   - The component re-renders with the UserManagement view
3. When the user clicks on "Dashboard" in the UserManagement view:
   - The onClick handler triggers `setView('dashboard')`
   - The component re-renders with the Dashboard view

### Code Examples

**Dashboard Navigation:**
```tsx
<li 
  className="px-3 py-2.5 rounded hover:bg-blue-500 cursor-pointer text-base flex items-center"
  onClick={onNavigateToUsers}
>
  <Users className="h-5 w-5 mr-3 text-pink-300" />
  Users
</li>
```

**View State Management:**
```tsx
const [view, setView] = useState<'dashboard' | 'users'>('dashboard');

// Navigation handler
const onNavigateToUsers = () => {
  logAction('Navigated to User Management');
  setView('users');
};

// Conditional rendering
return (
  <div>
    {view === 'dashboard' ? (
      <Dashboard {...dashboardProps} />
    ) : (
      renderUserManagement()
    )}
  </div>
);
```

## Future Improvements

In the future, we plan to:

1. Replace the current state-based navigation with React Router for more robust routing
2. Implement proper URL paths for each view
3. Add loading states during navigation
4. Implement authentication checks for protected routes

## Testing

Manual testing has confirmed that:
- Users can navigate from Dashboard to User Management
- Users can navigate from User Management back to Dashboard
- The action log records navigation events correctly
- The UI maintains consistent styling across views 
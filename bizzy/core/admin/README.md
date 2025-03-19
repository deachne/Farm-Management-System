# BizzyPerson Admin Dashboard Components

This directory contains the components for the BizzyPerson Admin Dashboard, a comprehensive UI for managing the BizzyPerson platform.

## Components Overview

The Admin Dashboard consists of the following components:

### 1. Dashboard (`components/Dashboard`)

The main container component that integrates all other admin interface elements. It provides:
- Navigation sidebar with core and extension sections
- System statistics overview
- Extension management interface
- System status panel

### 2. StatCard (`components/StatCard`)

A card component to display statistics with:
- Icon representation
- Numeric or text value
- Change indicators (increase/decrease/no-change)
- Support for showing percentage changes over time periods

### 3. ExtensionCard (`components/ExtensionCard`)

A component to display and manage extensions with:
- Extension name, icon, and version details
- Active/inactive status
- Permission indicators (document, search, network access)
- Resource usage statistics
- Actions for configuration and activation/deactivation

### 4. SystemStatus (`components/SystemStatus`)

A panel component that displays:
- Overall system operational status
- Individual service health indicators
- Recent incidents and their status
- Last updated timestamp

## Usage Examples

### Basic Dashboard

```tsx
import { Dashboard } from 'bizzy/core/admin/components';

// Create dashboard props
const dashboardProps = {
  stats: [...],
  extensions: [...],
  systemStatus: {...},
  // Add event handlers
  onAddExtension: () => {...},
  // Other handlers...
};

function AdminPage() {
  return <Dashboard {...dashboardProps} />;
}
```

### Individual Components

```tsx
import { StatCard, ExtensionCard, SystemStatus } from 'bizzy/core/admin/components';

// For StatCard
<StatCard
  icon={<Users />}
  value={24}
  label="Active Users"
  change={{ value: 4, type: 'increase', period: 'this month' }}
/>

// For ExtensionCard
<ExtensionCard
  name="Farm Management"
  icon={<Tractor />}
  version="1.2.3"
  status="active"
  permissions={{ documentAccess: true, searchAccess: true, networkAccess: true }}
  resources={{ users: 12, storage: "2.3 GB" }}
  onConfigure={() => {...}}
  onActivate={() => {...}}
  onDeactivate={() => {...}}
/>

// For SystemStatus
<SystemStatus
  isOperational={true}
  lastUpdated="2 minutes ago"
  services={[
    { name: 'API Server', status: 'healthy' },
    { name: 'Database', status: 'healthy' },
    // ...more services
  ]}
  incidents={[
    // ...incidents if any
  ]}
  onClose={() => {...}}
/>
```

## Demo

A fully interactive demo of the Dashboard component is available in the `/demo` directory. To view the demo:

1. Navigate to the demo directory: `cd bizzy/core/admin/demo`
2. Open the `index.html` file in a web browser to see the static demo
3. For the interactive React demo, you can use the `DashboardDemo` component:

```tsx
import DashboardDemo from 'bizzy/core/admin/demo/DashboardDemo';

function App() {
  return <DashboardDemo />;
}
```

## Design Notes

The Admin Dashboard components follow these design principles:

1. **Responsive Design**: All components adapt to different screen sizes
2. **Accessibility**: Components include appropriate ARIA attributes
3. **Dark Mode Support**: All components support light and dark themes
4. **Consistent Styling**: Uses the Shadcn UI component library
5. **Typed Interface**: Full TypeScript support with exported types

## Storybook

All components include Storybook stories that showcase their various states and configurations. View them in Storybook by running:

```bash
npm run storybook
```

And then navigating to the `Admin` section. 
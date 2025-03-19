import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Dashboard from '../index';
import SystemStatus from '../../SystemStatus';
import { 
  Users, 
  FileText, 
  HardDrive, 
  Sprout, 
  Tractor, 
  BanknoteIcon, 
  Factory,
  AlertTriangle
} from 'lucide-react';

// Create a visually appealing Demo wrapper with instructions
const DashboardDemo = ({ args }: { args: any }) => {
  return (
    <div className="dashboard-demo">
      {/* Visual instructions overlay */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg">
        <div className="flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Interactive Demo: Click on buttons to see actions!</span>
        </div>
      </div>
      
      {/* Render the actual Dashboard component */}
      <Dashboard {...args} />
    </div>
  );
};

const meta: Meta<typeof Dashboard> = {
  title: 'Admin/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
    },
    docs: {
      description: {
        component: 'The main Dashboard component for the admin interface, featuring statistics, extension management, and system status overview.'
      }
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', width: '100vw', overflow: 'auto' }}>
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof Dashboard>;

export const Default: Story = {
  render: (args) => <DashboardDemo args={args} />,
  args: {
    stats: [
      {
        icon: <Users className="text-blue-500" />,
        value: 24,
        label: 'Active Users',
        change: {
          value: 4,
          type: 'increase',
          period: 'this month',
        },
      },
      {
        icon: <Sprout className="text-green-500" />,
        value: 3,
        label: 'Active Extensions',
        change: {
          value: 0,
          type: 'no-change',
        },
      },
      {
        icon: <FileText className="text-purple-500" />,
        value: 142,
        label: 'Documents',
        change: {
          value: 23,
          type: 'increase',
          period: 'this week',
        },
      },
      {
        icon: <HardDrive className="text-gray-500" />,
        value: '68%',
        label: 'Storage Used',
        change: {
          value: 5,
          type: 'increase',
          period: 'this month',
        },
      },
    ],
    extensions: [
      {
        name: 'Farm Management',
        icon: <Tractor className="text-green-500" />,
        version: '1.2.3',
        status: 'active',
        permissions: {
          documentAccess: true,
          searchAccess: true,
          networkAccess: true,
        },
        resources: {
          users: 12,
          storage: '2.3 GB',
        },
      },
      {
        name: 'BizzyBank',
        icon: <BanknoteIcon className="text-yellow-500" />,
        version: '0.9.1',
        status: 'active',
        permissions: {
          documentAccess: true,
          searchAccess: false,
          networkAccess: false,
        },
        resources: {
          users: 5,
          storage: '1.2 GB',
        },
      },
      {
        name: 'Manufacturing',
        icon: <Factory className="text-gray-500" />,
        version: '1.0.0',
        status: 'inactive',
        permissions: {
          documentAccess: true,
          searchAccess: true,
          networkAccess: true,
        },
      },
    ],
    systemStatus: {
      isOperational: true,
      lastUpdated: '2 minutes ago',
      services: [
        { name: 'API Server', status: 'healthy' },
        { name: 'Database', status: 'healthy' },
        { name: 'Vector Store', status: 'healthy' },
        { name: 'Chat Server', status: 'healthy' },
        { name: 'File Storage', status: 'warning' },
      ],
      incidents: [
        {
          id: '1',
          title: 'File Storage Capacity Warning',
          timestamp: '2023-04-15 14:32',
          status: 'ongoing',
          severity: 'medium',
          description: 'File storage approaching capacity limits. Consider upgrading storage or removing unused files.',
        }
      ],
    },
    onAddExtension: () => alert('Add Extension clicked'),
    onManagePermissions: () => alert('Manage Permissions clicked'),
    onUpdateAll: () => alert('Update All clicked'),
    onConfigureExtension: (name) => alert(`Configure ${name} clicked`),
    onActivateExtension: (name) => alert(`Activate ${name} clicked`),
    onDeactivateExtension: (name) => alert(`Deactivate ${name} clicked`),
    onSearch: (query) => alert(`Search query: ${query}`),
    onToggleSystemStatus: () => console.log('Toggle System Status clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'The default view of the Admin Dashboard showing statistics, active extensions, and system status. Try clicking on the buttons to see the actions.'
      }
    }
  }
};

export const WithSystemStatusOpen: Story = {
  render: (args) => {
    // Create a custom component that shows the system status by default
    const DashboardWithOpenStatus = () => {
      const [showStatus, setShowStatus] = React.useState(true);
      
      React.useEffect(() => {
        // Force status panel to be open
        setShowStatus(true);
      }, []);
      
      // Clone args and override the onToggleSystemStatus function
      const dashboardProps = {
        ...args,
        onToggleSystemStatus: () => {
          setShowStatus(prev => !prev);
          if (args.onToggleSystemStatus) args.onToggleSystemStatus();
        }
      };
      
      return (
        <div className="dashboard">
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">System Status Panel is open for demo purposes</span>
            </div>
          </div>
          
          {/* Custom Dashboard with forced open status panel */}
          <Dashboard {...dashboardProps} />
          
          {/* Manually render system status panel */}
          {showStatus && (
            <div className="fixed inset-y-0 right-0 w-full max-w-sm z-50 transform transition-all ease-in-out duration-300">
              <div className="h-full flex flex-col">
                <SystemStatus
                  isOperational={args.systemStatus.isOperational}
                  lastUpdated={args.systemStatus.lastUpdated}
                  services={args.systemStatus.services}
                  incidents={args.systemStatus.incidents}
                  onClose={() => setShowStatus(false)}
                />
              </div>
            </div>
          )}
        </div>
      );
    };
    
    return <DashboardWithOpenStatus />;
  },
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story: 'The Admin Dashboard with the System Status panel open by default. View the system status and recent incidents.'
      }
    }
  }
};

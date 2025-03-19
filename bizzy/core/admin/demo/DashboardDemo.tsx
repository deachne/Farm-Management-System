import React, { useState } from 'react';
import { Dashboard } from '../components';
import { DashboardProps, StatItem, Extension } from '../components/Dashboard/types';
import { 
  Users, 
  FileText, 
  HardDrive, 
  Sprout, 
  Tractor, 
  BanknoteIcon, 
  Factory 
} from 'lucide-react';

/**
 * Dashboard Demonstration Component
 * 
 * This component provides a fully styled and interactive demonstration
 * of the Admin Dashboard component.
 * 
 * To use:
 * 1. Import this component
 * 2. Render it in your application
 * 
 * Example:
 * ```tsx
 * import { DashboardDemo } from './bizzy/core/admin/demo/DashboardDemo';
 * 
 * function App() {
 *   return <DashboardDemo />;
 * }
 * ```
 */
const DashboardDemo: React.FC = () => {
  const [actionLog, setActionLog] = useState<string[]>([]);
  
  // Log actions for demonstration
  const logAction = (action: string) => {
    setActionLog(prev => [action, ...prev].slice(0, 5));
  };

  // Dashboard props with action logging
  const dashboardProps: DashboardProps = {
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
    ] as StatItem[],
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
    ] as Extension[],
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
    // Action handlers with logs
    onAddExtension: () => logAction('Add Extension clicked'),
    onManagePermissions: () => logAction('Manage Permissions clicked'),
    onUpdateAll: () => logAction('Update All clicked'),
    onConfigureExtension: (name: string) => logAction(`Configure ${name} clicked`),
    onActivateExtension: (name: string) => logAction(`Activate ${name} clicked`),
    onDeactivateExtension: (name: string) => logAction(`Deactivate ${name} clicked`),
    onSearch: (query: string) => logAction(`Search query: ${query}`),
    onToggleSystemStatus: () => logAction('System Status toggled'),
  };

  return (
    <div className="dashboard-demo-wrapper">
      {/* Action log overlay */}
      {actionLog.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 w-80">
          <h3 className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">Action Log:</h3>
          <ul className="text-xs space-y-1">
            {actionLog.map((action, i) => (
              <li key={i} className="py-1 border-b border-gray-100 dark:border-gray-700 last:border-0 text-gray-700 dark:text-gray-300">
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Main Dashboard Component */}
      <Dashboard {...dashboardProps} />
    </div>
  );
};

export default DashboardDemo; 
import React, { useState } from 'react';
import { Dashboard } from '../components';
import { UserManagement } from '../components';
import { ExtensionManagement } from '../components';
import { DashboardProps, StatItem, Extension } from '../components/Dashboard/types';
import { 
  Users, 
  FileText, 
  HardDrive, 
  Sprout, 
  Tractor, 
  BanknoteIcon, 
  Factory,
  Package
} from 'lucide-react';
import SystemMonitoringDemo from './SystemMonitoringDemo';
import Sidebar from '../components/Sidebar';
import ConfigurationManagementDemo from './ConfigurationManagementDemo';

/**
 * Dashboard Demonstration Component
 * 
 * This component provides a fully styled and interactive demonstration
 * of the Admin Dashboard component with integrated User Management.
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

// First, let's update the DashboardProps type to include our new property
// Somewhere in the top section after importing DashboardProps
// We'll create a custom extended interface for our demo
interface ExtendedDashboardProps extends DashboardProps {
  onNavigateToSystem?: () => void;
  onNavigateToConfig?: () => void;
}

// Create an interface for the extension objects being passed to callbacks
interface ExtensionItem {
  name: string;
  [key: string]: any;
}

const DashboardDemo: React.FC = () => {
  // Using state to track the current view
  const [view, setView] = useState<'dashboard' | 'users' | 'extensions' | 'system' | 'config'>('dashboard');
  const [actionLog, setActionLog] = useState<string[]>([]);
  
  // Log actions for demonstration
  const logAction = (action: string) => {
    console.log("Action:", action);
    setActionLog(prev => [action, ...prev].slice(0, 5));
  };

  // Add the onNavigateToConfig handler function
  const onNavigateToConfig = () => {
    setView('config');
    logAction('Navigated to Configuration Management');
  };

  // Dashboard props with action logging
  const dashboardProps: ExtendedDashboardProps = {
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
    onAddExtension: () => logAction('Extension added'),
    onManagePermissions: (name?: string) => logAction(`Managing permissions for: ${name || 'all'}`),
    onUpdateAll: () => logAction('Updating all extensions'),
    onConfigureExtension: (name: string) => logAction(`Configuring extension: ${name}`),
    onActivateExtension: (name: string) => logAction(`Activated extension: ${name}`),
    onDeactivateExtension: (name: string) => logAction(`Deactivated extension: ${name}`),
    onSearch: (query: string) => logAction(`Searching for: ${query}`),
    onToggleSystemStatus: () => logAction('Toggled system status'),
    // Navigation handler to User Management
    onNavigateToUsers: () => {
      setView('users');
      logAction('Navigated to User Management');
    },
    // Navigation handler to Extensions Management
    onNavigateToExtensions: () => {
      setView('extensions');
      logAction('Navigated to Extension Management');
    },
    // Add a new navigation handler for system monitoring
    onNavigateToSystem: () => {
      setView('system');
      logAction('Navigated to System Monitoring');
    },
    onNavigateToConfig: () => {
      setView('config');
      logAction('Navigated to Configuration Management');
    }
  };

  // User Management component with proper styling for consistency
  const renderUserManagement = () => {
    return (
      <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 flex" style={{ margin: 0, padding: 0 }}>
        {/* Sidebar - copy from Dashboard with Users highlighted instead of Dashboard */}
        <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white h-screen fixed left-0 top-0 overflow-y-auto">
          <div className="p-4 flex items-center space-x-2 border-b border-blue-500">
            <div className="w-10 h-10 bg-white text-blue-600 rounded-md flex items-center justify-center font-bold text-lg">
              BP
            </div>
            <span className="text-xl font-semibold">BizzyPerson</span>
          </div>
          
          <div className="p-5">
            <button className="w-full mb-7 bg-blue-500 hover:bg-blue-400 border-none shadow-md py-2.5 rounded text-white flex items-center justify-center">
              <Users className="mr-2 h-4 w-4" /> New Workspace
            </button>
            
            {/* CORE section */}
            <div className="mb-6">
              <button className="flex w-full items-center justify-between py-2 text-sm font-semibold text-blue-200 hover:text-white">
                <span className="uppercase tracking-wider text-base">CORE</span>
                <div className="shrink-0 text-blue-200 transition-transform duration-200 rotate-180" style={{ width: '16px', height: '16px' }}></div>
              </button>
              <div className="overflow-hidden transition-all duration-200 max-h-96">
                <ul className="space-y-1.5 mt-2.5">
                  <li className="px-3 py-2.5 rounded hover:bg-blue-500 cursor-pointer text-base flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-green-300" />
                    Notes
                  </li>
                  {/* Other core items... */}
                </ul>
              </div>
            </div>
            
            {/* ADMIN section - with Users highlighted */}
            <div className="mb-6">
              <button className="flex w-full items-center justify-between py-2 text-sm font-semibold text-blue-200 hover:text-white">
                <span className="uppercase tracking-wider text-base">ADMIN</span>
                <div className="shrink-0 text-blue-200 transition-transform duration-200 rotate-180" style={{ width: '16px', height: '16px' }}></div>
              </button>
              <div className="overflow-hidden transition-all duration-200 max-h-96">
                <ul className="space-y-1.5 mt-2.5">
                  <li 
                    className="px-3 py-2.5 rounded hover:bg-blue-500 cursor-pointer text-base flex items-center"
                    onClick={() => {
                      setView('dashboard');
                      logAction('Navigated to Dashboard');
                    }}
                  >
                    <div className="h-5 w-5 mr-3 text-blue-300" />
                    Dashboard
                  </li>
                  <li 
                    className="px-3 py-2.5 rounded bg-blue-800 border-l-4 border-blue-300 cursor-pointer text-base flex items-center font-medium"
                  >
                    <Users className="h-5 w-5 mr-3 text-pink-300" />
                    Users
                  </li>
                  <li 
                    className="px-3 py-2.5 rounded hover:bg-blue-500 cursor-pointer text-base flex items-center"
                    onClick={() => {
                      setView('extensions');
                      logAction('Navigated to Extensions');
                    }}
                  >
                    <Package className="h-5 w-5 mr-3 text-orange-300" />
                    Extensions
                  </li>
                  {/* Other admin items... */}
                </ul>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div style={{ marginLeft: '16rem', width: 'calc(100% - 16rem)' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg">
            <div className="px-6 sm:px-8 lg:px-10">
              <div className="flex items-center justify-between py-5">
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <span className="bg-white text-blue-600 px-3 py-1 rounded-md mr-3">BizzyPerson</span>
                  User Management
                </h1>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="py-7 px-6 sm:px-8 lg:px-10">
            <UserManagement />
          </div>
        </div>
      </div>
    );
  };

  // Extensions Management component with proper styling for consistency
  const renderExtensionsManagement = () => {
    return (
      <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 flex" style={{ margin: 0, padding: 0 }}>
        {/* Sidebar - copy from Dashboard with Extensions highlighted */}
        <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white h-screen fixed left-0 top-0 overflow-y-auto">
          <div className="p-4 flex items-center space-x-2 border-b border-blue-500">
            <div className="w-10 h-10 bg-white text-blue-600 rounded-md flex items-center justify-center font-bold text-lg">
              BP
            </div>
            <span className="text-xl font-semibold">BizzyPerson</span>
          </div>
          
          <div className="p-5">
            <button className="w-full mb-7 bg-blue-500 hover:bg-blue-400 border-none shadow-md py-2.5 rounded text-white flex items-center justify-center">
              <Users className="mr-2 h-4 w-4" /> New Workspace
            </button>
            
            {/* CORE section */}
            <div className="mb-6">
              <button className="flex w-full items-center justify-between py-2 text-sm font-semibold text-blue-200 hover:text-white">
                <span className="uppercase tracking-wider text-base">CORE</span>
                <div className="shrink-0 text-blue-200 transition-transform duration-200 rotate-180" style={{ width: '16px', height: '16px' }}></div>
              </button>
              <div className="overflow-hidden transition-all duration-200 max-h-96">
                <ul className="space-y-1.5 mt-2.5">
                  <li className="px-3 py-2.5 rounded hover:bg-blue-500 cursor-pointer text-base flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-green-300" />
                    Notes
                  </li>
                  {/* Other core items... */}
                </ul>
              </div>
            </div>
            
            {/* ADMIN section - with Extensions highlighted */}
            <div className="mb-6">
              <button className="flex w-full items-center justify-between py-2 text-sm font-semibold text-blue-200 hover:text-white">
                <span className="uppercase tracking-wider text-base">ADMIN</span>
                <div className="shrink-0 text-blue-200 transition-transform duration-200 rotate-180" style={{ width: '16px', height: '16px' }}></div>
              </button>
              <div className="overflow-hidden transition-all duration-200 max-h-96">
                <ul className="space-y-1.5 mt-2.5">
                  <li 
                    className="px-3 py-2.5 rounded hover:bg-blue-500 cursor-pointer text-base flex items-center"
                    onClick={() => {
                      setView('dashboard');
                      logAction('Navigated to Dashboard');
                    }}
                  >
                    <div className="h-5 w-5 mr-3 text-blue-300" />
                    Dashboard
                  </li>
                  <li 
                    className="px-3 py-2.5 rounded hover:bg-blue-500 cursor-pointer text-base flex items-center"
                    onClick={() => {
                      setView('users');
                      logAction('Navigated to User Management');
                    }}
                  >
                    <Users className="h-5 w-5 mr-3 text-pink-300" />
                    Users
                  </li>
                  <li 
                    className="px-3 py-2.5 rounded bg-blue-800 border-l-4 border-blue-300 cursor-pointer text-base flex items-center font-medium"
                  >
                    <Package className="h-5 w-5 mr-3 text-orange-300" />
                    Extensions
                  </li>
                  {/* Other admin items... */}
                </ul>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div style={{ marginLeft: '16rem', width: 'calc(100% - 16rem)' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg">
            <div className="px-6 sm:px-8 lg:px-10">
              <div className="flex items-center justify-between py-5">
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <span className="bg-white text-blue-600 px-3 py-1 rounded-md mr-3">BizzyPerson</span>
                  Extension Management
                </h1>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="py-7 px-6 sm:px-8 lg:px-10">
            <ExtensionManagement 
              extensions={dashboardProps.extensions as any[]}
              onAddExtension={() => logAction('Extension added')}
              onActivateExtension={(ext: ExtensionItem) => logAction(`Activated extension: ${ext.name}`)}
              onDeactivateExtension={(ext: ExtensionItem) => logAction(`Deactivated extension: ${ext.name}`)}
              onUninstallExtension={(ext: ExtensionItem) => logAction(`Uninstalled extension: ${ext.name}`)}
              onUpdateExtension={(ext: ExtensionItem) => logAction(`Updated extension: ${ext.name}`)}
              onConfigureExtension={(ext: ExtensionItem) => logAction(`Configured extension: ${ext.name}`)}
              onManagePermissions={(ext: ExtensionItem) => logAction(`Managed permissions for: ${ext.name}`)}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Shared sidebar for all views */}
      <Sidebar 
        currentView={view}
        onNavigateToDashboard={() => setView('dashboard')}
        onNavigateToUsers={() => setView('users')}
        onNavigateToExtensions={() => setView('extensions')}
        onNavigateToSystem={() => setView('system')}
        onNavigateToConfig={() => setView('config')}
      />
      
      {/* Main content area */}
      <main className="ml-64 w-full">
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
        
        {/* Render the appropriate content based on view state */}
        {view === 'dashboard' ? (
          <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg">
              <div className="px-6 sm:px-8 lg:px-10">
                <div className="flex items-center justify-between py-5">
                  <h1 className="text-2xl font-bold text-white flex items-center">
                    <span className="bg-white text-blue-600 px-3 py-1 rounded-md mr-3">BizzyPerson</span>
                    Admin Dashboard
                  </h1>
                  {/* Search box and other header elements */}
                  <div className="flex items-center space-x-3">
                    {/* ... */}
                  </div>
                </div>
              </div>
            </div>
            {/* Dashboard content */}
            <div className="py-7 px-6 sm:px-8 lg:px-10">
              <Dashboard {...dashboardProps} />
            </div>
          </div>
        ) : view === 'users' ? (
          <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg">
              <div className="px-6 sm:px-8 lg:px-10">
                <div className="flex items-center justify-between py-5">
                  <h1 className="text-2xl font-bold text-white flex items-center">
                    <span className="bg-white text-blue-600 px-3 py-1 rounded-md mr-3">BizzyPerson</span>
                    User Management
                  </h1>
                  {/* Search box and other header elements */}
                  <div className="flex items-center space-x-3">
                    {/* ... */}
                  </div>
                </div>
              </div>
            </div>
            {/* User Management content */}
            <div className="py-7 px-6 sm:px-8 lg:px-10">
              {renderUserManagement()}
            </div>
          </div>
        ) : view === 'extensions' ? (
          <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg">
              <div className="px-6 sm:px-8 lg:px-10">
                <div className="flex items-center justify-between py-5">
                  <h1 className="text-2xl font-bold text-white flex items-center">
                    <span className="bg-white text-blue-600 px-3 py-1 rounded-md mr-3">BizzyPerson</span>
                    Extension Management
                  </h1>
                  {/* Search box and other header elements */}
                  <div className="flex items-center space-x-3">
                    {/* ... */}
                  </div>
                </div>
              </div>
            </div>
            {/* Extension Management content */}
            <div className="py-7 px-6 sm:px-8 lg:px-10">
              {renderExtensionsManagement()}
            </div>
          </div>
        ) : view === 'system' ? (
          <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg">
              <div className="px-6 sm:px-8 lg:px-10">
                <div className="flex items-center justify-between py-5">
                  <h1 className="text-2xl font-bold text-white flex items-center">
                    <span className="bg-white text-blue-600 px-3 py-1 rounded-md mr-3">BizzyPerson</span>
                    System Monitoring
                  </h1>
                  {/* Search box and other header elements */}
                  <div className="flex items-center space-x-3">
                    {/* ... */}
                  </div>
                </div>
              </div>
            </div>
            {/* System Monitoring content */}
            <div className="py-7 px-6 sm:px-8 lg:px-10">
              <SystemMonitoringDemo 
                onNavigateToDashboard={() => setView('dashboard')}
                onNavigateToUsers={() => setView('users')}
                onNavigateToExtensions={() => setView('extensions')}
              />
            </div>
          </div>
        ) : view === 'config' ? (
          <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg">
              <div className="px-6 sm:px-8 lg:px-10">
                <div className="flex items-center justify-between py-5">
                  <h1 className="text-2xl font-bold text-white flex items-center">
                    <span className="bg-white text-blue-600 px-3 py-1 rounded-md mr-3">BizzyPerson</span>
                    Configuration Management
                  </h1>
                  {/* Search box and other header elements */}
                  <div className="flex items-center space-x-3">
                    {/* ... */}
                  </div>
                </div>
              </div>
            </div>
            {/* Config content */}
            <div className="py-7 px-6 sm:px-8 lg:px-10">
              <ConfigurationManagementDemo />
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default DashboardDemo; 
import React, { useState, useEffect } from 'react';
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
  Package,
  MessageSquare
} from 'lucide-react';
import SystemMonitoringDemo from './SystemMonitoringDemo';
import Sidebar from '../components/Sidebar';
import ConfigurationManagementDemo from './ConfigurationManagementDemo';
import { NotesPage } from '../../notes';
// Import the components but not the full ChatPage
import { ChatPage } from '../../chat/components/ChatPage';

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
  onNavigateToNotes?: () => void;
}

// Create an interface for the extension objects being passed to callbacks
interface ExtensionItem {
  name: string;
  [key: string]: any;
}

const DashboardDemo: React.FC = () => {
  // Using state to track the current view
  const [view, setView] = useState<'dashboard' | 'users' | 'extensions' | 'system' | 'config' | 'notes' | 'chat'>('dashboard');
  // Add a "last view" state to track where we came from
  const [previousView, setPreviousView] = useState<string>('dashboard');
  const [actionLog, setActionLog] = useState<string[]>([]);
  
  // Add effect to monitor view changes
  useEffect(() => {
    console.log('View changed to:', view, 'from', previousView);
    // This will help us debug if the state is actually changing
  }, [view, previousView]);
  
  // Log actions for demonstration
  const logAction = (action: string) => {
    console.log("Action:", action);
    setActionLog(prev => [action, ...prev].slice(0, 5));
  };

  // Modified navigation function that updates both current and previous view
  const navigateTo = (newView: 'dashboard' | 'users' | 'extensions' | 'system' | 'config' | 'notes' | 'chat') => {
    setPreviousView(view); // Store the current view before changing
    setView(newView);      // Change to new view
    logAction(`Navigated to ${newView}`);
  };

  // Add the onNavigateToConfig handler function
  const onNavigateToConfig = () => {
    navigateTo('config');
  };

  // Add the onNavigateToNotes handler function
  const onNavigateToNotes = () => {
    navigateTo('notes');
  };

  // Special handler for chat that handles the Dashboard → Chat case
  const onNavigateToChat = () => {
    // If coming from dashboard, we need to "reset" something
    if (view === 'dashboard') {
      // This is the key fix - force a reset of any state that might be causing the issue
      console.log('Navigating from dashboard to chat via multi-step reset...');
      
      // First set to notes (which seems to work as an intermediary)
      setPreviousView('notes');
      setView('notes');
      
      // Then quickly transition to chat after a brief delay
      setTimeout(() => {
        setPreviousView('notes');
        setView('chat');
        logAction('Navigated to chat via reset sequence');
      }, 50);
    } else {
      // Normal navigation for other cases
      navigateTo('chat');
    }
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
        icon: <HardDrive className="text-amber-500" />,
        value: '1.2 TB',
        label: 'Storage Used',
        change: {
          value: 0.2,
          type: 'increase',
          period: 'this month',
        },
      },
    ],
    recentActivity: [
      {
        user: 'John Doe',
        action: 'Added new document: Farm_Report_2023.pdf',
        timestamp: '2 hours ago',
      },
      {
        user: 'Jane Smith',
        action: 'Created workspace: "Crop Planning 2024"',
        timestamp: '3 hours ago',
      },
      {
        user: 'Bob Johnson',
        action: 'Updated vector database settings',
        timestamp: '5 hours ago',
      },
      {
        user: 'Alice Williams',
        action: 'Invited 3 new users',
        timestamp: '1 day ago',
      },
      {
        user: 'System',
        action: 'Scheduled maintenance completed',
        timestamp: '1 day ago',
      },
    ],
    extensions: [
      {
        id: '1',
        name: 'BizzyFarmer',
        description: 'Agricultural management extension with field mapping, crop planning, and yield tracking',
        author: 'BizzyPerson Team',
        version: '1.2.0',
        icon: <Tractor className="text-green-600" />,
        isActive: true,
      },
      {
        id: '2',
        name: 'Inventory Manager',
        description: 'Track inventory, manage suppliers, and automate ordering processes',
        author: 'Supply Chain Solutions',
        version: '0.9.5',
        icon: <BanknoteIcon className="text-blue-600" />,
        isActive: true,
      },
      {
        id: '3',
        name: 'Manufacturing Suite',
        description: 'Production scheduling, quality control, and equipment maintenance tools',
        author: 'Industrial Systems Inc.',
        version: '1.0.1',
        icon: <Factory className="text-gray-600" />,
        isActive: true,
      },
      {
        id: '4',
        name: 'Sales Pipeline',
        description: 'Customer relationship management and sales forecasting',
        author: 'Growth Tools LLC',
        version: '2.1.3',
        icon: <HardDrive className="text-purple-600" />,
        isActive: false,
      },
    ],
    onExtensionClick: (extension: Extension) => {
      logAction(`Clicked on extension: ${extension.name}`);
    },
    onExtensionToggle: (extension: Extension, newState: boolean) => {
      logAction(`${newState ? 'Activated' : 'Deactivated'} extension: ${extension.name}`);
    },
    onNavigateToUsers: () => {
      navigateTo('users');
    },
    onNavigateToExtensions: () => {
      navigateTo('extensions');
    },
    onNavigateToSystem: () => {
      navigateTo('system');
    },
    onNavigateToConfig: () => {
      navigateTo('config');
    },
    onNavigateToNotes: () => {
      navigateTo('notes');
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
                  <li 
                    className="px-3 py-2.5 rounded hover:bg-blue-500 cursor-pointer text-base flex items-center"
                    onClick={() => {
                      setView('notes');
                    }}
                  >
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
                  <li 
                    className="px-3 py-2.5 rounded hover:bg-blue-500 cursor-pointer text-base flex items-center"
                    onClick={() => {
                      setView('notes');
                    }}
                  >
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
                    }}
                  >
                    <div className="h-5 w-5 mr-3 text-blue-300" />
                    Dashboard
                  </li>
                  <li 
                    className="px-3 py-2.5 rounded hover:bg-blue-500 cursor-pointer text-base flex items-center"
                    onClick={() => {
                      setView('users');
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
                {/* Search box and other header elements */}
                <div className="flex items-center space-x-3">
                  {/* ... */}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="py-7 px-6 sm:px-8 lg:px-10">
            <ExtensionManagement 
              extensions={dashboardProps.extensions as any[]}
              onExtensionConfigClick={(name) => logAction(`Configuring extension: ${name}`)}
              onExtensionToggle={(name, isActive) => logAction(`Set extension ${name} to ${isActive ? 'active' : 'inactive'}`)}
              onExtensionAddClick={() => logAction('Clicked Add Extension')}
            />
          </div>
        </div>
      </div>
    );
  };

  // Notes Management component with proper styling for consistency
  const renderNotesManagement = () => {
    console.log('Rendering notes management');
    return (
      <NotesPage />
    );
  };

  // Chat Management component with proper styling for consistency
  const renderChatManagement = () => {
    console.log('Rendering chat management from external component');
    
    // Return our external component instead of the inline one
    return (
      <div className="w-full h-full">
        <ChatPage />
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Shared sidebar for all views */}
      <Sidebar 
        currentView={view}
        onNavigateToDashboard={() => navigateTo('dashboard')}
        onNavigateToUsers={() => navigateTo('users')}
        onNavigateToExtensions={() => navigateTo('extensions')}
        onNavigateToSystem={() => navigateTo('system')}
        onNavigateToConfig={() => navigateTo('config')}
        onNavigateToNotes={() => navigateTo('notes')}
        onNavigateToChat={onNavigateToChat}
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
        
        {/* Render the appropriate content based on view state - with more explicit conditionals */}
        {view === 'dashboard' && (
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
        )}
        
        {view === 'users' && (
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
        )}
        
        {view === 'extensions' && (
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
        )}
        
        {view === 'system' && (
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
                onNavigateToDashboard={() => navigateTo('dashboard')}
                onNavigateToUsers={() => navigateTo('users')}
                onNavigateToExtensions={() => navigateTo('extensions')}
              />
            </div>
          </div>
        )}
        
        {view === 'config' && (
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
        )}
        
        {view === 'notes' && (
          <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg">
              <div className="px-6 sm:px-8 lg:px-10">
                <div className="flex items-center justify-between py-5">
                  <h1 className="text-2xl font-bold text-white flex items-center">
                    <span className="bg-white text-blue-600 px-3 py-1 rounded-md mr-3">BizzyPerson</span>
                    Notes
                  </h1>
                  {/* Search box and other header elements */}
                  <div className="flex items-center space-x-3">
                    {/* ... */}
                  </div>
                </div>
              </div>
            </div>
            {/* Notes content */}
            <div className="py-7 px-6 sm:px-8 lg:px-10">
              {renderNotesManagement()}
            </div>
          </div>
        )}
        
        {view === 'chat' && (
          <div key={`chat-view-container-${Date.now()}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg">
              <div className="px-6 sm:px-8 lg:px-10">
                <div className="flex items-center justify-between py-5">
                  <h1 className="text-2xl font-bold text-white flex items-center">
                    <span className="bg-white text-blue-600 px-3 py-1 rounded-md mr-3">BizzyPerson</span>
                    Chat
                  </h1>
                  {/* Search box and other header elements */}
                  <div className="flex items-center space-x-3">
                    {/* ... */}
                  </div>
                </div>
              </div>
            </div>
            {/* Chat content */}
            <div className="py-7 px-6 sm:px-8 lg:px-10">
              {renderChatManagement()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardDemo; 
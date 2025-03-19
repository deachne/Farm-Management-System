import React, { useState } from 'react';
import { Button } from '../../../shared/ui/components/Button';
import { Input } from '../../../shared/ui/components/Input';
import { Card, CardContent } from '../../../shared/ui/components/Card';
import { DashboardProps } from './types';
import StatCard from '../StatCard';
import ExtensionCard from '../ExtensionCard';
import SystemStatus from '../SystemStatus';
import { 
  Search, 
  BarChart2, 
  X, 
  Plus, 
  Settings, 
  RefreshCw, 
  ChevronDown,
  FileText,
  Folder,
  CheckSquare,
  MessageSquare,
  LayoutDashboard,
  Users,
  Package,
  Server,
  BarChart
} from 'lucide-react';

const Dashboard: React.FC<DashboardProps> = ({
  stats,
  extensions,
  systemStatus,
  onAddExtension,
  onManagePermissions,
  onUpdateAll,
  onConfigureExtension,
  onActivateExtension,
  onDeactivateExtension,
  onSearch,
  onToggleSystemStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSystemStatus, setShowSystemStatus] = useState(false);
  const [coreOpen, setCoreOpen] = useState(true);
  const [adminOpen, setAdminOpen] = useState(true);
  const [extensionsOpen, setExtensionsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const toggleSystemStatus = () => {
    setShowSystemStatus(!showSystemStatus);
    onToggleSystemStatus?.();
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 flex dashboard">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white h-screen fixed left-0 top-0 overflow-y-auto border-r border-blue-700">
        <div className="p-4 flex items-center space-x-2 border-b border-blue-500">
          <div className="w-10 h-10 bg-white text-blue-600 rounded-md flex items-center justify-center font-bold text-lg">
            BP
          </div>
          <span className="text-xl font-semibold">BizzyPerson</span>
        </div>
        
        <div className="p-5">
          <Button variant="primary" className="w-full mb-7 bg-blue-500 hover:bg-blue-400 border-none shadow-md py-2.5">
            <Plus className="mr-2 h-4 w-4" /> New Workspace
          </Button>
          
          <div className="mb-6">
            <button
              onClick={() => setCoreOpen(!coreOpen)}
              className="flex w-full items-center justify-between py-2 text-sm font-semibold text-blue-200 hover:text-white"
            >
              <span className="uppercase tracking-wider text-base">CORE</span>
              <ChevronDown 
                size={16}
                className={`shrink-0 text-blue-200 transition-transform duration-200 ${
                  coreOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                coreOpen ? "max-h-96" : "max-h-0"
              }`}
            >
              <ul className="space-y-1.5 mt-2.5">
                <li className="px-3 py-2.5 rounded hover:bg-blue-500 cursor-pointer text-base flex items-center">
                  <FileText className="h-5 w-5 mr-3 text-green-300" />
                  Notes
                </li>
                <li className="px-3 py-2.5 rounded hover:bg-blue-500 cursor-pointer text-base flex items-center">
                  <Folder className="h-5 w-5 mr-3 text-yellow-300" />
                  Documents
                </li>
                <li className="px-3 py-2.5 rounded hover:bg-blue-500 cursor-pointer text-base flex items-center">
                  <CheckSquare className="h-5 w-5 mr-3 text-purple-300" />
                  Tasks
                </li>
                <li className="px-3 py-2.5 rounded hover:bg-blue-500 cursor-pointer text-base flex items-center">
                  <MessageSquare className="h-5 w-5 mr-3 text-cyan-300" />
                  Chat
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mb-6">
            <button
              onClick={() => setAdminOpen(!adminOpen)}
              className="flex w-full items-center justify-between py-2 text-sm font-semibold text-blue-200 hover:text-white"
            >
              <span className="uppercase tracking-wider text-base">ADMIN</span>
              <ChevronDown 
                size={16}
                className={`shrink-0 text-blue-200 transition-transform duration-200 ${
                  adminOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                adminOpen ? "max-h-96" : "max-h-0"
              }`}
            >
              <ul className="space-y-1.5 mt-2.5">
                <li className="px-3 py-2.5 rounded bg-blue-800 border-l-4 border-blue-300 cursor-pointer text-base flex items-center font-medium">
                  <LayoutDashboard className="h-5 w-5 mr-3 text-blue-300" />
                  Dashboard
                </li>
                <li className="px-3 py-2.5 rounded hover:bg-blue-500 cursor-pointer text-base flex items-center">
                  <Users className="h-5 w-5 mr-3 text-pink-300" />
                  Users
                </li>
                <li className="px-3 py-2.5 rounded hover:bg-blue-500 cursor-pointer text-base flex items-center">
                  <Package className="h-5 w-5 mr-3 text-orange-300" />
                  Extensions
                </li>
                <li className="px-3 py-2.5 rounded hover:bg-blue-500 cursor-pointer text-base flex items-center">
                  <Server className="h-5 w-5 mr-3 text-indigo-300" />
                  System
                </li>
                <li className="px-3 py-2.5 rounded hover:bg-blue-500 cursor-pointer text-base flex items-center">
                  <BarChart className="h-5 w-5 mr-3 text-teal-300" />
                  Analytics
                </li>
              </ul>
            </div>
          </div>
          
          <div>
            <button
              onClick={() => setExtensionsOpen(!extensionsOpen)}
              className="flex w-full items-center justify-between py-2 text-sm font-semibold text-blue-200 hover:text-white"
            >
              <span className="uppercase tracking-wider text-base">EXTENSIONS</span>
              <ChevronDown 
                size={16}
                className={`shrink-0 text-blue-200 transition-transform duration-200 ${
                  extensionsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                extensionsOpen ? "max-h-96" : "max-h-0"
              }`}
            >
              <ul className="space-y-1.5 mt-2.5">
                {extensions.map((ext, idx) => (
                  <li key={idx} className="px-3 py-2.5 rounded hover:bg-blue-500 cursor-pointer text-base flex items-center">
                    <div className="mr-3">{ext.icon}</div>
                    <span>{ext.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 w-full pl-8 pr-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg">
          <div className="px-6 sm:px-8 lg:px-10">
            <div className="flex items-center justify-between py-5">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <span className="bg-white text-blue-600 px-3 py-1 rounded-md mr-3">BizzyPerson</span>
                Admin Dashboard
              </h1>
              <div className="flex items-center space-x-3">
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="text"
                    placeholder="Search admin..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-10 py-2 border border-blue-300 dark:border-blue-700 rounded-md"
                  />
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                </form>
                <Button
                  variant="outline"
                  onClick={toggleSystemStatus}
                  className="ml-2 py-2 bg-white text-blue-600 border border-blue-300 hover:bg-blue-50 transition-colors"
                  aria-label="Toggle System Status"
                >
                  <BarChart2 className="h-5 w-5 mr-2" />
                  System Status
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 sm:px-8 lg:px-10 py-7">
          {/* System Overview */}
          <section className="mb-10">
            <div className="mb-5 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
              <h3 className="text-blue-700 font-medium">Dashboard UI Updated!</h3>
              <p className="text-blue-600">New design with enhanced visuals and better user experience.</p>
            </div>
            
            <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
              System Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                  <CardContent className="p-5">
                    <StatCard
                      icon={stat.icon}
                      value={stat.value}
                      label={stat.label}
                      change={stat.change}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Extension Management */}
          <section>
            <div className="flex justify-between items-center mb-5 border-b pb-2 border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Extension Management
              </h2>
              <div className="flex space-x-3">
                <Button variant="primary" className="bg-blue-700 hover:bg-blue-800 transition-colors shadow-md py-2 px-4" onClick={onAddExtension}>
                  <Plus className="h-5 w-5 mr-2" />
                  Add Extension
                </Button>
                <Button variant="outline" className="border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors py-2 px-4" onClick={onManagePermissions}>
                  <Settings className="h-5 w-5 mr-2" />
                  Manage Permissions
                </Button>
                <Button variant="outline" className="border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors py-2 px-4" onClick={onUpdateAll}>
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Update All
                </Button>
              </div>
            </div>
            <div className="space-y-5">
              {extensions.map((extension, index) => (
                <ExtensionCard
                  key={index}
                  name={extension.name}
                  icon={extension.icon}
                  version={extension.version}
                  status={extension.status}
                  permissions={extension.permissions}
                  resources={extension.resources}
                  onConfigure={() => onConfigureExtension?.(extension.name)}
                  onActivate={() => onActivateExtension?.(extension.name)}
                  onDeactivate={() => onDeactivateExtension?.(extension.name)}
                />
              ))}
            </div>
          </section>
          
          {/* New Footer Section */}
          <section className="mt-12 -mx-6 sm:-mx-8 lg:-mx-10 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-lg shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold mb-1">BizzyPerson UI Updated</h2>
                <p className="text-blue-100">Improve your workspace experience with our new dashboard design</p>
              </div>
              <Button
                variant="outline"
                className="bg-white text-blue-600 hover:bg-blue-50 border-none px-6 py-2 font-medium"
              >
                Learn More
              </Button>
            </div>
          </section>
        </div>
      </main>

      {/* System Status Panel */}
      {showSystemStatus && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md z-50 transform transition-all ease-in-out duration-300 shadow-2xl">
          <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
            <SystemStatus
              isOperational={systemStatus.isOperational}
              lastUpdated={systemStatus.lastUpdated}
              services={systemStatus.services}
              incidents={systemStatus.incidents}
              onClose={toggleSystemStatus}
            />
          </div>
        </div>
      )}

      {/* Toast notification for system actions */}
      <div className="fixed bottom-0 right-0 m-6 pointer-events-none z-50 transition-opacity duration-500 opacity-0">
        <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center">
          <div className="mr-3">
            <X className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">Action completed successfully</p>
            <p className="text-sm opacity-90">Your changes have been saved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

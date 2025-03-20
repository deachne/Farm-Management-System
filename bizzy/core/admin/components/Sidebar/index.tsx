import React, { useState } from 'react';
import { Button } from '../../../shared/ui/components/Button';
import { 
  Plus, 
  ChevronDown,
  FileText,
  Folder,
  CheckSquare,
  MessageSquare,
  LayoutDashboard,
  Users,
  Package,
  Server,
  BarChart,
  Settings
} from 'lucide-react';

export interface SidebarProps {
  currentView: 'dashboard' | 'users' | 'extensions' | 'system' | 'config';
  onNavigateToDashboard: () => void;
  onNavigateToUsers: () => void;
  onNavigateToExtensions: () => void;
  onNavigateToSystem: () => void;
  onNavigateToConfig: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigateToDashboard,
  onNavigateToUsers,
  onNavigateToExtensions,
  onNavigateToSystem,
  onNavigateToConfig
}) => {
  const [coreOpen, setCoreOpen] = useState(true);
  const [adminOpen, setAdminOpen] = useState(true);
  const [extensionsOpen, setExtensionsOpen] = useState(false);

  return (
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
              <li 
                className={`px-3 py-2.5 rounded cursor-pointer text-base flex items-center ${currentView === 'dashboard' ? 'bg-blue-800 border-l-4 border-blue-300 font-medium' : 'hover:bg-blue-500'}`}
                onClick={onNavigateToDashboard}
              >
                <LayoutDashboard className="h-5 w-5 mr-3 text-blue-300" />
                Dashboard
              </li>
              <li 
                className={`px-3 py-2.5 rounded cursor-pointer text-base flex items-center ${currentView === 'users' ? 'bg-blue-800 border-l-4 border-blue-300 font-medium' : 'hover:bg-blue-500'}`}
                onClick={onNavigateToUsers}
              >
                <Users className="h-5 w-5 mr-3 text-pink-300" />
                Users
              </li>
              <li 
                className={`px-3 py-2.5 rounded cursor-pointer text-base flex items-center ${currentView === 'extensions' ? 'bg-blue-800 border-l-4 border-blue-300 font-medium' : 'hover:bg-blue-500'}`}
                onClick={onNavigateToExtensions}
              >
                <Package className="h-5 w-5 mr-3 text-orange-300" />
                Extensions
              </li>
              <li 
                className={`px-3 py-2.5 rounded cursor-pointer text-base flex items-center ${currentView === 'system' ? 'bg-blue-800 border-l-4 border-blue-300 font-medium' : 'hover:bg-blue-500'}`}
                onClick={onNavigateToSystem}
              >
                <Server className="h-5 w-5 mr-3 text-indigo-300" />
                System
              </li>
              <li 
                className={`px-3 py-2.5 rounded cursor-pointer text-base flex items-center ${currentView === 'config' ? 'bg-blue-800 border-l-4 border-blue-300 font-medium' : 'hover:bg-blue-500'}`}
                onClick={onNavigateToConfig}
              >
                <Settings className="h-5 w-5 mr-3 text-teal-300" />
                Configuration
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
              <li className="px-3 py-2.5 rounded hover:bg-blue-500 cursor-pointer text-base flex items-center">
                <span className="mr-3 text-green-300">🚜</span>
                Farm Management
              </li>
              <li className="px-3 py-2.5 rounded hover:bg-blue-500 cursor-pointer text-base flex items-center">
                <span className="mr-3 text-yellow-300">💰</span>
                BizzyBank
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 
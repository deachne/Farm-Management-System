import React from 'react';
import { 
  User, 
  Settings, 
  MessageSquare, 
  Brain, 
  Box, 
  Sparkles 
} from 'lucide-react';
import { SettingsPanelType } from './UnifiedSettingsContainer';
import { cn } from '../../utils/cn';

interface SettingsNavProps {
  activePanel: SettingsPanelType;
  onPanelChange: (panel: SettingsPanelType) => void;
  isSmallScreen: boolean;
}

interface NavItem {
  id: SettingsPanelType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const SettingsNav: React.FC<SettingsNavProps> = ({ 
  activePanel, 
  onPanelChange,
  isSmallScreen 
}) => {
  const navItems: NavItem[] = [
    {
      id: SettingsPanelType.USER,
      label: 'User Settings',
      icon: <User className="w-5 h-5" />,
      description: 'User profile, account, and preferences'
    },
    {
      id: SettingsPanelType.SYSTEM,
      label: 'System',
      icon: <Settings className="w-5 h-5" />,
      description: 'System configuration and API keys'
    },
    {
      id: SettingsPanelType.CHAT,
      label: 'Chat Experience',
      icon: <MessageSquare className="w-5 h-5" />,
      description: 'Chat behavior and model settings'
    },
    {
      id: SettingsPanelType.AI,
      label: 'AI Configuration',
      icon: <Brain className="w-5 h-5" />,
      description: 'Embedding, retrieval, and knowledge base settings'
    },
    {
      id: SettingsPanelType.EXTENSIONS,
      label: 'Extensions',
      icon: <Box className="w-5 h-5" />,
      description: 'Extension and plugin management'
    },
    {
      id: SettingsPanelType.ADVANCED,
      label: 'Advanced Features',
      icon: <Sparkles className="w-5 h-5" />,
      description: 'Beta features and experimental settings'
    }
  ];

  // If small screen, render a dropdown or horizontal tabs instead of sidebar
  if (isSmallScreen) {
    return (
      <div className="w-full border-b border-theme-sidebar-border pb-2 mb-4">
        <select 
          className="w-full p-2 bg-theme-bg-secondary text-theme-text-primary border border-theme-sidebar-border rounded-md"
          value={activePanel}
          onChange={(e) => onPanelChange(e.target.value as SettingsPanelType)}
        >
          {navItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // On larger screens, render a sidebar
  return (
    <div className="w-64 border-r border-theme-sidebar-border overflow-y-auto">
      <nav className="p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onPanelChange(item.id)}
                className={cn(
                  'w-full flex items-center p-3 rounded-md transition-colors hover:bg-theme-bg-hover group',
                  activePanel === item.id 
                    ? 'bg-theme-bg-hover text-theme-text-primary' 
                    : 'text-theme-text-secondary'
                )}
                aria-current={activePanel === item.id ? 'page' : undefined}
              >
                <span className="mr-3">{item.icon}</span>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs text-theme-text-tertiary group-hover:text-theme-text-secondary">
                    {item.description}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SettingsNav; 
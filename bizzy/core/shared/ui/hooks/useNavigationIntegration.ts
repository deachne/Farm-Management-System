import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useThemeIntegration } from './useThemeIntegration';
import type { NavSectionProps } from '../components/UnifiedNavigation';

// Standard icons to be used across both systems - can be moved to a separate file later
import {
  SquaresFour,
  Plus,
  Gear,
  Globe,
  Database,
  Brain,
  ChatText,
  File,
  Users,
  BookOpen,
  Info,
} from '@phosphor-icons/react';

interface NavigationIntegrationResult {
  anythingLLMSections: NavSectionProps[];
  libreChatSections: NavSectionProps[];
  activePath: string;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  onNavigate: (path: string) => void;
}

/**
 * Hook that integrates navigation items from AnythingLLM and LibreChat
 * @returns Integrated navigation sections for both systems
 */
export const useNavigationIntegration = (): NavigationIntegrationResult => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useThemeIntegration();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [anythingLLMSections, setAnythingLLMSections] = useState<NavSectionProps[]>([]);
  const [libreChatSections, setLibreChatSections] = useState<NavSectionProps[]>([]);

  // Toggle sidebar collapse state
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    localStorage.setItem('sidebarCollapsed', String(!isCollapsed));
  };

  // Handle navigation between different features
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Initialize collapsed state from localStorage
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsed !== null) {
      setIsCollapsed(savedCollapsed === 'true');
    }
  }, []);

  // Load AnythingLLM navigation items
  useEffect(() => {
    // These would typically come from an API or another source
    // For now, we're hardcoding some example items
    const workspaceSection: NavSectionProps = {
      title: 'Workspaces',
      items: [
        {
          id: 'new-workspace',
          title: 'New Workspace',
          icon: <Plus className="h-5 w-5" />,
          href: '/workspaces/new',
        },
        {
          id: 'your-workspaces',
          title: 'Your Workspaces',
          icon: <SquaresFour className="h-5 w-5" />,
          href: '/workspaces',
        },
      ],
      collapsible: true,
      defaultExpanded: true,
    };

    const settingsSection: NavSectionProps = {
      title: 'Settings',
      items: [
        {
          id: 'general-settings',
          title: 'General Settings',
          icon: <Gear className="h-5 w-5" />,
          href: '/settings/general',
          subItems: [
            {
              id: 'llm-preference',
              title: 'LLM Preference',
              icon: <Brain className="h-4 w-4" />,
              href: '/settings/llm-preference',
            },
            {
              id: 'vector-database',
              title: 'Vector Database',
              icon: <Database className="h-4 w-4" />,
              href: '/settings/vector-database',
            },
          ],
        },
        {
          id: 'user-management',
          title: 'User Management',
          icon: <Users className="h-5 w-5" />,
          href: '/settings/users',
        },
      ],
      collapsible: true,
      defaultExpanded: false,
    };

    setAnythingLLMSections([workspaceSection, settingsSection]);
  }, []);

  // Load LibreChat navigation items
  useEffect(() => {
    // These would typically come from an API or another source
    // For now, we're hardcoding some example items
    const chatSection: NavSectionProps = {
      title: 'Chat',
      items: [
        {
          id: 'new-chat',
          title: 'New Chat',
          icon: <ChatText className="h-5 w-5" />,
          href: '/chat/new',
        },
        {
          id: 'saved-chats',
          title: 'Saved Chats',
          icon: <BookOpen className="h-5 w-5" />,
          href: '/chat/history',
        },
      ],
      collapsible: true,
      defaultExpanded: true,
    };

    const resourceSection: NavSectionProps = {
      title: 'Resources',
      items: [
        {
          id: 'files',
          title: 'Files',
          icon: <File className="h-5 w-5" />,
          href: '/files',
        },
        {
          id: 'help',
          title: 'Help & Resources',
          icon: <Info className="h-5 w-5" />,
          href: '/help',
        },
      ],
      collapsible: true,
      defaultExpanded: false,
    };

    setLibreChatSections([chatSection, resourceSection]);
  }, []);

  return {
    anythingLLMSections,
    libreChatSections,
    activePath: location.pathname,
    isCollapsed,
    toggleCollapse,
    onNavigate: handleNavigate,
  };
};

export default useNavigationIntegration; 
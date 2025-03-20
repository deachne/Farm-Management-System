import React from 'react';
import UnifiedNavigation from './UnifiedNavigation';
import { useNavigationIntegration } from '../hooks';

/**
 * Navigation wrapper component that integrates AnythingLLM and LibreChat navigation
 * This component uses the useNavigationIntegration hook to get navigation items
 * and renders the UnifiedNavigation component with those items
 */
export const NavigationWrapper: React.FC = () => {
  const {
    anythingLLMSections,
    libreChatSections,
    activePath,
    isCollapsed,
    toggleCollapse,
    onNavigate,
  } = useNavigationIntegration();

  return (
    <UnifiedNavigation
      anythingLLMSections={anythingLLMSections}
      libreChatSections={libreChatSections}
      activePath={activePath}
      isCollapsed={isCollapsed}
      toggleCollapse={toggleCollapse}
      onNavigate={onNavigate}
      className="min-h-screen"
    />
  );
};

export default NavigationWrapper; 
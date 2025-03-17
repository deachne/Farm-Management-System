import React, { useState, useEffect } from 'react';
import SettingsNav from './SettingsNav';
import UserSettingsPanel from './UserSettingsPanel';
import SystemConfigPanel from './SystemConfigPanel';
import ChatExperiencePanel from './ChatExperiencePanel';
import AIConfigPanel from './AIConfigPanel';
import ExtensionsPanel from './ExtensionsPanel';
import AdvancedFeaturesPanel from './AdvancedFeaturesPanel';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/components/Dialog';

// Setting panel types
export enum SettingsPanelType {
  USER = 'user',
  SYSTEM = 'system',
  CHAT = 'chat',
  AI = 'ai',
  EXTENSIONS = 'extensions',
  ADVANCED = 'advanced',
}

interface UnifiedSettingsContainerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPanel?: SettingsPanelType;
}

const UnifiedSettingsContainer: React.FC<UnifiedSettingsContainerProps> = ({
  open,
  onOpenChange,
  initialPanel = SettingsPanelType.USER,
}) => {
  const [activePanel, setActivePanel] = useState<SettingsPanelType>(initialPanel);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Render the active panel based on the selected panel type
  const renderPanel = () => {
    switch (activePanel) {
      case SettingsPanelType.USER:
        return <UserSettingsPanel />;
      case SettingsPanelType.SYSTEM:
        return <SystemConfigPanel />;
      case SettingsPanelType.CHAT:
        return <ChatExperiencePanel />;
      case SettingsPanelType.AI:
        return <AIConfigPanel />;
      case SettingsPanelType.EXTENSIONS:
        return <ExtensionsPanel />;
      case SettingsPanelType.ADVANCED:
        return <AdvancedFeaturesPanel />;
      default:
        return <UserSettingsPanel />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-theme-bg-primary text-theme-text-primary w-full max-w-[980px] h-[85vh] p-0 overflow-hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="p-4 border-b border-theme-sidebar-border">
          <DialogTitle className="text-xl font-semibold text-theme-text-primary">
            Settings
          </DialogTitle>
        </DialogHeader>
        <div className="flex h-[calc(85vh-64px)] overflow-hidden">
          <SettingsNav 
            activePanel={activePanel} 
            onPanelChange={setActivePanel} 
            isSmallScreen={isSmallScreen} 
          />
          <div className="flex-1 overflow-y-auto p-4">
            {renderPanel()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnifiedSettingsContainer; 
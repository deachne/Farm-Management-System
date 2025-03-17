import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { UnifiedSettingsContainer, SettingsPanelType } from './unified-settings';

interface SettingsButtonProps {
  initialPanel?: SettingsPanelType;
  className?: string;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ 
  initialPanel = SettingsPanelType.USER,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center justify-center p-2 rounded-md text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-bg-hover transition-colors ${className}`}
        aria-label="Open Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      <UnifiedSettingsContainer
        open={isOpen}
        onOpenChange={setIsOpen}
        initialPanel={initialPanel}
      />
    </>
  );
};

export default SettingsButton; 
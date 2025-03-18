import React, { useState } from 'react';
import UnifiedSettingsContainer from '../../../bizzy/core/shared/ui/components/unified-settings/UnifiedSettingsContainer';
import SettingsNav from '../../../bizzy/core/shared/ui/components/unified-settings/SettingsNav';
import UserSettingsPanel from '../../../bizzy/core/shared/ui/components/unified-settings/UserSettingsPanel';
import SystemConfigPanel from '../../../bizzy/core/shared/ui/components/unified-settings/SystemConfigPanel';
import AIConfigPanel from '../../../bizzy/core/shared/ui/components/unified-settings/AIConfigPanel';
import ChatExperiencePanel from '../../../bizzy/core/shared/ui/components/unified-settings/ChatExperiencePanel';
import ExtensionsPanel from '../../../bizzy/core/shared/ui/components/unified-settings/ExtensionsPanel';
import AdvancedFeaturesPanel from '../../../bizzy/core/shared/ui/components/unified-settings/AdvancedFeaturesPanel';

export default {
  title: 'Core/UnifiedSettings/SettingsDemo',
  component: UnifiedSettingsContainer,
  parameters: {
    docs: {
      description: {
        component: 'Consolidated demo of the unified settings interface that integrates AnythingLLM and LibreChat settings.',
      },
    },
    layout: 'fullscreen',
  },
};

// Unified settings navigation and panel demo
export const SettingsDemo = {
  render: () => {
    // State to track the active panel
    const [activePanel, setActivePanel] = useState('user');
    
    // Define navigation items
    const navigationItems = [
      { id: 'user', label: 'User Profile', icon: 'user' },
      { id: 'system', label: 'System Configuration', icon: 'settings' },
      { id: 'ai', label: 'AI Models', icon: 'brain' },
      { id: 'chat', label: 'Chat Experience', icon: 'message-circle' },
      { id: 'extensions', label: 'Extensions', icon: 'puzzle' },
      { id: 'advanced', label: 'Advanced Features', icon: 'sliders' },
    ];
    
    // Mock user data for demonstration
    const userData = {
      username: 'farm_admin',
      email: 'admin@example-farm.com',
      fullName: 'Farm Administrator',
      role: 'Admin',
      preferences: {
        theme: 'light',
        language: 'English',
        notifications: true,
        dataSharing: false,
      },
      farmDetails: {
        farmName: 'Green Valley Farms',
        location: 'Midwest, USA',
        totalAcres: 850,
        crops: ['Corn', 'Soybeans', 'Wheat'],
        established: 1985,
      },
    };
    
    // Mock system configuration
    const systemConfig = {
      version: '2.5.0',
      storageType: 'Local Database',
      embeddingModel: 'OpenAI Ada 002',
      maxFileSize: '50MB',
      autoBackup: true,
      offlineMode: false,
    };
    
    // Mock AI models configuration
    const aiModels = [
      { id: 'gpt-4', name: 'GPT-4', enabled: true, provider: 'OpenAI', default: true },
      { id: 'claude-3', name: 'Claude 3 Sonnet', enabled: true, provider: 'Anthropic', default: false },
      { id: 'llama-3', name: 'Llama 3 70B', enabled: false, provider: 'Meta', default: false },
      { id: 'mistral', name: 'Mistral Large', enabled: false, provider: 'Mistral AI', default: false },
    ];
    
    // Mock extensions data
    const extensions = [
      { id: 'farm-analyzer', name: 'Farm Analyzer', version: '1.2.0', enabled: true, description: 'Advanced analytics for farm data' },
      { id: 'weather-insights', name: 'Weather Insights', version: '2.0.1', enabled: true, description: 'Detailed weather forecasting and analysis' },
      { id: 'crop-advisor', name: 'Crop Advisor', version: '1.5.0', enabled: true, description: 'AI-powered crop recommendations' },
      { id: 'equipment-tracker', name: 'Equipment Tracker', version: '1.0.3', enabled: false, description: 'Track farm equipment maintenance and usage' },
    ];
    
    // Handle navigation changes
    const handleNavChange = (panelId) => {
      setActivePanel(panelId);
    };
    
    // Render the appropriate panel based on the active selection
    const renderPanel = () => {
      switch (activePanel) {
        case 'user':
          return <UserSettingsPanel userData={userData} onSave={(data) => console.log('Saving user data:', data)} />;
        case 'system':
          return <SystemConfigPanel config={systemConfig} onSave={(data) => console.log('Saving system config:', data)} />;
        case 'ai':
          return <AIConfigPanel models={aiModels} onSave={(data) => console.log('Saving AI config:', data)} />;
        case 'chat':
          return <ChatExperiencePanel onSave={(data) => console.log('Saving chat config:', data)} />;
        case 'extensions':
          return <ExtensionsPanel extensions={extensions} onToggle={(id, enabled) => console.log(`Extension ${id} ${enabled ? 'enabled' : 'disabled'}`)} />;
        case 'advanced':
          return <AdvancedFeaturesPanel onSave={(data) => console.log('Saving advanced config:', data)} />;
        default:
          return <div className="p-6">Select a settings category</div>;
      }
    };
    
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">Unified Settings</h1>
          
          <UnifiedSettingsContainer>
            <SettingsNav 
              items={navigationItems} 
              activeItem={activePanel}
              onSelect={handleNavChange}
            />
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-r-lg shadow-md">
              {renderPanel()}
            </div>
          </UnifiedSettingsContainer>
        </div>
      </div>
    );
  }
};

// Individual Settings Panel Demo
export const IndividualPanels = {
  render: (args) => {
    const { panelType } = args;
    
    // Mock data
    const userData = {
      username: 'farm_admin',
      email: 'admin@example-farm.com',
      fullName: 'Farm Administrator',
      role: 'Admin',
      preferences: {
        theme: 'light',
        language: 'English',
        notifications: true,
        dataSharing: false,
      },
      farmDetails: {
        farmName: 'Green Valley Farms',
        location: 'Midwest, USA',
        totalAcres: 850,
        crops: ['Corn', 'Soybeans', 'Wheat'],
        established: 1985,
      },
    };
    
    const systemConfig = {
      version: '2.5.0',
      storageType: 'Local Database',
      embeddingModel: 'OpenAI Ada 002',
      maxFileSize: '50MB',
      autoBackup: true,
      offlineMode: false,
    };
    
    const aiModels = [
      { id: 'gpt-4', name: 'GPT-4', enabled: true, provider: 'OpenAI', default: true },
      { id: 'claude-3', name: 'Claude 3 Sonnet', enabled: true, provider: 'Anthropic', default: false },
      { id: 'llama-3', name: 'Llama 3 70B', enabled: false, provider: 'Meta', default: false },
      { id: 'mistral', name: 'Mistral Large', enabled: false, provider: 'Mistral AI', default: false },
    ];
    
    const extensions = [
      { id: 'farm-analyzer', name: 'Farm Analyzer', version: '1.2.0', enabled: true, description: 'Advanced analytics for farm data' },
      { id: 'weather-insights', name: 'Weather Insights', version: '2.0.1', enabled: true, description: 'Detailed weather forecasting and analysis' },
      { id: 'crop-advisor', name: 'Crop Advisor', version: '1.5.0', enabled: true, description: 'AI-powered crop recommendations' },
      { id: 'equipment-tracker', name: 'Equipment Tracker', version: '1.0.3', enabled: false, description: 'Track farm equipment maintenance and usage' },
    ];
    
    // Render the selected panel
    switch (panelType) {
      case 'user':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <UserSettingsPanel userData={userData} onSave={(data) => console.log('Saving user data:', data)} />
          </div>
        );
      case 'system':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <SystemConfigPanel config={systemConfig} onSave={(data) => console.log('Saving system config:', data)} />
          </div>
        );
      case 'ai':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <AIConfigPanel models={aiModels} onSave={(data) => console.log('Saving AI config:', data)} />
          </div>
        );
      case 'chat':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <ChatExperiencePanel onSave={(data) => console.log('Saving chat config:', data)} />
          </div>
        );
      case 'extensions':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <ExtensionsPanel extensions={extensions} onToggle={(id, enabled) => console.log(`Extension ${id} ${enabled ? 'enabled' : 'disabled'}`)} />
          </div>
        );
      case 'advanced':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <AdvancedFeaturesPanel onSave={(data) => console.log('Saving advanced config:', data)} />
          </div>
        );
      default:
        return <div>Select a panel type</div>;
    }
  },
  args: {
    panelType: 'user',
  },
  argTypes: {
    panelType: {
      control: { type: 'select' },
      options: ['user', 'system', 'ai', 'chat', 'extensions', 'advanced'],
    },
  },
};

// Settings Navigation Demo
export const NavigationOnly = {
  render: () => {
    const [activeItem, setActiveItem] = useState('user');
    
    const navigationItems = [
      { id: 'user', label: 'User Profile', icon: 'user' },
      { id: 'system', label: 'System Configuration', icon: 'settings' },
      { id: 'ai', label: 'AI Models', icon: 'brain' },
      { id: 'chat', label: 'Chat Experience', icon: 'message-circle' },
      { id: 'extensions', label: 'Extensions', icon: 'puzzle' },
      { id: 'advanced', label: 'Advanced Features', icon: 'sliders' },
    ];
    
    return (
      <div className="p-6 bg-gray-100 dark:bg-gray-900">
        <div className="w-64 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <SettingsNav 
            items={navigationItems} 
            activeItem={activeItem}
            onSelect={(id) => {
              setActiveItem(id);
              console.log(`Selected navigation item: ${id}`);
            }}
          />
        </div>
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p>Active Item: <strong>{activeItem}</strong></p>
        </div>
      </div>
    );
  },
}; 
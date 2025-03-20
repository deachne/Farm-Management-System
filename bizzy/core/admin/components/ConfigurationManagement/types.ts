import { ReactNode } from 'react';

export interface ConfigSetting {
  id: string;
  name: string;
  description: string;
  value: string | number | boolean;
  type: 'text' | 'number' | 'boolean' | 'select' | 'password';
  options?: string[]; // For select type
  category: 'system' | 'security' | 'integration' | 'notification' | 'performance';
  isSecret?: boolean;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface ConfigCategory {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  settings: ConfigSetting[];
}

export interface ConfigurationManagementProps {
  categories: ConfigCategory[];
  onSaveSetting: (settingId: string, value: string | number | boolean) => void;
  onResetToDefault: (settingId: string) => void;
  onImportConfig: (configFile: File) => void;
  onExportConfig: () => void;
  onTestConnection?: (categoryId: string) => Promise<boolean>;
  isLoading?: boolean;
} 
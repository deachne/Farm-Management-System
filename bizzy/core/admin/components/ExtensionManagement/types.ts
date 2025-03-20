import { ReactNode } from 'react';

/**
 * Extension interface representing a BizzyPerson extension
 */
export interface Extension {
  id: string;
  name: string;
  version: string;
  description?: string;
  icon?: ReactNode;
  status: 'active' | 'inactive';
  hasUpdate?: boolean;
  categories?: string[];
  permissions?: {
    documentAccess?: boolean;
    searchAccess?: boolean;
    networkAccess?: boolean;
    [key: string]: boolean | undefined;
  };
  resources?: {
    users?: number;
    storage?: string;
    [key: string]: number | string | undefined;
  };
  config?: Record<string, any>;
}

/**
 * Props for the ExtensionManagement component
 */
export interface ExtensionManagementProps {
  extensions?: Extension[];
  onAddExtension?: (extension: Extension) => void;
  onActivateExtension?: (extension: Extension) => void;
  onDeactivateExtension?: (extension: Extension) => void;
  onUninstallExtension?: (extension: Extension) => void;
  onUpdateExtension?: (extension: Extension) => void;
  onConfigureExtension?: (extension: Extension) => void;
  onManagePermissions?: (extension: Extension) => void;
}

/**
 * Permission object for managing extension permissions
 */
export interface ExtensionPermission {
  id: string;
  name: string;
  description: string;
  granted: boolean;
  category: 'document' | 'network' | 'search' | 'system' | 'user';
} 
import { ReactNode } from 'react';
import { ServiceStatus, Incident } from '../SystemStatus/types';

export interface StatItem {
  icon: ReactNode;
  value: number | string;
  label: string;
  change?: {
    value?: number;
    type: 'increase' | 'decrease' | 'no-change';
    period?: string;
  };
}

export interface Extension {
  name: string;
  icon: ReactNode;
  version: string;
  status: 'active' | 'inactive';
  permissions: {
    documentAccess?: boolean;
    searchAccess?: boolean;
    networkAccess?: boolean;
  };
  resources?: {
    users?: number;
    storage?: string;
  };
}

export interface DashboardProps {
  stats: StatItem[];
  extensions: Extension[];
  systemStatus: {
    isOperational: boolean;
    lastUpdated?: Date | string;
    services: ServiceStatus[];
    incidents?: Incident[];
  };
  onAddExtension?: (name?: string) => void;
  onManagePermissions?: (name?: string) => void;
  onUpdateAll?: () => void;
  onConfigureExtension?: (name: string) => void;
  onActivateExtension?: (name: string) => void;
  onDeactivateExtension?: (name: string) => void;
  onSearch?: (query: string) => void;
  onToggleSystemStatus?: () => void;
  onNavigateToUsers?: () => void;
  onNavigateToExtensions?: () => void;
  onNavigateToSystem?: () => void;
}

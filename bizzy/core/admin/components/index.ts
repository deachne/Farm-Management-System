// Export admin components
export { default as ExtensionCard } from './ExtensionCard';
export { default as StatCard } from './StatCard';
export { default as SystemStatus } from './SystemStatus';
export { default as Dashboard } from './Dashboard';
export { default as UserManagement } from './UserManagement';

// Export types
export type { ExtensionCardProps } from './ExtensionCard/types';
export type { StatCardProps } from './StatCard/types';
export type { SystemStatusProps, ServiceStatus, Incident, StatusType } from './SystemStatus/types';
export type { DashboardProps, StatItem, Extension } from './Dashboard/types';
export type { User, UserRole, UserStatus } from './UserManagement/types';

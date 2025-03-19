export interface ExtensionCardProps {
  name: string;
  icon?: React.ReactNode;
  version: string;
  status: 'active' | 'inactive';
  permissions?: {
    documentAccess?: boolean;
    searchAccess?: boolean;
    networkAccess?: boolean;
  };
  resources?: {
    users?: number;
    storage?: string;
  };
  onConfigure?: () => void;
  onActivate?: () => void;
  onDeactivate?: () => void;
}

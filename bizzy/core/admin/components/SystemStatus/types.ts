export type StatusType = 'healthy' | 'warning' | 'error' | 'unknown';

export interface ServiceStatus {
  name: string;
  status: StatusType;
}

export interface Incident {
  id: string;
  title: string;
  timestamp: Date | string;
  status: 'ongoing' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
}

export interface SystemStatusProps {
  isOperational: boolean;
  lastUpdated?: Date | string;
  services: ServiceStatus[];
  incidents?: Incident[];
  onClose?: () => void;
}

import { ReactNode } from 'react';

export interface ResourceMetric {
  name: string;
  value: number;
  unit: string;
  max?: number;
  status: 'normal' | 'warning' | 'critical';
}

export interface SystemService {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'inactive';
  lastUpdated: string | Date;
  uptime?: string;
  metadata?: Record<string, any>;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  timestamp: string | Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'acknowledged';
  source: string;
}

export interface PerformanceDataPoint {
  timestamp: string | Date;
  value: number;
}

export interface PerformanceMetric {
  id: string;
  name: string;
  unit: string;
  data: PerformanceDataPoint[];
  status: 'normal' | 'warning' | 'critical';
}

export interface LogEntry {
  id: string;
  timestamp: string | Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  source: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface SystemMonitoringProps {
  resourceMetrics: ResourceMetric[];
  systemServices: SystemService[];
  alerts: Alert[];
  performanceMetrics: PerformanceMetric[];
  logs: LogEntry[];
  timeRange: string;
  onRefresh?: () => void;
  onTimeRangeChange?: (range: string) => void;
  onServiceAction?: (serviceId: string, action: 'restart' | 'stop' | 'start') => void;
  onAlertAction?: (alertId: string, action: 'acknowledge' | 'resolve') => void;
  onDownloadLogs?: (logSource?: string) => void;
} 
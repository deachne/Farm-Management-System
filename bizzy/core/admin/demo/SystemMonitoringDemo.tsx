import React, { useState } from 'react';
import { SystemMonitoring } from '../components';
import {
  ResourceMetric,
  SystemService,
  Alert,
  PerformanceMetric,
  LogEntry
} from '../components/SystemMonitoring/types';
import { 
  Cpu, 
  Activity, 
  AlertTriangle, 
  Search, 
  BarChart2, 
  X, 
  Plus, 
  Settings, 
  RefreshCw, 
  ChevronDown,
  FileText,
  Folder,
  CheckSquare,
  MessageSquare,
  LayoutDashboard,
  Users,
  Package,
  Server,
  BarChart
} from 'lucide-react';

/**
 * SystemMonitoring Demonstration Component
 * 
 * This component provides a fully styled and interactive demonstration
 * of the System Monitoring tools component.
 * 
 * To use:
 * 1. Import this component
 * 2. Render it in your application
 * 
 * Example:
 * ```tsx
 * import { SystemMonitoringDemo } from './bizzy/core/admin/demo/SystemMonitoringDemo';
 * 
 * function App() {
 *   return <SystemMonitoringDemo />;
 * }
 * ```
 */

// Add props for external navigation
interface SystemMonitoringDemoProps {
  onNavigateToDashboard?: () => void;
  onNavigateToUsers?: () => void;
  onNavigateToExtensions?: () => void;
}

// Update the component definition to accept props
const SystemMonitoringDemo: React.FC<SystemMonitoringDemoProps> = ({
  onNavigateToDashboard,
  onNavigateToUsers,
  onNavigateToExtensions
}) => {
  // Remove the view state and sidebar state since that's handled by the parent
  // Remove unneeded navigation handlers
  const [actionLog, setActionLog] = useState<string[]>([]);
  
  // Log actions for demonstration
  const logAction = (action: string) => {
    console.log("Action:", action);
    setActionLog(prev => [action, ...prev].slice(0, 5));
  };

  // Sample resource metrics
  const resourceMetrics: ResourceMetric[] = [
    {
      name: 'CPU Usage',
      value: 42,
      unit: '%',
      max: 100,
      status: 'normal'
    },
    {
      name: 'Memory Usage',
      value: 6.2,
      unit: 'GB',
      max: 16,
      status: 'normal'
    },
    {
      name: 'Storage Usage',
      value: 78,
      unit: '%',
      max: 100,
      status: 'warning'
    },
    {
      name: 'Network Bandwidth',
      value: 42.5,
      unit: 'Mbps',
      status: 'normal'
    },
    {
      name: 'System Load (1m)',
      value: 2.4,
      unit: '',
      status: 'normal'
    },
    {
      name: 'System Load (5m)',
      value: 3.2,
      unit: '',
      status: 'warning'
    },
    {
      name: 'System Load (15m)',
      value: 3.8,
      unit: '',
      status: 'critical'
    },
    {
      name: 'Swap Usage',
      value: 12,
      unit: '%',
      max: 100,
      status: 'normal'
    }
  ];

  // Sample system services
  const systemServices: SystemService[] = [
    {
      id: 'api-server',
      name: 'API Server',
      status: 'healthy',
      lastUpdated: '2 minutes ago',
      uptime: '24d 5h 12m'
    },
    {
      id: 'db-server',
      name: 'Database Server',
      status: 'healthy',
      lastUpdated: '5 minutes ago',
      uptime: '15d 8h 34m'
    },
    {
      id: 'vector-store',
      name: 'Vector Store',
      status: 'warning',
      lastUpdated: '10 minutes ago',
      uptime: '8d 12h 5m',
      metadata: {
        warning: 'High memory usage detected'
      }
    },
    {
      id: 'file-storage',
      name: 'File Storage',
      status: 'healthy',
      lastUpdated: '12 minutes ago',
      uptime: '24d 5h 12m'
    },
    {
      id: 'chat-server',
      name: 'Chat Server',
      status: 'healthy',
      lastUpdated: '3 minutes ago',
      uptime: '24d 4h 18m'
    },
    {
      id: 'email-service',
      name: 'Email Service',
      status: 'error',
      lastUpdated: '15 minutes ago',
      uptime: '2h 15m',
      metadata: {
        error: 'Connection to SMTP server failed'
      }
    },
    {
      id: 'scheduler',
      name: 'Task Scheduler',
      status: 'inactive',
      lastUpdated: '1 hour ago'
    }
  ];

  // Sample alerts
  const alerts: Alert[] = [
    {
      id: 'alert-1',
      title: 'High CPU Usage',
      message: 'CPU usage exceeded 90% for more than 5 minutes',
      timestamp: '2023-06-15 14:32:45',
      severity: 'high',
      status: 'active',
      source: 'System Monitor'
    },
    {
      id: 'alert-2',
      title: 'Database Connection Error',
      message: 'Multiple failed connection attempts to primary database',
      timestamp: '2023-06-15 13:45:12',
      severity: 'critical',
      status: 'active',
      source: 'Database Server'
    },
    {
      id: 'alert-3',
      title: 'File Storage Approaching Capacity',
      message: 'File storage is at 85% capacity',
      timestamp: '2023-06-15 12:15:00',
      severity: 'medium',
      status: 'acknowledged',
      source: 'Storage Monitor'
    },
    {
      id: 'alert-4',
      title: 'API Rate Limit Reached',
      message: 'External API rate limit reached for endpoint /users',
      timestamp: '2023-06-15 10:22:35',
      severity: 'low',
      status: 'resolved',
      source: 'API Gateway'
    },
    {
      id: 'alert-5',
      title: 'Memory Leak Detected',
      message: 'Possible memory leak detected in worker process',
      timestamp: '2023-06-14 23:12:10',
      severity: 'high',
      status: 'resolved',
      source: 'Process Monitor'
    }
  ];

  // Sample performance metrics
  const generateTimeSeries = (count: number, min: number, max: number) => {
    const now = new Date();
    const result = [];
    for (let i = 0; i < count; i++) {
      const timestamp = new Date(now.getTime() - (i * 15 * 60 * 1000)); // 15 min intervals
      const value = Math.floor(Math.random() * (max - min + 1)) + min;
      result.push({ timestamp, value });
    }
    return result.reverse(); // newest last
  };

  const performanceMetrics: PerformanceMetric[] = [
    {
      id: 'cpu-usage',
      name: 'CPU Usage',
      unit: '%',
      data: generateTimeSeries(24, 20, 95),
      status: 'normal'
    },
    {
      id: 'memory-usage',
      name: 'Memory Usage',
      unit: 'GB',
      data: generateTimeSeries(24, 4, 14),
      status: 'normal'
    },
    {
      id: 'api-requests',
      name: 'API Requests per Minute',
      unit: 'req/min',
      data: generateTimeSeries(24, 10, 250),
      status: 'normal'
    },
    {
      id: 'db-queries',
      name: 'Database Queries per Second',
      unit: 'q/s',
      data: generateTimeSeries(24, 5, 120),
      status: 'warning'
    },
    {
      id: 'network-in',
      name: 'Network Traffic In',
      unit: 'Mbps',
      data: generateTimeSeries(24, 5, 75),
      status: 'normal'
    },
    {
      id: 'network-out',
      name: 'Network Traffic Out',
      unit: 'Mbps',
      data: generateTimeSeries(24, 2, 60),
      status: 'normal'
    }
  ];

  // Sample log entries
  const generateLogs = (count: number) => {
    const logSources = ['API Server', 'Database', 'File Server', 'Authentication', 'Task Scheduler', 'Email Service'];
    const logLevels: ('info' | 'warning' | 'error' | 'debug')[] = ['info', 'warning', 'error', 'debug'];
    const infoMessages = [
      'User authenticated successfully',
      'Database connection established',
      'Task completed successfully',
      'File uploaded successfully',
      'Cache refreshed',
      'Service started'
    ];
    const warnMessages = [
      'Rate limit approaching threshold',
      'Slow database query detected',
      'High memory usage',
      'Auth retry attempted',
      'Service approaching capacity'
    ];
    const errorMessages = [
      'Database connection failed',
      'Task failed to complete',
      'File upload failed',
      'Authentication failed',
      'API request failed'
    ];
    const debugMessages = [
      'Debug: Processing request details',
      'Debug: Query execution plan',
      'Debug: Cache hit ratio',
      'Debug: Token validation',
      'Debug: Function call trace'
    ];

    const logs: LogEntry[] = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
      const level = logLevels[Math.floor(Math.random() * logLevels.length)];
      const source = logSources[Math.floor(Math.random() * logSources.length)];
      let message = '';
      let metadata = undefined;

      switch (level) {
        case 'info':
          message = infoMessages[Math.floor(Math.random() * infoMessages.length)];
          if (Math.random() > 0.7) {
            metadata = { userId: `user-${Math.floor(Math.random() * 1000)}`, duration: `${Math.floor(Math.random() * 500)}ms` };
          }
          break;
        case 'warning':
          message = warnMessages[Math.floor(Math.random() * warnMessages.length)];
          if (Math.random() > 0.5) {
            metadata = { threshold: `${Math.floor(Math.random() * 90)}%`, resourceId: `res-${Math.floor(Math.random() * 1000)}` };
          }
          break;
        case 'error':
          message = errorMessages[Math.floor(Math.random() * errorMessages.length)];
          metadata = { errorCode: `ERR-${Math.floor(Math.random() * 1000)}`, context: 'Request processing' };
          break;
        case 'debug':
          message = debugMessages[Math.floor(Math.random() * debugMessages.length)];
          if (Math.random() > 0.3) {
            metadata = { 
              executionTime: `${Math.floor(Math.random() * 1000)}ms`, 
              memoryUsage: `${Math.floor(Math.random() * 100)}MB` 
            };
          }
          break;
      }

      logs.push({
        id: `log-${i}`,
        timestamp: new Date(now.getTime() - (i * 2 * 60 * 1000)), // 2 min intervals
        level,
        source,
        message,
        metadata
      });
    }

    return logs;
  };

  const logs = generateLogs(50);

  // Handler functions
  const handleRefresh = () => {
    logAction('Refreshing system monitoring data');
  };

  const handleTimeRangeChange = (range: string) => {
    logAction(`Changing time range to: ${range}`);
  };

  const handleServiceAction = (serviceId: string, action: 'restart' | 'stop' | 'start') => {
    logAction(`Performing ${action} on service ${serviceId}`);
  };

  const handleAlertAction = (alertId: string, action: 'acknowledge' | 'resolve') => {
    logAction(`Performing ${action} on alert ${alertId}`);
  };

  const handleDownloadLogs = (logSource?: string) => {
    logAction(`Downloading logs${logSource ? ` for ${logSource}` : ''}`);
  };

  // Update the return statement to only include the main component
  return (
    <>
      <SystemMonitoring
        resourceMetrics={resourceMetrics}
        systemServices={systemServices}
        alerts={alerts}
        performanceMetrics={performanceMetrics}
        logs={logs}
        timeRange="day"
        onRefresh={handleRefresh}
        onTimeRangeChange={handleTimeRangeChange}
        onServiceAction={handleServiceAction}
        onAlertAction={handleAlertAction}
        onDownloadLogs={handleDownloadLogs}
      />
      
      {/* Action Log */}
      {actionLog.length > 0 && (
        <div className="fixed bottom-0 right-0 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-tl-lg m-4 z-50">
          <h3 className="text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Action Log:</h3>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            {actionLog.map((action, index) => (
              <li key={index}>{action}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default SystemMonitoringDemo; 
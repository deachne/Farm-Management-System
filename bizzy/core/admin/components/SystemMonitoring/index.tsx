import React, { useState } from 'react';
import { SystemMonitoringProps } from './types';
import { Card, CardContent } from '../../../shared/ui/components/Card';
import { Button } from '../../../shared/ui/components/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/ui/components/Tabs';
import { Badge } from '../../../shared/ui/components/Badge';
import { Progress } from '../../../shared/ui/components/Progress';
import {
  Activity,
  AlertTriangle,
  BarChart,
  ChevronDown,
  Clock,
  Download,
  FileText,
  HardDrive,
  RefreshCw,
  Server,
  Settings,
  Cpu,
  Database,
  Cloud
} from 'lucide-react';
import ResourceMetricsPanel from './ResourceMetricsPanel';
import ServiceStatusTable from './ServiceStatusTable';
import AlertHistoryList from './AlertHistoryList';
import PerformanceMetricsChart from './PerformanceMetricsChart';
import LogViewer from './LogViewer';

const SystemMonitoring: React.FC<SystemMonitoringProps> = ({
  resourceMetrics,
  systemServices,
  alerts,
  performanceMetrics,
  logs,
  timeRange,
  onRefresh,
  onTimeRangeChange,
  onServiceAction,
  onAlertAction,
  onDownloadLogs
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Calculate system health status
  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical');
  const highAlerts = activeAlerts.filter(alert => alert.severity === 'high');
  
  const unhealthyServices = systemServices.filter(service => service.status !== 'healthy').length;
  const totalServices = systemServices.length;
  const servicesHealthPercentage = ((totalServices - unhealthyServices) / totalServices) * 100;
  
  let systemStatus: 'operational' | 'degraded' | 'critical' = 'operational';
  if (criticalAlerts.length > 0 || servicesHealthPercentage < 70) {
    systemStatus = 'critical';
  } else if (highAlerts.length > 0 || unhealthyServices > 0) {
    systemStatus = 'degraded';
  }
  
  const getStatusColor = (status: 'operational' | 'degraded' | 'critical') => {
    switch(status) {
      case 'operational': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <div className="system-monitoring">
      {/* System Health Overview */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
            System Health Monitor
          </h2>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onRefresh?.()}
              className="h-9 px-3 border-blue-300 dark:border-blue-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 px-3 border-blue-300 dark:border-blue-700"
              >
                <Clock className="h-4 w-4 mr-2" />
                {timeRange}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex items-center mb-4">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus)} mr-2`}></div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">
              System Status: <span className="font-bold">{systemStatus === 'operational' ? 'Operational' : systemStatus === 'degraded' ? 'Degraded' : 'Critical'}</span>
            </h3>
            
            <div className="ml-auto">
              <Badge variant={
                systemStatus === 'operational' ? 'success' : 
                systemStatus === 'degraded' ? 'warning' : 'destructive'
              }>
                {activeAlerts.length > 0 ? `${activeAlerts.length} active alerts` : 'No active alerts'}
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Services Health ({totalServices - unhealthyServices}/{totalServices})
              </div>
              <Progress 
                value={servicesHealthPercentage} 
                className={`h-2.5 ${
                  servicesHealthPercentage > 90 ? 'bg-green-200' : 
                  servicesHealthPercentage > 70 ? 'bg-yellow-200' : 'bg-red-200'
                }`}
                variant={
                  servicesHealthPercentage > 90 ? 'success' : 
                  servicesHealthPercentage > 70 ? 'warning' : 'danger'
                }
              />
            </div>
            
            <div className="flex divide-x divide-gray-300 dark:divide-gray-600">
              <div className="pr-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">Critical Alerts</div>
                <div className="text-xl font-bold text-red-600 dark:text-red-400">{criticalAlerts.length}</div>
              </div>
              <div className="px-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">High Alerts</div>
                <div className="text-xl font-bold text-orange-600 dark:text-orange-400">{highAlerts.length}</div>
              </div>
              <div className="pl-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Alerts</div>
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{activeAlerts.length}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Tabs for different monitoring sections */}
      <Tabs
        defaultValue="dashboard"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="bg-blue-50 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger 
            value="dashboard"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="resources"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            Resources
          </TabsTrigger>
          <TabsTrigger 
            value="services"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            Services
          </TabsTrigger>
          <TabsTrigger 
            value="performance"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            Performance
          </TabsTrigger>
          <TabsTrigger 
            value="alerts"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            Alerts
          </TabsTrigger>
          <TabsTrigger 
            value="logs"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            Logs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Resource Metrics Summary */}
            <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg hover:shadow-lg transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
                    <Cpu className="h-5 w-5 mr-2 text-blue-500" />
                    Resources
                  </h3>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {resourceMetrics.slice(0, 3).map((metric) => (
                    <div key={metric.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">
                          {metric.name}
                        </span>
                        <span className={`font-medium ${
                          metric.status === 'normal' ? 'text-green-600 dark:text-green-400' :
                          metric.status === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {metric.value}{metric.unit}
                        </span>
                      </div>
                      <Progress 
                        value={metric.max ? (metric.value / metric.max) * 100 : metric.value} 
                        className="h-2 bg-blue-100 dark:bg-blue-900"
                        variant={
                          metric.status === 'normal' ? 'success' :
                          metric.status === 'warning' ? 'warning' :
                          'danger'
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Services Summary */}
            <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg hover:shadow-lg transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
                    <Server className="h-5 w-5 mr-2 text-purple-500" />
                    Services
                  </h3>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {systemServices.slice(0, 5).map((service) => (
                    <div key={service.id} className="flex items-center justify-between py-1 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {service.name}
                      </span>
                      <Badge variant={
                        service.status === 'healthy' ? 'success' :
                        service.status === 'warning' ? 'warning' :
                        service.status === 'error' ? 'destructive' : 'outline'
                      }>
                        {service.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Alerts Summary */}
            <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg hover:shadow-lg transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                    Recent Alerts
                  </h3>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {alerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="p-2 rounded-md border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`h-2 w-2 rounded-full ${
                            alert.severity === 'critical' ? 'bg-red-500' :
                            alert.severity === 'high' ? 'bg-orange-500' :
                            alert.severity === 'medium' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`}></div>
                          <span className="font-medium text-gray-800 dark:text-white text-sm">
                            {alert.title}
                          </span>
                        </div>
                        <Badge variant={
                          alert.status === 'active' ? 'outline' :
                          alert.status === 'acknowledged' ? 'secondary' :
                          'success'
                        }>
                          {alert.status}
                        </Badge>
                      </div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {typeof alert.timestamp === 'string' ? alert.timestamp : alert.timestamp.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Performance Overview */}
          <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-500" />
                  Performance Overview
                </h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="h-8 px-3 border-blue-300 dark:border-blue-700">
                    Day
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 px-3 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900">
                    Week
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 px-3 border-blue-300 dark:border-blue-700">
                    Month
                  </Button>
                </div>
              </div>
              
              <div className="h-64">
                {/* This would be replaced with your charting component */}
                <div className="h-full w-full flex items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <BarChart className="h-12 w-12 mx-auto text-blue-300 mb-2" />
                    <p>Performance chart will display here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources">
          <ResourceMetricsPanel resourceMetrics={resourceMetrics} />
        </TabsContent>
        
        <TabsContent value="services">
          <ServiceStatusTable 
            services={systemServices} 
            onServiceAction={onServiceAction} 
          />
        </TabsContent>
        
        <TabsContent value="performance">
          <PerformanceMetricsChart 
            metrics={performanceMetrics} 
            timeRange={timeRange}
            onTimeRangeChange={onTimeRangeChange}
          />
        </TabsContent>
        
        <TabsContent value="alerts">
          <AlertHistoryList 
            alerts={alerts} 
            onAlertAction={onAlertAction} 
          />
        </TabsContent>
        
        <TabsContent value="logs">
          <LogViewer 
            logs={logs} 
            onDownloadLogs={onDownloadLogs}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemMonitoring; 
import React from 'react';
import { Card, CardContent } from '../../../shared/ui/components/Card';
import { Progress } from '../../../shared/ui/components/Progress';
import { Cpu, HardDrive, Activity, Database } from 'lucide-react';
import { ResourceMetric } from './types';

interface ResourceMetricsPanelProps {
  resourceMetrics: ResourceMetric[];
}

const ResourceMetricsPanel: React.FC<ResourceMetricsPanelProps> = ({ resourceMetrics }) => {
  // Group metrics by type
  const cpuMetrics = resourceMetrics.filter(m => m.name.toLowerCase().includes('cpu'));
  const memoryMetrics = resourceMetrics.filter(m => m.name.toLowerCase().includes('memory'));
  const storageMetrics = resourceMetrics.filter(m => m.name.toLowerCase().includes('storage') || m.name.toLowerCase().includes('disk'));
  const networkMetrics = resourceMetrics.filter(m => m.name.toLowerCase().includes('network'));
  const otherMetrics = resourceMetrics.filter(
    m => !m.name.toLowerCase().includes('cpu') && 
    !m.name.toLowerCase().includes('memory') && 
    !m.name.toLowerCase().includes('storage') && 
    !m.name.toLowerCase().includes('disk') && 
    !m.name.toLowerCase().includes('network')
  );

  const renderMetric = (metric: ResourceMetric) => (
    <div key={metric.name} className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {metric.name}
        </div>
        <div className={`text-sm font-medium ${
          metric.status === 'normal' ? 'text-green-600 dark:text-green-400' : 
          metric.status === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 
          'text-red-600 dark:text-red-400'
        }`}>
          {metric.value}{metric.unit} {metric.max && `/ ${metric.max}${metric.unit}`}
        </div>
      </div>
      <Progress 
        value={metric.max ? (metric.value / metric.max) * 100 : metric.value} 
        className={`h-2 bg-blue-100 dark:bg-blue-900`}
        variant={
          metric.status === 'normal' ? 'success' : 
          metric.status === 'warning' ? 'warning' : 
          'danger'
        }
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
        Resource Metrics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU Metrics */}
        <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg">
          <CardContent className="p-5">
            <div className="flex items-center mb-4">
              <Cpu className="h-5 w-5 mr-2 text-blue-500" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">CPU Utilization</h3>
            </div>
            <div>
              {cpuMetrics.map(renderMetric)}
              {cpuMetrics.length === 0 && (
                <div className="text-gray-500 dark:text-gray-400 text-sm italic">No CPU metrics available</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Memory Metrics */}
        <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg">
          <CardContent className="p-5">
            <div className="flex items-center mb-4">
              <Database className="h-5 w-5 mr-2 text-purple-500" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Memory Usage</h3>
            </div>
            <div>
              {memoryMetrics.map(renderMetric)}
              {memoryMetrics.length === 0 && (
                <div className="text-gray-500 dark:text-gray-400 text-sm italic">No memory metrics available</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Storage Metrics */}
        <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg">
          <CardContent className="p-5">
            <div className="flex items-center mb-4">
              <HardDrive className="h-5 w-5 mr-2 text-yellow-500" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Storage Utilization</h3>
            </div>
            <div>
              {storageMetrics.map(renderMetric)}
              {storageMetrics.length === 0 && (
                <div className="text-gray-500 dark:text-gray-400 text-sm italic">No storage metrics available</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Network Metrics */}
        <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg">
          <CardContent className="p-5">
            <div className="flex items-center mb-4">
              <Activity className="h-5 w-5 mr-2 text-green-500" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Network Activity</h3>
            </div>
            <div>
              {networkMetrics.map(renderMetric)}
              {networkMetrics.length === 0 && (
                <div className="text-gray-500 dark:text-gray-400 text-sm italic">No network metrics available</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Other Metrics (if any) */}
        {otherMetrics.length > 0 && (
          <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg">
            <CardContent className="p-5">
              <div className="flex items-center mb-4">
                <div className="h-5 w-5 mr-2 bg-blue-500 rounded-full"></div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Other Metrics</h3>
              </div>
              <div>
                {otherMetrics.map(renderMetric)}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Add explicit displayName
ResourceMetricsPanel.displayName = "ResourceMetricsPanel";

// Export default is already there
export default ResourceMetricsPanel; 
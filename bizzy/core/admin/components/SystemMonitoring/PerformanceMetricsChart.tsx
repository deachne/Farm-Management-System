import React, { useState } from 'react';
import { Card, CardContent } from '../../../shared/ui/components/Card';
import { Button } from '../../../shared/ui/components/Button';
import { Badge } from '../../../shared/ui/components/Badge';
import { 
  BarChart2, 
  Clock, 
  RefreshCw, 
  Download,
  ChevronDown,
  Activity,
  Cpu,
  Database,
  HardDrive,
  Wifi
} from 'lucide-react';
import { PerformanceMetric } from './types';

interface PerformanceMetricsChartProps {
  metrics: PerformanceMetric[];
  timeRange: string;
  onTimeRangeChange?: (range: string) => void;
}

const PerformanceMetricsChart: React.FC<PerformanceMetricsChartProps> = ({ 
  metrics,
  timeRange,
  onTimeRangeChange
}) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(
    metrics.length > 0 ? [metrics[0].id] : []
  );

  // Toggle a metric's visibility in chart
  const toggleMetric = (metricId: string) => {
    if (selectedMetrics.includes(metricId)) {
      setSelectedMetrics(selectedMetrics.filter(id => id !== metricId));
    } else {
      setSelectedMetrics([...selectedMetrics, metricId]);
    }
  };

  // Get an icon for a metric based on its name
  const getMetricIcon = (metricName: string) => {
    const name = metricName.toLowerCase();
    if (name.includes('cpu')) return <Cpu className="h-4 w-4 mr-2 text-blue-500" />;
    if (name.includes('memory')) return <Database className="h-4 w-4 mr-2 text-purple-500" />;
    if (name.includes('disk') || name.includes('storage')) return <HardDrive className="h-4 w-4 mr-2 text-yellow-500" />;
    if (name.includes('network') || name.includes('bandwidth')) return <Wifi className="h-4 w-4 mr-2 text-green-500" />;
    return <Activity className="h-4 w-4 mr-2 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
        Performance Metrics
      </h2>

      <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg">
        <CardContent className="p-5">
          {/* Chart Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex space-x-2">
              <Button 
                variant={timeRange === 'hour' ? 'primary' : 'outline'} 
                size="sm" 
                onClick={() => onTimeRangeChange?.('hour')}
                className="h-8"
              >
                Hour
              </Button>
              <Button 
                variant={timeRange === 'day' ? 'primary' : 'outline'} 
                size="sm" 
                onClick={() => onTimeRangeChange?.('day')}
                className="h-8"
              >
                Day
              </Button>
              <Button 
                variant={timeRange === 'week' ? 'primary' : 'outline'} 
                size="sm" 
                onClick={() => onTimeRangeChange?.('week')}
                className="h-8"
              >
                Week
              </Button>
              <Button 
                variant={timeRange === 'month' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => onTimeRangeChange?.('month')}
                className="h-8"
              >
                Month
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="h-8"
              >
                <RefreshCw className="h-4 w-4 mr-1.5" />
                Refresh
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="h-8"
              >
                <Download className="h-4 w-4 mr-1.5" />
                Export
              </Button>
            </div>
          </div>

          {/* Chart Area */}
          <div className="h-80 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6 p-4 relative">
            {metrics.length > 0 ? (
              <div className="flex items-center justify-center h-full w-full text-gray-500 border border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <BarChart2 className="h-12 w-12 mx-auto text-blue-300 mb-2" />
                  <p>Performance chart visualization will render here</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Selected metrics: {selectedMetrics.map(id => metrics.find(m => m.id === id)?.name).join(', ')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">No performance metrics available</p>
              </div>
            )}
          </div>

          {/* Metrics Selection */}
          <div>
            <h3 className="text-base font-medium text-gray-800 dark:text-white mb-3 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-500" />
              Available Metrics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {metrics.map(metric => (
                <div 
                  key={metric.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedMetrics.includes(metric.id) 
                      ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => toggleMetric(metric.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getMetricIcon(metric.name)}
                      <span className="font-medium text-gray-800 dark:text-white">
                        {metric.name}
                      </span>
                    </div>
                    
                    <Badge variant={
                      metric.status === 'normal' ? 'success' :
                      metric.status === 'warning' ? 'warning' :
                      'destructive'
                    }>
                      {metric.status}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Unit: {metric.unit} &middot; Data points: {metric.data.length}
                  </div>
                </div>
              ))}
            </div>
            
            {metrics.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No metrics available for display</p>
              </div>
            )}
          </div>
          
          {/* Time Range Info */}
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <Clock className="h-4 w-4 mr-1.5" />
            <span>Showing data for the last {timeRange}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Add explicit displayName
PerformanceMetricsChart.displayName = "PerformanceMetricsChart";

// Export default is already there
export default PerformanceMetricsChart; 
import React, { useState } from 'react';
import { Card, CardContent } from '../../../shared/ui/components/Card';
import { Button } from '../../../shared/ui/components/Button';
import { Badge } from '../../../shared/ui/components/Badge';
import { Input } from '../../../shared/ui/components/Input';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Filter, 
  Search,
  Bell,
  AlertCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Alert } from './types';

interface AlertHistoryListProps {
  alerts: Alert[];
  onAlertAction?: (alertId: string, action: 'acknowledge' | 'resolve') => void;
}

const AlertHistoryList: React.FC<AlertHistoryListProps> = ({ 
  alerts,
  onAlertAction 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');
  const [sortField, setSortField] = useState<'timestamp' | 'severity'>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter alerts based on search term and filters
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.source.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // Sort alerts
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    if (sortField === 'timestamp') {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      // Sort by severity (critical > high > medium > low)
      const severityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
      const severityA = severityOrder[a.severity as keyof typeof severityOrder];
      const severityB = severityOrder[b.severity as keyof typeof severityOrder];
      return sortDirection === 'asc' ? severityA - severityB : severityB - severityA;
    }
  });

  // Handle sort toggle
  const toggleSort = (field: 'timestamp' | 'severity') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Status counts
  const statusCounts = {
    all: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
    resolved: alerts.filter(a => a.status === 'resolved').length
  };

  // Severity counts
  const severityCounts = {
    all: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    high: alerts.filter(a => a.severity === 'high').length,
    medium: alerts.filter(a => a.severity === 'medium').length,
    low: alerts.filter(a => a.severity === 'low').length
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
        Alert History
      </h2>

      <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg">
        <CardContent className="p-5">
          {/* Search and Filter Controls */}
          <div className="flex flex-col space-y-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:w-80">
                <Input
                  type="text"
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-2 w-full"
                />
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  <Filter className="h-4 w-4 inline mr-1" />
                  Status:
                </span>
                <div className="flex space-x-1.5">
                  <Button 
                    variant={statusFilter === 'all' ? 'primary' : 'outline'} 
                    size="sm" 
                    onClick={() => setStatusFilter('all')}
                    className="text-xs h-8"
                  >
                    All ({statusCounts.all})
                  </Button>
                  <Button 
                    variant={statusFilter === 'active' ? 'primary' : 'outline'} 
                    size="sm" 
                    onClick={() => setStatusFilter('active')}
                    className="text-xs h-8 text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50"
                  >
                    Active ({statusCounts.active})
                  </Button>
                  <Button 
                    variant={statusFilter === 'acknowledged' ? 'primary' : 'outline'} 
                    size="sm" 
                    onClick={() => setStatusFilter('acknowledged')}
                    className="text-xs h-8 text-blue-600 border-blue-200 hover:text-blue-700 hover:bg-blue-50"
                  >
                    Acknowledged ({statusCounts.acknowledged})
                  </Button>
                  <Button 
                    variant={statusFilter === 'resolved' ? 'primary' : 'outline'} 
                    size="sm" 
                    onClick={() => setStatusFilter('resolved')}
                    className="text-xs h-8 text-green-600 border-green-200 hover:text-green-700 hover:bg-green-50"
                  >
                    Resolved ({statusCounts.resolved})
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                Severity:
              </span>
              <div className="flex space-x-1.5">
                <Button 
                  variant={severityFilter === 'all' ? 'primary' : 'outline'} 
                  size="sm" 
                  onClick={() => setSeverityFilter('all')}
                  className="text-xs h-8"
                >
                  All ({severityCounts.all})
                </Button>
                <Button 
                  variant={severityFilter === 'critical' ? 'primary' : 'outline'} 
                  size="sm" 
                  onClick={() => setSeverityFilter('critical')}
                  className="text-xs h-8 text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50"
                >
                  Critical ({severityCounts.critical})
                </Button>
                <Button 
                  variant={severityFilter === 'high' ? 'primary' : 'outline'} 
                  size="sm" 
                  onClick={() => setSeverityFilter('high')}
                  className="text-xs h-8 text-orange-600 border-orange-200 hover:text-orange-700 hover:bg-orange-50"
                >
                  High ({severityCounts.high})
                </Button>
                <Button 
                  variant={severityFilter === 'medium' ? 'primary' : 'outline'} 
                  size="sm" 
                  onClick={() => setSeverityFilter('medium')}
                  className="text-xs h-8 text-yellow-600 border-yellow-200 hover:text-yellow-700 hover:bg-yellow-50"
                >
                  Medium ({severityCounts.medium})
                </Button>
                <Button 
                  variant={severityFilter === 'low' ? 'primary' : 'outline'} 
                  size="sm" 
                  onClick={() => setSeverityFilter('low')}
                  className="text-xs h-8 text-blue-600 border-blue-200 hover:text-blue-700 hover:bg-blue-50"
                >
                  Low ({severityCounts.low})
                </Button>
              </div>
            </div>
          </div>

          {/* Alerts List */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 px-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <button 
                  className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => toggleSort('severity')}
                >
                  <span>Severity</span>
                  {sortField === 'severity' && (
                    sortDirection === 'asc' ? 
                    <ArrowUp className="h-3 w-3 ml-1" /> : 
                    <ArrowDown className="h-3 w-3 ml-1" />
                  )}
                </button>
                <span>Alert</span>
              </div>
              <button 
                className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => toggleSort('timestamp')}
              >
                <span>Time</span>
                {sortField === 'timestamp' && (
                  sortDirection === 'asc' ? 
                  <ArrowUp className="h-3 w-3 ml-1" /> : 
                  <ArrowDown className="h-3 w-3 ml-1" />
                )}
              </button>
            </div>
            
            {sortedAlerts.length > 0 ? (
              sortedAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`w-3 h-3 mt-1 rounded-full ${getSeverityColor(alert.severity)}`}></div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{alert.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{alert.message}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <Bell className="h-3.5 w-3.5 mr-1" />
                          <span>{alert.source}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        <span>
                          {typeof alert.timestamp === 'string' ? alert.timestamp : alert.timestamp.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Badge variant={
                          alert.status === 'active' ? 'outline' :
                          alert.status === 'acknowledged' ? 'secondary' :
                          'success'
                        }>
                          {alert.status}
                        </Badge>
                        
                        {alert.status === 'active' && (
                          <div className="flex space-x-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => onAlertAction?.(alert.id, 'acknowledge')}
                              className="h-6 px-2 text-xs"
                            >
                              Acknowledge
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => onAlertAction?.(alert.id, 'resolve')}
                              className="h-6 px-2 text-xs text-green-600"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Resolve
                            </Button>
                          </div>
                        )}
                        
                        {alert.status === 'acknowledged' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onAlertAction?.(alert.id, 'resolve')}
                            className="h-6 px-2 text-xs text-green-600"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <AlertCircle className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No alerts found matching the current filters.</p>
              </div>
            )}
          </div>
          
          {/* Alerts List Footer */}
          {sortedAlerts.length > 0 && (
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <div>
                Showing {sortedAlerts.length} of {alerts.length} alerts
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Add explicit displayName
AlertHistoryList.displayName = "AlertHistoryList";

// Export default is already there
export default AlertHistoryList; 
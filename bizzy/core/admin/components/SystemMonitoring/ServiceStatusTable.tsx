import React, { useState } from 'react';
import { Card, CardContent } from '../../../shared/ui/components/Card';
import { Button } from '../../../shared/ui/components/Button';
import { Badge } from '../../../shared/ui/components/Badge';
import { 
  Server, 
  RefreshCw, 
  PlayCircle, 
  StopCircle, 
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
  Clock,
  Search
} from 'lucide-react';
import { SystemService } from './types';
import { Input } from '../../../shared/ui/components/Input';
import DropdownMenu, { DropdownMenuItem } from '../../../shared/ui/components/DropdownMenu';

interface ServiceStatusTableProps {
  services: SystemService[];
  onServiceAction?: (serviceId: string, action: 'restart' | 'stop' | 'start') => void;
}

const ServiceStatusTable: React.FC<ServiceStatusTableProps> = ({ 
  services,
  onServiceAction 
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'healthy' | 'warning' | 'error' | 'inactive'>('all');

  // Filter services based on search and status
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get counts for each status
  const counts = {
    all: services.length,
    healthy: services.filter(s => s.status === 'healthy').length,
    warning: services.filter(s => s.status === 'warning').length,
    error: services.filter(s => s.status === 'error').length,
    inactive: services.filter(s => s.status === 'inactive').length,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
        Service Status
      </h2>

      <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg">
        <CardContent className="p-5">
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-80">
              <Input
                type="text"
                placeholder="Search services..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-10 py-2 w-full"
              />
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant={statusFilter === 'all' ? 'primary' : 'outline'} 
                size="sm" 
                onClick={() => setStatusFilter('all')}
                className="text-xs h-8"
              >
                All ({counts.all})
              </Button>
              <Button 
                variant={statusFilter === 'healthy' ? 'primary' : 'outline'} 
                size="sm" 
                onClick={() => setStatusFilter('healthy')}
                className="text-xs h-8 text-green-600 border-green-200 hover:text-green-700 hover:bg-green-50"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Healthy ({counts.healthy})
              </Button>
              <Button 
                variant={statusFilter === 'warning' ? 'primary' : 'outline'} 
                size="sm" 
                onClick={() => setStatusFilter('warning')}
                className="text-xs h-8 text-yellow-600 border-yellow-200 hover:text-yellow-700 hover:bg-yellow-50"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Warning ({counts.warning})
              </Button>
              <Button 
                variant={statusFilter === 'error' ? 'primary' : 'outline'} 
                size="sm" 
                onClick={() => setStatusFilter('error')}
                className="text-xs h-8 text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Error ({counts.error})
              </Button>
              <Button 
                variant={statusFilter === 'inactive' ? 'primary' : 'outline'} 
                size="sm" 
                onClick={() => setStatusFilter('inactive')}
                className="text-xs h-8 text-gray-500 border-gray-200 hover:text-gray-700 hover:bg-gray-50"
              >
                <StopCircle className="h-3 w-3 mr-1" />
                Inactive ({counts.inactive})
              </Button>
            </div>
          </div>

          {/* Services Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Service
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Uptime
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Server className="h-5 w-5 mr-3 text-blue-500" />
                          <div className="font-medium text-gray-900 dark:text-white">
                            {service.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant={
                          service.status === 'healthy' ? 'success' :
                          service.status === 'warning' ? 'warning' :
                          service.status === 'error' ? 'destructive' : 'outline'
                        }>
                          {service.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                          {typeof service.lastUpdated === 'string' ? service.lastUpdated : service.lastUpdated.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {service.uptime || '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onServiceAction?.(service.id, 'restart')}
                            className="h-8 px-3 text-blue-600"
                            disabled={service.status === 'inactive'}
                          >
                            <RefreshCw className="h-3.5 w-3.5 mr-1" />
                            Restart
                          </Button>
                          
                          <DropdownMenu
                            trigger={
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            }
                            align="end"
                          >
                            {service.status !== 'inactive' && (
                              <DropdownMenuItem onClick={() => onServiceAction?.(service.id, 'stop')}>
                                <StopCircle className="h-4 w-4 mr-2 text-gray-500" />
                                <span>Stop Service</span>
                              </DropdownMenuItem>
                            )}
                            {service.status === 'inactive' && (
                              <DropdownMenuItem onClick={() => onServiceAction?.(service.id, 'start')}>
                                <PlayCircle className="h-4 w-4 mr-2 text-green-500" />
                                <span>Start Service</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                      No services found matching the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer */}
          <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <div>
              Showing {filteredServices.length} of {services.length} services
            </div>
            <div>
              Last refreshed: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Add explicit displayName
ServiceStatusTable.displayName = "ServiceStatusTable";

// Export default is already there
export default ServiceStatusTable; 
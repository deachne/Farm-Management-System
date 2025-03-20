import React, { useState } from 'react';
import { Card, CardContent } from '../../../shared/ui/components/Card';
import { Button } from '../../../shared/ui/components/Button';
import { Badge } from '../../../shared/ui/components/Badge';
import { Input } from '../../../shared/ui/components/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../shared/ui/components/Tabs';
import { 
  FileText,
  Search,
  Download,
  Filter,
  ChevronDown,
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Terminal
} from 'lucide-react';
import { LogEntry } from './types';

interface LogViewerProps {
  logs: LogEntry[];
  onDownloadLogs?: (logSource?: string) => void;
}

const LogViewer: React.FC<LogViewerProps> = ({ 
  logs,
  onDownloadLogs 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'debug'>('all');
  const [activeSource, setActiveSource] = useState<string>('all');
  
  // Extract unique sources from logs
  const sources = ['all', ...Array.from(new Set(logs.map(log => log.source)))];
  
  // Filter logs based on active source, search term, and level filter
  const filteredLogs = logs.filter(log => {
    const matchesSource = activeSource === 'all' || log.source === activeSource;
    const matchesSearch = 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.metadata && JSON.stringify(log.metadata).toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    
    return matchesSource && matchesSearch && matchesLevel;
  });
  
  // Level counts for the current source
  const sourceLogs = logs.filter(log => activeSource === 'all' || log.source === activeSource);
  const levelCounts = {
    all: sourceLogs.length,
    info: sourceLogs.filter(log => log.level === 'info').length,
    warning: sourceLogs.filter(log => log.level === 'warning').length,
    error: sourceLogs.filter(log => log.level === 'error').length,
    debug: sourceLogs.filter(log => log.level === 'debug').length
  };
  
  // Get icon for log level
  const getLevelIcon = (level: string) => {
    switch(level) {
      case 'error': 
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': 
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': 
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'debug': 
        return <Terminal className="h-4 w-4 text-gray-500" />;
      default: 
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get color class for log level
  const getLevelColorClass = (level: string) => {
    switch(level) {
      case 'error': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'info': return 'text-blue-600 dark:text-blue-400';
      case 'debug': return 'text-gray-600 dark:text-gray-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
        System Logs
      </h2>

      <Tabs 
        defaultValue={sources[0]} 
        value={activeSource} 
        onValueChange={setActiveSource}
        className="space-y-4"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <TabsList className="bg-blue-50 dark:bg-gray-800 p-1 rounded-lg">
            {sources.map(source => (
              <TabsTrigger 
                key={source} 
                value={source}
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
              >
                {source === 'all' ? 'All Logs' : source}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDownloadLogs?.(activeSource !== 'all' ? activeSource : undefined)}
              className="h-8"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Download Logs
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="h-8"
            >
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Refresh
            </Button>
          </div>
        </div>
        
        {sources.map(source => (
          <TabsContent key={source} value={source} className="space-y-4">
            <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg">
              <CardContent className="p-5">
                {/* Search and Filter Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div className="relative w-full md:w-80">
                    <Input
                      type="text"
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 py-2 w-full"
                    />
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      <Filter className="h-4 w-4 inline mr-1" />
                      Level:
                    </span>
                    <div className="flex space-x-1.5">
                      <Button 
                        variant={levelFilter === 'all' ? 'primary' : 'outline'} 
                        size="sm" 
                        onClick={() => setLevelFilter('all')}
                        className="text-xs h-8"
                      >
                        All ({levelCounts.all})
                      </Button>
                      <Button 
                        variant={levelFilter === 'error' ? 'primary' : 'outline'} 
                        size="sm" 
                        onClick={() => setLevelFilter('error')}
                        className="text-xs h-8 text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50"
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Errors ({levelCounts.error})
                      </Button>
                      <Button 
                        variant={levelFilter === 'warning' ? 'primary' : 'outline'} 
                        size="sm" 
                        onClick={() => setLevelFilter('warning')}
                        className="text-xs h-8 text-yellow-600 border-yellow-200 hover:text-yellow-700 hover:bg-yellow-50"
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Warnings ({levelCounts.warning})
                      </Button>
                      <Button 
                        variant={levelFilter === 'info' ? 'primary' : 'outline'} 
                        size="sm" 
                        onClick={() => setLevelFilter('info')}
                        className="text-xs h-8 text-blue-600 border-blue-200 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Info className="h-3 w-3 mr-1" />
                        Info ({levelCounts.info})
                      </Button>
                      <Button 
                        variant={levelFilter === 'debug' ? 'primary' : 'outline'} 
                        size="sm" 
                        onClick={() => setLevelFilter('debug')}
                        className="text-xs h-8 text-gray-600 border-gray-200 hover:text-gray-700 hover:bg-gray-50"
                      >
                        <Terminal className="h-3 w-3 mr-1" />
                        Debug ({levelCounts.debug})
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Logs Display */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-[500px] overflow-y-auto font-mono text-sm">
                  {filteredLogs.length > 0 ? (
                    <table className="min-w-full">
                      <tbody>
                        {filteredLogs.map((log) => (
                          <tr 
                            key={log.id}
                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
                          >
                            <td className="py-2 px-3 whitespace-nowrap w-36 text-gray-500 dark:text-gray-400">
                              <div className="flex items-center">
                                <Clock className="h-3.5 w-3.5 mr-1.5" />
                                {typeof log.timestamp === 'string' ? log.timestamp : log.timestamp.toLocaleTimeString()}
                              </div>
                            </td>
                            <td className="py-2 px-3 whitespace-nowrap w-20">
                              <Badge variant={
                                log.level === 'error' ? 'destructive' :
                                log.level === 'warning' ? 'warning' :
                                log.level === 'info' ? 'default' :
                                'outline'
                              }>
                                <div className="flex items-center">
                                  {getLevelIcon(log.level)}
                                  <span className="ml-1">{log.level}</span>
                                </div>
                              </Badge>
                            </td>
                            {activeSource === 'all' && (
                              <td className="py-2 px-3 whitespace-nowrap w-32 text-gray-600 dark:text-gray-400">
                                {log.source}
                              </td>
                            )}
                            <td className="py-2 px-3 break-all">
                              <span className={`font-medium ${getLevelColorClass(log.level)}`}>
                                {log.message}
                              </span>
                              {log.metadata && (
                                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                  {Object.entries(log.metadata).map(([key, value]) => (
                                    <div key={key} className="ml-2">
                                      <span className="font-semibold">{key}:</span> {JSON.stringify(value)}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                        <p>No logs found matching the current filters</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Log Footer */}
                <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <div>
                    Showing {filteredLogs.length} of {sourceLogs.length} logs
                  </div>
                  <div>
                    Last refreshed: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

// Add explicit displayName
LogViewer.displayName = "LogViewer";

// Export default is already there
export default LogViewer; 
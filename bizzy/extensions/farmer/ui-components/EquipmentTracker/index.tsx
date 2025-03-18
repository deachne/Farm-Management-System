import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { EquipmentTrackerProps, Equipment } from './types';

// Helper function to get Icon for equipment type
const getEquipmentIcon = (type: Equipment['type']) => {
  switch (type) {
    case 'tractor':
      return '🚜';
    case 'harvester':
      return '🌾';
    case 'plow':
      return '⚒️';
    case 'seeder':
      return '🌱';
    case 'sprayer':
      return '💦';
    case 'truck':
      return '🚚';
    default:
      return '⚙️';
  }
};

// Helper function to get color for equipment status
const getStatusColor = (status: Equipment['status']) => {
  switch (status) {
    case 'operational':
      return 'bg-green-100 text-green-800';
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-800';
    case 'repair':
      return 'bg-red-100 text-red-800';
    case 'idle':
      return 'bg-gray-100 text-gray-800';
    case 'in-use':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const EquipmentTracker: React.FC<EquipmentTrackerProps> = ({
  equipment,
  onEquipmentSelect,
  onStatusChange,
  onAssignTask,
  viewMode: initialViewMode = 'list',
  filterByType: initialFilterType = 'all',
  filterByStatus: initialFilterStatus = 'all'
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>(initialViewMode);
  const [filterByType, setFilterByType] = useState<Equipment['type'] | 'all'>(initialFilterType);
  const [filterByStatus, setFilterByStatus] = useState<Equipment['status'] | 'all'>(initialFilterStatus);
  
  // Filter equipment based on current filters
  const filteredEquipment = equipment.filter((item) => {
    let typeMatch = filterByType === 'all' || item.type === filterByType;
    let statusMatch = filterByStatus === 'all' || item.status === filterByStatus;
    return typeMatch && statusMatch;
  });
  
  // Handler for status change
  const handleStatusChange = (equipmentId: string, newStatus: Equipment['status']) => {
    if (onStatusChange) {
      onStatusChange(equipmentId, newStatus);
    }
  };
  
  // Helper to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Render List View
  const renderListView = () => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Operator
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Maintenance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEquipment.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onEquipmentSelect && onEquipmentSelect(item.id)}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-2xl mr-2">{getEquipmentIcon(item.type)}</div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.manufacturer} {item.model} ({item.year})</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.currentLocation?.fieldName || 'Not in field'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.currentOperator || 'Unassigned'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Last: {formatDate(item.lastMaintenance)}</div>
                  <div className="text-sm text-gray-500">Next: {formatDate(item.nextScheduledMaintenance)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select 
                    className="rounded border border-gray-300 p-1 mr-2"
                    value={item.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleStatusChange(item.id, e.target.value as Equipment['status']);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="operational">Operational</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="repair">Repair</option>
                    <option value="idle">Idle</option>
                    <option value="in-use">In Use</option>
                  </select>
                  <button 
                    className="text-indigo-600 hover:text-indigo-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAssignTask && onAssignTask(item.id, {
                        id: `task-${Date.now()}`,
                        name: 'New Task'
                      });
                    }}
                  >
                    Assign Task
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Render Grid View
  const renderGridView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEquipment.map((item) => (
          <div 
            key={item.id} 
            className="border rounded-lg p-4 hover:shadow-md cursor-pointer"
            onClick={() => onEquipmentSelect && onEquipmentSelect(item.id)}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="text-3xl mr-2">{getEquipmentIcon(item.type)}</div>
                <div>
                  <h3 className="text-lg font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.manufacturer} {item.model}</p>
                </div>
              </div>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
            </div>
            
            <div className="mt-4 space-y-2">
              {item.currentLocation?.fieldName && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Location:</span>
                  <span className="text-sm">{item.currentLocation.fieldName}</span>
                </div>
              )}
              
              {item.fuelLevel !== undefined && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Fuel:</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2.5 mt-1">
                    <div 
                      className={`h-2.5 rounded-full ${
                        item.fuelLevel > 60 ? 'bg-green-500' : 
                        item.fuelLevel > 30 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} 
                      style={{ width: `${item.fuelLevel}%` }}
                    />
                  </div>
                </div>
              )}
              
              {item.hoursUsed !== undefined && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Hours:</span>
                  <span className="text-sm">{item.hoursUsed} hrs</span>
                </div>
              )}
              
              {item.nextScheduledMaintenance && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Next Service:</span>
                  <span className="text-sm">{formatDate(item.nextScheduledMaintenance)}</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex justify-between">
              <select 
                className="rounded border border-gray-300 text-sm p-1"
                value={item.status}
                onChange={(e) => {
                  e.stopPropagation();
                  handleStatusChange(item.id, e.target.value as Equipment['status']);
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="operational">Operational</option>
                <option value="maintenance">Maintenance</option>
                <option value="repair">Repair</option>
                <option value="idle">Idle</option>
                <option value="in-use">In Use</option>
              </select>
              
              <button 
                className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAssignTask && onAssignTask(item.id, {
                    id: `task-${Date.now()}`,
                    name: 'New Task'
                  });
                }}
              >
                Assign Task
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Render Map View (placeholder)
  const renderMapView = () => {
    return (
      <div className="relative h-[500px] bg-gray-100 rounded-lg">
        {/* Placeholder for actual map */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">Map View (Placeholder)</p>
        </div>
        
        {/* Equipment Markers Simulation */}
        <div className="absolute inset-0">
          {filteredEquipment
            .filter(item => item.currentLocation?.lat && item.currentLocation?.lng)
            .map(item => (
              <div 
                key={item.id}
                style={{
                  position: 'absolute',
                  left: `${(item.currentLocation!.lng % 100) / 100 * 90 + 5}%`,
                  top: `${(item.currentLocation!.lat % 100) / 100 * 90 + 5}%`,
                  cursor: 'pointer'
                }}
                onClick={() => onEquipmentSelect && onEquipmentSelect(item.id)}
                title={item.name}
              >
                <div className="flex flex-col items-center">
                  <div className="text-3xl">{getEquipmentIcon(item.type)}</div>
                  <div className="text-xs bg-white px-1 rounded shadow">
                    {item.name}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <h2 className="text-lg font-semibold mb-2 sm:mb-0">Equipment Tracker</h2>
          
          <div className="flex flex-wrap gap-2">
            {/* View Mode Toggles */}
            <div className="flex rounded-md shadow-sm">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                } border-t border-b border-gray-300`}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  viewMode === 'map' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
                onClick={() => setViewMode('map')}
              >
                Map
              </button>
            </div>
            
            {/* Type Filter */}
            <select
              className="rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm"
              value={filterByType}
              onChange={(e) => setFilterByType(e.target.value as any)}
            >
              <option value="all">All Types</option>
              <option value="tractor">Tractors</option>
              <option value="harvester">Harvesters</option>
              <option value="plow">Plows</option>
              <option value="seeder">Seeders</option>
              <option value="sprayer">Sprayers</option>
              <option value="truck">Trucks</option>
              <option value="other">Other</option>
            </select>
            
            {/* Status Filter */}
            <select
              className="rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm"
              value={filterByStatus}
              onChange={(e) => setFilterByStatus(e.target.value as any)}
            >
              <option value="all">All Statuses</option>
              <option value="operational">Operational</option>
              <option value="maintenance">Maintenance</option>
              <option value="repair">Repair</option>
              <option value="idle">Idle</option>
              <option value="in-use">In Use</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {filteredEquipment.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No equipment found matching the current filters.
          </div>
        ) : (
          <>
            {viewMode === 'list' && renderListView()}
            {viewMode === 'grid' && renderGridView()}
            {viewMode === 'map' && renderMapView()}
          </>
        )}
      </div>
    </Card>
  );
};

export default EquipmentTracker; 
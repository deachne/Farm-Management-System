export interface Equipment {
  id: string;
  name: string;
  type: 'tractor' | 'harvester' | 'plow' | 'seeder' | 'sprayer' | 'truck' | 'other';
  manufacturer: string;
  model: string;
  year: number;
  status: 'operational' | 'maintenance' | 'repair' | 'idle' | 'in-use';
  lastMaintenance?: string; // ISO date string
  nextScheduledMaintenance?: string; // ISO date string
  currentLocation?: {
    lat: number;
    lng: number;
    fieldId?: string;
    fieldName?: string;
  };
  currentOperator?: string;
  fuelLevel?: number; // percentage
  hoursUsed?: number;
  assignedTask?: {
    id: string;
    name: string;
    startTime?: string; // ISO date string
    endTime?: string; // ISO date string
    fieldId?: string;
    fieldName?: string;
  };
  notes?: string;
}

export interface EquipmentTrackerProps {
  equipment: Equipment[];
  onEquipmentSelect?: (equipmentId: string) => void;
  onStatusChange?: (equipmentId: string, newStatus: Equipment['status']) => void;
  onAssignTask?: (equipmentId: string, taskData: Equipment['assignedTask']) => void;
  viewMode?: 'list' | 'grid' | 'map';
  filterByType?: Equipment['type'] | 'all';
  filterByStatus?: Equipment['status'] | 'all';
} 
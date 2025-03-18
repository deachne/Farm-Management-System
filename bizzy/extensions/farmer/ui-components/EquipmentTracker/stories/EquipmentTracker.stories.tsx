import type { Meta, StoryObj } from '@storybook/react';
import EquipmentTracker from '../index';
import { Equipment } from '../types';

const meta: Meta<typeof EquipmentTracker> = {
  title: 'Agriculture/EquipmentTracker',
  component: EquipmentTracker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EquipmentTracker>;

// Generate mock equipment data
const mockEquipment: Equipment[] = [
  {
    id: 'tractor-1',
    name: 'John Deere 8R',
    type: 'tractor',
    manufacturer: 'John Deere',
    model: '8R 410',
    year: 2022,
    status: 'operational',
    lastMaintenance: '2024-02-15',
    nextScheduledMaintenance: '2024-06-15',
    currentLocation: {
      lat: 42.5,
      lng: -89.5,
      fieldId: 'field1',
      fieldName: 'North Field'
    },
    currentOperator: 'Mike Johnson',
    fuelLevel: 85,
    hoursUsed: 120,
    notes: 'New tractor, performs well in all conditions'
  },
  {
    id: 'tractor-2',
    name: 'Case IH Magnum',
    type: 'tractor',
    manufacturer: 'Case IH',
    model: 'Magnum 340',
    year: 2019,
    status: 'maintenance',
    lastMaintenance: '2023-11-20',
    nextScheduledMaintenance: '2024-03-20',
    fuelLevel: 30,
    hoursUsed: 3200,
    notes: 'Scheduled for transmission check and fluid change'
  },
  {
    id: 'harvester-1',
    name: 'New Holland CR',
    type: 'harvester',
    manufacturer: 'New Holland',
    model: 'CR9.90',
    year: 2020,
    status: 'idle',
    lastMaintenance: '2023-12-10',
    nextScheduledMaintenance: '2024-08-01',
    currentLocation: {
      lat: 42.6,
      lng: -89.6,
      fieldId: 'field2',
      fieldName: 'South Field'
    },
    fuelLevel: 60,
    hoursUsed: 950,
    notes: 'Ready for the next harvest season'
  },
  {
    id: 'seeder-1',
    name: 'Kinze Planter',
    type: 'seeder',
    manufacturer: 'Kinze',
    model: '3660',
    year: 2021,
    status: 'in-use',
    lastMaintenance: '2024-03-01',
    currentLocation: {
      lat: 42.4,
      lng: -89.7,
      fieldId: 'field3',
      fieldName: 'East Field'
    },
    currentOperator: 'Sarah Miller',
    fuelLevel: 45,
    hoursUsed: 250,
    assignedTask: {
      id: 'task-1',
      name: 'Corn Planting',
      startTime: '2024-03-15T08:00:00Z',
      endTime: '2024-03-20T18:00:00Z',
      fieldId: 'field3',
      fieldName: 'East Field'
    }
  },
  {
    id: 'sprayer-1',
    name: 'John Deere R4045',
    type: 'sprayer',
    manufacturer: 'John Deere',
    model: 'R4045',
    year: 2018,
    status: 'repair',
    lastMaintenance: '2023-10-05',
    fuelLevel: 10,
    hoursUsed: 1800,
    notes: 'Pump needs replacement, parts on order'
  },
  {
    id: 'truck-1',
    name: 'Ford F-650',
    type: 'truck',
    manufacturer: 'Ford',
    model: 'F-650',
    year: 2017,
    status: 'operational',
    lastMaintenance: '2024-01-15',
    nextScheduledMaintenance: '2024-07-15',
    currentOperator: 'Tom Wilson',
    fuelLevel: 70,
    hoursUsed: 5300,
    assignedTask: {
      id: 'task-2',
      name: 'Grain Transport',
      startTime: '2024-03-16T09:00:00Z',
      fieldId: 'field2',
      fieldName: 'South Field'
    }
  },
  {
    id: 'plow-1',
    name: 'Sunflower 6631',
    type: 'plow',
    manufacturer: 'Sunflower',
    model: '6631',
    year: 2019,
    status: 'idle',
    lastMaintenance: '2023-11-30',
    nextScheduledMaintenance: '2024-05-30',
    fuelLevel: 0,
    hoursUsed: 600
  },
  {
    id: 'other-1',
    name: 'GPS Guidance System',
    type: 'other',
    manufacturer: 'Trimble',
    model: 'Autopilot',
    year: 2021,
    status: 'operational',
    lastMaintenance: '2023-12-12',
    nextScheduledMaintenance: '2024-06-12',
    notes: 'Used across multiple vehicles'
  }
];

export const Default: Story = {
  args: {
    equipment: mockEquipment,
    onEquipmentSelect: (equipmentId) => {
      console.log(`Equipment selected: ${equipmentId}`);
    },
    onStatusChange: (equipmentId, newStatus) => {
      console.log(`Status changed for ${equipmentId} to ${newStatus}`);
    },
    onAssignTask: (equipmentId, taskData) => {
      console.log(`Task assigned to ${equipmentId}:`, taskData);
    }
  }
};

export const ListView: Story = {
  args: {
    equipment: mockEquipment,
    viewMode: 'list'
  }
};

export const GridView: Story = {
  args: {
    equipment: mockEquipment,
    viewMode: 'grid'
  }
};

export const MapView: Story = {
  args: {
    equipment: mockEquipment,
    viewMode: 'map'
  }
};

export const FilteredByTractors: Story = {
  args: {
    equipment: mockEquipment,
    filterByType: 'tractor'
  }
};

export const FilteredByStatus: Story = {
  args: {
    equipment: mockEquipment,
    filterByStatus: 'in-use'
  }
}; 
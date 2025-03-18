import type { Meta, StoryObj } from '@storybook/react';
import CropCalendar from '../index';
import { CropEvent } from '../types';

const meta: Meta<typeof CropCalendar> = {
  title: 'Agriculture/CropCalendar',
  component: CropCalendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CropCalendar>;

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);

const getISODate = (date: Date) => date.toISOString().split('T')[0];

const mockEvents: CropEvent[] = [
  {
    id: '1',
    title: 'Plant Corn',
    start: getISODate(lastWeek),
    cropType: 'Corn',
    fieldId: '1',
    fieldName: 'North Field',
    type: 'planting',
    status: 'completed',
    notes: 'Used new hybrid seeds'
  },
  {
    id: '2',
    title: 'Fertilize Soybeans',
    start: getISODate(today),
    cropType: 'Soybeans',
    fieldId: '2',
    fieldName: 'South Field',
    type: 'fertilizing',
    status: 'in-progress'
  },
  {
    id: '3',
    title: 'Harvest Wheat',
    start: getISODate(nextWeek),
    cropType: 'Wheat',
    fieldId: '3',
    fieldName: 'East Field',
    type: 'harvesting',
    status: 'planned'
  },
  {
    id: '4',
    title: 'Pest Control',
    start: getISODate(tomorrow),
    cropType: 'Corn',
    fieldId: '1',
    fieldName: 'North Field',
    type: 'pesticide',
    status: 'planned'
  },
  {
    id: '5',
    title: 'Irrigation Maintenance',
    start: getISODate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3)),
    cropType: 'All',
    fieldId: '4',
    fieldName: 'All Fields',
    type: 'irrigation',
    status: 'planned'
  }
];

export const Default: Story = {
  args: {
    events: mockEvents,
    onEventClick: (event) => {
      console.log('Event clicked:', event);
    },
    onDateSelect: (date) => {
      console.log('Date selected:', date);
    },
    onViewChange: (view) => {
      console.log('View changed to:', view);
    }
  }
};

export const EmptyCalendar: Story = {
  args: {
    events: [],
  }
};

export const WeekView: Story = {
  args: {
    events: mockEvents,
    currentView: 'week',
  }
};

export const DayView: Story = {
  args: {
    events: mockEvents,
    currentView: 'day',
  }
}; 
export interface CropEvent {
  id: string;
  title: string;
  start: string; // ISO date string
  end?: string; // ISO date string
  cropType: string;
  fieldId: string;
  fieldName: string;
  type: 'planting' | 'harvesting' | 'fertilizing' | 'pesticide' | 'irrigation' | 'maintenance' | 'other';
  status?: 'planned' | 'in-progress' | 'completed' | 'delayed' | 'cancelled';
  notes?: string;
}

export interface CropCalendarProps {
  events: CropEvent[];
  onEventClick?: (event: CropEvent) => void;
  onDateSelect?: (date: Date) => void;
  onViewChange?: (view: 'month' | 'week' | 'day' | 'agenda') => void;
  currentView?: 'month' | 'week' | 'day' | 'agenda';
  currentDate?: Date;
} 
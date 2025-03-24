import React, { useState, useEffect } from 'react';
import { useNotes } from '../hooks/useNotes';
import { Note } from '../types';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

type CalendarViewMode = 'day' | 'week' | 'month';

interface DateNavigatorProps {
  date: Date;
  onDateChange: (date: Date) => void;
  viewMode: CalendarViewMode;
}

interface MonthGridProps {
  selectedDate: Date;
  groupedNotes: Record<string, Note[]>;
  onDateSelect: (date: Date) => void;
}

interface WeekGridProps {
  selectedDate: Date;
  groupedNotes: Record<string, Note[]>;
  onDateSelect: (date: Date) => void;
}

interface DayViewProps {
  selectedDate: Date;
  notes: Note[];
  onSelectNote?: (noteId: string) => void;
}

interface ViewModeSelectorProps {
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
}

// Format a date as yyyy-MM-dd for using as record keys
const formatDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Format date for display
const formatDateForDisplay = (date: Date, viewMode: CalendarViewMode): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  };
  
  if (viewMode === 'month') {
    return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  } else if (viewMode === 'week') {
    const endOfWeek = new Date(date);
    endOfWeek.setDate(date.getDate() + 6);
    return `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
  } else {
    return date.toLocaleDateString(undefined, options);
  }
};

// Check if two dates represent the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// Helper hook to calculate date range based on view mode
const useDateRange = (selectedDate: Date, viewMode: CalendarViewMode) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  
  useEffect(() => {
    const start = new Date(selectedDate);
    const end = new Date(selectedDate);
    
    if (viewMode === 'day') {
      // For day view, start and end are the same day
      setStartDate(start);
      setEndDate(end);
    } else if (viewMode === 'week') {
      // For week view, adjust to the start of the week (Sunday)
      const day = start.getDay();
      start.setDate(start.getDate() - day); // Go to Sunday
      end.setDate(start.getDate() + 6); // Go to Saturday
      setStartDate(start);
      setEndDate(end);
    } else if (viewMode === 'month') {
      // For month view, get the first and last day of the month
      start.setDate(1); // First day of the month
      end.setMonth(end.getMonth() + 1);
      end.setDate(0); // Last day of the month
      setStartDate(start);
      setEndDate(end);
    }
  }, [selectedDate, viewMode]);
  
  return { startDate, endDate };
};

// Date Navigator Component
export const DateNavigator: React.FC<DateNavigatorProps> = ({ date, onDateChange, viewMode }) => {
  const goToToday = () => {
    onDateChange(new Date());
  };
  
  const goToPrevious = () => {
    const newDate = new Date(date);
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    onDateChange(newDate);
  };
  
  const goToNext = () => {
    const newDate = new Date(date);
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    onDateChange(newDate);
  };
  
  return (
    <div className="flex items-center gap-2 mb-4">
      <button 
        onClick={goToPrevious}
        className="p-2 rounded hover:bg-gray-100"
      >
        <ChevronLeft size={18} />
      </button>
      <button 
        onClick={goToToday}
        className="px-3 py-1 rounded hover:bg-gray-100 text-sm"
      >
        Today
      </button>
      <button 
        onClick={goToNext}
        className="p-2 rounded hover:bg-gray-100"
      >
        <ChevronRight size={18} />
      </button>
      <div className="text-lg font-medium ml-2">
        {formatDateForDisplay(date, viewMode)}
      </div>
    </div>
  );
};

// View Mode Selector Component
export const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="flex border rounded overflow-hidden">
      <button 
        className={`px-3 py-1 text-sm ${viewMode === 'day' ? 'bg-blue-600 text-white' : 'bg-white'}`}
        onClick={() => onViewModeChange('day')}
      >
        Day
      </button>
      <button 
        className={`px-3 py-1 text-sm ${viewMode === 'week' ? 'bg-blue-600 text-white' : 'bg-white'}`}
        onClick={() => onViewModeChange('week')}
      >
        Week
      </button>
      <button 
        className={`px-3 py-1 text-sm ${viewMode === 'month' ? 'bg-blue-600 text-white' : 'bg-white'}`}
        onClick={() => onViewModeChange('month')}
      >
        Month
      </button>
    </div>
  );
};

// Day View Component
export const DayView: React.FC<DayViewProps> = ({ selectedDate, notes, onSelectNote }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="day-view">
      <h3 className="text-lg font-medium mb-4">
        {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
      </h3>
      
      {notes.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No notes for this day
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map(note => (
            <div 
              key={note.id} 
              className="p-4 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => onSelectNote?.(note.id)}
            >
              <div className="flex justify-between items-start">
                <div className="font-medium text-gray-900">{note.noteType || 'Note'}</div>
                <div className="text-sm text-gray-500">
                  {formatTime(note.createdAt)}
                </div>
              </div>
              <div className="mt-2 text-gray-700">
                {note.content.length > 120 ? `${note.content.substring(0, 120)}...` : note.content}
              </div>
              {note.userTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {note.userTags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Week Grid Component
export const WeekGrid: React.FC<WeekGridProps> = ({ selectedDate, groupedNotes, onDateSelect }) => {
  const { startDate } = useDateRange(selectedDate, 'week');
  
  // Generate array of days for the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    return day;
  });
  
  return (
    <div className="grid grid-cols-7 gap-2 mb-4">
      {/* Weekday headings */}
      {weekDays.map((day, i) => (
        <div key={`heading-${i}`} className="text-center font-medium p-2 border-b">
          {day.toLocaleDateString(undefined, { weekday: 'short' })}
          <div className="text-sm font-normal">
            {day.getDate()}
          </div>
        </div>
      ))}
      
      {/* Week grid */}
      {weekDays.map((day, i) => {
        const dateKey = formatDateKey(day);
        const dayNotes = groupedNotes[dateKey] || [];
        const isCurrentDay = isSameDay(day, new Date());
        const isSelected = isSameDay(day, selectedDate);
        
        return (
          <div 
            key={`day-${i}`}
            className={`h-48 overflow-y-auto border p-1 cursor-pointer ${
              isCurrentDay ? 'bg-blue-50' : ''
            } ${
              isSelected ? 'border-blue-500 border-2' : ''
            }`}
            onClick={() => onDateSelect(day)}
          >
            {dayNotes.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No notes
              </div>
            ) : (
              <div className="space-y-1">
                {dayNotes.map(note => (
                  <div 
                    key={note.id}
                    className="text-xs p-1 rounded bg-white border overflow-hidden"
                  >
                    <div className="font-medium truncate">{note.noteType}</div>
                    <div className="truncate">
                      {note.content.substring(0, 50)}
                      {note.content.length > 50 ? '...' : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Month Grid Component
export const MonthGrid: React.FC<MonthGridProps> = ({ selectedDate, groupedNotes, onDateSelect }) => {
  // Get first day of month
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const lastDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  
  // Calculate grid start date (previous month dates to fill first week)
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  // Calculate grid end date (next month dates to fill last week)
  const endDate = new Date(lastDayOfMonth);
  const daysToAdd = 6 - endDate.getDay();
  endDate.setDate(endDate.getDate() + daysToAdd);
  
  // Generate array of weeks
  const weeks = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const week = [];
    
    for (let i = 0; i < 7; i++) {
      week.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    weeks.push(week);
  }
  
  return (
    <div className="month-grid">
      {/* Day headings */}
      <div className="grid grid-cols-7 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      {weeks.map((week, weekIndex) => (
        <div key={`week-${weekIndex}`} className="grid grid-cols-7 gap-1 mb-1">
          {week.map((day, dayIndex) => {
            const dateKey = formatDateKey(day);
            const dayNotes = groupedNotes[dateKey] || [];
            const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
            const isCurrentDay = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDate);
            
            return (
              <div 
                key={`day-${weekIndex}-${dayIndex}`}
                className={`h-24 border overflow-hidden cursor-pointer p-1 ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                } ${
                  isCurrentDay ? 'bg-blue-50' : ''
                } ${
                  isSelected ? 'border-blue-500 border-2' : ''
                }`}
                onClick={() => onDateSelect(day)}
              >
                <div className="text-right">
                  {day.getDate()}
                </div>
                
                {/* Note count indicator */}
                {dayNotes.length > 0 && (
                  <div className="mt-1">
                    {dayNotes.length <= 2 ? (
                      // Show abbreviated notes if only a few
                      dayNotes.map(note => (
                        <div 
                          key={note.id}
                          className="text-xs truncate p-1 mb-1 bg-white rounded border"
                        >
                          {note.noteType}
                        </div>
                      ))
                    ) : (
                      // Show count if many notes
                      <div className="text-xs p-1 bg-blue-100 text-blue-800 rounded-full text-center">
                        {dayNotes.length} notes
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Main Calendar View Component
export const CalendarView: React.FC<{
  onSelectNote?: (noteId: string) => void;
}> = ({ onSelectNote }) => {
  const { notes } = useNotes();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [groupedNotes, setGroupedNotes] = useState<Record<string, Note[]>>({});
  
  // Calculate start and end dates based on view mode
  const { startDate, endDate } = useDateRange(selectedDate, viewMode);
  
  // Group notes by date
  useEffect(() => {
    // Create a map to hold notes grouped by date
    const groupedByDate: Record<string, Note[]> = {};
    
    // Helper function to ensure dates are initialized
    const initDateRange = () => {
      // Create empty arrays for each date in the range
      const current = new Date(startDate);
      while (current <= endDate) {
        const dateKey = formatDateKey(current);
        if (!groupedByDate[dateKey]) {
          groupedByDate[dateKey] = [];
        }
        current.setDate(current.getDate() + 1);
      }
    };
    
    initDateRange();
    
    // Distribute notes into date buckets
    notes.forEach(note => {
      // Use dateStamp if available, otherwise use createdAt
      const noteDate = note.dateStamp || note.createdAt;
      const dateKey = formatDateKey(noteDate);
      
      if (groupedByDate[dateKey]) {
        groupedByDate[dateKey].push(note);
      }
    });
    
    setGroupedNotes(groupedByDate);
  }, [notes, startDate, endDate]);
  
  return (
    <div className="calendar-view p-4">
      <div className="flex justify-between items-center mb-6">
        <DateNavigator 
          date={selectedDate}
          onDateChange={setSelectedDate}
          viewMode={viewMode}
        />
        <ViewModeSelector
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>
      
      <div className="calendar-content">
        {viewMode === 'month' && (
          <MonthGrid 
            selectedDate={selectedDate}
            groupedNotes={groupedNotes}
            onDateSelect={setSelectedDate}
          />
        )}
        {viewMode === 'week' && (
          <WeekGrid 
            selectedDate={selectedDate}
            groupedNotes={groupedNotes}
            onDateSelect={setSelectedDate}
          />
        )}
        {viewMode === 'day' && (
          <DayView 
            selectedDate={selectedDate}
            notes={groupedNotes[formatDateKey(selectedDate)] || []}
            onSelectNote={onSelectNote}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarView; 
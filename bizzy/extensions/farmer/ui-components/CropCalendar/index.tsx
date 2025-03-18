import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { CropCalendarProps, CropEvent } from './types';

const CropCalendar: React.FC<CropCalendarProps> = ({
  events,
  onEventClick,
  onDateSelect,
  onViewChange,
  currentView: initialView = 'month',
  currentDate: initialDate = new Date(),
}) => {
  const [currentView, setCurrentView] = useState(initialView);
  const [currentDate, setCurrentDate] = useState(initialDate);
  
  // Helper to generate calendar grid based on current date
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // Previous month days to fill the first row
    const prevMonthDays = [];
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      prevMonthDays.unshift({
        date: new Date(prevMonthYear, prevMonth, daysInPrevMonth - i),
        isCurrentMonth: false
      });
    }
    
    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Next month days to fill the last row
    const totalDaysDisplayed = prevMonthDays.length + currentMonthDays.length;
    const nextMonthDays = [];
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    
    const daysToAdd = 42 - totalDaysDisplayed; // 6 rows of 7 days
    for (let i = 1; i <= daysToAdd; i++) {
      nextMonthDays.push({
        date: new Date(nextMonthYear, nextMonth, i),
        isCurrentMonth: false
      });
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };
  
  // Filter events for a specific day
  const getEventsForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventStart = event.start.split('T')[0];
      const eventEnd = event.end ? event.end.split('T')[0] : eventStart;
      return eventStart <= dateStr && dateStr <= eventEnd;
    });
  };
  
  // Handle view changes
  const handleViewChange = (view: 'month' | 'week' | 'day' | 'agenda') => {
    setCurrentView(view);
    if (onViewChange) onViewChange(view);
  };
  
  // Navigate to previous/next month, week, or day
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (currentView === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };
  
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (currentView === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };
  
  const navigateToday = () => {
    setCurrentDate(new Date());
  };
  
  // Calendar grid for month view
  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const month = currentDate.toLocaleDateString('en-US', { month: 'long' });
    const year = currentDate.getFullYear();
    
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{month} {year}</h2>
          <div className="flex space-x-2">
            <button onClick={navigatePrevious} className="px-2 py-1 rounded hover:bg-gray-100">
              &lt;
            </button>
            <button onClick={navigateToday} className="px-2 py-1 rounded hover:bg-gray-100">
              Today
            </button>
            <button onClick={navigateNext} className="px-2 py-1 rounded hover:bg-gray-100">
              &gt;
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium py-1">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 flex-1">
          {days.map(({ date, isCurrentMonth }) => {
            const dateEvents = getEventsForDay(date);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div 
                key={date.toISOString()} 
                className={`min-h-[80px] border rounded p-1 ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
                } ${isToday ? 'border-blue-500' : 'border-gray-200'}`}
                onClick={() => onDateSelect && onDateSelect(date)}
              >
                <div className="text-right text-sm mb-1">
                  {date.getDate()}
                </div>
                <div className="space-y-1 overflow-y-auto max-h-[60px]">
                  {dateEvents.slice(0, 3).map(event => (
                    <div 
                      key={event.id}
                      className={`text-xs p-1 rounded text-white truncate cursor-pointer
                        ${event.type === 'planting' ? 'bg-green-500' : 
                        event.type === 'harvesting' ? 'bg-amber-500' : 
                        event.type === 'fertilizing' ? 'bg-blue-500' : 
                        event.type === 'pesticide' ? 'bg-red-500' :
                        event.type === 'irrigation' ? 'bg-cyan-500' :
                        'bg-purple-500'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick && onEventClick(event);
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dateEvents.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dateEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Simplified week view
  const renderWeekView = () => {
    // Implementation of week view would go here
    return (
      <div className="h-full flex flex-col">
        <div className="text-center py-16">
          <p className="text-gray-500">Week view to be implemented</p>
          <p className="text-sm text-gray-400">Showing week of {currentDate.toLocaleDateString()}</p>
        </div>
      </div>
    );
  };
  
  // Simplified day view
  const renderDayView = () => {
    // Implementation of day view would go here
    return (
      <div className="h-full flex flex-col">
        <div className="text-center py-16">
          <p className="text-gray-500">Day view to be implemented</p>
          <p className="text-sm text-gray-400">Showing {currentDate.toLocaleDateString()}</p>
        </div>
      </div>
    );
  };
  
  // Simplified agenda view
  const renderAgendaView = () => {
    // Implementation of agenda view would go here
    return (
      <div className="h-full flex flex-col">
        <div className="text-center py-16">
          <p className="text-gray-500">Agenda view to be implemented</p>
          <p className="text-sm text-gray-400">Showing events around {currentDate.toLocaleDateString()}</p>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="w-full h-[600px] p-4">
      <div className="mb-4 border-b pb-2">
        <div className="flex space-x-4">
          <button
            className={`px-3 py-1 rounded ${currentView === 'month' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            onClick={() => handleViewChange('month')}
          >
            Month
          </button>
          <button
            className={`px-3 py-1 rounded ${currentView === 'week' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            onClick={() => handleViewChange('week')}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 rounded ${currentView === 'day' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            onClick={() => handleViewChange('day')}
          >
            Day
          </button>
          <button
            className={`px-3 py-1 rounded ${currentView === 'agenda' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            onClick={() => handleViewChange('agenda')}
          >
            Agenda
          </button>
        </div>
      </div>
      
      <div className="h-[calc(100%-3rem)]">
        {currentView === 'month' && renderMonthView()}
        {currentView === 'week' && renderWeekView()}
        {currentView === 'day' && renderDayView()}
        {currentView === 'agenda' && renderAgendaView()}
      </div>
    </Card>
  );
};

export default CropCalendar; 
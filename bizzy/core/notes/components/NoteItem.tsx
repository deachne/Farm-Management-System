import React from 'react';
import { Note } from '../types';

interface NoteItemProps {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
}

/**
 * Component for displaying a single note item in the list
 */
export const NoteItem: React.FC<NoteItemProps> = ({ note, isSelected, onClick }) => {
  // Function to format time for display
  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true
    };
    return new Date(date).toLocaleTimeString(undefined, options);
  };
  
  // Function to format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get a preview of the content (first few characters)
  const getContentPreview = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  };

  // Use dateStamp if available, otherwise fall back to createdAt
  const displayDate = note.dateStamp || note.createdAt;

  return (
    <div
      onClick={onClick}
      className={`
        px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg border
        ${isSelected 
          ? 'bg-blue-50 border-l-4 border-blue-600 shadow-sm' 
          : 'border-gray-300 hover:shadow-sm'}
      `}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-gray-900">{note.noteType || 'General'}</h4>
        <div className="text-xs text-gray-500 text-right">
          <div>{formatDate(displayDate)}</div>
          <div>{formatTime(note.createdAt)}</div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
        {getContentPreview(note.content, 120)}
      </p>
      
      {note.userTags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {note.userTags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}; 
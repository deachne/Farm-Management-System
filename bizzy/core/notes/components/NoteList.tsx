import React, { useMemo } from 'react';
import { Note } from '../types';
import { NoteItem } from './NoteItem';
import { FolderOpen } from 'lucide-react';

interface NoteListProps {
  notes: Note[];
  onSelectNote: (noteId: string) => void;
  selectedNoteId: string | null;
}

/**
 * Component to display a list of notes grouped by date
 */
export const NoteList: React.FC<NoteListProps> = ({
  notes,
  onSelectNote,
  selectedNoteId,
}) => {
  // Group notes by date
  const groupedNotes = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);
    
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const groups: { [key: string]: Note[] } = {
      'Today': [],
      'Yesterday': [],
      'This Week': [],
      'Last Week': [], 
      'This Month': [],
      'Older': []
    };
    
    notes.forEach(note => {
      // Use dateStamp if available, otherwise use createdAt
      const noteDate = new Date(note.dateStamp || note.createdAt);
      noteDate.setHours(0, 0, 0, 0);
      
      if (noteDate.getTime() === today.getTime()) {
        groups['Today'].push(note);
      } else if (noteDate.getTime() === yesterday.getTime()) {
        groups['Yesterday'].push(note);
      } else if (noteDate >= thisWeekStart) {
        groups['This Week'].push(note);
      } else if (noteDate >= lastWeekStart) {
        groups['Last Week'].push(note);
      } else if (noteDate >= thisMonthStart) {
        groups['This Month'].push(note);
      } else {
        groups['Older'].push(note);
      }
    });
    
    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });
    
    return groups;
  }, [notes]);

  // Sort categories to ensure Today, Yesterday, This Week order
  const categoryOrder = ['Today', 'Yesterday', 'This Week', 'Last Week', 'This Month', 'Older'];
  const sortedCategories = Object.keys(groupedNotes).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <FolderOpen className="h-16 w-16 text-gray-300 mb-4" />
        <p className="text-xl font-medium mb-2">No notes found</p>
        <p className="text-sm text-gray-400">Create a new note to get started</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {sortedCategories.map((category) => (
        <div key={category} className="pb-4">
          <h3 className="text-sm font-medium text-gray-500 px-4 py-2">{category}</h3>
          <div className="space-y-2 px-3">
            {groupedNotes[category].map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                isSelected={note.id === selectedNoteId}
                onClick={() => onSelectNote(note.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}; 
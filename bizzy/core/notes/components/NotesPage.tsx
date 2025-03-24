import React, { useState, useEffect } from 'react';
import { useNotes } from '../hooks/useNotes';
import { Note, NoteSortOrder } from '../types';
import { NoteList } from './NoteList';
import { TagSelector } from './TagSelector';
import { NoteEditor } from './NoteEditor';
import { FileText, Plus, Calendar, Tag as TagIcon } from 'lucide-react';
import { CalendarView } from './CalendarView';
import { TagView } from './TagView';

/**
 * Main Notes page component
 * Enhanced implementation based on Lovable design
 */
export const NotesPage: React.FC = () => {
  const { 
    notes, 
    isLoading, 
    createNote, 
    updateNote, 
    deleteNote,
    addTag,
    removeTag,
    getUserTags,
    updateSort,
    updateFilter,
    sort
  } = useNotes();
  
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'tags'>('list');
  const [isEditing, setIsEditing] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newTagText, setNewTagText] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  
  // Get available tags
  useEffect(() => {
    const tags = getUserTags();
    setAvailableTags(tags);
  }, [notes, getUserTags]);
  
  // Update selectedNote when selectedNoteId changes
  useEffect(() => {
    if (selectedNoteId) {
      const note = notes.find(n => n.id === selectedNoteId);
      setSelectedNote(note || null);
      if (note) {
        setCurrentContent(note.content);
      }
    } else {
      setSelectedNote(null);
      setCurrentContent('');
    }
  }, [selectedNoteId, notes]);
  
  // Handle selecting a note
  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    setIsEditing(false);
  };
  
  // Handle creating a new note
  const handleCreateNote = async () => {
    try {
      const newNote = await createNote({
        content: '',
        noteType: 'General',
        userTags: [],
        aiTags: [],
        dateStamp: new Date(), // Set initial dateStamp to current date
      });
      
      if (newNote) {
        setSelectedNoteId(newNote.id);
        setCurrentContent('');
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };
  
  // Handle deleting a note
  const handleDeleteNote = () => {
    if (selectedNoteId) {
      deleteNote(selectedNoteId);
      setSelectedNoteId(null);
      setSelectedNote(null);
      setCurrentContent('');
    }
  };
  
  // Handle saving the current note
  const handleSaveCurrentNote = () => {
    if (selectedNote && selectedNoteId) {
      updateNote(selectedNoteId, {
        content: currentContent,
        noteType: selectedNote.noteType,
        userTags: selectedNote.userTags,
        aiTags: selectedNote.aiTags,
        category: selectedNote.category,
        dateStamp: selectedNote.dateStamp
      });
      setIsEditing(false);
    }
  };
  
  // Handle canceling edit
  const handleCancelEdit = () => {
    if (selectedNoteId) {
      // Revert to the saved version
      const note = notes.find(n => n.id === selectedNoteId);
      setSelectedNote(note || null);
      if (note) {
        setCurrentContent(note.content);
      }
    }
    setIsEditing(false);
  };
  
  // Handle content change
  const handleContentChange = (content: string) => {
    setCurrentContent(content);
    if (selectedNote) {
      setSelectedNote({
        ...selectedNote,
        content
      });
    }
  };
  
  // Handle note type change
  const handleNoteTypeChange = (noteType: Note['noteType']) => {
    if (selectedNote) {
      setSelectedNote({
        ...selectedNote,
        noteType
      });
    }
  };
  
  // Handle adding a tag to the current note
  const handleAddTag = (tag: string) => {
    if (selectedNote && selectedNoteId) {
      if (!selectedNote.userTags.includes(tag)) {
        const updatedTags = [...selectedNote.userTags, tag];
        
        if (isEditing) {
          // Just update local state when editing
          setSelectedNote({
            ...selectedNote,
            userTags: updatedTags
          });
        } else {
          // Update in database when not editing
          addTag(selectedNoteId, tag);
        }
        
        if (!availableTags.includes(tag)) {
          setAvailableTags([...availableTags, tag]);
        }
      }
    }
  };
  
  // Handle tag input button click
  const handleAddTagButton = () => {
    if (newTagText.trim()) {
      handleAddTag(newTagText.trim());
      setNewTagText('');
    }
  };
  
  // Handle removing a tag from the current note
  const handleRemoveTag = (tag: string) => {
    if (selectedNote && selectedNoteId) {
      const updatedTags = selectedNote.userTags.filter(t => t !== tag);
      
      if (isEditing) {
        // Just update local state when editing
        setSelectedNote({
          ...selectedNote,
          userTags: updatedTags
        });
      } else {
        // Update in database when not editing
        removeTag(selectedNoteId, tag);
      }
    }
  };
  
  // Handle search text change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    updateFilter({ searchText: value || undefined });
  };
  
  // Handle view mode change
  const handleViewModeChange = (mode: 'list' | 'calendar' | 'tags') => {
    setViewMode(mode);
  };
  
  // Handle date change from the date input
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedNote) {
      const dateValue = e.target.value ? new Date(e.target.value) : new Date();
      setSelectedNote({
        ...selectedNote,
        dateStamp: dateValue
      });
    }
  };
  
  // Handle keyboard events for tag input
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTagButton();
    }
  };
  
  // Format a date for the input field
  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return new Date().toISOString().split('T')[0];
    return date.toISOString().split('T')[0];
  };
  
  // Format time for display
  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true
    };
    return new Date(date).toLocaleTimeString(undefined, options);
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="notes-page h-full flex flex-col">
      <div className="bg-white border-b p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Notes</h1>
          <div className="flex items-center space-x-2">
            <div className="flex border rounded overflow-hidden">
              <button 
                className={`px-3 py-1 flex items-center ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                onClick={() => handleViewModeChange('list')}
              >
                <FileText size={16} className="mr-1" />
                List
              </button>
              <button 
                className={`px-3 py-1 flex items-center ${viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                onClick={() => handleViewModeChange('calendar')}
              >
                <Calendar size={16} className="mr-1" />
                Calendar
              </button>
              <button 
                className={`px-3 py-1 flex items-center ${viewMode === 'tags' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                onClick={() => handleViewModeChange('tags')}
              >
                <TagIcon size={16} className="mr-1" />
                Tags
              </button>
            </div>
            <button
              onClick={handleCreateNote}
              className="px-3 py-1 bg-blue-600 text-white rounded flex items-center"
            >
              <Plus size={16} className="mr-1" />
              New Note
            </button>
          </div>
        </div>
        
        {/* Only show search in list view */}
        {viewMode === 'list' && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchText}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-hidden flex">
        {viewMode === 'list' && (
          <div className="flex-1 flex overflow-hidden">
            {/* List view */}
            <div className="w-1/3 overflow-y-auto border-r p-4">
              <NoteList
                notes={notes}
                selectedNoteId={selectedNoteId}
                onSelectNote={handleSelectNote}
              />
            </div>
            
            {/* Note editor area */}
            <div className="w-2/3 overflow-y-auto p-4">
              {selectedNote ? (
                <div className="h-full flex flex-col">
                  <div className="mb-4 flex justify-between items-center">
                    <div>
                      <select
                        value={selectedNote.noteType || 'General'}
                        onChange={(e) => handleNoteTypeChange(e.target.value as Note['noteType'])}
                        disabled={!isEditing}
                        className="block px-3 py-1 border rounded bg-white"
                      >
                        <option value="General">General</option>
                        <option value="Field Observation">Field Observation</option>
                        <option value="Price Quote">Price Quote</option>
                        <option value="Equipment Maintenance">Equipment Maintenance</option>
                        <option value="Meeting Notes">Meeting Notes</option>
                        <option value="Soil Test Results">Soil Test Results</option>
                        <option value="Weather Report">Weather Report</option>
                        <option value="Market Update">Market Update</option>
                      </select>
                      <div className="text-xs text-gray-500 mt-1">
                        {selectedNote.dateStamp ? new Date(selectedNote.dateStamp).toLocaleDateString() : 
                          new Date(selectedNote.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSaveCurrentNote}
                            className="px-3 py-1 bg-green-600 text-white rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 bg-gray-200 text-gray-800 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="px-3 py-1 bg-blue-600 text-white rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={handleDeleteNote}
                            className="px-3 py-1 bg-red-600 text-white rounded"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto border rounded p-4">
                    <NoteEditor
                      content={currentContent}
                      onChange={handleContentChange}
                      isEditing={isEditing}
                      note={selectedNote}
                      onAddTag={handleAddTag}
                      onRemoveTag={handleRemoveTag}
                      availableTags={availableTags}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Select a note or create a new one
                </div>
              )}
            </div>
          </div>
        )}
        
        {viewMode === 'calendar' && (
          <div className="flex-1 overflow-y-auto">
            <CalendarView onSelectNote={handleSelectNote} />
          </div>
        )}
        
        {viewMode === 'tags' && (
          <div className="flex-1 overflow-y-auto">
            <TagView onSelectNote={handleSelectNote} />
          </div>
        )}
      </div>
    </div>
  );
}; 
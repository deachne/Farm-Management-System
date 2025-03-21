import React, { useState, useEffect } from 'react';
import { useNotes } from '../hooks/useNotes';
import { Note, NoteSortOrder } from '../types';
import { NoteList } from './NoteList';
import { TagSelector } from './TagSelector';
import { NoteEditor } from './NoteEditor';
import { FileText, Plus } from 'lucide-react';

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
    <div className="flex flex-1 h-screen bg-white overflow-hidden">
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <div className="bg-blue-600 text-white text-xl font-semibold px-4 py-2 rounded-md">
              BizzyPerson
            </div>
            <div className="text-xl font-semibold ml-2 text-gray-700">Notes</div>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Notes List Panel */}
          <div className="w-1/3 border-r flex flex-col">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Notes</h2>
              
              <div className="flex items-center justify-between mb-4">
                <div className="w-full grid grid-cols-3 bg-gray-100 p-1 rounded-md">
                  <button 
                    className={`py-2 px-4 rounded text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
                    onClick={() => handleViewModeChange('list')}
                  >
                    List
                  </button>
                  <button 
                    className={`py-2 px-4 rounded text-sm font-medium transition-colors ${viewMode === 'calendar' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
                    onClick={() => handleViewModeChange('calendar')}
                  >
                    Calendar
                  </button>
                  <button 
                    className={`py-2 px-4 rounded text-sm font-medium transition-colors ${viewMode === 'tags' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
                    onClick={() => handleViewModeChange('tags')}
                  >
                    Tags
                  </button>
                </div>
                
                <button 
                  onClick={handleCreateNote}
                  className="ml-2 p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search notes..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    value={searchText}
                    onChange={handleSearchChange}
                  />
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <select
                  className="p-2 border rounded-md text-sm w-full"
                  value={sort}
                  onChange={(e) => updateSort(e.target.value as NoteSortOrder)}
                >
                  <option value={NoteSortOrder.CreatedNewest}>Newest first</option>
                  <option value={NoteSortOrder.CreatedOldest}>Oldest first</option>
                  <option value={NoteSortOrder.UpdatedNewest}>Recently updated</option>
                  <option value={NoteSortOrder.UpdatedOldest}>Least recently updated</option>
                </select>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <NoteList 
                notes={notes} 
                onSelectNote={handleSelectNote}
                selectedNoteId={selectedNoteId}
              />
            </div>
          </div>
          
          {/* Note Content Panel */}
          <div className="w-2/3 flex flex-col">
            {selectedNote ? (
              <div className="h-full flex flex-col">
                {/* Note Editor Header */}
                <div className="p-4 border-b border-gray-200 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedNote.noteType || 'General'}
                      </h2>
                      
                      {isEditing ? (
                        <div className="mt-2 flex items-center">
                          <label className="text-sm text-gray-600 mr-2">Date:</label>
                          <input 
                            type="date" 
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                            value={formatDateForInput(selectedNote.dateStamp)}
                            onChange={handleDateChange}
                          />
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 mt-1">
                          Date: {selectedNote.dateStamp ? 
                            new Date(selectedNote.dateStamp).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 
                            new Date(selectedNote.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSaveCurrentNote}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="px-3 py-1 border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={handleDeleteNote}
                            className="px-3 py-1 border border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700 text-sm rounded"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-2">
                    Last updated {formatDate(selectedNote.updatedAt)} at {formatTime(selectedNote.updatedAt)}
                  </div>
                  
                  {/* Tags Section - Moved to the top */}
                  <div className="flex items-center mt-2">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-sm font-medium text-gray-700">Tags:</span>
                      {selectedNote.userTags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                        >
                          {tag}
                          {isEditing && (
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 text-blue-400 hover:text-blue-600"
                            >
                              ×
                            </button>
                          )}
                        </span>
                      ))}
                      {isEditing && (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={newTagText}
                            onChange={e => setNewTagText(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder="Add tag..."
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                          <button
                            onClick={handleAddTagButton}
                            className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
            
                {/* Note Editor Content */}
                <div className="flex-grow overflow-auto p-4">
                  <NoteEditor
                    content={currentContent}
                    onChange={handleContentChange}
                    isEditing={isEditing}
                    placeholder="Write your note here..."
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FileText className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-xl font-medium mb-2">No note selected</p>
                <p className="text-sm text-gray-400 mb-6">Select a note or create a new one</p>
                <button 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  onClick={handleCreateNote}
                >
                  Create Note
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Log Footer */}
        <div className="border-t p-2 text-sm text-gray-500 flex justify-end">
          <div>
            <span className="font-medium">Action Log:</span> 
            <span className="ml-2">{selectedNote ? `Viewing: ${selectedNote.noteType || 'Note'}` : 'Navigated to Notes'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 
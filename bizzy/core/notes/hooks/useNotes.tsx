import { useState, useEffect, useCallback } from 'react';
import { Note, NoteFilter, NoteSortOrder } from '../types';
import { NotesService } from '../services/notesService';

/**
 * Hook for managing notes
 */
export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<NoteFilter>({});
  const [sort, setSort] = useState<NoteSortOrder>(NoteSortOrder.CreatedNewest);
  
  const notesService = new NotesService();
  
  /**
   * Fetch notes based on current filter and sort order
   */
  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedNotes = notesService.getNotes(filter, sort);
      setNotes(fetchedNotes);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while fetching notes'));
    } finally {
      setIsLoading(false);
    }
  }, [filter, sort]);
  
  /**
   * Create a new note
   */
  const createNote = useCallback(async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    setError(null);
    
    try {
      const newNote = notesService.createNote(noteData);
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while creating the note'));
      return null;
    }
  }, []);
  
  /**
   * Update an existing note
   */
  const updateNote = useCallback(async (id: string, noteData: Partial<Note>) => {
    setError(null);
    
    try {
      const updatedNote = notesService.updateNote(id, noteData);
      
      if (updatedNote) {
        setNotes(prev => 
          prev.map(note => note.id === id ? updatedNote : note)
        );
        return updatedNote;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while updating the note'));
      return null;
    }
  }, []);
  
  /**
   * Delete a note
   */
  const deleteNote = useCallback(async (id: string) => {
    setError(null);
    
    try {
      const success = notesService.deleteNote(id);
      
      if (success) {
        setNotes(prev => prev.filter(note => note.id !== id));
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while deleting the note'));
      return false;
    }
  }, []);
  
  /**
   * Add a tag to a note
   */
  const addTag = useCallback(async (noteId: string, tag: string) => {
    setError(null);
    
    try {
      const updatedNote = notesService.addTag(noteId, tag);
      
      if (updatedNote) {
        setNotes(prev => 
          prev.map(note => note.id === noteId ? updatedNote : note)
        );
      }
      
      return updatedNote;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while adding the tag'));
      return null;
    }
  }, []);
  
  /**
   * Remove a tag from a note
   */
  const removeTag = useCallback(async (noteId: string, tag: string) => {
    setError(null);
    
    try {
      const updatedNote = notesService.removeTag(noteId, tag);
      
      if (updatedNote) {
        setNotes(prev => 
          prev.map(note => note.id === noteId ? updatedNote : note)
        );
      }
      
      return updatedNote;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while removing the tag'));
      return null;
    }
  }, []);
  
  /**
   * Update the filter and refetch notes
   */
  const updateFilter = useCallback((newFilter: Partial<NoteFilter>) => {
    setFilter(prev => ({
      ...prev,
      ...newFilter
    }));
  }, []);
  
  /**
   * Update the sort order and refetch notes
   */
  const updateSort = useCallback((newSort: NoteSortOrder) => {
    setSort(newSort);
  }, []);
  
  /**
   * Get all available categories
   */
  const getCategories = useCallback(() => {
    return notesService.getCategories();
  }, []);
  
  /**
   * Get all available user tags
   */
  const getUserTags = useCallback(() => {
    return notesService.getUserTags();
  }, []);
  
  /**
   * Get all available AI tags
   */
  const getAITags = useCallback(() => {
    return notesService.getAITags();
  }, []);
  
  // Fetch notes on initial load or when filter/sort changes
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);
  
  return {
    notes,
    isLoading,
    error,
    filter,
    sort,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    addTag,
    removeTag,
    updateFilter,
    updateSort,
    getCategories,
    getUserTags,
    getAITags
  };
}; 
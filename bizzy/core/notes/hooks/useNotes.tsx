import { useState, useEffect, useCallback } from 'react';
import { Note, NoteFilter, NoteSortOrder } from '../types';
import { NotesService, TagRecommender } from '../services';

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
  const tagRecommender = new TagRecommender();
  
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
  
  /**
   * Update a tag across all notes
   */
  const updateTag = useCallback((oldTag: string, newTag: string) => {
    setError(null);
    
    try {
      notesService.updateTag(oldTag, newTag);
      // Refresh notes to reflect changes
      fetchNotes();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while updating the tag'));
      return false;
    }
  }, [fetchNotes]);
  
  /**
   * Delete a tag across all notes
   */
  const deleteTag = useCallback((tag: string) => {
    setError(null);
    
    try {
      notesService.deleteTag(tag);
      // Refresh notes to reflect changes
      fetchNotes();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while deleting the tag'));
      return false;
    }
  }, [fetchNotes]);
  
  /**
   * Get tag recommendations for a note
   */
  const getTagRecommendations = useCallback(async (noteId: string, limit = 5) => {
    setError(null);
    
    try {
      const note = notesService.getNote(noteId);
      
      if (!note) {
        return [];
      }
      
      return await tagRecommender.getTagRecommendations(note, limit);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while getting tag recommendations'));
      return [];
    }
  }, []);
  
  /**
   * Record user feedback about a tag suggestion
   */
  const recordTagFeedback = useCallback((noteId: string, tag: string, accepted: boolean) => {
    try {
      tagRecommender.recordTagFeedback(noteId, tag, accepted);
    } catch (err) {
      console.error('Error recording tag feedback:', err);
    }
  }, []);
  
  /**
   * Add AI tag to a note
   */
  const addAITag = useCallback(async (noteId: string, tag: string) => {
    setError(null);
    
    try {
      const updatedNote = notesService.addAITag(noteId, tag);
      
      if (updatedNote) {
        setNotes(prev => 
          prev.map(note => note.id === noteId ? updatedNote : note)
        );
      }
      
      return updatedNote;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while adding the AI tag'));
      return null;
    }
  }, []);
  
  /**
   * Remove AI tag from a note
   */
  const removeAITag = useCallback(async (noteId: string, tag: string) => {
    setError(null);
    
    try {
      const updatedNote = notesService.removeAITag(noteId, tag);
      
      if (updatedNote) {
        setNotes(prev => 
          prev.map(note => note.id === noteId ? updatedNote : note)
        );
      }
      
      return updatedNote;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while removing the AI tag'));
      return null;
    }
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
    getAITags,
    updateTag,
    deleteTag,
    getTagRecommendations,
    recordTagFeedback,
    addAITag,
    removeAITag
  };
}; 
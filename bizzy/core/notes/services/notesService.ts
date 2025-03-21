import { Note, NoteFilter, NoteSortOrder } from '../types';

/**
 * Service for managing notes
 * Phase 1 implementation with local storage
 */
export class NotesService {
  private notes: Note[] = [];
  private isInitialized: boolean = false;
  private storageKey = 'bizzy-notes';
  
  /**
   * Initialize the service
   */
  constructor() {
    this.loadFromLocalStorage();
    
    if (!this.isInitialized) {
      this.notes = this.initializeSampleNotes();
      this.saveToLocalStorage();
      this.isInitialized = true;
    }
  }

  /**
   * Initialize with sample notes for demo purposes
   */
  private initializeSampleNotes(): Note[] {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    return [
      {
        id: '1',
        workspaceId: 'default',
        noteType: 'Field Observation',
        title: '',
        content: 'Noticed signs of nutrient deficiency in the north field corn. Leaves showing yellowing at the edges. Need to adjust fertilizer application. Soil test recommended.',
        createdAt: now,
        updatedAt: now,
        dateStamp: now,
        userTags: ['corn', 'fertilizer', 'north field'],
        aiTags: ['crop health', 'nutrient management'],
        category: 'crop'
      },
      {
        id: '2',
        workspaceId: 'default',
        noteType: 'Price Quote',
        title: '',
        content: 'John Deere dealer offering 10% discount on replacement parts for next two weeks. Consider stocking up on common wear items for the 5065E tractor.',
        createdAt: yesterday,
        updatedAt: yesterday,
        dateStamp: yesterday,
        userTags: ['deals', 'parts', 'john deere'],
        aiTags: ['equipment', 'purchasing'],
        category: 'equipment'
      },
      {
        id: '3',
        workspaceId: 'default',
        noteType: 'Equipment Maintenance',
        title: '',
        content: 'Performed oil change on primary tractor. 342 hours on engine. Used 15W-40 synthetic oil. Replaced fuel filter. Next service due in 100 hours.',
        createdAt: lastWeek,
        updatedAt: lastWeek,
        dateStamp: lastWeek,
        userTags: ['maintenance', 'tractor', 'service'],
        aiTags: ['equipment maintenance', 'service record'],
        category: 'equipment'
      },
      {
        id: '4',
        workspaceId: 'default',
        noteType: 'Weather Report',
        title: '',
        content: 'Forecast calls for heavy rain next week. Consider delaying herbicide application scheduled for Tuesday. Could affect field access. Plan accordingly.',
        createdAt: twoDaysAgo,
        updatedAt: twoDaysAgo,
        dateStamp: twoDaysAgo,
        userTags: ['weather', 'planning', 'herbicide'],
        aiTags: ['weather', 'planning'],
        category: 'weather'
      },
      {
        id: '5',
        workspaceId: 'default',
        noteType: 'Market Update',
        title: '',
        content: 'Local co-op offering $3.85/bushel for corn and $9.45/bushel for soybeans. Considering forward contract for 15% of expected yield at these prices.',
        createdAt: threeDaysAgo,
        updatedAt: threeDaysAgo,
        dateStamp: threeDaysAgo,
        userTags: ['prices', 'market', 'contracts'],
        aiTags: ['market prices', 'planning'],
        category: 'financial'
      }
    ];
  }

  /**
   * Load notes from localStorage
   */
  private loadFromLocalStorage() {
    try {
      const notesData = localStorage.getItem(this.storageKey);
      if (notesData) {
        const parsedData = JSON.parse(notesData);
        
        this.notes = parsedData.notes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
          dateStamp: note.dateStamp ? new Date(note.dateStamp) : undefined
        }));
        
        this.isInitialized = parsedData.isInitialized;
      }
    } catch (error) {
      console.error('Error loading notes from localStorage:', error);
    }
  }
  
  /**
   * Save notes to localStorage
   */
  private saveToLocalStorage() {
    try {
      const data = {
        notes: this.notes,
        isInitialized: this.isInitialized
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving notes to localStorage:', error);
    }
  }

  /**
   * Get all notes with optional filtering and sorting
   */
  getNotes(filter?: NoteFilter, sortOrder?: NoteSortOrder): Note[] {
    let filteredNotes = [...this.notes];
    
    // Apply filters if provided
    if (filter) {
      filteredNotes = filteredNotes.filter(note => {
        // Filter by workspace ID
        if (filter.workspaceId && note.workspaceId !== filter.workspaceId) {
          return false;
        }
        
        // Filter by date range
        if (filter.dateRange) {
          const noteDate = note.dateStamp || note.createdAt;
          if (
            (filter.dateRange.start && noteDate < filter.dateRange.start) ||
            (filter.dateRange.end && noteDate > filter.dateRange.end)
          ) {
            return false;
          }
        }
        
        // Filter by note type
        if (filter.noteType && note.noteType !== filter.noteType) {
          return false;
        }
        
        // Filter by user tags
        if (filter.userTags && filter.userTags.length > 0) {
          if (!filter.userTags.some(tag => note.userTags.includes(tag))) {
            return false;
          }
        }
        
        // Filter by AI tags
        if (filter.aiTags && filter.aiTags.length > 0) {
          if (!filter.aiTags.some(tag => note.aiTags.includes(tag))) {
            return false;
          }
        }
        
        // Filter by category
        if (filter.category && note.category !== filter.category) {
          return false;
        }
        
        // Filter by search text
        if (filter.searchText) {
          const searchText = filter.searchText.toLowerCase();
          return (
            note.content.toLowerCase().includes(searchText) ||
            (note.title && note.title.toLowerCase().includes(searchText)) ||
            note.userTags.some(tag => tag.toLowerCase().includes(searchText)) ||
            (note.noteType && note.noteType.toLowerCase().includes(searchText))
          );
        }
        
        return true;
      });
    }
    
    // Sort notes
    if (sortOrder) {
      filteredNotes.sort((a, b) => {
        switch (sortOrder) {
          case NoteSortOrder.CreatedNewest:
            return (b.dateStamp || b.createdAt).getTime() - (a.dateStamp || a.createdAt).getTime();
          case NoteSortOrder.CreatedOldest:
            return (a.dateStamp || a.createdAt).getTime() - (b.dateStamp || b.createdAt).getTime();
          case NoteSortOrder.UpdatedNewest:
            return b.updatedAt.getTime() - a.updatedAt.getTime();
          case NoteSortOrder.UpdatedOldest:
            return a.updatedAt.getTime() - b.updatedAt.getTime();
          default:
            return 0;
        }
      });
    } else {
      // Default sort by creation date (newest first)
      filteredNotes.sort((a, b) => 
        (b.dateStamp || b.createdAt).getTime() - (a.dateStamp || a.createdAt).getTime()
      );
    }
    
    return filteredNotes;
  }
  
  /**
   * Get a note by ID
   */
  getNote(id: string): Note | null {
    const note = this.notes.find(note => note.id === id);
    return note || null;
  }
  
  /**
   * Create a new note
   */
  createNote(noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      userTags: noteData.userTags || [],
      aiTags: noteData.aiTags || [],
      category: noteData.category || 'general'
    };
    
    this.notes.push(newNote);
    this.saveToLocalStorage();
    
    return newNote;
  }
  
  /**
   * Update an existing note
   */
  updateNote(id: string, noteData: Partial<Note>): Note | null {
    const index = this.notes.findIndex(note => note.id === id);
    if (index === -1) return null;
    
    const updatedNote = {
      ...this.notes[index],
      ...noteData,
      updatedAt: new Date()
    };
    
    // Keep the dateStamp from existing note if not explicitly updated
    if (!noteData.dateStamp) {
      updatedNote.dateStamp = this.notes[index].dateStamp;
    }
    
    this.notes[index] = updatedNote;
    this.saveToLocalStorage();
    
    return updatedNote;
  }
  
  /**
   * Delete a note by ID
   */
  deleteNote(id: string): boolean {
    const initialLength = this.notes.length;
    this.notes = this.notes.filter(note => note.id !== id);
    
    if (this.notes.length !== initialLength) {
      this.saveToLocalStorage();
      return true;
    }
    
    return false;
  }
  
  /**
   * Add a tag to a note
   */
  addTag(noteId: string, tag: string): Note | null {
    const note = this.getNote(noteId);
    if (!note) return null;
    
    if (!note.userTags.includes(tag)) {
      note.userTags.push(tag);
      this.updateNote(noteId, { userTags: note.userTags });
    }
    
    return note;
  }
  
  /**
   * Remove a tag from a note
   */
  removeTag(noteId: string, tag: string): Note | null {
    const note = this.getNote(noteId);
    if (!note) return null;
    
    note.userTags = note.userTags.filter(t => t !== tag);
    return this.updateNote(noteId, { userTags: note.userTags });
  }
  
  /**
   * Get all unique categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    
    this.notes.forEach(note => {
      if (note.category) {
        categories.add(note.category);
      }
    });
    
    return Array.from(categories);
  }
  
  /**
   * Get all unique user tags
   */
  getUserTags(): string[] {
    const tags = new Set<string>();
    
    this.notes.forEach(note => {
      note.userTags.forEach(tag => tags.add(tag));
    });
    
    return Array.from(tags);
  }
  
  /**
   * Get all unique AI tags
   */
  getAITags(): string[] {
    const tags = new Set<string>();
    
    this.notes.forEach(note => {
      note.aiTags.forEach(tag => tags.add(tag));
    });
    
    return Array.from(tags);
  }
}

// Export a singleton instance
export const notesService = new NotesService(); 
/**
 * Core types for the Notes System
 */

/**
 * Represents a note in the system
 */
export interface Note {
  id: string;
  noteType?: 
    | 'General' 
    | 'Field Observation' 
    | 'Price Quote' 
    | 'Equipment Maintenance' 
    | 'Meeting Notes' 
    | 'Soil Test Results'
    | 'Weather Report'
    | 'Market Update';
  title?: string; // Optional title, if different from noteType
  content: string;
  createdAt: Date;
  updatedAt: Date;
  dateStamp?: Date; // Explicit date for the note, set by user
  location?: {
    lat: number;
    lng: number;
    fieldId?: string;
    fieldName?: string; // Name of the field (e.g., "North 40")
  };
  weather?: {
    temperature: number;
    conditions: string;
    humidity: number;
  };
  media?: Media[];
  vectorId?: string;  // Reference to vector store entry
  userTags: string[];
  workspaceId?: string;
  aiTags: string[];
  category?: string;
}

/**
 * Media attachment for a note
 */
export interface Media {
  type: 'image' | 'audio' | 'video';
  url: string;
  metadata: any;
}

/**
 * Filter parameters for note queries
 */
export interface NoteFilter {
  workspaceId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  noteType?: Note['noteType'];
  userTags?: string[];
  aiTags?: string[];
  category?: string;
  searchText?: string;
}

/**
 * Types of sort orders for notes
 */
export enum NoteSortOrder {
  CreatedNewest = 'created_newest',
  CreatedOldest = 'created_oldest',
  UpdatedNewest = 'updated_newest',
  UpdatedOldest = 'updated_oldest',
} 
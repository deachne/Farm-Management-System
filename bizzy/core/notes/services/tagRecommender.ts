import { Note } from '../types';
import { EntityExtractor } from './entityExtractor';
import { VectorService } from './vectorService';
import { NotesService } from './notesService';

/**
 * Service for recommending tags for notes
 * Combines entity extraction and vector-based similarity
 */
export class TagRecommender {
  private entityExtractor: EntityExtractor;
  private vectorService: VectorService;
  private notesService: NotesService;
  
  constructor() {
    this.entityExtractor = new EntityExtractor();
    this.vectorService = new VectorService();
    this.notesService = new NotesService();
  }
  
  /**
   * Get tag recommendations for a note
   */
  async getTagRecommendations(note: Note, limit: number = 5): Promise<string[]> {
    try {
      // Extract entities directly from the content
      const entityTags = this.entityExtractor.extractEntities(note.content);
      
      // Get existing user tags to exclude from recommendations
      const existingTags = note.userTags;
      
      // Remove already-applied tags from recommendations
      const filteredEntityTags = entityTags.filter(tag => 
        !existingTags.includes(tag)
      );
      
      // Get vector for the note
      const vectorId = await this.vectorService.vectorizeNote(note);
      
      // If we've vectorized the note, get similar notes' tags
      let similarNoteTags: string[] = [];
      if (vectorId) {
        similarNoteTags = await this.getTagsFromSimilarNotes(note.id);
      }
      
      // Combine tags and filter out duplicates
      const combinedTags = Array.from(new Set([...filteredEntityTags, ...similarNoteTags]));
      
      // Sort by relevance and limit
      const scoredTags = this.scoreAndSortTags(combinedTags, note.content);
      
      // Return limited number of recommendations
      return scoredTags.slice(0, limit);
    } catch (error) {
      console.error('Error getting tag recommendations:', error);
      return [];
    }
  }
  
  /**
   * Get tags from similar notes
   */
  private async getTagsFromSimilarNotes(noteId: string): Promise<string[]> {
    try {
      // Find similar notes using vector similarity
      const similarNotes = await this.vectorService.findSimilarNotes(noteId, 3);
      
      // Extract tags from the similar notes
      const tagCounts = new Map<string, number>();
      
      similarNotes.forEach(note => {
        // Consider both user and AI tags
        const allTags = [...note.userTags, ...note.aiTags];
        
        allTags.forEach(tag => {
          const count = tagCounts.get(tag) || 0;
          tagCounts.set(tag, count + 1);
        });
      });
      
      // Sort by frequency and convert to array
      return Array.from(tagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);
    } catch (error) {
      console.error('Error getting tags from similar notes:', error);
      return [];
    }
  }
  
  /**
   * Score and sort tags by relevance
   */
  private scoreAndSortTags(tags: string[], content: string): string[] {
    // This could be enhanced with more sophisticated relevance algorithms
    const contentLower = content.toLowerCase();
    
    // Calculate a simple relevance score based on:
    // 1. Word frequency in the content
    // 2. Word position (earlier is better)
    const tagScores = tags.map(tag => {
      const tagLower = tag.toLowerCase();
      const regex = new RegExp(`\\b${tagLower}\\b`, 'gi');
      const matches = contentLower.match(regex);
      
      // Count occurrences
      const occurrences = matches ? matches.length : 0;
      
      // Find position of first occurrence (earlier is better)
      const position = contentLower.indexOf(tagLower);
      const positionScore = position > -1 ? (1000 - Math.min(position, 1000)) / 1000 : 0;
      
      // Combined score (frequency + position bonus)
      const score = occurrences + (positionScore * 0.5);
      
      return { tag, score };
    });
    
    // Sort by score (descending)
    return tagScores
      .sort((a, b) => b.score - a.score)
      .map(item => item.tag);
  }
  
  /**
   * Record user feedback about tag suggestions
   */
  recordTagFeedback(noteId: string, tag: string, accepted: boolean): void {
    // In a production implementation, this would store feedback
    // for improving future recommendations
    console.log(`Tag feedback for note ${noteId}: ${tag} was ${accepted ? 'accepted' : 'rejected'}`);
  }
} 
import { ContentTypes, TMessageContentParts, TAttachment } from '../types/librechat-types';

// Interface for saved artifact metadata
export interface SavedArtifactMetadata {
  id: string;
  type: string;
  title: string;
  description?: string;
  tags: string[];
  timestamp: string;
  sourceChat?: string;
  farmContext?: {
    fieldId?: string;
    fieldName?: string;
    cropType?: string;
    season?: string;
  };
  dimensions?: {
    width?: number;
    height?: number;
  };
  fileType?: string;
  fileSize?: number;
  vectorEmbeddingId?: string;
}

// Interface for artifacts with content
export interface SavedArtifact extends SavedArtifactMetadata {
  content: any;
  rawData?: any;
  attachments?: TAttachment[];
}

// Response from storage operations
interface StorageResponse {
  success: boolean;
  id?: string;
  message?: string;
  error?: any;
}

/**
 * Service for handling artifact storage to vector database
 * Provides methods for saving, tagging, and retrieving artifacts
 */
class ArtifactStorageService {
  // Base API endpoint for AnythingLLM's vector operations
  private baseApiUrl: string = '/api/vector';
  
  // Save an artifact to the vector database with proper embedding
  async saveArtifact(
    artifactData: any,
    messageContent?: TMessageContentParts,
    options?: {
      title?: string;
      description?: string;
      tags?: string[];
      chatId?: string;
      farmContext?: any;
    }
  ): Promise<StorageResponse> {
    try {
      // Generate a unique ID for the artifact
      const artifactId = `artifact-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Extract artifact details based on type
      const { title, description, tags = [], chatId, farmContext } = options || {};
      const timestamp = new Date().toISOString();
      const artifactType = artifactData.type || this.determineArtifactType(messageContent);
      
      // Prepare metadata for vector storage
      const metadata: SavedArtifactMetadata = {
        id: artifactId,
        type: artifactType,
        title: title || this.generateArtifactTitle(artifactType, artifactData, messageContent),
        description: description || '',
        tags: [...tags, artifactType, ...this.generateSmartTags(artifactType, artifactData, farmContext)],
        timestamp,
        sourceChat: chatId,
        farmContext: farmContext ? {
          fieldId: farmContext.currentField?.id,
          fieldName: farmContext.currentField?.name,
          cropType: farmContext.currentField?.cropType,
          season: farmContext.season
        } : undefined
      };
      
      // Handle type-specific properties
      if (artifactType === 'image') {
        metadata.dimensions = artifactData.dimensions || {
          width: messageContent?.[ContentTypes.IMAGE_FILE]?.width,
          height: messageContent?.[ContentTypes.IMAGE_FILE]?.height
        };
        metadata.fileType = this.determineImageType(artifactData.path);
      }
      
      // Create artifact object with content
      const artifact: SavedArtifact = {
        ...metadata,
        content: this.prepareContentForStorage(artifactType, artifactData),
        rawData: messageContent
      };
      
      // Save to local storage for immediate access (temporary, would be replaced with API call)
      this.saveToLocalStorage(artifactId, artifact);
      
      // In a real implementation, we'd make an API call to AnythingLLM's vector storage
      // This is a placeholder for the actual API integration
      const response = await this.mockSaveToVectorStorage(artifact);
      
      return {
        success: true,
        id: artifactId,
        message: 'Artifact saved successfully'
      };
    } catch (error) {
      console.error('Failed to save artifact:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  // Search for artifacts using natural language
  async searchArtifacts(
    query: string,
    filters?: {
      types?: string[];
      tags?: string[];
      dateFrom?: Date;
      dateTo?: Date;
      fieldId?: string;
      cropType?: string;
    }
  ): Promise<SavedArtifact[]> {
    try {
      // In a real implementation, this would call AnythingLLM's vector search API
      // For now, we'll just search local storage
      const storedArtifacts = this.getAllFromLocalStorage();
      
      // Basic filtering
      return storedArtifacts.filter(artifact => {
        // Type filter
        if (filters?.types && filters.types.length > 0) {
          if (!filters.types.includes(artifact.type)) return false;
        }
        
        // Tag filter
        if (filters?.tags && filters.tags.length > 0) {
          if (!filters.tags.some(tag => artifact.tags.includes(tag))) return false;
        }
        
        // Date range filter
        if (filters?.dateFrom) {
          const artifactDate = new Date(artifact.timestamp);
          if (artifactDate < filters.dateFrom) return false;
        }
        
        if (filters?.dateTo) {
          const artifactDate = new Date(artifact.timestamp);
          if (artifactDate > filters.dateTo) return false;
        }
        
        // Farm context filters
        if (filters?.fieldId && artifact.farmContext?.fieldId !== filters.fieldId) return false;
        if (filters?.cropType && artifact.farmContext?.cropType !== filters.cropType) return false;
        
        // Search query (basic implementation - would be replaced with vector similarity search)
        if (query) {
          const searchableContent = JSON.stringify(artifact).toLowerCase();
          return searchableContent.includes(query.toLowerCase());
        }
        
        return true;
      });
    } catch (error) {
      console.error('Failed to search artifacts:', error);
      return [];
    }
  }
  
  // Get artifact by ID
  async getArtifactById(id: string): Promise<SavedArtifact | null> {
    try {
      // In a real implementation, this would fetch from AnythingLLM's API
      return this.getFromLocalStorage(id);
    } catch (error) {
      console.error('Failed to get artifact:', error);
      return null;
    }
  }
  
  // Update tags for an artifact
  async updateArtifactTags(id: string, tags: string[]): Promise<StorageResponse> {
    try {
      const artifact = this.getFromLocalStorage(id);
      if (!artifact) {
        return {
          success: false,
          message: 'Artifact not found'
        };
      }
      
      // Update tags
      artifact.tags = tags;
      this.saveToLocalStorage(id, artifact);
      
      // In a real implementation, update in vector storage
      
      return {
        success: true,
        id,
        message: 'Tags updated successfully'
      };
    } catch (error) {
      console.error('Failed to update tags:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  // Delete an artifact
  async deleteArtifact(id: string): Promise<StorageResponse> {
    try {
      localStorage.removeItem(`artifact_${id}`);
      
      // In a real implementation, delete from vector storage
      
      return {
        success: true,
        message: 'Artifact deleted successfully'
      };
    } catch (error) {
      console.error('Failed to delete artifact:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  // Helper methods
  
  private determineArtifactType(messageContent?: TMessageContentParts): string {
    if (!messageContent) return 'unknown';
    
    switch (messageContent.type) {
      case ContentTypes.TEXT:
        return 'text';
      case ContentTypes.IMAGE_FILE:
      case ContentTypes.IMAGE_URL:
        return 'image';
      case ContentTypes.TOOL_CALL:
        const toolCall = messageContent[ContentTypes.TOOL_CALL];
        if (!toolCall) return 'unknown';
        
        if (toolCall.name === 'execute_code') return 'code';
        if (toolCall.name === 'create_chart' || toolCall.name === 'generate_chart') return 'chart';
        if (toolCall.name === 'create_table' || toolCall.name === 'generate_table') return 'table';
        
        return 'tool_result';
      default:
        return 'unknown';
    }
  }
  
  private generateArtifactTitle(type: string, data: any, messageContent?: TMessageContentParts): string {
    const timestamp = new Date().toLocaleString();
    
    switch (type) {
      case 'code':
        return `${data.language || 'Code'} snippet - ${timestamp}`;
      case 'image':
        return data.altText || messageContent?.[ContentTypes.IMAGE_FILE]?.filename || `Image - ${timestamp}`;
      case 'chart':
        return data.title || `Chart - ${timestamp}`;
      case 'table':
        return `Table data - ${timestamp}`;
      case 'text':
        // Extract first line or first few words
        const text = typeof data.content === 'string' ? data.content : '';
        const firstLine = text.split('\n')[0] || '';
        return firstLine.length > 50 ? `${firstLine.substring(0, 47)}...` : firstLine || `Text - ${timestamp}`;
      default:
        return `Artifact - ${timestamp}`;
    }
  }
  
  private generateSmartTags(type: string, data: any, farmContext?: any): string[] {
    const tags: string[] = [];
    
    // Add type-specific tags
    switch (type) {
      case 'code':
        tags.push(data.language || 'code');
        if (data.output) tags.push('has-output');
        break;
      case 'image':
        if (data.dimensions) {
          if (data.dimensions.width && data.dimensions.width > 1000) tags.push('high-resolution');
        }
        break;
      case 'chart':
        tags.push(data.chartType || 'chart');
        break;
      case 'table':
        if (data.headers) {
          // Check for farm-specific headers
          const farmHeaders = ['field', 'crop', 'yield', 'harvest', 'plant', 'soil', 'moisture', 'fertilizer'];
          const hasAgriculturalData = data.headers.some((header: string) => 
            farmHeaders.some(term => header.toLowerCase().includes(term))
          );
          if (hasAgriculturalData) tags.push('agricultural-data');
        }
        break;
      case 'text':
        // Check for farm terminology
        const farmTerms = [
          'crop', 'field', 'harvest', 'yield', 'soil', 'moisture', 'fertilizer',
          'pesticide', 'irrigation', 'planting', 'tractor', 'acre', 'hectare'
        ];
        
        const content = typeof data.content === 'string' ? data.content.toLowerCase() : '';
        const hasFarmContent = farmTerms.some(term => content.includes(term));
        if (hasFarmContent) tags.push('farm-related');
        break;
    }
    
    // Add farm context tags
    if (farmContext) {
      if (farmContext.currentField?.cropType) {
        tags.push(`crop-${farmContext.currentField.cropType.toLowerCase()}`);
      }
      if (farmContext.season) {
        tags.push(`season-${farmContext.season.toLowerCase()}`);
      }
    }
    
    return tags;
  }
  
  private prepareContentForStorage(type: string, data: any): any {
    switch (type) {
      case 'image':
        // For images, we may need to convert to a storable format
        // If it's a base64 image, we can store it directly
        // If it's a URL, we might want to download and store the image
        return {
          dataUrl: data.path,
          alt: data.altText
        };
      case 'code':
        return {
          language: data.language,
          code: data.content,
          output: data.output
        };
      case 'chart':
        return {
          chartType: data.chartType,
          data: data.data,
          result: data.result
        };
      case 'table':
        return {
          headers: data.headers,
          rows: data.rows
        };
      case 'text':
        return {
          text: data.content
        };
      default:
        return data;
    }
  }
  
  private determineImageType(path?: string): string {
    if (!path) return 'unknown';
    
    if (path.startsWith('data:')) {
      // Handle base64 encoded images
      const match = path.match(/data:image\/([a-zA-Z]+);base64/);
      return match ? match[1] : 'unknown';
    }
    
    // Handle file paths
    const extension = path.split('.').pop()?.toLowerCase();
    return extension || 'unknown';
  }
  
  // Local storage methods for prototype/development
  
  private saveToLocalStorage(id: string, artifact: SavedArtifact): void {
    localStorage.setItem(`artifact_${id}`, JSON.stringify(artifact));
  }
  
  private getFromLocalStorage(id: string): SavedArtifact | null {
    const data = localStorage.getItem(`artifact_${id}`);
    return data ? JSON.parse(data) : null;
  }
  
  private getAllFromLocalStorage(): SavedArtifact[] {
    const artifacts: SavedArtifact[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('artifact_')) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            artifacts.push(JSON.parse(data));
          } catch (e) {
            console.error('Failed to parse artifact data:', e);
          }
        }
      }
    }
    
    return artifacts;
  }
  
  // Mock API method for testing
  private async mockSaveToVectorStorage(artifact: SavedArtifact): Promise<any> {
    // In a real implementation, this would make an API call to AnythingLLM's vector storage
    // For now, we'll just simulate a successful response
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          vectorId: `vector-${artifact.id}`,
          message: 'Artifact saved to vector storage'
        });
      }, 500);
    });
  }
}

// Create and export singleton instance
export const artifactStorageService = new ArtifactStorageService(); 
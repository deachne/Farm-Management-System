/**
 * Default Chunking Strategy
 * 
 * This module implements the default chunking strategy for document processing.
 * It splits documents into chunks of appropriate size for vectorization.
 */

class DefaultChunkingStrategy {
  /**
   * Chunk a document into smaller pieces
   * 
   * @param {object} document - Processed document
   * @returns {Promise<Array>} Document chunks
   */
  async chunk(document) {
    try {
      console.log(`Chunking document: ${document.filename} using default strategy`);
      
      // Default configuration
      const config = {
        chunkSize: 1000,      // Target chunk size in characters
        chunkOverlap: 200,    // Overlap between chunks
        minChunkSize: 100     // Minimum chunk size
      };
      
      // Extract content from document
      const content = document.content || '';
      
      // If content is empty, return empty array
      if (!content || content.length === 0) {
        return [];
      }
      
      // Split content into chunks
      const chunks = this.splitIntoChunks(content, config);
      
      // Add metadata to chunks
      return chunks.map((text, index) => ({
        text,
        metadata: {
          ...document.metadata,
          chunkIndex: index,
          documentId: document.id,
          documentTitle: document.metadata?.title || document.filename
        }
      }));
    } catch (error) {
      console.error('Error chunking document:', error);
      throw error;
    }
  }
  
  /**
   * Split text into chunks of appropriate size
   * 
   * @param {string} text - Document text
   * @param {object} config - Chunking configuration
   * @returns {Array<string>} Text chunks
   */
  splitIntoChunks(text, config) {
    const { chunkSize, chunkOverlap, minChunkSize } = config;
    
    // If text is smaller than minimum chunk size, return as single chunk
    if (text.length <= minChunkSize) {
      return [text];
    }
    
    const chunks = [];
    let startIndex = 0;
    
    while (startIndex < text.length) {
      // Calculate end index for current chunk
      let endIndex = startIndex + chunkSize;
      
      // If we're at the end of the text, just use the remaining text
      if (endIndex >= text.length) {
        chunks.push(text.substring(startIndex));
        break;
      }
      
      // Try to find a natural break point (period, newline, etc.)
      const breakPoint = this.findBreakPoint(text, endIndex);
      
      // Extract chunk
      chunks.push(text.substring(startIndex, breakPoint));
      
      // Move start index for next chunk, accounting for overlap
      startIndex = breakPoint - chunkOverlap;
      
      // Ensure we're making forward progress
      if (startIndex <= 0 || startIndex <= chunks.length * minChunkSize) {
        startIndex = breakPoint;
      }
    }
    
    return chunks;
  }
  
  /**
   * Find a natural break point in text
   * 
   * @param {string} text - Document text
   * @param {number} targetIndex - Target index
   * @returns {number} Break point index
   */
  findBreakPoint(text, targetIndex) {
    // Look for natural break points: period followed by space or newline
    const lookbackDistance = 100; // How far to look back for a break
    
    // Don't look beyond the end of the text
    const searchEndIndex = Math.min(targetIndex, text.length);
    
    // Don't look before the beginning of the text
    const searchStartIndex = Math.max(targetIndex - lookbackDistance, 0);
    
    // Extract the section to search
    const searchText = text.substring(searchStartIndex, searchEndIndex);
    
    // Look for paragraph breaks first
    const paragraphMatch = searchText.lastIndexOf('\n\n');
    if (paragraphMatch !== -1) {
      return searchStartIndex + paragraphMatch + 2; // +2 for the two newlines
    }
    
    // Look for single newlines
    const newlineMatch = searchText.lastIndexOf('\n');
    if (newlineMatch !== -1) {
      return searchStartIndex + newlineMatch + 1; // +1 for the newline
    }
    
    // Look for sentence endings (period, question mark, exclamation point followed by space)
    const sentenceMatch = searchText.match(/[.!?]\s+[A-Z]/);
    if (sentenceMatch && sentenceMatch.index !== -1) {
      return searchStartIndex + sentenceMatch.index + 2; // +2 for the punctuation and space
    }
    
    // If no natural break is found, just use the target index
    return targetIndex;
  }
}

module.exports = new DefaultChunkingStrategy(); 
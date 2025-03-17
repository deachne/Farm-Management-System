/**
 * Paragraph Chunking Strategy
 * 
 * This module implements a paragraph-based chunking strategy for document processing.
 * It splits documents into chunks based on paragraph breaks.
 */

class ParagraphChunkingStrategy {
  /**
   * Chunk a document into paragraphs
   * 
   * @param {object} document - Processed document
   * @returns {Promise<Array>} Document chunks
   */
  async chunk(document) {
    try {
      console.log(`Chunking document: ${document.filename} using paragraph strategy`);
      
      // Configuration
      const config = {
        maxParagraphLength: 1500,  // Maximum paragraph length
        minParagraphLength: 50,    // Minimum paragraph length
        combineShortParagraphs: true // Combine short paragraphs
      };
      
      // Extract content from document
      const content = document.content || '';
      
      // If content is empty, return empty array
      if (!content || content.length === 0) {
        return [];
      }
      
      // Split content into paragraphs
      const paragraphs = this.splitIntoParagraphs(content, config);
      
      // Add metadata to chunks
      return paragraphs.map((text, index) => ({
        text,
        metadata: {
          ...document.metadata,
          chunkIndex: index,
          chunkType: 'paragraph',
          documentId: document.id,
          documentTitle: document.metadata?.title || document.filename
        }
      }));
    } catch (error) {
      console.error('Error chunking document by paragraphs:', error);
      throw error;
    }
  }
  
  /**
   * Split text into paragraphs
   * 
   * @param {string} text - Document text
   * @param {object} config - Chunking configuration
   * @returns {Array<string>} Paragraphs
   */
  splitIntoParagraphs(text, config) {
    const { maxParagraphLength, minParagraphLength, combineShortParagraphs } = config;
    
    // Split text by double newlines (paragraph breaks)
    const rawParagraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    
    // Process paragraphs according to configuration
    const processedParagraphs = [];
    let currentParagraph = '';
    
    for (const paragraph of rawParagraphs) {
      // If paragraph is too long, split it further
      if (paragraph.length > maxParagraphLength) {
        // If we have accumulated text, add it first
        if (currentParagraph.length > 0) {
          processedParagraphs.push(currentParagraph);
          currentParagraph = '';
        }
        
        // Split long paragraph into smaller chunks
        const chunks = this.splitLongParagraph(paragraph, maxParagraphLength);
        processedParagraphs.push(...chunks);
      } 
      // If combining short paragraphs and this one is short
      else if (combineShortParagraphs && paragraph.length < minParagraphLength) {
        // If adding this paragraph would exceed max length, push current and start new
        if (currentParagraph.length + paragraph.length + 1 > maxParagraphLength) {
          processedParagraphs.push(currentParagraph);
          currentParagraph = paragraph;
        } 
        // Otherwise, add to current with a space
        else {
          currentParagraph = currentParagraph.length > 0 
            ? `${currentParagraph} ${paragraph}`
            : paragraph;
        }
      } 
      // Normal paragraph
      else {
        // If we have accumulated text, add it first
        if (currentParagraph.length > 0) {
          processedParagraphs.push(currentParagraph);
          currentParagraph = '';
        }
        
        processedParagraphs.push(paragraph);
      }
    }
    
    // Add any remaining accumulated text
    if (currentParagraph.length > 0) {
      processedParagraphs.push(currentParagraph);
    }
    
    return processedParagraphs;
  }
  
  /**
   * Split a long paragraph into smaller chunks
   * 
   * @param {string} paragraph - Long paragraph
   * @param {number} maxLength - Maximum chunk length
   * @returns {Array<string>} Smaller chunks
   */
  splitLongParagraph(paragraph, maxLength) {
    const chunks = [];
    let startIndex = 0;
    
    while (startIndex < paragraph.length) {
      // Calculate end index for current chunk
      let endIndex = Math.min(startIndex + maxLength, paragraph.length);
      
      // If we're not at the end, try to find a sentence break
      if (endIndex < paragraph.length) {
        // Look for sentence endings (period, question mark, exclamation point followed by space)
        const searchText = paragraph.substring(Math.max(endIndex - 100, startIndex), endIndex);
        const sentenceMatch = searchText.match(/[.!?]\s+[A-Z]/);
        
        if (sentenceMatch && sentenceMatch.index !== -1) {
          endIndex = Math.max(endIndex - 100, startIndex) + sentenceMatch.index + 2;
        }
      }
      
      // Extract chunk
      chunks.push(paragraph.substring(startIndex, endIndex));
      
      // Move to next chunk
      startIndex = endIndex;
    }
    
    return chunks;
  }
}

module.exports = new ParagraphChunkingStrategy(); 
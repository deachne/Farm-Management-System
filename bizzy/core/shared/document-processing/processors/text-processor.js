/**
 * Text Document Processor
 * 
 * This module handles the processing of plain text documents for further
 * processing in the pipeline.
 */

class TextProcessor {
  /**
   * Process a text document
   * 
   * @param {object} document - Document object with buffer and metadata
   * @returns {Promise<object>} Processed document with extracted content
   */
  async process(document) {
    try {
      console.log(`Processing text document: ${document.filename}`);
      
      // Convert buffer to string
      const content = document.buffer.toString('utf-8');
      
      // Extract basic metadata
      const metadata = this.extractMetadata(content, document.filename);
      
      // Return processed document
      return {
        ...document,
        type: 'text',
        content: content,
        metadata: {
          ...document.metadata,
          ...metadata
        }
      };
    } catch (error) {
      console.error('Error processing text document:', error);
      throw error;
    }
  }
  
  /**
   * Extract metadata from text content
   * 
   * @param {string} content - Document content
   * @param {string} filename - Document filename
   * @returns {object} Extracted metadata
   */
  extractMetadata(content, filename) {
    // Basic metadata extraction
    const lines = content.split('\n');
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const charCount = content.length;
    
    // Try to extract title from first line
    let title = filename;
    if (lines.length > 0 && lines[0].trim().length > 0) {
      title = lines[0].trim();
      // If title is too long, truncate it
      if (title.length > 100) {
        title = title.substring(0, 97) + '...';
      }
    }
    
    return {
      title: title,
      wordCount: wordCount,
      charCount: charCount,
      lineCount: lines.length
    };
  }
}

module.exports = new TextProcessor(); 
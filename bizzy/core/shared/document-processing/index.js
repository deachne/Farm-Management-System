/**
 * Document Processing Pipeline
 * 
 * This module implements the core document processing pipeline for BizzyPerson.
 * It handles the ingestion, analysis, and vectorization of documents with
 * extension-specific customizations.
 */

class DocumentProcessingPipeline {
  constructor() {
    this.processors = new Map();
    this.chunkingStrategies = new Map();
    this.embeddingModels = new Map();
    this.extensionProcessors = new Map();
    
    // Register default processors
    this.registerCoreProcessors();
    
    // Register default chunking strategies
    this.registerCoreChunkingStrategies();
    
    // Register default embedding model
    this.registerDefaultEmbeddingModel();
  }
  
  /**
   * Register core document processors
   */
  registerCoreProcessors() {
    // These will be implemented in separate files
    this.registerProcessor('pdf', require('./processors/pdf-processor'));
    this.registerProcessor('csv', require('./processors/csv-processor'));
    this.registerProcessor('xlsx', require('./processors/excel-processor'));
    this.registerProcessor('docx', require('./processors/word-processor'));
    this.registerProcessor('image', require('./processors/image-processor'));
    this.registerProcessor('text', require('./processors/text-processor'));
    this.registerProcessor('html', require('./processors/html-processor'));
    this.registerProcessor('markdown', require('./processors/markdown-processor'));
  }
  
  /**
   * Register core chunking strategies
   */
  registerCoreChunkingStrategies() {
    this.registerChunkingStrategy('default', require('./chunking/default-strategy'));
    this.registerChunkingStrategy('paragraph', require('./chunking/paragraph-strategy'));
    this.registerChunkingStrategy('sentence', require('./chunking/sentence-strategy'));
    this.registerChunkingStrategy('fixed', require('./chunking/fixed-size-strategy'));
    this.registerChunkingStrategy('semantic', require('./chunking/semantic-strategy'));
    this.registerChunkingStrategy('table', require('./chunking/table-strategy'));
  }
  
  /**
   * Register default embedding model
   */
  registerDefaultEmbeddingModel() {
    this.registerEmbeddingModel('default', require('./embedding/default-model'));
  }
  
  /**
   * Register a document processor
   * 
   * @param {string} type - Document type
   * @param {object} processor - Processor implementation
   * @param {string} extension - Optional extension name
   */
  registerProcessor(type, processor, extension = null) {
    const key = extension ? `${extension}:${type}` : type;
    this.processors.set(key, processor);
  }
  
  /**
   * Register an extension-specific processor
   * 
   * @param {string} extension - Extension name
   * @param {object} processor - Extension processor implementation
   */
  registerExtensionProcessor(extension, processor) {
    this.extensionProcessors.set(extension, processor);
  }
  
  /**
   * Register a chunking strategy
   * 
   * @param {string} name - Strategy name
   * @param {object} strategy - Strategy implementation
   * @param {string} extension - Optional extension name
   */
  registerChunkingStrategy(name, strategy, extension = null) {
    const key = extension ? `${extension}:${name}` : name;
    this.chunkingStrategies.set(key, strategy);
  }
  
  /**
   * Register an embedding model
   * 
   * @param {string} name - Model name
   * @param {object} model - Model implementation
   * @param {string} extension - Optional extension name
   */
  registerEmbeddingModel(name, model, extension = null) {
    const key = extension ? `${extension}:${name}` : name;
    this.embeddingModels.set(key, model);
  }
  
  /**
   * Detect document type based on file extension and content
   * 
   * @param {object} document - Document object
   * @returns {string} Document type
   */
  detectDocumentType(document) {
    // Extract file extension
    const fileExtension = document.filename.split('.').pop().toLowerCase();
    
    // Map common extensions to document types
    const extensionMap = {
      'pdf': 'pdf',
      'csv': 'csv',
      'xlsx': 'xlsx',
      'xls': 'xlsx',
      'docx': 'docx',
      'doc': 'docx',
      'jpg': 'image',
      'jpeg': 'image',
      'png': 'image',
      'gif': 'image',
      'txt': 'text',
      'html': 'html',
      'htm': 'html',
      'md': 'markdown'
    };
    
    // Return mapped type or default to text
    return extensionMap[fileExtension] || 'text';
  }
  
  /**
   * Process a document through the pipeline
   * 
   * @param {object} document - Document object
   * @param {string} workspace - Workspace ID
   * @param {string} extension - Optional extension name
   * @returns {Promise<object>} Processed document
   */
  async processDocument(document, workspace, extension = null) {
    try {
      // Detect document type
      const type = this.detectDocumentType(document);
      
      // Get appropriate processor
      const extensionKey = extension ? `${extension}:${type}` : type;
      const processor = this.processors.get(extensionKey) || this.processors.get(type);
      
      if (!processor) {
        throw new Error(`No processor available for document type: ${type}`);
      }
      
      // Process document
      const processed = await processor.process(document);
      
      // Extract metadata
      const metadata = await this.extractMetadata(processed, extension);
      
      // Apply extension-specific processing if available
      if (extension && this.extensionProcessors.has(extension)) {
        await this.extensionProcessors.get(extension).process(processed, metadata);
      }
      
      // Chunk document
      const chunks = await this.chunkDocument(processed, extension);
      
      // Vectorize chunks
      const vectors = await this.vectorizeChunks(chunks, extension);
      
      // Store document and vectors
      return this.storeDocument(processed, metadata, chunks, vectors, workspace);
    } catch (error) {
      console.error('Error processing document:', error);
      throw error;
    }
  }
  
  /**
   * Extract metadata from a document
   * 
   * @param {object} document - Processed document
   * @param {string} extension - Optional extension name
   * @returns {Promise<object>} Extracted metadata
   */
  async extractMetadata(document, extension = null) {
    try {
      // Base metadata extraction
      const metadata = {
        title: document.title || document.filename,
        type: document.type,
        created: new Date().toISOString(),
        size: document.size,
        extension: extension
      };
      
      // Use extension-specific metadata extractor if available
      if (extension && this.extensionProcessors.has(extension)) {
        const extendedMetadata = await this.extensionProcessors.get(extension).extractMetadata(document);
        return { ...metadata, ...extendedMetadata };
      }
      
      return metadata;
    } catch (error) {
      console.error('Error extracting metadata:', error);
      return {};
    }
  }
  
  /**
   * Chunk a document into smaller pieces for vectorization
   * 
   * @param {object} document - Processed document
   * @param {string} extension - Optional extension name
   * @returns {Promise<Array>} Document chunks
   */
  async chunkDocument(document, extension = null) {
    try {
      // Determine chunking strategy
      let strategy = 'default';
      
      // Use document type-specific strategy if available
      if (document.type === 'table' || document.type === 'csv' || document.type === 'xlsx') {
        strategy = 'table';
      } else if (document.type === 'text' || document.type === 'markdown') {
        strategy = 'paragraph';
      }
      
      // Get extension-specific strategy if available
      const extensionKey = extension ? `${extension}:${strategy}` : strategy;
      const chunkingStrategy = this.chunkingStrategies.get(extensionKey) || this.chunkingStrategies.get(strategy);
      
      if (!chunkingStrategy) {
        throw new Error(`No chunking strategy available for: ${strategy}`);
      }
      
      // Apply chunking strategy
      return await chunkingStrategy.chunk(document);
    } catch (error) {
      console.error('Error chunking document:', error);
      throw error;
    }
  }
  
  /**
   * Vectorize document chunks
   * 
   * @param {Array} chunks - Document chunks
   * @param {string} extension - Optional extension name
   * @returns {Promise<Array>} Vectorized chunks
   */
  async vectorizeChunks(chunks, extension = null) {
    try {
      // Determine embedding model
      const modelKey = extension ? `${extension}:default` : 'default';
      const embeddingModel = this.embeddingModels.get(modelKey) || this.embeddingModels.get('default');
      
      if (!embeddingModel) {
        throw new Error('No embedding model available');
      }
      
      // Vectorize chunks
      return await embeddingModel.embed(chunks);
    } catch (error) {
      console.error('Error vectorizing chunks:', error);
      throw error;
    }
  }
  
  /**
   * Store document, metadata, chunks, and vectors
   * 
   * @param {object} document - Processed document
   * @param {object} metadata - Document metadata
   * @param {Array} chunks - Document chunks
   * @param {Array} vectors - Vectorized chunks
   * @param {string} workspace - Workspace ID
   * @returns {Promise<object>} Stored document
   */
  async storeDocument(document, metadata, chunks, vectors, workspace) {
    try {
      // This would integrate with AnythingLLM's document storage
      // For now, we'll just return the processed data
      return {
        document,
        metadata,
        chunks,
        vectors,
        workspace
      };
    } catch (error) {
      console.error('Error storing document:', error);
      throw error;
    }
  }
}

module.exports = new DocumentProcessingPipeline(); 
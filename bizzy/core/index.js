/**
 * BizzyPerson Core
 * 
 * This is the main entry point for the BizzyPerson platform.
 * It initializes the core components and loads extensions.
 */

const path = require('path');
const fs = require('fs');

// Import core components
const documentProcessing = require('./shared/document-processing');
const extensionApi = require('./extension-api/hooks');
const knowledgeBase = require('./shared/knowledge-base');
const anythingLLMKnowledgeBase = require('./anythingllm/knowledge-base-integration');
const libreChatKnowledgeBase = require('./librechat/knowledge-base-integration');

/**
 * Initialize the BizzyPerson platform
 */
async function initialize() {
  try {
    console.log('Initializing BizzyPerson platform...');
    
    // Initialize knowledge base integration
    await initializeKnowledgeBaseIntegration();
    
    // Load extensions
    await loadExtensions();
    
    console.log('BizzyPerson platform initialized successfully');
    
    return {
      documentProcessing,
      extensionApi,
      knowledgeBase,
      anythingLLMKnowledgeBase,
      libreChatKnowledgeBase
    };
  } catch (error) {
    console.error('Error initializing BizzyPerson platform:', error);
    throw error;
  }
}

/**
 * Initialize the knowledge base integration
 */
async function initializeKnowledgeBaseIntegration() {
  try {
    console.log('Initializing knowledge base integration...');
    
    // Initialize the shared knowledge base
    await knowledgeBase.initialize();
    
    // Initialize AnythingLLM knowledge base integration
    await anythingLLMKnowledgeBase.initialize();
    
    // Initialize LibreChat knowledge base integration
    await libreChatKnowledgeBase.initialize();
    
    console.log('Knowledge base integration initialized successfully');
  } catch (error) {
    console.error('Error initializing knowledge base integration:', error);
    throw error;
  }
}

/**
 * Load extensions from the extensions directory
 */
async function loadExtensions() {
  try {
    console.log('Loading extensions...');
    
    // Get extensions directory path
    const extensionsDir = path.join(__dirname, '../extensions');
    
    // Check if extensions directory exists
    if (!fs.existsSync(extensionsDir)) {
      console.warn('Extensions directory not found. Skipping extension loading.');
      return;
    }
    
    // Get extension directories
    const extensionDirs = fs.readdirSync(extensionsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    // Load each extension
    for (const extensionDir of extensionDirs) {
      try {
        const extensionPath = path.join(extensionsDir, extensionDir);
        const indexPath = path.join(extensionPath, 'index.js');
        
        // Check if extension has an index.js file
        if (fs.existsSync(indexPath)) {
          console.log(`Loading extension: ${extensionDir}`);
          
          // Require the extension
          require(indexPath);
        }
      } catch (error) {
        console.error(`Error loading extension ${extensionDir}:`, error);
        // Continue loading other extensions
      }
    }
    
    console.log('Extensions loaded successfully');
  } catch (error) {
    console.error('Error loading extensions:', error);
    throw error;
  }
}

/**
 * Process a document using the document processing pipeline
 * 
 * @param {object} document - Document object
 * @param {string} workspaceId - Workspace ID
 * @param {string} extension - Optional extension name
 * @returns {Promise<object>} Processed document
 */
async function processDocument(document, workspaceId, extension = null) {
  try {
    console.log(`Processing document: ${document.filename}`);
    
    // Process document through the pipeline
    return await documentProcessing.processDocument(document, workspaceId, extension);
  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
}

/**
 * Query the knowledge base
 * 
 * @param {string} query - The query to search for
 * @param {object} options - Query options
 * @returns {Promise<Array>} Query results
 */
async function queryKnowledgeBase(query, options = {}) {
  try {
    console.log(`Querying knowledge base: ${query}`);
    
    // Query the knowledge base
    return await knowledgeBase.query(query, options);
  } catch (error) {
    console.error('Error querying knowledge base:', error);
    throw error;
  }
}

/**
 * Sync AnythingLLM workspace with LibreChat RAG
 * 
 * @param {string} workspaceId - AnythingLLM workspace ID
 * @returns {Promise<object>} Sync result
 */
async function syncWorkspaceWithLibreChatRag(workspaceId) {
  try {
    console.log(`Syncing workspace ${workspaceId} with LibreChat RAG`);
    
    // Sync the workspace with LibreChat RAG
    return await anythingLLMKnowledgeBase.syncWorkspaceWithLibreChatRag(workspaceId);
  } catch (error) {
    console.error('Error syncing workspace with LibreChat RAG:', error);
    throw error;
  }
}

// Export the BizzyPerson API
module.exports = {
  initialize,
  processDocument,
  queryKnowledgeBase,
  syncWorkspaceWithLibreChatRag,
  documentProcessing,
  extensionApi,
  knowledgeBase,
  anythingLLMKnowledgeBase,
  libreChatKnowledgeBase
}; 
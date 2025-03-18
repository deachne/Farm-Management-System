/**
 * BizzyPerson Core
 * 
 * This is the main entry point for the BizzyPerson platform.
 * It initializes the core components and loads extensions.
 */

const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

// Import core components
const documentProcessing = require('./shared/document-processing');
const extensionApi = require('./extension-api/hooks');
const knowledgeBase = require('./shared/knowledge-base');
const anythingLLMKnowledgeBase = require('./anythingllm/knowledge-base-integration');
const libreChatKnowledgeBase = require('./librechat/knowledge-base-integration');
const chat = require('./shared/chat');
const anythingLLMChat = require('./anythingllm/chat-integration');
const libreChatChat = require('./librechat/chat-integration');

/**
 * Initialize the BizzyPerson platform
 */
async function initialize() {
  try {
    console.log('Initializing BizzyPerson platform...');
    
    // Initialize knowledge base integration
    await initializeKnowledgeBaseIntegration();
    
    // Initialize chat integration
    await initializeChatIntegration();
    
    // Load extensions
    await loadExtensions();
    
    console.log('BizzyPerson platform initialized successfully');
    
    return {
      documentProcessing,
      extensionApi,
      knowledgeBase,
      anythingLLMKnowledgeBase,
      libreChatKnowledgeBase,
      chat,
      anythingLLMChat,
      libreChatChat
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
 * Initialize the chat integration
 */
async function initializeChatIntegration() {
  try {
    console.log('Initializing chat integration...');
    
    // Initialize the shared chat
    await chat.initialize();
    
    // Initialize AnythingLLM chat integration
    await anythingLLMChat.initialize();
    
    // Initialize LibreChat chat integration
    await libreChatChat.initialize();
    
    console.log('Chat integration initialized successfully');
  } catch (error) {
    console.error('Error initializing chat integration:', error);
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
      return [];
    }
    
    // Get extension directories
    const extensionDirs = (await fsPromises.readdir(extensionsDir, { withFileTypes: true }))
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    console.log(`Found ${extensionDirs.length} extension directories: ${extensionDirs.join(', ')}`);
    
    // Sort extensions by dependency order
    let sortedExtensionDirs;
    try {
      sortedExtensionDirs = await extensionApi.sortExtensionsByDependency(extensionDirs, extensionsDir);
      console.log(`Sorted extensions by dependencies: ${sortedExtensionDirs.join(', ')}`);
    } catch (error) {
      console.error('Error sorting extensions by dependencies:', error);
      console.log('Falling back to unsorted loading');
      sortedExtensionDirs = extensionDirs;
    }
    
    const loadedExtensions = [];
    const failedExtensions = [];
    
    // Load each extension
    for (const extensionDir of sortedExtensionDirs) {
      try {
        const extensionModule = await extensionApi.loadExtension(extensionDir, extensionsDir);
        
        if (extensionModule) {
          loadedExtensions.push(extensionDir);
          
          // Get the extension name from the module
          const extensionName = path.basename(extensionDir);
          const extension = extensionApi.getExtension(extensionName);
          
          if (extension) {
            console.log(`Initializing extension: ${extensionName}`);
            try {
              // Initialize the extension
              await extensionApi.registry.initializeExtension(extensionName);
              console.log(`Extension ${extensionName} initialized successfully`);
            } catch (initError) {
              console.error(`Error initializing extension ${extensionName}:`, initError);
            }
          }
        } else {
          failedExtensions.push(extensionDir);
        }
      } catch (error) {
        console.error(`Error loading extension ${extensionDir}:`, error);
        failedExtensions.push(extensionDir);
        // Continue loading other extensions
      }
    }
    
    // Print summary
    console.log(`Extensions loaded: ${loadedExtensions.length} successful, ${failedExtensions.length} failed`);
    if (failedExtensions.length > 0) {
      console.log(`Failed extensions: ${failedExtensions.join(', ')}`);
    }
    
    // Check for any dependency issues in loaded extensions
    const loadingStatus = extensionApi.getExtensionLoadingStatus();
    for (const [name, status] of Object.entries(loadingStatus)) {
      if (status.state === 'error') {
        console.error(`Extension ${name} failed to load: ${status.error}`);
        
        // Log any extensions that depend on this failed extension
        const dependents = extensionApi.getDependentExtensions(name);
        if (dependents.length > 0) {
          console.warn(`Extensions that may be affected: ${dependents.join(', ')}`);
        }
      }
    }
    
    // Set up event handlers for extensions
    extensionApi.registry.on('extension:error', (name, error) => {
      console.error(`Extension error: ${name} - ${error.message}`);
    });
    
    return loadedExtensions;
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

/**
 * Send a chat message using the integrated chat system
 * 
 * @param {string} message - Chat message
 * @param {object} options - Chat options
 * @returns {Promise<object>} Chat response
 */
async function sendChatMessage(message, options = {}) {
  try {
    console.log(`Sending chat message: ${message}`);
    
    // Forward the chat message to AnythingLLM chat integration
    return await anythingLLMChat.forwardChatToLibreChat(
      options.workspaceId,
      message,
      options.conversationId,
      options.systemPrompt
    );
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}

// Export the BizzyPerson API
module.exports = {
  initialize,
  processDocument,
  queryKnowledgeBase,
  syncWorkspaceWithLibreChatRag,
  sendChatMessage,
  documentProcessing,
  extensionApi,
  knowledgeBase,
  anythingLLMKnowledgeBase,
  libreChatKnowledgeBase,
  chat,
  anythingLLMChat,
  libreChatChat
}; 
/**
 * Knowledge Base Integration
 * 
 * This module integrates AnythingLLM's knowledge base with LibreChat's RAG capabilities.
 * It provides a unified interface for accessing and querying the knowledge base.
 */

const path = require('path');
const axios = require('axios');

class KnowledgeBaseIntegration {
  constructor(config = {}) {
    this.config = {
      anythingLLMBaseUrl: process.env.ANYTHINGLLM_BASE_URL || 'http://localhost:3001',
      libreChatBaseUrl: process.env.LIBRECHAT_BASE_URL || 'http://localhost:3080',
      libreChatRagApiUrl: process.env.LIBRECHAT_RAG_API_URL || 'http://localhost:3001',
      ...config
    };
  }

  /**
   * Initialize the knowledge base integration
   */
  async initialize() {
    try {
      console.log('Initializing knowledge base integration...');
      
      // Check AnythingLLM connection
      await this.checkAnythingLLMConnection();
      
      // Check LibreChat connection
      await this.checkLibreChatConnection();
      
      console.log('Knowledge base integration initialized successfully');
    } catch (error) {
      console.error('Error initializing knowledge base integration:', error);
      throw error;
    }
  }

  /**
   * Check AnythingLLM connection
   */
  async checkAnythingLLMConnection() {
    try {
      const response = await axios.get(`${this.config.anythingLLMBaseUrl}/api/health`);
      
      if (response.status !== 200) {
        throw new Error(`AnythingLLM health check failed with status: ${response.status}`);
      }
      
      console.log('AnythingLLM connection successful');
    } catch (error) {
      console.error('Error connecting to AnythingLLM:', error);
      throw error;
    }
  }

  /**
   * Check LibreChat connection
   */
  async checkLibreChatConnection() {
    try {
      const response = await axios.get(`${this.config.libreChatBaseUrl}/api/health`);
      
      if (response.status !== 200) {
        throw new Error(`LibreChat health check failed with status: ${response.status}`);
      }
      
      console.log('LibreChat connection successful');
    } catch (error) {
      console.error('Error connecting to LibreChat:', error);
      throw error;
    }
  }

  /**
   * Query the knowledge base
   * 
   * @param {string} query - The query to search for
   * @param {object} options - Query options
   * @param {string} options.workspaceId - AnythingLLM workspace ID
   * @param {number} options.limit - Maximum number of results
   * @param {number} options.threshold - Similarity threshold
   * @returns {Promise<Array>} Query results
   */
  async query(query, options = {}) {
    try {
      const { workspaceId, limit = 5, threshold = 0.7 } = options;
      
      if (!workspaceId) {
        throw new Error('Workspace ID is required for knowledge base queries');
      }
      
      // Query AnythingLLM vector store
      const response = await axios.post(
        `${this.config.anythingLLMBaseUrl}/api/workspace/${workspaceId}/vector-search`,
        {
          query,
          limit,
          threshold
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error querying knowledge base:', error);
      throw error;
    }
  }

  /**
   * Sync AnythingLLM knowledge base with LibreChat RAG
   * 
   * @param {string} workspaceId - AnythingLLM workspace ID
   * @returns {Promise<object>} Sync result
   */
  async syncWithLibreChat(workspaceId) {
    try {
      if (!workspaceId) {
        throw new Error('Workspace ID is required for knowledge base sync');
      }
      
      // Get workspace documents from AnythingLLM
      const documents = await this.getWorkspaceDocuments(workspaceId);
      
      // Sync documents with LibreChat RAG
      const syncResults = await this.syncDocumentsWithLibreChatRag(documents);
      
      return {
        success: true,
        message: 'Knowledge base synced with LibreChat RAG',
        syncedDocuments: syncResults.length
      };
    } catch (error) {
      console.error('Error syncing knowledge base with LibreChat RAG:', error);
      throw error;
    }
  }

  /**
   * Get workspace documents from AnythingLLM
   * 
   * @param {string} workspaceId - AnythingLLM workspace ID
   * @returns {Promise<Array>} Workspace documents
   */
  async getWorkspaceDocuments(workspaceId) {
    try {
      const response = await axios.get(
        `${this.config.anythingLLMBaseUrl}/api/workspace/${workspaceId}/documents`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting workspace documents:', error);
      throw error;
    }
  }

  /**
   * Sync documents with LibreChat RAG
   * 
   * @param {Array} documents - Documents to sync
   * @returns {Promise<Array>} Sync results
   */
  async syncDocumentsWithLibreChatRag(documents) {
    try {
      const syncPromises = documents.map(document => {
        return this.syncDocumentWithLibreChatRag(document);
      });
      
      return await Promise.all(syncPromises);
    } catch (error) {
      console.error('Error syncing documents with LibreChat RAG:', error);
      throw error;
    }
  }

  /**
   * Sync a document with LibreChat RAG
   * 
   * @param {object} document - Document to sync
   * @returns {Promise<object>} Sync result
   */
  async syncDocumentWithLibreChatRag(document) {
    try {
      // Create document in LibreChat RAG
      const response = await axios.post(
        `${this.config.libreChatRagApiUrl}/api/documents`,
        {
          name: document.name,
          content: document.content,
          metadata: document.metadata
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error syncing document with LibreChat RAG:', error);
      throw error;
    }
  }

  /**
   * Get document by ID from AnythingLLM
   * 
   * @param {string} documentId - Document ID
   * @returns {Promise<object>} Document
   */
  async getDocument(documentId) {
    try {
      const response = await axios.get(
        `${this.config.anythingLLMBaseUrl}/api/document/${documentId}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }
}

// Export the knowledge base integration
module.exports = new KnowledgeBaseIntegration(); 
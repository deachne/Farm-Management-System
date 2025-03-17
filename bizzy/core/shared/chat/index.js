/**
 * Shared Chat Integration
 * 
 * This module provides shared chat functionality between AnythingLLM and LibreChat.
 * It includes utilities for message formatting, conversation management, and more.
 */

const path = require('path');
const axios = require('axios');

class ChatIntegration {
  constructor(config = {}) {
    this.config = {
      anythingLLMBaseUrl: process.env.ANYTHINGLLM_BASE_URL || 'http://localhost:3001',
      libreChatBaseUrl: process.env.LIBRECHAT_BASE_URL || 'http://localhost:3080',
      ...config
    };
  }

  /**
   * Initialize the chat integration
   */
  async initialize() {
    try {
      console.log('Initializing shared chat integration...');
      
      console.log('Shared chat integration initialized successfully');
    } catch (error) {
      console.error('Error initializing shared chat integration:', error);
      throw error;
    }
  }

  /**
   * Format a chat message for display
   * 
   * @param {object} message - Chat message
   * @returns {object} Formatted message
   */
  formatMessage(message) {
    try {
      // Basic message formatting
      return {
        id: message.id || `msg-${Date.now()}`,
        role: message.role || 'user',
        content: message.content || '',
        timestamp: message.timestamp || new Date().toISOString(),
        metadata: message.metadata || {}
      };
    } catch (error) {
      console.error('Error formatting message:', error);
      throw error;
    }
  }

  /**
   * Format a conversation for display
   * 
   * @param {object} conversation - Conversation
   * @returns {object} Formatted conversation
   */
  formatConversation(conversation) {
    try {
      // Basic conversation formatting
      return {
        id: conversation.id || `conv-${Date.now()}`,
        title: conversation.title || 'New Conversation',
        messages: (conversation.messages || []).map(message => this.formatMessage(message)),
        metadata: conversation.metadata || {},
        timestamp: conversation.timestamp || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error formatting conversation:', error);
      throw error;
    }
  }

  /**
   * Create a new conversation
   * 
   * @param {object} options - Conversation options
   * @returns {object} New conversation
   */
  createConversation(options = {}) {
    try {
      const conversation = {
        id: `conv-${Date.now()}`,
        title: options.title || 'New Conversation',
        messages: [],
        metadata: {
          ...options.metadata,
          workspaceId: options.workspaceId
        },
        timestamp: new Date().toISOString()
      };
      
      return this.formatConversation(conversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  /**
   * Add a message to a conversation
   * 
   * @param {object} conversation - Conversation
   * @param {object} message - Message to add
   * @returns {object} Updated conversation
   */
  addMessageToConversation(conversation, message) {
    try {
      const formattedMessage = this.formatMessage(message);
      
      const updatedConversation = {
        ...conversation,
        messages: [...(conversation.messages || []), formattedMessage],
        timestamp: new Date().toISOString()
      };
      
      return this.formatConversation(updatedConversation);
    } catch (error) {
      console.error('Error adding message to conversation:', error);
      throw error;
    }
  }

  /**
   * Format chat artifacts for display
   * 
   * @param {Array} artifacts - Chat artifacts
   * @returns {Array} Formatted artifacts
   */
  formatArtifacts(artifacts) {
    try {
      if (!artifacts || artifacts.length === 0) {
        return [];
      }
      
      return artifacts.map(artifact => {
        // Basic artifact formatting
        return {
          id: artifact.id || `art-${Date.now()}`,
          type: artifact.type || 'text',
          content: artifact.content || '',
          metadata: artifact.metadata || {}
        };
      });
    } catch (error) {
      console.error('Error formatting artifacts:', error);
      throw error;
    }
  }

  /**
   * Format a system prompt with context
   * 
   * @param {string} systemPrompt - System prompt
   * @param {Array} context - Context items
   * @returns {string} Formatted system prompt
   */
  formatSystemPromptWithContext(systemPrompt, context) {
    try {
      if (!context || context.length === 0) {
        return systemPrompt || '';
      }
      
      const contextText = context.map(item => item.text).join('\n\n');
      
      return `${systemPrompt || ''}\n\nContext:\n${contextText}`;
    } catch (error) {
      console.error('Error formatting system prompt with context:', error);
      throw error;
    }
  }

  /**
   * Format a chat response for display
   * 
   * @param {object} response - Chat response
   * @returns {object} Formatted response
   */
  formatChatResponse(response) {
    try {
      // Basic response formatting
      return {
        message: this.formatMessage(response.message || {}),
        artifacts: this.formatArtifacts(response.artifacts || []),
        metadata: response.metadata || {}
      };
    } catch (error) {
      console.error('Error formatting chat response:', error);
      throw error;
    }
  }
}

// Export the chat integration
module.exports = new ChatIntegration(); 
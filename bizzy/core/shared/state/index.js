/**
 * Shared State Management
 * 
 * This module provides shared state management between AnythingLLM and LibreChat.
 * It includes utilities for synchronizing state, managing shared settings, and more.
 */

const path = require('path');
const axios = require('axios');
const EventEmitter = require('events');

class SharedStateManager extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = {
      anythingLLMBaseUrl: process.env.ANYTHINGLLM_BASE_URL || 'http://localhost:3001',
      libreChatBaseUrl: process.env.LIBRECHAT_BASE_URL || 'http://localhost:3080',
      syncInterval: process.env.STATE_SYNC_INTERVAL || 30000, // 30 seconds by default
      ...config
    };
    
    this.state = {
      user: null,
      settings: {
        llm: {
          provider: null,
          model: null,
          temperature: null,
          maxTokens: null
        },
        embedding: {
          provider: null,
          model: null
        },
        ui: {
          theme: null,
          fontSize: null
        },
        vectorDb: {
          provider: null,
          settings: {}
        }
      },
      workspaces: [],
      conversations: [],
      syncTimestamp: null
    };
    
    this.syncIntervalId = null;
  }

  /**
   * Initialize the shared state manager
   */
  async initialize() {
    try {
      console.log('Initializing shared state manager...');
      
      // Perform initial state sync
      await this.syncState();
      
      // Set up automatic sync interval
      this.syncIntervalId = setInterval(() => {
        this.syncState().catch(error => {
          console.error('Error during automatic state sync:', error);
        });
      }, parseInt(this.config.syncInterval));
      
      console.log('Shared state manager initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing shared state manager:', error);
      throw error;
    }
  }

  /**
   * Stop the shared state manager
   */
  stop() {
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId);
      this.syncIntervalId = null;
    }
    console.log('Shared state manager stopped');
  }

  /**
   * Sync state between AnythingLLM and LibreChat
   */
  async syncState() {
    try {
      console.log('Syncing state between AnythingLLM and LibreChat...');
      
      // Sync user state
      await this.syncUserState();
      
      // Sync settings
      await this.syncSettings();
      
      // Sync workspaces
      await this.syncWorkspaces();
      
      // Sync conversations
      await this.syncConversations();
      
      // Update sync timestamp
      this.state.syncTimestamp = new Date().toISOString();
      
      // Emit sync event
      this.emit('sync', this.state);
      
      console.log('State sync completed successfully');
      return true;
    } catch (error) {
      console.error('Error syncing state:', error);
      this.emit('syncError', error);
      throw error;
    }
  }

  /**
   * Sync user state
   */
  async syncUserState() {
    try {
      // Get user from AnythingLLM
      const anythingLLMUser = await this.getAnythingLLMUser();
      
      // Get user from LibreChat
      const libreChatUser = await this.getLibreChatUser();
      
      // Merge user data
      this.state.user = this.mergeUserData(anythingLLMUser, libreChatUser);
      
      return this.state.user;
    } catch (error) {
      console.error('Error syncing user state:', error);
      throw error;
    }
  }

  /**
   * Get user from AnythingLLM
   */
  async getAnythingLLMUser() {
    try {
      const response = await axios.get(
        `${this.config.anythingLLMBaseUrl}/api/me`,
        {
          withCredentials: true
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting AnythingLLM user:', error);
      return null;
    }
  }

  /**
   * Get user from LibreChat
   */
  async getLibreChatUser() {
    try {
      const response = await axios.get(
        `${this.config.libreChatBaseUrl}/api/user/me`,
        {
          withCredentials: true
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting LibreChat user:', error);
      return null;
    }
  }

  /**
   * Merge user data from AnythingLLM and LibreChat
   */
  mergeUserData(anythingLLMUser, libreChatUser) {
    // If either user is null, return the other
    if (!anythingLLMUser) return libreChatUser;
    if (!libreChatUser) return anythingLLMUser;
    
    // Merge user data
    return {
      id: anythingLLMUser.id || libreChatUser.id,
      username: anythingLLMUser.username || libreChatUser.username,
      email: anythingLLMUser.email || libreChatUser.email,
      name: anythingLLMUser.name || libreChatUser.name,
      role: anythingLLMUser.role || libreChatUser.role,
      anythingLLM: anythingLLMUser,
      libreChat: libreChatUser
    };
  }

  /**
   * Sync settings between AnythingLLM and LibreChat
   */
  async syncSettings() {
    try {
      // Get settings from AnythingLLM
      const anythingLLMSettings = await this.getAnythingLLMSettings();
      
      // Get settings from LibreChat
      const libreChatSettings = await this.getLibreChatSettings();
      
      // Merge settings
      this.state.settings = this.mergeSettings(anythingLLMSettings, libreChatSettings);
      
      return this.state.settings;
    } catch (error) {
      console.error('Error syncing settings:', error);
      throw error;
    }
  }

  /**
   * Get settings from AnythingLLM
   */
  async getAnythingLLMSettings() {
    try {
      const response = await axios.get(
        `${this.config.anythingLLMBaseUrl}/api/system/settings`,
        {
          withCredentials: true
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting AnythingLLM settings:', error);
      return null;
    }
  }

  /**
   * Get settings from LibreChat
   */
  async getLibreChatSettings() {
    try {
      const response = await axios.get(
        `${this.config.libreChatBaseUrl}/api/user/settings`,
        {
          withCredentials: true
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting LibreChat settings:', error);
      return null;
    }
  }

  /**
   * Merge settings from AnythingLLM and LibreChat
   */
  mergeSettings(anythingLLMSettings, libreChatSettings) {
    // If either settings is null, return the other
    if (!anythingLLMSettings) return libreChatSettings;
    if (!libreChatSettings) return anythingLLMSettings;
    
    // Extract LLM settings
    const llmSettings = {
      provider: anythingLLMSettings.LLMProvider || libreChatSettings.defaultModelId?.split('/')[0],
      model: anythingLLMSettings.OpenAiModelPref || libreChatSettings.defaultModelId?.split('/')[1],
      temperature: anythingLLMSettings.Temperature || libreChatSettings.defaultTemperature || 0.7,
      maxTokens: anythingLLMSettings.MaxTokens || libreChatSettings.defaultMaxTokens || 4096
    };
    
    // Extract embedding settings
    const embeddingSettings = {
      provider: anythingLLMSettings.EmbeddingEngine || 'openai',
      model: anythingLLMSettings.EmbeddingModel || 'text-embedding-ada-002'
    };
    
    // Extract UI settings
    const uiSettings = {
      theme: libreChatSettings.theme || 'system',
      fontSize: libreChatSettings.fontSize || 'medium'
    };
    
    // Extract vector DB settings
    const vectorDbSettings = {
      provider: anythingLLMSettings.VectorDB || 'lancedb',
      settings: anythingLLMSettings.VectorDBSettings || {}
    };
    
    return {
      llm: llmSettings,
      embedding: embeddingSettings,
      ui: uiSettings,
      vectorDb: vectorDbSettings,
      anythingLLM: anythingLLMSettings,
      libreChat: libreChatSettings
    };
  }

  /**
   * Sync workspaces between AnythingLLM and LibreChat
   */
  async syncWorkspaces() {
    try {
      // Get workspaces from AnythingLLM
      const workspaces = await this.getAnythingLLMWorkspaces();
      
      // Store workspaces in state
      this.state.workspaces = workspaces;
      
      return this.state.workspaces;
    } catch (error) {
      console.error('Error syncing workspaces:', error);
      throw error;
    }
  }

  /**
   * Get workspaces from AnythingLLM
   */
  async getAnythingLLMWorkspaces() {
    try {
      const response = await axios.get(
        `${this.config.anythingLLMBaseUrl}/api/workspaces`,
        {
          withCredentials: true
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting AnythingLLM workspaces:', error);
      return [];
    }
  }

  /**
   * Sync conversations between AnythingLLM and LibreChat
   */
  async syncConversations() {
    try {
      // Get conversations from LibreChat
      const conversations = await this.getLibreChatConversations();
      
      // Store conversations in state
      this.state.conversations = conversations;
      
      return this.state.conversations;
    } catch (error) {
      console.error('Error syncing conversations:', error);
      throw error;
    }
  }

  /**
   * Get conversations from LibreChat
   */
  async getLibreChatConversations() {
    try {
      const response = await axios.get(
        `${this.config.libreChatBaseUrl}/api/conversations`,
        {
          withCredentials: true
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting LibreChat conversations:', error);
      return [];
    }
  }

  /**
   * Get the current state
   */
  getState() {
    return this.state;
  }

  /**
   * Update LLM settings
   */
  async updateLLMSettings(settings) {
    try {
      // Update AnythingLLM LLM settings
      await this.updateAnythingLLMLLMSettings(settings);
      
      // Update LibreChat LLM settings
      await this.updateLibreChatLLMSettings(settings);
      
      // Update local state
      this.state.settings.llm = {
        ...this.state.settings.llm,
        ...settings
      };
      
      // Emit update event
      this.emit('llmSettingsUpdated', this.state.settings.llm);
      
      return this.state.settings.llm;
    } catch (error) {
      console.error('Error updating LLM settings:', error);
      throw error;
    }
  }

  /**
   * Update AnythingLLM LLM settings
   */
  async updateAnythingLLMLLMSettings(settings) {
    try {
      const data = {
        LLMProvider: settings.provider,
        OpenAiModelPref: settings.model,
        Temperature: settings.temperature,
        MaxTokens: settings.maxTokens
      };
      
      await axios.post(
        `${this.config.anythingLLMBaseUrl}/api/system/update`,
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      return true;
    } catch (error) {
      console.error('Error updating AnythingLLM LLM settings:', error);
      throw error;
    }
  }

  /**
   * Update LibreChat LLM settings
   */
  async updateLibreChatLLMSettings(settings) {
    try {
      const data = {
        defaultModelId: `${settings.provider}/${settings.model}`,
        defaultTemperature: settings.temperature,
        defaultMaxTokens: settings.maxTokens
      };
      
      await axios.post(
        `${this.config.libreChatBaseUrl}/api/user/settings`,
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      return true;
    } catch (error) {
      console.error('Error updating LibreChat LLM settings:', error);
      throw error;
    }
  }
}

// Export the shared state manager
module.exports = new SharedStateManager(); 
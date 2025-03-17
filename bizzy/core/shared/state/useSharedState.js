/**
 * useSharedState Hook
 * 
 * This hook provides access to the shared state between AnythingLLM and LibreChat
 * in React components.
 */

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * Hook for accessing and updating shared state
 * 
 * @param {object} options - Hook options
 * @param {boolean} options.autoSync - Whether to automatically sync state
 * @param {number} options.syncInterval - Interval for automatic sync in ms
 * @returns {object} Shared state and utility functions
 */
export function useSharedState(options = {}) {
  const {
    autoSync = true,
    syncInterval = 30000 // 30 seconds by default
  } = options;
  
  const [state, setState] = useState({
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
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  /**
   * Sync state from the server
   */
  const syncState = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/shared-state');
      
      setState(response.data);
      
      return response.data;
    } catch (err) {
      setError(err.message || 'Error syncing state');
      console.error('Error syncing shared state:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Update LLM settings
   */
  const updateLLMSettings = useCallback(async (settings) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/shared-state/llm-settings', settings);
      
      setState(prevState => ({
        ...prevState,
        settings: {
          ...prevState.settings,
          llm: {
            ...prevState.settings.llm,
            ...response.data
          }
        }
      }));
      
      return response.data;
    } catch (err) {
      setError(err.message || 'Error updating LLM settings');
      console.error('Error updating LLM settings:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Update UI settings
   */
  const updateUISettings = useCallback(async (settings) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/shared-state/ui-settings', settings);
      
      setState(prevState => ({
        ...prevState,
        settings: {
          ...prevState.settings,
          ui: {
            ...prevState.settings.ui,
            ...response.data
          }
        }
      }));
      
      return response.data;
    } catch (err) {
      setError(err.message || 'Error updating UI settings');
      console.error('Error updating UI settings:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Get a workspace by ID
   */
  const getWorkspace = useCallback((workspaceId) => {
    return state.workspaces.find(workspace => workspace.id === workspaceId);
  }, [state.workspaces]);
  
  /**
   * Get a conversation by ID
   */
  const getConversation = useCallback((conversationId) => {
    return state.conversations.find(conversation => conversation.id === conversationId);
  }, [state.conversations]);
  
  // Initial sync
  useEffect(() => {
    syncState();
  }, [syncState]);
  
  // Set up automatic sync if enabled
  useEffect(() => {
    if (!autoSync) return;
    
    const intervalId = setInterval(() => {
      syncState();
    }, syncInterval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [autoSync, syncInterval, syncState]);
  
  return {
    state,
    loading,
    error,
    syncState,
    updateLLMSettings,
    updateUISettings,
    getWorkspace,
    getConversation
  };
} 
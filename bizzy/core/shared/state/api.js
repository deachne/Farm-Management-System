/**
 * Shared State API
 * 
 * This module provides API endpoints for accessing and updating shared state
 * between AnythingLLM and LibreChat.
 */

const express = require('express');
const sharedState = require('./index');

/**
 * Create shared state API router
 * 
 * @param {object} options - Router options
 * @returns {express.Router} Express router
 */
function createSharedStateRouter(options = {}) {
  const router = express.Router();
  
  /**
   * GET /api/shared-state
   * Get the current shared state
   */
  router.get('/', async (req, res) => {
    try {
      // Ensure state is synced
      await sharedState.syncState();
      
      // Return the current state
      res.json(sharedState.getState());
    } catch (error) {
      console.error('Error getting shared state:', error);
      res.status(500).json({ error: 'Failed to get shared state' });
    }
  });
  
  /**
   * POST /api/shared-state/llm-settings
   * Update LLM settings
   */
  router.post('/llm-settings', async (req, res) => {
    try {
      const settings = req.body;
      
      // Validate settings
      if (!settings || typeof settings !== 'object') {
        return res.status(400).json({ error: 'Invalid settings' });
      }
      
      // Update LLM settings
      const updatedSettings = await sharedState.updateLLMSettings(settings);
      
      res.json(updatedSettings);
    } catch (error) {
      console.error('Error updating LLM settings:', error);
      res.status(500).json({ error: 'Failed to update LLM settings' });
    }
  });
  
  /**
   * POST /api/shared-state/ui-settings
   * Update UI settings
   */
  router.post('/ui-settings', async (req, res) => {
    try {
      const settings = req.body;
      
      // Validate settings
      if (!settings || typeof settings !== 'object') {
        return res.status(400).json({ error: 'Invalid settings' });
      }
      
      // Update UI settings
      // Note: This is a placeholder for now, as we need to implement this method in the shared state manager
      const updatedSettings = settings;
      
      res.json(updatedSettings);
    } catch (error) {
      console.error('Error updating UI settings:', error);
      res.status(500).json({ error: 'Failed to update UI settings' });
    }
  });
  
  /**
   * GET /api/shared-state/workspaces
   * Get all workspaces
   */
  router.get('/workspaces', async (req, res) => {
    try {
      // Ensure workspaces are synced
      await sharedState.syncWorkspaces();
      
      // Return workspaces
      res.json(sharedState.getState().workspaces);
    } catch (error) {
      console.error('Error getting workspaces:', error);
      res.status(500).json({ error: 'Failed to get workspaces' });
    }
  });
  
  /**
   * GET /api/shared-state/conversations
   * Get all conversations
   */
  router.get('/conversations', async (req, res) => {
    try {
      // Ensure conversations are synced
      await sharedState.syncConversations();
      
      // Return conversations
      res.json(sharedState.getState().conversations);
    } catch (error) {
      console.error('Error getting conversations:', error);
      res.status(500).json({ error: 'Failed to get conversations' });
    }
  });
  
  /**
   * GET /api/shared-state/user
   * Get the current user
   */
  router.get('/user', async (req, res) => {
    try {
      // Ensure user is synced
      await sharedState.syncUserState();
      
      // Return user
      res.json(sharedState.getState().user);
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ error: 'Failed to get user' });
    }
  });
  
  /**
   * GET /api/shared-state/settings
   * Get all settings
   */
  router.get('/settings', async (req, res) => {
    try {
      // Ensure settings are synced
      await sharedState.syncSettings();
      
      // Return settings
      res.json(sharedState.getState().settings);
    } catch (error) {
      console.error('Error getting settings:', error);
      res.status(500).json({ error: 'Failed to get settings' });
    }
  });
  
  return router;
}

module.exports = { createSharedStateRouter }; 
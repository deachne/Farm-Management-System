/**
 * Shared State Manager Tests
 * 
 * This file contains tests for the shared state manager.
 */

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const sharedState = require('./index');

// Create axios mock
const mock = new MockAdapter(axios);

describe('Shared State Manager', () => {
  beforeEach(() => {
    // Reset axios mock
    mock.reset();
    
    // Reset shared state
    sharedState.state = {
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
    
    // Clear interval if it exists
    if (sharedState.syncIntervalId) {
      clearInterval(sharedState.syncIntervalId);
      sharedState.syncIntervalId = null;
    }
  });
  
  afterEach(() => {
    // Clear interval if it exists
    if (sharedState.syncIntervalId) {
      clearInterval(sharedState.syncIntervalId);
      sharedState.syncIntervalId = null;
    }
  });
  
  test('should initialize successfully', async () => {
    // Mock API responses
    mock.onGet(`${sharedState.config.anythingLLMBaseUrl}/api/me`).reply(200, { id: 1, username: 'test' });
    mock.onGet(`${sharedState.config.libreChatBaseUrl}/api/user/me`).reply(200, { id: 1, username: 'test' });
    mock.onGet(`${sharedState.config.anythingLLMBaseUrl}/api/system/settings`).reply(200, { LLMProvider: 'openai' });
    mock.onGet(`${sharedState.config.libreChatBaseUrl}/api/user/settings`).reply(200, { theme: 'dark' });
    mock.onGet(`${sharedState.config.anythingLLMBaseUrl}/api/workspaces`).reply(200, [{ id: 1, name: 'Test Workspace' }]);
    mock.onGet(`${sharedState.config.libreChatBaseUrl}/api/conversations`).reply(200, [{ id: 1, title: 'Test Conversation' }]);
    
    // Initialize shared state
    const result = await sharedState.initialize();
    
    // Verify result
    expect(result).toBe(true);
    
    // Verify state
    expect(sharedState.state.user).toEqual({
      id: 1,
      username: 'test',
      email: undefined,
      name: undefined,
      role: undefined,
      anythingLLM: { id: 1, username: 'test' },
      libreChat: { id: 1, username: 'test' }
    });
    
    expect(sharedState.state.settings.llm.provider).toBe('openai');
    expect(sharedState.state.settings.ui.theme).toBe('dark');
    expect(sharedState.state.workspaces).toEqual([{ id: 1, name: 'Test Workspace' }]);
    expect(sharedState.state.conversations).toEqual([{ id: 1, title: 'Test Conversation' }]);
    expect(sharedState.state.syncTimestamp).not.toBeNull();
    
    // Verify interval
    expect(sharedState.syncIntervalId).not.toBeNull();
  });
  
  test('should sync user state', async () => {
    // Mock API responses
    mock.onGet(`${sharedState.config.anythingLLMBaseUrl}/api/me`).reply(200, { id: 1, username: 'test1' });
    mock.onGet(`${sharedState.config.libreChatBaseUrl}/api/user/me`).reply(200, { id: 2, username: 'test2' });
    
    // Sync user state
    const result = await sharedState.syncUserState();
    
    // Verify result
    expect(result).toEqual({
      id: 1,
      username: 'test1',
      email: undefined,
      name: undefined,
      role: undefined,
      anythingLLM: { id: 1, username: 'test1' },
      libreChat: { id: 2, username: 'test2' }
    });
    
    // Verify state
    expect(sharedState.state.user).toEqual(result);
  });
  
  test('should sync settings', async () => {
    // Mock API responses
    mock.onGet(`${sharedState.config.anythingLLMBaseUrl}/api/system/settings`).reply(200, {
      LLMProvider: 'openai',
      OpenAiModelPref: 'gpt-4',
      Temperature: 0.7,
      MaxTokens: 4096,
      EmbeddingEngine: 'openai',
      EmbeddingModel: 'text-embedding-ada-002',
      VectorDB: 'lancedb'
    });
    
    mock.onGet(`${sharedState.config.libreChatBaseUrl}/api/user/settings`).reply(200, {
      defaultModelId: 'openai/gpt-4',
      defaultTemperature: 0.8,
      defaultMaxTokens: 8192,
      theme: 'dark',
      fontSize: 'medium'
    });
    
    // Sync settings
    const result = await sharedState.syncSettings();
    
    // Verify result
    expect(result.llm.provider).toBe('openai');
    expect(result.llm.model).toBe('gpt-4');
    expect(result.llm.temperature).toBe(0.7);
    expect(result.llm.maxTokens).toBe(4096);
    expect(result.embedding.provider).toBe('openai');
    expect(result.embedding.model).toBe('text-embedding-ada-002');
    expect(result.ui.theme).toBe('dark');
    expect(result.ui.fontSize).toBe('medium');
    expect(result.vectorDb.provider).toBe('lancedb');
    
    // Verify state
    expect(sharedState.state.settings).toEqual(result);
  });
  
  test('should update LLM settings', async () => {
    // Mock API responses
    mock.onPost(`${sharedState.config.anythingLLMBaseUrl}/api/system/update`).reply(200, { success: true });
    mock.onPost(`${sharedState.config.libreChatBaseUrl}/api/user/settings`).reply(200, { success: true });
    
    // Set initial state
    sharedState.state.settings.llm = {
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 4096
    };
    
    // Update LLM settings
    const newSettings = {
      provider: 'anthropic',
      model: 'claude-2',
      temperature: 0.8,
      maxTokens: 8192
    };
    
    const result = await sharedState.updateLLMSettings(newSettings);
    
    // Verify result
    expect(result).toEqual(newSettings);
    
    // Verify state
    expect(sharedState.state.settings.llm).toEqual(newSettings);
  });
  
  test('should handle API errors gracefully', async () => {
    // Mock API responses with errors
    mock.onGet(`${sharedState.config.anythingLLMBaseUrl}/api/me`).reply(500, { error: 'Server error' });
    mock.onGet(`${sharedState.config.libreChatBaseUrl}/api/user/me`).reply(500, { error: 'Server error' });
    
    // Sync user state
    const result = await sharedState.syncUserState();
    
    // Verify result is null
    expect(result).toBeNull();
    
    // Verify state
    expect(sharedState.state.user).toBeNull();
  });
}); 
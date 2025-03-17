/**
 * Chat Integration Tests
 * 
 * This file contains tests for the shared chat functionality.
 */

const chat = require('./index');

describe('Shared Chat Integration', () => {
  beforeEach(() => {
    // Reset any mocks or state before each test
  });

  describe('Message Formatting', () => {
    test('should format a message correctly', () => {
      const message = {
        content: 'Hello, world!',
        role: 'user'
      };

      const formattedMessage = chat.formatMessage(message);

      expect(formattedMessage).toHaveProperty('id');
      expect(formattedMessage).toHaveProperty('role', 'user');
      expect(formattedMessage).toHaveProperty('content', 'Hello, world!');
      expect(formattedMessage).toHaveProperty('timestamp');
      expect(formattedMessage).toHaveProperty('metadata');
    });

    test('should use default values for missing properties', () => {
      const message = {
        content: 'Hello, world!'
      };

      const formattedMessage = chat.formatMessage(message);

      expect(formattedMessage).toHaveProperty('role', 'user');
    });
  });

  describe('Conversation Formatting', () => {
    test('should format a conversation correctly', () => {
      const conversation = {
        title: 'Test Conversation',
        messages: [
          { content: 'Hello', role: 'user' },
          { content: 'Hi there!', role: 'assistant' }
        ]
      };

      const formattedConversation = chat.formatConversation(conversation);

      expect(formattedConversation).toHaveProperty('id');
      expect(formattedConversation).toHaveProperty('title', 'Test Conversation');
      expect(formattedConversation).toHaveProperty('messages');
      expect(formattedConversation.messages).toHaveLength(2);
      expect(formattedConversation).toHaveProperty('timestamp');
      expect(formattedConversation).toHaveProperty('metadata');
    });

    test('should use default values for missing properties', () => {
      const conversation = {
        messages: [
          { content: 'Hello', role: 'user' }
        ]
      };

      const formattedConversation = chat.formatConversation(conversation);

      expect(formattedConversation).toHaveProperty('title', 'New Conversation');
    });
  });

  describe('Conversation Creation', () => {
    test('should create a new conversation', () => {
      const options = {
        title: 'New Discussion',
        workspaceId: 'workspace-123'
      };

      const conversation = chat.createConversation(options);

      expect(conversation).toHaveProperty('id');
      expect(conversation).toHaveProperty('title', 'New Discussion');
      expect(conversation).toHaveProperty('messages');
      expect(conversation.messages).toHaveLength(0);
      expect(conversation).toHaveProperty('metadata.workspaceId', 'workspace-123');
    });

    test('should use default values for missing properties', () => {
      const conversation = chat.createConversation();

      expect(conversation).toHaveProperty('title', 'New Conversation');
    });
  });

  describe('Message Addition', () => {
    test('should add a message to a conversation', () => {
      const conversation = chat.createConversation({
        title: 'Test Conversation'
      });

      const message = {
        content: 'Hello, world!',
        role: 'user'
      };

      const updatedConversation = chat.addMessageToConversation(conversation, message);

      expect(updatedConversation.messages).toHaveLength(1);
      expect(updatedConversation.messages[0]).toHaveProperty('content', 'Hello, world!');
      expect(updatedConversation.messages[0]).toHaveProperty('role', 'user');
    });
  });

  describe('Artifact Formatting', () => {
    test('should format artifacts correctly', () => {
      const artifacts = [
        {
          type: 'image',
          content: 'image-data',
          metadata: { width: 100, height: 100 }
        },
        {
          type: 'code',
          content: 'console.log("Hello, world!");'
        }
      ];

      const formattedArtifacts = chat.formatArtifacts(artifacts);

      expect(formattedArtifacts).toHaveLength(2);
      expect(formattedArtifacts[0]).toHaveProperty('id');
      expect(formattedArtifacts[0]).toHaveProperty('type', 'image');
      expect(formattedArtifacts[0]).toHaveProperty('content', 'image-data');
      expect(formattedArtifacts[0]).toHaveProperty('metadata.width', 100);
      expect(formattedArtifacts[0]).toHaveProperty('metadata.height', 100);

      expect(formattedArtifacts[1]).toHaveProperty('type', 'code');
      expect(formattedArtifacts[1]).toHaveProperty('content', 'console.log("Hello, world!");');
    });

    test('should return an empty array for null or empty artifacts', () => {
      expect(chat.formatArtifacts(null)).toEqual([]);
      expect(chat.formatArtifacts([])).toEqual([]);
    });
  });

  describe('System Prompt Formatting', () => {
    test('should format a system prompt with context', () => {
      const systemPrompt = 'You are a helpful assistant.';
      const context = [
        { text: 'Sustainable farming is a method of agriculture.' },
        { text: 'It focuses on long-term ecosystem health.' }
      ];

      const formattedPrompt = chat.formatSystemPromptWithContext(systemPrompt, context);

      expect(formattedPrompt).toContain('You are a helpful assistant.');
      expect(formattedPrompt).toContain('Sustainable farming is a method of agriculture.');
      expect(formattedPrompt).toContain('It focuses on long-term ecosystem health.');
    });

    test('should return the system prompt if context is empty', () => {
      const systemPrompt = 'You are a helpful assistant.';

      expect(chat.formatSystemPromptWithContext(systemPrompt, [])).toBe(systemPrompt);
      expect(chat.formatSystemPromptWithContext(systemPrompt, null)).toBe(systemPrompt);
    });

    test('should handle empty system prompt', () => {
      const context = [
        { text: 'Sustainable farming is a method of agriculture.' }
      ];

      expect(chat.formatSystemPromptWithContext('', context)).toContain('Sustainable farming');
      expect(chat.formatSystemPromptWithContext(null, context)).toContain('Sustainable farming');
    });
  });

  describe('Chat Response Formatting', () => {
    test('should format a chat response correctly', () => {
      const response = {
        message: {
          content: 'Hello, world!',
          role: 'assistant'
        },
        artifacts: [
          {
            type: 'image',
            content: 'image-data'
          }
        ],
        metadata: {
          model: 'gpt-4'
        }
      };

      const formattedResponse = chat.formatChatResponse(response);

      expect(formattedResponse).toHaveProperty('message');
      expect(formattedResponse.message).toHaveProperty('content', 'Hello, world!');
      expect(formattedResponse.message).toHaveProperty('role', 'assistant');

      expect(formattedResponse).toHaveProperty('artifacts');
      expect(formattedResponse.artifacts).toHaveLength(1);
      expect(formattedResponse.artifacts[0]).toHaveProperty('type', 'image');

      expect(formattedResponse).toHaveProperty('metadata');
      expect(formattedResponse.metadata).toHaveProperty('model', 'gpt-4');
    });

    test('should handle missing properties', () => {
      const response = {};

      const formattedResponse = chat.formatChatResponse(response);

      expect(formattedResponse).toHaveProperty('message');
      expect(formattedResponse).toHaveProperty('artifacts');
      expect(formattedResponse).toHaveProperty('metadata');
    });
  });
}); 
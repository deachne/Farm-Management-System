/**
 * Example Extension
 * 
 * This is an example extension that demonstrates the extension registration system.
 */

// Import the extension API
const { register, registry } = require('../../core/extension-api');

// Listen for extension events
registry.on('extension:registered', (name, extension) => {
  console.log(`Event received in extension: ${name} registered`);
});

registry.on('extension:initialized', (name, extension) => {
  console.log(`Event received in extension: ${name} initialized`);
});

// Create a document processor
function createDocumentProcessor() {
  return {
    process: async (document) => {
      console.log('Example extension processing document...');
      
      // Add metadata
      const enhancedMetadata = {
        ...document.metadata,
        example: {
          processed: true,
          timestamp: Date.now(),
          wordCount: document.text.split(/\s+/).length
        }
      };
      
      // Return the processed document
      return {
        text: document.text,
        metadata: enhancedMetadata
      };
    }
  };
}

// Create a chat tool
function createChatTool() {
  return {
    processQuery: async (context) => {
      console.log('Example extension processing chat query:', context.query);
      
      // Only handle queries about the example extension
      if (context.query.toLowerCase().includes('example extension')) {
        return {
          type: 'text',
          content: 'This is the example extension. It demonstrates the extension registration system.'
        };
      }
      
      // Pass through to other handlers
      return null;
    }
  };
}

// Create UI components
function createUIComponents() {
  return {
    components: {
      'example-card': (props) => {
        return {
          type: 'div',
          className: 'example-card',
          children: [
            {
              type: 'h2',
              content: 'Example Extension'
            },
            {
              type: 'p',
              content: 'This is a UI component from the example extension.'
            }
          ]
        };
      }
    }
  };
}

// Define data models
const dataModels = {
  'example-model': {
    schema: {
      id: 'string',
      name: 'string',
      created: 'date',
      properties: 'object'
    },
    methods: {
      validate: (data) => {
        return !!data.id && !!data.name;
      }
    }
  }
};

// Create AnythingLLM integration
function createAnythingLLMIntegration(api) {
  return {
    documentProcessors: [
      {
        name: 'example-processor',
        process: async (document) => {
          console.log('Example extension processing document for AnythingLLM...');
          return document;
        }
      }
    ]
  };
}

// Create LibreChat integration
function createLibreChatIntegration(api) {
  return {
    chatTools: [
      {
        name: 'example-tool',
        description: 'An example tool from the example extension',
        execute: async (params) => {
          console.log('Example extension executing LibreChat tool...');
          return {
            content: 'This is a result from the example extension tool.'
          };
        }
      }
    ]
  };
}

// Initialize function
async function initialize(context) {
  console.log('Example extension initializing...');
  console.log('Hooks available:', Object.keys(context.hooks));
  console.log('Capabilities available:', Object.keys(context.capabilities));
  
  // Simulate initialization tasks
  await new Promise(resolve => setTimeout(resolve, 100));
  
  console.log('Example extension initialized successfully');
}

// Register the extension
register({
  name: 'example-extension',
  version: '1.0.0',
  description: 'An example extension that demonstrates the extension registration system',
  author: 'BizzyPerson Team',
  
  // Extension initialization
  initialize,
  
  // Document processing hook
  initializeDocumentProcessing: createDocumentProcessor,
  
  // Chat hook
  initializeChat: createChatTool,
  
  // UI hook
  initializeUI: createUIComponents,
  
  // AnythingLLM hook
  initializeAnythingLLM: createAnythingLLMIntegration,
  
  // LibreChat hook
  initializeLibreChat: createLibreChatIntegration,
  
  // Data models
  dataModels
});

console.log('Example extension registration submitted'); 
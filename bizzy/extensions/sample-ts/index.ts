/**
 * Sample TypeScript Extension
 * 
 * This is a sample TypeScript extension to demonstrate the extension loading mechanism.
 */

// Import the extension API
import { register } from '../../core/extension-api/hooks';

// Define types for the extension
interface DocumentProcessingContext {
  text: string;
  metadata: Record<string, any>;
}

interface ChatContext {
  query: string;
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

interface UIComponentProps {
  theme: 'light' | 'dark';
  [key: string]: any;
}

// Sample document processor
async function processDocument(document: DocumentProcessingContext) {
  console.log('Processing document with TypeScript extension:', document.text.substring(0, 50) + '...');
  
  // Add a simple enhancement to the document
  const enhancedMetadata = {
    ...document.metadata,
    samplets: {
      processed: true,
      processingDate: new Date().toISOString(),
      wordCount: document.text.split(/\s+/).length
    }
  };
  
  return {
    text: document.text,
    metadata: enhancedMetadata
  };
}

// Sample chat tool
async function handleChat(context: ChatContext) {
  console.log('Sample TypeScript extension processing chat:', context.query);
  
  // Only handle queries that explicitly mention TypeScript
  if (context.query.toLowerCase().includes('typescript')) {
    return {
      type: 'text',
      content: 'This response is coming from the Sample TypeScript extension. TypeScript is a strongly typed programming language that builds on JavaScript.'
    };
  }
  
  // Pass through to other handlers
  return null;
}

// Sample UI component (simplified representation)
function SampleUIComponent(props: UIComponentProps) {
  const componentConfig = {
    type: 'div',
    className: `sample-ts-component ${props.theme}`,
    children: [
      {
        type: 'h2',
        content: 'Sample TypeScript Extension'
      },
      {
        type: 'p',
        content: 'This component is rendered by the Sample TypeScript extension.'
      }
    ]
  };
  
  console.log('Rendering Sample TypeScript UI component with config:', componentConfig);
  
  return componentConfig;
}

// Register the extension
register({
  name: 'sample-ts',
  version: '0.1.0',
  description: 'Sample TypeScript extension for BizzyPerson',
  author: 'BizzyPerson Team',
  
  // Document processing hook
  initializeDocumentProcessing: () => {
    return {
      process: processDocument
    };
  },
  
  // Chat hooks
  initializeChat: () => {
    return {
      processQuery: handleChat
    };
  },
  
  // UI component hooks
  initializeUI: () => {
    return {
      components: {
        'sample-ts-component': SampleUIComponent
      }
    };
  }
});

console.log('Sample TypeScript extension registered successfully'); 
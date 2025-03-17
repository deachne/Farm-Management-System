/**
 * Document Processing Pipeline Test
 * 
 * This module tests the document processing pipeline functionality.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const pipeline = require('../../core/shared/document-processing');

/**
 * Test the document processing pipeline with a text document
 */
async function testTextProcessing() {
  console.log('Testing text document processing...');
  
  // Create a sample text document
  const content = `# Sample Document
  
This is a sample text document for testing the document processing pipeline.

It contains multiple paragraphs to test the chunking strategies.

Each paragraph should be processed correctly and converted into chunks.

The chunks should then be vectorized using the embedding model.`;
  
  const document = {
    id: 'test-doc-1',
    filename: 'sample.txt',
    buffer: Buffer.from(content),
    metadata: {
      source: 'test'
    }
  };
  
  // Process the document
  const result = await pipeline.processDocument(document, 'test-workspace');
  
  // Verify the result
  assert(result, 'Result should not be null');
  assert(result.document, 'Document should be included in result');
  assert(result.metadata, 'Metadata should be included in result');
  assert(result.chunks, 'Chunks should be included in result');
  assert(result.vectors, 'Vectors should be included in result');
  assert(result.workspace === 'test-workspace', 'Workspace should match input');
  
  // Verify document processing
  assert(result.document.type === 'text', 'Document type should be text');
  assert(result.document.content === content, 'Document content should match input');
  
  // Verify metadata
  assert(result.metadata.title, 'Metadata should include title');
  assert(result.metadata.type === 'text', 'Metadata should include type');
  assert(result.metadata.created, 'Metadata should include creation date');
  
  // Verify chunks
  assert(Array.isArray(result.chunks), 'Chunks should be an array');
  assert(result.chunks.length > 0, 'There should be at least one chunk');
  
  // Verify vectors
  assert(Array.isArray(result.vectors), 'Vectors should be an array');
  assert(result.vectors.length === result.chunks.length, 'Vector count should match chunk count');
  assert(result.vectors[0].embedding, 'Vectors should include embeddings');
  assert(Array.isArray(result.vectors[0].embedding), 'Embeddings should be arrays');
  
  console.log('Text document processing test passed!');
  return true;
}

/**
 * Run all tests
 */
async function runTests() {
  try {
    await testTextProcessing();
    console.log('All tests passed!');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testTextProcessing,
  runTests
}; 
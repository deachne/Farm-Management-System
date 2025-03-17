# Document Processing System

## Overview

The Document Processing System is a core component of BizzyPerson that handles the ingestion, analysis, and vectorization of documents. It provides a modular pipeline architecture that can be extended with industry-specific processors, chunking strategies, and embedding models.

## Architecture

The document processing pipeline follows this flow:

```
Document Upload → Type Detection → Content Extraction → 
Metadata Extraction → Extension Processing → Chunking → 
Vectorization → Storage
```

### Key Components

1. **Document Processors**: Handle specific document types (PDF, CSV, XLSX, etc.)
2. **Chunking Strategies**: Split documents into appropriate chunks for vectorization
3. **Embedding Models**: Convert text chunks into vector embeddings for semantic search
4. **Extension Points**: Allow industry-specific extensions to customize processing

## Usage

### Basic Usage

```javascript
const pipeline = require('../../core/shared/document-processing');

// Process a document
const result = await pipeline.processDocument(document, workspaceId, extensionName);
```

### Document Object Structure

```javascript
const document = {
  id: 'unique-id',
  filename: 'document.pdf',
  buffer: Buffer.from(...), // Document content as Buffer
  metadata: {
    // Optional initial metadata
    source: 'upload',
    tags: ['important', 'report']
  }
};
```

### Result Structure

```javascript
const result = {
  document: {
    // Original document with extracted content
    id: 'unique-id',
    filename: 'document.pdf',
    buffer: Buffer.from(...),
    type: 'pdf',
    content: '...',
    structure: { ... }
  },
  metadata: {
    // Extracted and enhanced metadata
    title: 'Document Title',
    type: 'pdf',
    created: '2023-03-15T12:34:56Z',
    author: 'Author Name',
    pageCount: 5,
    ...
  },
  chunks: [
    // Document chunks for vectorization
    {
      text: 'Chunk content...',
      metadata: {
        chunkIndex: 0,
        documentId: 'unique-id',
        ...
      }
    },
    ...
  ],
  vectors: [
    // Vectorized chunks
    {
      text: 'Chunk content...',
      metadata: { ... },
      embedding: [0.1, 0.2, ...]
    },
    ...
  ],
  workspace: 'workspace-id'
};
```

## Extension Points

### Custom Document Processors

```javascript
// Register a custom processor for a specific document type
pipeline.registerProcessor('custom-type', customProcessor);

// Register an extension-specific processor
pipeline.registerProcessor('custom-type', customProcessor, 'extension-name');
```

### Custom Chunking Strategies

```javascript
// Register a custom chunking strategy
pipeline.registerChunkingStrategy('custom-strategy', customStrategy);

// Register an extension-specific chunking strategy
pipeline.registerChunkingStrategy('custom-strategy', customStrategy, 'extension-name');
```

### Custom Embedding Models

```javascript
// Register a custom embedding model
pipeline.registerEmbeddingModel('custom-model', customModel);

// Register an extension-specific embedding model
pipeline.registerEmbeddingModel('custom-model', customModel, 'extension-name');
```

## Supported Document Types

- PDF (`pdf`)
- CSV (`csv`)
- Excel (`xlsx`, `xls`)
- Word (`docx`, `doc`)
- Images (`jpg`, `jpeg`, `png`, `gif`)
- Plain Text (`txt`)
- HTML (`html`, `htm`)
- Markdown (`md`)

## Chunking Strategies

- **Default**: General-purpose chunking with natural break detection
- **Paragraph**: Paragraph-based chunking for text documents
- **Sentence**: Sentence-based chunking for fine-grained analysis
- **Fixed**: Fixed-size chunking for consistent lengths
- **Semantic**: Semantic-aware chunking that preserves meaning
- **Table**: Specialized chunking for tabular data

## Integration with AnythingLLM

The Document Processing System integrates with AnythingLLM's document storage and vectorization capabilities. The `storeDocument` method handles the integration with AnythingLLM's database and vector store.

## Testing

Run the tests to verify the document processing pipeline:

```bash
node tests/document-processing/pipeline-test.js
``` 
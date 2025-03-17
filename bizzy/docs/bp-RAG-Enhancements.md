# BizzyPerson RAG Enhancements (BP06)

## Overview

This document outlines the Retrieval-Augmented Generation (RAG) enhancements implemented in the BizzyPerson platform. These enhancements are designed to improve the platform's ability to process, store, and retrieve agricultural documents and data, providing more accurate and contextually relevant information to users.

## Core RAG Improvements

The BizzyPerson platform extends the RAG capabilities of AnythingLLM and LibreChat with the following enhancements:

1. **Enhanced Metadata System**: Extended document metadata to support agricultural-specific attributes and relationships
2. **Tabular Data Processing**: Specialized handling for tabular data common in agricultural contexts (soil tests, yield data, etc.)
3. **Document Relationship Tracking**: Ability to link related documents for improved context
4. **Specialized MCP Tools**: Custom tools for intelligent document querying and analysis
5. **Agricultural Context Awareness**: Improved retrieval based on seasonal and operational factors

## AnythingLLM Extensions

### Database Schema Extensions

The BizzyPerson platform extends AnythingLLM's database schema to support enhanced metadata:

```javascript
// Extended Prisma schema for documents
model documents {
  id                Int      @id @default(autoincrement())
  // Existing AnythingLLM fields...
  
  // BizzyPerson extensions
  schema            Json?    // For storing table schemas
  document_type     String?  // Document categorization (soil_test, field_report, etc.)
  custom_tags       String?  // JSON string of custom tags
  related_docs      String?  // References to related documents
  field_id          String?  // Associated field identifier
  season            String?  // Growing season reference
  crop_type         String?  // Associated crop type
  equipment_id      String?  // Associated equipment identifier
  observation_date  DateTime? // When the observation was made
  
  // Relations
  sections          document_sections[]
  rows              document_rows[]
}

// New model for tabular data
model document_rows {
  id            Int      @id @default(autoincrement())
  document_id   Int
  row_data      Json     // Store row data as JSON
  row_number    Int      // Row number in the original document
  document      documents @relation(fields: [document_id], references: [id], onDelete: Cascade)
}

// New model for field boundaries
model field_boundaries {
  id            Int      @id @default(autoincrement())
  field_id      String   // Field identifier
  boundary_data Json     // GeoJSON representation of field boundary
  center_lat    Float    // Center latitude
  center_lon    Float    // Center longitude
  area_acres    Float    // Field area in acres
}
```

### Document Processing Enhancements

The document processing pipeline is enhanced to extract and store agricultural-specific metadata:

```javascript
// Enhanced document processing
const processAgriculturalDocument = async (docData, workspace_id) => {
  // Extract document type and metadata
  const docType = detectDocumentType(docData);
  const metadata = extractAgMetadata(docData, docType);
  
  // Extract schema for tabular documents
  let schema = null;
  if (isTabularDocument(docData)) {
    schema = extractTableSchema(docData.rawContent);
  }
  
  // Store document with enhanced metadata
  const documentRecord = await prisma.documents.create({
    data: {
      // Standard AnythingLLM fields
      name: docData.title,
      workspace_id: Number(workspace_id),
      // ... other standard fields
      
      // BizzyPerson extensions
      schema: schema,
      document_type: docType,
      custom_tags: JSON.stringify(metadata.tags || []),
      related_docs: JSON.stringify(metadata.relatedDocs || []),
      field_id: metadata.fieldId,
      season: metadata.season,
      crop_type: metadata.cropType,
      equipment_id: metadata.equipmentId,
      observation_date: metadata.observationDate
    }
  });
  
  // Process tabular data if applicable
  if (schema && docData.tableData) {
    await storeTabularData(documentRecord.id, docData.tableData);
  }
  
  // Continue with vectorization...
  return await vectorizeDocument(documentRecord, docData, workspace_id);
};

// Helper function to store tabular data
const storeTabularData = async (documentId, tableData) => {
  // Store each row with its row number
  const rowPromises = tableData.map((rowData, index) => {
    return prisma.document_rows.create({
      data: {
        document_id: documentId,
        row_data: rowData,
        row_number: index + 1
      }
    });
  });
  
  await Promise.all(rowPromises);
};
```

### Specialized Vectorization

The vectorization process is enhanced to better handle agricultural content:

```javascript
// Enhanced vectorization for agricultural documents
const vectorizeAgriculturalDocument = async (document, docData, workspace_id) => {
  const embeddingType = await getEmbeddingType(workspace_id);
  const openai = getOpenAIEmbedding();
  
  // Split content into sections
  const sections = splitBySection(docData.rawContent, docData.fileType);
  
  // Process each section with agricultural context
  for (const section of sections) {
    // Enhance section with agricultural context
    const enhancedSection = addAgriculturalContext(section, {
      docType: document.document_type,
      fieldId: document.field_id,
      season: document.season,
      cropType: document.crop_type
    });
    
    // Generate embedding with enhanced context
    const { embedding, tokens } = await openai.embedTextWithTokenCount(enhancedSection);
    
    // Store section with embedding
    await prisma.document_sections.create({
      data: {
        document_id: document.id,
        content: section,
        tokens: tokens,
        embedding: embedding,
        metadata: JSON.stringify({
          enhanced: true,
          docType: document.document_type,
          fieldId: document.field_id,
          season: document.season,
          cropType: document.crop_type
        })
      }
    });
  }
};

// Add agricultural context to improve embedding quality
const addAgriculturalContext = (text, context) => {
  if (!context.docType) return text;
  
  // Add contextual prefixes based on document type
  let enhancedText = text;
  
  if (context.docType === 'soil_test') {
    enhancedText = `Soil Test Report for field ${context.fieldId || 'unknown'}: ${text}`;
  } else if (context.docType === 'yield_data') {
    enhancedText = `Yield Data for ${context.cropType || 'crop'} in ${context.season || 'season'}: ${text}`;
  } else if (context.docType === 'field_observation') {
    enhancedText = `Field Observation for ${context.fieldId || 'field'}: ${text}`;
  }
  
  return enhancedText;
};
```

### Enhanced Retrieval API

New API endpoints are added to support advanced querying by agricultural metadata:

```javascript
// API endpoint for querying by agricultural metadata
router.get('/api/documents/ag-metadata', async (req, res) => {
  const { 
    type, 
    field_id, 
    season, 
    crop_type, 
    tags, 
    workspace_id 
  } = req.query;
  
  try {
    const documents = await prisma.documents.findMany({
      where: {
        workspace_id: Number(workspace_id),
        ...(type ? { document_type: type } : {}),
        ...(field_id ? { field_id: field_id } : {}),
        ...(season ? { season: season } : {}),
        ...(crop_type ? { crop_type: crop_type } : {}),
        ...(tags ? { 
          custom_tags: { 
            contains: tags.split(',').map(t => t.trim()) 
          } 
        } : {})
      },
      select: {
        id: true,
        name: true,
        document_type: true,
        custom_tags: true,
        schema: true,
        field_id: true,
        season: true,
        crop_type: true,
        observation_date: true
      }
    });
    
    return res.status(200).json({ success: true, documents });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint for querying tabular data
router.post('/api/documents/:documentId/query-table', async (req, res) => {
  const { documentId } = req.params;
  const { query } = req.body;
  
  try {
    // Get document to verify it has a schema
    const document = await prisma.documents.findUnique({
      where: { id: Number(documentId) },
      select: { schema: true }
    });
    
    if (!document || !document.schema) {
      return res.status(404).json({ 
        success: false, 
        error: 'Document not found or is not tabular' 
      });
    }
    
    // Get all rows for this document
    const rows = await prisma.document_rows.findMany({
      where: { document_id: Number(documentId) },
      select: { row_data: true }
    });
    
    // Process query against rows
    const results = processTableQuery(rows.map(r => r.row_data), query, document.schema);
    
    return res.status(200).json({ success: true, results });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
});
```

## LibreChat MCP Tool Integration

### Agricultural Document Tools

Custom MCP tools are created to interact with the enhanced document system:

```javascript
// Agricultural document tools for LibreChat MCP
const agriculturalDocumentTools = [
  {
    name: 'list_ag_documents',
    description: 'Lists agricultural documents with their metadata',
    parameters: {
      type: 'object',
      properties: {
        document_type: {
          type: 'string',
          description: 'Filter by document type (soil_test, yield_data, field_observation, etc.)'
        },
        field_id: {
          type: 'string',
          description: 'Filter by field identifier'
        },
        season: {
          type: 'string',
          description: 'Filter by growing season'
        },
        crop_type: {
          type: 'string',
          description: 'Filter by crop type'
        },
        tags: {
          type: 'string',
          description: 'Filter by tags (comma-separated)'
        }
      }
    },
    execute: async ({ document_type, field_id, season, crop_type, tags }) => {
      // Call BizzyPerson API to get document metadata
      const queryParams = new URLSearchParams();
      if (document_type) queryParams.append('type', document_type);
      if (field_id) queryParams.append('field_id', field_id);
      if (season) queryParams.append('season', season);
      if (crop_type) queryParams.append('crop_type', crop_type);
      if (tags) queryParams.append('tags', tags);
      
      const response = await fetch(`${process.env.BIZZY_API_URL}/api/documents/ag-metadata?${queryParams}`);
      const data = await response.json();
      return data.documents;
    }
  },
  {
    name: 'get_field_documents',
    description: 'Retrieves all documents related to a specific field',
    parameters: {
      type: 'object',
      properties: {
        field_id: {
          type: 'string',
          description: 'Field identifier'
        },
        season: {
          type: 'string',
          description: 'Optional: Filter by growing season'
        }
      },
      required: ['field_id']
    },
    execute: async ({ field_id, season }) => {
      // Call BizzyPerson API to get field documents
      const queryParams = new URLSearchParams();
      queryParams.append('field_id', field_id);
      if (season) queryParams.append('season', season);
      
      const response = await fetch(`${process.env.BIZZY_API_URL}/api/documents/ag-metadata?${queryParams}`);
      const data = await response.json();
      return data.documents;
    }
  },
  {
    name: 'query_ag_table',
    description: 'Executes queries against agricultural tabular documents',
    parameters: {
      type: 'object',
      properties: {
        document_id: {
          type: 'number',
          description: 'ID of the tabular document to query'
        },
        query: {
          type: 'string',
          description: 'SQL-like query to execute against the document'
        }
      },
      required: ['document_id', 'query']
    },
    execute: async ({ document_id, query }) => {
      // Call BizzyPerson API to query tabular data
      const response = await fetch(`${process.env.BIZZY_API_URL}/api/documents/${document_id}/query-table`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      return data.results;
    }
  },
  {
    name: 'analyze_soil_test',
    description: 'Analyzes soil test data and provides recommendations',
    parameters: {
      type: 'object',
      properties: {
        document_id: {
          type: 'number',
          description: 'ID of the soil test document'
        },
        crop_type: {
          type: 'string',
          description: 'Crop type for recommendations'
        }
      },
      required: ['document_id']
    },
    execute: async ({ document_id, crop_type }) => {
      // Call BizzyPerson API to analyze soil test
      const response = await fetch(`${process.env.BIZZY_API_URL}/api/soil-test/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_id, crop_type })
      });
      const data = await response.json();
      return data.analysis;
    }
  }
];

export default agriculturalDocumentTools;
```

### Tool Registration

These tools are registered with LibreChat's MCP system:

```javascript
// Register agricultural tools with LibreChat MCP
import agriculturalDocumentTools from '../tools/agriculturalDocumentTools';

const registerAgTools = (mcpClient) => {
  // Register agricultural document tools
  agriculturalDocumentTools.forEach(tool => {
    mcpClient.registerTool(tool.name, tool);
  });
};

export default registerAgTools;
```

### Enhanced System Prompts

System prompts are updated to guide the AI in using the agricultural tools effectively:

```javascript
// Agricultural RAG system prompt
export const agriculturalRagPrompt = `You are an agricultural assistant with access to a specialized knowledge base of farming information.
To explore this knowledge base, you have several tools available:

1. vector_search: Use this for semantic search when you need to find information based on meaning.

2. list_ag_documents: Use this to see what agricultural documents are available, filtered by type, field, season, or crop.

3. get_field_documents: Use this to retrieve all documents related to a specific field.

4. query_ag_table: Use this for tabular documents like soil tests or yield data when you need to analyze data or find specific records.

5. analyze_soil_test: Use this to get recommendations based on soil test results for a specific crop.

Follow these guidelines:
- For general questions about farming practices, use vector_search
- For field-specific questions, use get_field_documents to find relevant documents first
- For questions about soil fertility or recommendations, use analyze_soil_test
- For numerical analysis of yield data or other tabular information, use query_ag_table
- Consider seasonal context - current growing season may be most relevant
- Always cite your sources and explain your reasoning

When using these tools, consider the agricultural context of the question, including the growing season, crop type, and field conditions.`;
```

## Field Analyzer Tool

A specialized Field Analyzer tool leverages the enhanced RAG capabilities:

```javascript
// Field Analyzer MCP Tool
const fieldAnalyzerTool = {
  name: 'analyze_field',
  description: 'Analyzes a field based on all available data and provides insights',
  parameters: {
    type: 'object',
    properties: {
      field_id: {
        type: 'string',
        description: 'Field identifier'
      },
      season: {
        type: 'string',
        description: 'Growing season to analyze'
      },
      analysis_type: {
        type: 'string',
        enum: ['soil_health', 'yield_potential', 'input_recommendations', 'comprehensive'],
        description: 'Type of analysis to perform'
      }
    },
    required: ['field_id']
  },
  execute: async ({ field_id, season, analysis_type = 'comprehensive' }) => {
    // 1. Gather all field documents
    const fieldDocsResponse = await fetch(
      `${process.env.BIZZY_API_URL}/api/documents/ag-metadata?field_id=${field_id}${season ? `&season=${season}` : ''}`
    );
    const fieldDocs = await fieldDocsResponse.json();
    
    // 2. Categorize documents by type
    const docsByType = categorizeDocuments(fieldDocs.documents);
    
    // 3. Extract relevant data based on analysis type
    const analysisData = await extractAnalysisData(docsByType, analysis_type);
    
    // 4. Generate analysis and recommendations
    const analysis = await generateFieldAnalysis(analysisData, analysis_type);
    
    return analysis;
  }
};

// Helper function to categorize documents
const categorizeDocuments = (documents) => {
  return documents.reduce((acc, doc) => {
    const type = doc.document_type || 'unknown';
    if (!acc[type]) acc[type] = [];
    acc[type].push(doc);
    return acc;
  }, {});
};

// Helper function to extract analysis data
const extractAnalysisData = async (docsByType, analysisType) => {
  const data = {};
  
  // Extract soil test data if available
  if (docsByType.soil_test && (analysisType === 'soil_health' || analysisType === 'comprehensive')) {
    // Get the most recent soil test
    const latestSoilTest = docsByType.soil_test.sort((a, b) => 
      new Date(b.observation_date) - new Date(a.observation_date)
    )[0];
    
    // Get soil test data
    const soilTestResponse = await fetch(
      `${process.env.BIZZY_API_URL}/api/documents/${latestSoilTest.id}/content`
    );
    data.soilTest = await soilTestResponse.json();
  }
  
  // Extract yield data if available
  if (docsByType.yield_data && (analysisType === 'yield_potential' || analysisType === 'comprehensive')) {
    // Get yield history
    data.yieldHistory = await Promise.all(
      docsByType.yield_data.map(async (doc) => {
        const response = await fetch(
          `${process.env.BIZZY_API_URL}/api/documents/${doc.id}/content`
        );
        return await response.json();
      })
    );
  }
  
  // Extract field observations
  if (docsByType.field_observation) {
    data.fieldObservations = await Promise.all(
      docsByType.field_observation.map(async (doc) => {
        const response = await fetch(
          `${process.env.BIZZY_API_URL}/api/documents/${doc.id}/content`
        );
        return await response.json();
      })
    );
  }
  
  return data;
};

// Helper function to generate field analysis
const generateFieldAnalysis = async (data, analysisType) => {
  // Generate analysis based on the data and analysis type
  // This would typically involve AI processing or specialized algorithms
  
  // For this example, we'll return a structured analysis
  const analysis = {
    summary: "Field analysis based on available data",
    analysisType: analysisType,
    soilHealth: data.soilTest ? analyzeSoilHealth(data.soilTest) : null,
    yieldPotential: data.yieldHistory ? analyzeYieldPotential(data.yieldHistory) : null,
    observations: data.fieldObservations ? summarizeObservations(data.fieldObservations) : null,
    recommendations: generateRecommendations(data, analysisType)
  };
  
  return analysis;
};
```

## Implementation Strategy

The RAG enhancements will be implemented in phases:

1. **Phase 1: Database Schema Extensions**
   - Extend AnythingLLM's database schema
   - Create migration scripts
   - Update data models

2. **Phase 2: Document Processing Pipeline**
   - Enhance document processing for agricultural content
   - Implement specialized vectorization
   - Add support for tabular data

3. **Phase 3: API Extensions**
   - Create new API endpoints for metadata querying
   - Implement tabular data querying
   - Add field analysis endpoints

4. **Phase 4: LibreChat MCP Integration**
   - Develop agricultural document tools
   - Register tools with MCP system
   - Create enhanced system prompts

5. **Phase 5: Field Analyzer Tool**
   - Implement comprehensive field analysis
   - Integrate with document system
   - Add recommendation generation

## Best Practices

When working with the enhanced RAG system, follow these best practices:

1. **Document Metadata**: Always provide as much metadata as possible when uploading documents
2. **Tabular Data**: Use consistent column names and formats for tabular data
3. **Field References**: Always link documents to specific fields when applicable
4. **Seasonal Context**: Include growing season information for all crop-related documents
5. **Document Relationships**: Establish relationships between related documents
6. **Query Optimization**: Use specific metadata filters to narrow search results
7. **Tool Selection**: Choose the most appropriate tool for each query type

## Conclusion

The RAG enhancements in the BizzyPerson platform significantly improve the system's ability to process, store, and retrieve agricultural information. By extending AnythingLLM's metadata capabilities and integrating with LibreChat's MCP system, we provide a powerful foundation for agricultural knowledge management and AI-assisted decision making. 
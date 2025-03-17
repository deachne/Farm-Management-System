/**
 * MetadataManager.js
 * 
 * Provides a unified API for extensions to define and access custom metadata
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class MetadataManager {
  constructor() {
    this.extensionFields = new Map();
  }

  /**
   * Register extension-specific metadata fields
   * @param {string} extension - Extension name
   * @param {Array} fields - Array of field definitions
   */
  registerMetadataFields(extension, fields) {
    if (!extension || !Array.isArray(fields)) {
      throw new Error('Invalid parameters for registerMetadataFields');
    }

    // Validate field definitions
    fields.forEach(field => {
      if (!field.name || !field.type) {
        throw new Error('Field definition must include name and type');
      }
    });

    this.extensionFields.set(extension, fields);
    return true;
  }

  /**
   * Get metadata for a document
   * @param {number} documentId - Document ID
   * @param {string} extension - Optional extension name to filter metadata
   * @returns {Promise<Object>} - Document metadata
   */
  async getDocumentMetadata(documentId, extension = null) {
    if (!documentId) {
      throw new Error('Document ID is required');
    }

    const document = await prisma.documents.findUnique({
      where: { id: documentId },
      select: {
        metadata: true,
        schema: true,
        document_type: true,
        custom_tags: true,
        related_docs: true,
        industry_metadata: true
      }
    });

    if (!document) {
      throw new Error(`Document with ID ${documentId} not found`);
    }

    // Parse JSON fields
    const metadata = {
      ...document,
      metadata: document.metadata ? JSON.parse(document.metadata) : {},
      custom_tags: document.custom_tags ? JSON.parse(document.custom_tags) : [],
      related_docs: document.related_docs ? JSON.parse(document.related_docs) : []
    };

    // Filter by extension if specified
    if (extension && document.industry_metadata) {
      const industryMetadata = document.industry_metadata;
      return {
        ...metadata,
        industry_metadata: industryMetadata[extension] || {}
      };
    }

    return metadata;
  }

  /**
   * Update document metadata
   * @param {number} documentId - Document ID
   * @param {Object} metadata - Metadata to update
   * @param {string} extension - Optional extension name
   * @returns {Promise<Object>} - Updated document
   */
  async updateDocumentMetadata(documentId, metadata, extension = null) {
    if (!documentId || !metadata) {
      throw new Error('Document ID and metadata are required');
    }

    // Prepare update data
    const updateData = {};

    // Handle base metadata fields
    if (metadata.document_type) updateData.document_type = metadata.document_type;
    if (metadata.schema) updateData.schema = metadata.schema;
    if (metadata.custom_tags) updateData.custom_tags = JSON.stringify(metadata.custom_tags);
    if (metadata.related_docs) updateData.related_docs = JSON.stringify(metadata.related_docs);

    // Handle extension-specific metadata
    if (extension && metadata.industry_metadata) {
      // Get current industry_metadata
      const document = await prisma.documents.findUnique({
        where: { id: documentId },
        select: { industry_metadata: true }
      });

      const currentIndustryMetadata = document?.industry_metadata || {};
      
      // Update only the extension-specific portion
      updateData.industry_metadata = {
        ...currentIndustryMetadata,
        [extension]: metadata.industry_metadata
      };
    } else if (metadata.industry_metadata) {
      updateData.industry_metadata = metadata.industry_metadata;
    }

    // Update the document
    const updatedDocument = await prisma.documents.update({
      where: { id: documentId },
      data: {
        ...updateData,
        lastUpdatedAt: new Date()
      }
    });

    return updatedDocument;
  }

  /**
   * Create a relationship between two documents
   * @param {number} sourceId - Source document ID
   * @param {number} targetId - Target document ID
   * @param {string} relationship - Type of relationship
   * @param {Object} metadata - Additional relationship metadata
   * @returns {Promise<Object>} - Created relationship
   */
  async createDocumentRelationship(sourceId, targetId, relationship, metadata = {}) {
    if (!sourceId || !targetId || !relationship) {
      throw new Error('Source ID, target ID, and relationship type are required');
    }

    // Check if documents exist
    const sourceDoc = await prisma.documents.findUnique({ where: { id: sourceId } });
    const targetDoc = await prisma.documents.findUnique({ where: { id: targetId } });

    if (!sourceDoc || !targetDoc) {
      throw new Error('Source or target document not found');
    }

    // Create the relationship
    const docRelationship = await prisma.document_relationships.create({
      data: {
        source_doc_id: sourceId,
        target_doc_id: targetId,
        relationship,
        metadata
      }
    });

    return docRelationship;
  }

  /**
   * Query documents by metadata
   * @param {Object} criteria - Query criteria
   * @param {string} extension - Optional extension name
   * @returns {Promise<Array>} - Matching documents
   */
  async queryDocumentsByMetadata(criteria, extension = null) {
    if (!criteria) {
      throw new Error('Query criteria are required');
    }

    // Build the query
    const query = {
      where: {}
    };

    // Handle base metadata fields
    if (criteria.document_type) query.where.document_type = criteria.document_type;
    
    // Handle custom tags (array contains)
    if (criteria.custom_tags) {
      // This is a simplified approach - in a real implementation,
      // you would need to parse the JSON string and check for tag inclusion
      query.where.custom_tags = {
        contains: criteria.custom_tags
      };
    }

    // Handle extension-specific metadata
    if (extension && criteria.industry_metadata) {
      // This is a simplified approach - in a real implementation,
      // you would need more sophisticated JSON querying
      query.where.industry_metadata = {
        path: [extension],
        equals: criteria.industry_metadata
      };
    }

    // Execute the query
    const documents = await prisma.documents.findMany(query);
    return documents;
  }

  /**
   * Get related documents
   * @param {number} documentId - Document ID
   * @param {string} relationshipType - Optional relationship type filter
   * @returns {Promise<Array>} - Related documents
   */
  async getRelatedDocuments(documentId, relationshipType = null) {
    if (!documentId) {
      throw new Error('Document ID is required');
    }

    const query = {
      where: {
        OR: [
          { source_doc_id: documentId },
          { target_doc_id: documentId }
        ]
      },
      include: {
        source_document: true,
        target_document: true
      }
    };

    // Filter by relationship type if specified
    if (relationshipType) {
      query.where.relationship = relationshipType;
    }

    const relationships = await prisma.document_relationships.findMany(query);

    // Transform the results to return related documents
    return relationships.map(rel => {
      const isSource = rel.source_doc_id === documentId;
      const relatedDoc = isSource ? rel.target_document : rel.source_document;
      return {
        document: relatedDoc,
        relationship: rel.relationship,
        direction: isSource ? 'outgoing' : 'incoming',
        metadata: rel.metadata
      };
    });
  }
}

module.exports = MetadataManager; 
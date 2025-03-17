/**
 * api.js
 * 
 * API endpoints for the metadata system
 */

const express = require('express');
const router = express.Router();
const MetadataManager = require('./MetadataManager');
const FarmMetadataExtension = require('./FarmMetadataExtension');

// Initialize metadata manager and extensions
const metadataManager = new MetadataManager();
const farmMetadataExtension = new FarmMetadataExtension(metadataManager);

// Register extensions
farmMetadataExtension.register();

/**
 * Get document metadata
 * GET /api/metadata/documents/:id
 */
router.get('/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { extension } = req.query;
    
    const metadata = await metadataManager.getDocumentMetadata(
      parseInt(id, 10),
      extension
    );
    
    res.json({ success: true, metadata });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * Update document metadata
 * PUT /api/metadata/documents/:id
 */
router.put('/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { metadata, extension } = req.body;
    
    if (!metadata) {
      return res.status(400).json({ success: false, error: 'Metadata is required' });
    }
    
    const updatedDocument = await metadataManager.updateDocumentMetadata(
      parseInt(id, 10),
      metadata,
      extension
    );
    
    res.json({ success: true, document: updatedDocument });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * Create document relationship
 * POST /api/metadata/relationships
 */
router.post('/relationships', async (req, res) => {
  try {
    const { sourceId, targetId, relationship, metadata } = req.body;
    
    if (!sourceId || !targetId || !relationship) {
      return res.status(400).json({
        success: false,
        error: 'Source ID, target ID, and relationship type are required'
      });
    }
    
    const docRelationship = await metadataManager.createDocumentRelationship(
      parseInt(sourceId, 10),
      parseInt(targetId, 10),
      relationship,
      metadata || {}
    );
    
    res.json({ success: true, relationship: docRelationship });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * Get related documents
 * GET /api/metadata/documents/:id/related
 */
router.get('/documents/:id/related', async (req, res) => {
  try {
    const { id } = req.params;
    const { relationship } = req.query;
    
    const relatedDocuments = await metadataManager.getRelatedDocuments(
      parseInt(id, 10),
      relationship
    );
    
    res.json({ success: true, documents: relatedDocuments });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * Query documents by metadata
 * POST /api/metadata/documents/query
 */
router.post('/documents/query', async (req, res) => {
  try {
    const { criteria, extension } = req.body;
    
    if (!criteria) {
      return res.status(400).json({ success: false, error: 'Query criteria are required' });
    }
    
    const documents = await metadataManager.queryDocumentsByMetadata(criteria, extension);
    
    res.json({ success: true, documents });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * Farm-specific endpoints
 */

/**
 * Add field metadata to a document
 * POST /api/metadata/farm/documents/:id/field/:fieldId
 */
router.post('/farm/documents/:id/field/:fieldId', async (req, res) => {
  try {
    const { id, fieldId } = req.params;
    
    const updatedDocument = await farmMetadataExtension.addFieldMetadata(
      parseInt(id, 10),
      parseInt(fieldId, 10)
    );
    
    res.json({ success: true, document: updatedDocument });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * Add crop metadata to a document
 * POST /api/metadata/farm/documents/:id/crop/:cropId
 */
router.post('/farm/documents/:id/crop/:cropId', async (req, res) => {
  try {
    const { id, cropId } = req.params;
    
    const updatedDocument = await farmMetadataExtension.addCropMetadata(
      parseInt(id, 10),
      parseInt(cropId, 10)
    );
    
    res.json({ success: true, document: updatedDocument });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * Add equipment metadata to a document
 * POST /api/metadata/farm/documents/:id/equipment/:equipmentId
 */
router.post('/farm/documents/:id/equipment/:equipmentId', async (req, res) => {
  try {
    const { id, equipmentId } = req.params;
    
    const updatedDocument = await farmMetadataExtension.addEquipmentMetadata(
      parseInt(id, 10),
      parseInt(equipmentId, 10)
    );
    
    res.json({ success: true, document: updatedDocument });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * Find documents related to a field
 * GET /api/metadata/farm/fields/:fieldId/documents
 */
router.get('/farm/fields/:fieldId/documents', async (req, res) => {
  try {
    const { fieldId } = req.params;
    
    const documents = await farmMetadataExtension.findFieldDocuments(
      parseInt(fieldId, 10)
    );
    
    res.json({ success: true, documents });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * Find documents related to a crop
 * GET /api/metadata/farm/crops/:cropId/documents
 */
router.get('/farm/crops/:cropId/documents', async (req, res) => {
  try {
    const { cropId } = req.params;
    
    const documents = await farmMetadataExtension.findCropDocuments(
      parseInt(cropId, 10)
    );
    
    res.json({ success: true, documents });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * Create a seasonal relationship between documents
 * POST /api/metadata/farm/relationships/seasonal
 */
router.post('/farm/relationships/seasonal', async (req, res) => {
  try {
    const { previousSeasonDocId, currentSeasonDocId, metadata } = req.body;
    
    if (!previousSeasonDocId || !currentSeasonDocId) {
      return res.status(400).json({
        success: false,
        error: 'Previous season document ID and current season document ID are required'
      });
    }
    
    const relationship = await farmMetadataExtension.createSeasonalRelationship(
      parseInt(previousSeasonDocId, 10),
      parseInt(currentSeasonDocId, 10),
      metadata || {}
    );
    
    res.json({ success: true, relationship });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router; 
/**
 * FarmMetadataExtension.js
 * 
 * Farm-specific metadata extension for the metadata system
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class FarmMetadataExtension {
  constructor(metadataManager) {
    this.metadataManager = metadataManager;
    this.extensionName = 'farm';
  }

  /**
   * Register the extension with the metadata manager
   */
  register() {
    // Register metadata fields
    this.metadataManager.registerMetadataFields(this.extensionName, [
      { name: 'field_id', type: 'string', description: 'Associated field ID' },
      { name: 'crop_type', type: 'string', description: 'Type of crop' },
      { name: 'season', type: 'string', description: 'Growing season' },
      { name: 'soil_type', type: 'string', description: 'Soil type' },
      { name: 'planting_date', type: 'date', description: 'Date of planting' },
      { name: 'harvest_date', type: 'date', description: 'Date of harvest' },
      { name: 'equipment_used', type: 'array', description: 'Equipment used' },
      { name: 'weather_conditions', type: 'object', description: 'Weather conditions' },
      { name: 'yield_data', type: 'object', description: 'Yield data' }
    ]);

    return true;
  }

  /**
   * Add field metadata to a document
   * @param {number} documentId - Document ID
   * @param {number} fieldId - Field ID
   * @returns {Promise<Object>} - Updated document
   */
  async addFieldMetadata(documentId, fieldId) {
    if (!documentId || !fieldId) {
      throw new Error('Document ID and field ID are required');
    }

    // Get field information
    const field = await prisma.farm_fields.findUnique({
      where: { id: fieldId }
    });

    if (!field) {
      throw new Error(`Field with ID ${fieldId} not found`);
    }

    // Update document metadata
    const metadata = {
      industry_metadata: {
        field_id: fieldId,
        field_name: field.name,
        soil_type: field.soil_type
      }
    };

    return this.metadataManager.updateDocumentMetadata(documentId, metadata, this.extensionName);
  }

  /**
   * Add crop metadata to a document
   * @param {number} documentId - Document ID
   * @param {number} cropId - Crop ID
   * @returns {Promise<Object>} - Updated document
   */
  async addCropMetadata(documentId, cropId) {
    if (!documentId || !cropId) {
      throw new Error('Document ID and crop ID are required');
    }

    // Get crop information
    const crop = await prisma.farm_crops.findUnique({
      where: { id: cropId }
    });

    if (!crop) {
      throw new Error(`Crop with ID ${cropId} not found`);
    }

    // Update document metadata
    const metadata = {
      industry_metadata: {
        crop_type: crop.name,
        variety: crop.variety,
        planting_date: crop.planting_date,
        harvest_date: crop.harvest_date,
        status: crop.status
      }
    };

    return this.metadataManager.updateDocumentMetadata(documentId, metadata, this.extensionName);
  }

  /**
   * Add equipment metadata to a document
   * @param {number} documentId - Document ID
   * @param {number} equipmentId - Equipment ID
   * @returns {Promise<Object>} - Updated document
   */
  async addEquipmentMetadata(documentId, equipmentId) {
    if (!documentId || !equipmentId) {
      throw new Error('Document ID and equipment ID are required');
    }

    // Get equipment information
    const equipment = await prisma.farm_equipment.findUnique({
      where: { id: equipmentId }
    });

    if (!equipment) {
      throw new Error(`Equipment with ID ${equipmentId} not found`);
    }

    // Update document metadata
    const metadata = {
      industry_metadata: {
        equipment_id: equipmentId,
        equipment_name: equipment.name,
        equipment_type: equipment.type,
        manufacturer: equipment.manufacturer,
        model: equipment.model
      }
    };

    return this.metadataManager.updateDocumentMetadata(documentId, metadata, this.extensionName);
  }

  /**
   * Find documents related to a specific field
   * @param {number} fieldId - Field ID
   * @returns {Promise<Array>} - Related documents
   */
  async findFieldDocuments(fieldId) {
    if (!fieldId) {
      throw new Error('Field ID is required');
    }

    return this.metadataManager.queryDocumentsByMetadata(
      { industry_metadata: { field_id: fieldId } },
      this.extensionName
    );
  }

  /**
   * Find documents related to a specific crop
   * @param {number} cropId - Crop ID
   * @returns {Promise<Array>} - Related documents
   */
  async findCropDocuments(cropId) {
    if (!cropId) {
      throw new Error('Crop ID is required');
    }

    // Get crop information
    const crop = await prisma.farm_crops.findUnique({
      where: { id: cropId }
    });

    if (!crop) {
      throw new Error(`Crop with ID ${cropId} not found`);
    }

    return this.metadataManager.queryDocumentsByMetadata(
      { industry_metadata: { crop_type: crop.name } },
      this.extensionName
    );
  }

  /**
   * Create a seasonal relationship between documents
   * @param {number} previousSeasonDocId - Previous season document ID
   * @param {number} currentSeasonDocId - Current season document ID
   * @param {Object} metadata - Additional relationship metadata
   * @returns {Promise<Object>} - Created relationship
   */
  async createSeasonalRelationship(previousSeasonDocId, currentSeasonDocId, metadata = {}) {
    return this.metadataManager.createDocumentRelationship(
      previousSeasonDocId,
      currentSeasonDocId,
      'seasonal_succession',
      metadata
    );
  }
}

module.exports = FarmMetadataExtension; 
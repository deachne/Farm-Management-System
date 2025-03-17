/**
 * Farmer Extension
 * 
 * This module registers the farmer extension with the BizzyPerson platform.
 * It provides agricultural-specific functionality for farm management.
 */

const { register } = require('../../core/extension-api/hooks');
const soilTestProcessor = require('./document-processing/soil-test-processor');

/**
 * Register the farmer extension
 */
register({
  name: 'bizzy-farmer',
  version: '0.1.0',
  description: 'Agricultural extension for farm management',
  
  /**
   * Initialize document processing
   * 
   * @param {object} documentProcessing - Document processing pipeline
   */
  initializeDocumentProcessing: (documentProcessing) => {
    console.log('Initializing farmer document processing...');
    
    // Register soil test processor
    documentProcessing.registerProcessor('soil_test', soilTestProcessor, 'farmer');
    
    // Register extension processor for agricultural documents
    documentProcessing.registerExtensionProcessor('farmer', {
      /**
       * Process agricultural documents
       * 
       * @param {object} document - Processed document
       * @param {object} metadata - Document metadata
       * @returns {Promise<object>} Enhanced document
       */
      process: async (document, metadata) => {
        console.log(`Applying farmer-specific processing to ${document.filename}`);
        
        // Add agricultural context to document
        return {
          ...document,
          agriculturalContext: {
            // This would contain agricultural-specific context
            // such as growing season, crop information, etc.
            season: determineSeason(metadata.testDate || new Date()),
            relevantCrops: determineRelevantCrops(document)
          }
        };
      },
      
      /**
       * Extract agricultural metadata
       * 
       * @param {object} document - Processed document
       * @returns {Promise<object>} Agricultural metadata
       */
      extractMetadata: async (document) => {
        // Extract agricultural-specific metadata
        return {
          // Add agricultural-specific metadata fields
          documentCategory: determineAgriculturalCategory(document),
          fieldId: extractFieldId(document),
          cropType: extractCropType(document),
          season: determineSeason(document.metadata?.testDate || new Date())
        };
      }
    });
    
    return {
      // Return any extension-specific document processing utilities
      detectSoilTestType: (document) => {
        // Logic to detect specific soil test lab/format
        return 'standard';
      }
    };
  },
  
  // Other extension registration methods would go here
  // such as registering data models, UI components, etc.
});

/**
 * Determine the agricultural season based on date
 * 
 * @param {Date|string} date - Date to check
 * @returns {string} Season name
 */
function determineSeason(date) {
  const d = new Date(date);
  const month = d.getMonth();
  
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 10) return 'Fall';
  return 'Winter';
}

/**
 * Determine relevant crops based on document content
 * 
 * @param {object} document - Processed document
 * @returns {Array<string>} Relevant crops
 */
function determineRelevantCrops(document) {
  // In a real implementation, we would analyze the document content
  // to identify mentioned crops or crops relevant to the field
  
  // For now, return some common crops
  return ['Corn', 'Soybeans', 'Wheat'];
}

/**
 * Determine agricultural category for a document
 * 
 * @param {object} document - Processed document
 * @returns {string} Agricultural category
 */
function determineAgriculturalCategory(document) {
  // In a real implementation, we would analyze the document content
  // to determine its agricultural category
  
  if (document.type === 'soil_test') {
    return 'soil-management';
  }
  
  // Check content for keywords
  const content = document.content || '';
  if (content.includes('pest') || content.includes('disease')) {
    return 'pest-management';
  }
  if (content.includes('fertilizer') || content.includes('nutrient')) {
    return 'nutrient-management';
  }
  if (content.includes('harvest') || content.includes('yield')) {
    return 'harvest-management';
  }
  
  return 'general';
}

/**
 * Extract field ID from document
 * 
 * @param {object} document - Processed document
 * @returns {string|null} Field ID
 */
function extractFieldId(document) {
  // In a real implementation, we would use regex or NLP to extract field ID
  
  // For soil test documents, use the structured data
  if (document.type === 'soil_test' && document.structuredData?.fieldId) {
    return document.structuredData.fieldId;
  }
  
  // For other documents, try to extract from content
  const content = document.content || '';
  const fieldMatch = content.match(/Field[:\s]+([A-Za-z0-9\s-]+)/i);
  if (fieldMatch && fieldMatch[1]) {
    return fieldMatch[1].trim();
  }
  
  return null;
}

/**
 * Extract crop type from document
 * 
 * @param {object} document - Processed document
 * @returns {string|null} Crop type
 */
function extractCropType(document) {
  // In a real implementation, we would use regex or NLP to extract crop type
  
  // For soil test documents, use the structured data
  if (document.type === 'soil_test' && document.structuredData?.recommendations?.crop) {
    return document.structuredData.recommendations.crop;
  }
  
  // For other documents, try to extract from content
  const content = document.content || '';
  const cropMatch = content.match(/Crop[:\s]+([A-Za-z]+)/i);
  if (cropMatch && cropMatch[1]) {
    return cropMatch[1].trim();
  }
  
  return null;
}

module.exports = {}; 
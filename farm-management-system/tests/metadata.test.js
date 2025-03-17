/**
 * metadata.test.js
 * 
 * Tests for the metadata system
 */

const MetadataManager = require('../src/metadata/MetadataManager');
const FarmMetadataExtension = require('../src/metadata/FarmMetadataExtension');

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    documents: {
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn()
    },
    document_relationships: {
      create: jest.fn(),
      findMany: jest.fn()
    },
    farm_fields: {
      findUnique: jest.fn()
    },
    farm_crops: {
      findUnique: jest.fn()
    },
    farm_equipment: {
      findUnique: jest.fn()
    }
  };
  
  return {
    PrismaClient: jest.fn(() => mockPrisma)
  };
});

describe('MetadataManager', () => {
  let metadataManager;
  
  beforeEach(() => {
    metadataManager = new MetadataManager();
    jest.clearAllMocks();
  });
  
  test('registerMetadataFields should register fields for an extension', () => {
    const extension = 'test';
    const fields = [
      { name: 'field1', type: 'string' },
      { name: 'field2', type: 'number' }
    ];
    
    const result = metadataManager.registerMetadataFields(extension, fields);
    
    expect(result).toBe(true);
    expect(metadataManager.extensionFields.get(extension)).toEqual(fields);
  });
  
  test('registerMetadataFields should throw error for invalid parameters', () => {
    expect(() => {
      metadataManager.registerMetadataFields(null, []);
    }).toThrow('Invalid parameters for registerMetadataFields');
    
    expect(() => {
      metadataManager.registerMetadataFields('test', null);
    }).toThrow('Invalid parameters for registerMetadataFields');
    
    expect(() => {
      metadataManager.registerMetadataFields('test', [{ name: 'field1' }]);
    }).toThrow('Field definition must include name and type');
  });
  
  test('getDocumentMetadata should return document metadata', async () => {
    const documentId = 1;
    const mockDocument = {
      metadata: '{"key": "value"}',
      schema: { fields: ['field1', 'field2'] },
      document_type: 'test',
      custom_tags: '["tag1", "tag2"]',
      related_docs: '["doc1", "doc2"]',
      industry_metadata: { farm: { field_id: 1 } }
    };
    
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    prisma.documents.findUnique.mockResolvedValue(mockDocument);
    
    const result = await metadataManager.getDocumentMetadata(documentId);
    
    expect(prisma.documents.findUnique).toHaveBeenCalledWith({
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
    
    expect(result).toEqual({
      ...mockDocument,
      metadata: { key: 'value' },
      custom_tags: ['tag1', 'tag2'],
      related_docs: ['doc1', 'doc2']
    });
  });
  
  test('getDocumentMetadata should filter by extension', async () => {
    const documentId = 1;
    const extension = 'farm';
    const mockDocument = {
      metadata: '{"key": "value"}',
      schema: { fields: ['field1', 'field2'] },
      document_type: 'test',
      custom_tags: '["tag1", "tag2"]',
      related_docs: '["doc1", "doc2"]',
      industry_metadata: { farm: { field_id: 1 } }
    };
    
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    prisma.documents.findUnique.mockResolvedValue(mockDocument);
    
    const result = await metadataManager.getDocumentMetadata(documentId, extension);
    
    expect(result).toEqual({
      ...mockDocument,
      metadata: { key: 'value' },
      custom_tags: ['tag1', 'tag2'],
      related_docs: ['doc1', 'doc2'],
      industry_metadata: { field_id: 1 }
    });
  });
});

describe('FarmMetadataExtension', () => {
  let metadataManager;
  let farmMetadataExtension;
  
  beforeEach(() => {
    metadataManager = new MetadataManager();
    farmMetadataExtension = new FarmMetadataExtension(metadataManager);
    jest.clearAllMocks();
  });
  
  test('register should register farm-specific metadata fields', () => {
    const spy = jest.spyOn(metadataManager, 'registerMetadataFields');
    
    const result = farmMetadataExtension.register();
    
    expect(result).toBe(true);
    expect(spy).toHaveBeenCalledWith('farm', expect.any(Array));
    expect(spy.mock.calls[0][1].length).toBeGreaterThan(0);
  });
  
  test('addFieldMetadata should add field metadata to a document', async () => {
    const documentId = 1;
    const fieldId = 2;
    const mockField = {
      id: fieldId,
      name: 'Test Field',
      soil_type: 'Clay'
    };
    
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    prisma.farm_fields.findUnique.mockResolvedValue(mockField);
    
    const spy = jest.spyOn(metadataManager, 'updateDocumentMetadata').mockResolvedValue({});
    
    await farmMetadataExtension.addFieldMetadata(documentId, fieldId);
    
    expect(prisma.farm_fields.findUnique).toHaveBeenCalledWith({
      where: { id: fieldId }
    });
    
    expect(spy).toHaveBeenCalledWith(
      documentId,
      {
        industry_metadata: {
          field_id: fieldId,
          field_name: mockField.name,
          soil_type: mockField.soil_type
        }
      },
      'farm'
    );
  });
}); 
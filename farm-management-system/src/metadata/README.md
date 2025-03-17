# Metadata System

This directory contains the implementation of the metadata system for the Farm Management System.

## Components

### MetadataManager.js

The `MetadataManager` class provides a unified API for extensions to define and access custom metadata:

- `registerMetadataFields(extension, fields)`: Register extension-specific metadata fields
- `getDocumentMetadata(documentId, extension)`: Get metadata for a document
- `updateDocumentMetadata(documentId, metadata, extension)`: Update document metadata
- `createDocumentRelationship(sourceId, targetId, relationship, metadata)`: Create a relationship between two documents
- `queryDocumentsByMetadata(criteria, extension)`: Query documents by metadata
- `getRelatedDocuments(documentId, relationshipType)`: Get related documents

### FarmMetadataExtension.js

The `FarmMetadataExtension` class provides farm-specific metadata functionality:

- `register()`: Register the extension with the metadata manager
- `addFieldMetadata(documentId, fieldId)`: Add field metadata to a document
- `addCropMetadata(documentId, cropId)`: Add crop metadata to a document
- `addEquipmentMetadata(documentId, equipmentId)`: Add equipment metadata to a document
- `findFieldDocuments(fieldId)`: Find documents related to a specific field
- `findCropDocuments(cropId)`: Find documents related to a specific crop
- `createSeasonalRelationship(previousSeasonDocId, currentSeasonDocId, metadata)`: Create a seasonal relationship between documents

### api.js

The `api.js` file provides API endpoints for the metadata system:

#### Base Metadata Endpoints

- `GET /api/metadata/documents/:id`: Get document metadata
- `PUT /api/metadata/documents/:id`: Update document metadata
- `POST /api/metadata/relationships`: Create document relationship
- `GET /api/metadata/documents/:id/related`: Get related documents
- `POST /api/metadata/documents/query`: Query documents by metadata

#### Farm-Specific Endpoints

- `POST /api/metadata/farm/documents/:id/field/:fieldId`: Add field metadata to a document
- `POST /api/metadata/farm/documents/:id/crop/:cropId`: Add crop metadata to a document
- `POST /api/metadata/farm/documents/:id/equipment/:equipmentId`: Add equipment metadata to a document
- `GET /api/metadata/farm/fields/:fieldId/documents`: Find documents related to a field
- `GET /api/metadata/farm/crops/:cropId/documents`: Find documents related to a crop
- `POST /api/metadata/farm/relationships/seasonal`: Create a seasonal relationship between documents 
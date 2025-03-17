# Metadata System

## Overview

The Metadata System extends AnythingLLM's document storage capabilities to support rich, industry-specific metadata and document relationships for agricultural applications. It provides a unified API for extensions to define and access custom metadata.

## Components

### MetadataManager

The `MetadataManager` class provides a unified API for extensions to define and access custom metadata:

- `registerMetadataFields(extension, fields)`: Register extension-specific metadata fields
- `getDocumentMetadata(documentId, extension)`: Get metadata for a document
- `updateDocumentMetadata(documentId, metadata, extension)`: Update document metadata
- `createDocumentRelationship(sourceId, targetId, relationship, metadata)`: Create a relationship between two documents
- `queryDocumentsByMetadata(criteria, extension)`: Query documents by metadata
- `getRelatedDocuments(documentId, relationshipType)`: Get related documents

### FarmMetadataExtension

The `FarmMetadataExtension` class provides farm-specific metadata functionality:

- `register()`: Register the extension with the metadata manager
- `addFieldMetadata(documentId, fieldId)`: Add field metadata to a document
- `addCropMetadata(documentId, cropId)`: Add crop metadata to a document
- `addEquipmentMetadata(documentId, equipmentId)`: Add equipment metadata to a document
- `findFieldDocuments(fieldId)`: Find documents related to a specific field
- `findCropDocuments(cropId)`: Find documents related to a specific crop
- `createSeasonalRelationship(previousSeasonDocId, currentSeasonDocId, metadata)`: Create a seasonal relationship between documents

## Database Schema

The database schema includes the following models:

### Extended Document Model

```prisma
model documents {
  id                Int                     @id @default(autoincrement())
  docId             String                  @unique
  filename          String
  docpath           String
  workspaceId       Int
  metadata          String?
  pinned            Boolean?                @default(false)
  watched           Boolean?                @default(false)
  createdAt         DateTime                @default(now())
  lastUpdatedAt     DateTime                @default(now())
  
  // Enhanced metadata fields
  schema            Json?                   // For storing table schemas
  document_type     String?                 // Document categorization
  custom_tags       String?                 // JSON string of custom tags
  related_docs      String?                 // References to related documents
  industry_metadata Json?                   // Extension-specific metadata
  
  // Relations
  sections          document_sections[]
  rows              document_rows[]
  source_relations  document_relationships[] @relation("SourceDocument")
  target_relations  document_relationships[] @relation("TargetDocument")
}
```

### Document Sections

```prisma
model document_sections {
  id            Int       @id @default(autoincrement())
  document_id   Int
  section_title String?
  content       String
  order_index   Int
  document      documents @relation(fields: [document_id], references: [id], onDelete: Cascade)
}
```

### Tabular Data

```prisma
model document_rows {
  id            Int       @id @default(autoincrement())
  document_id   Int
  row_data      Json      // Store row data as JSON
  document      documents @relation(fields: [document_id], references: [id], onDelete: Cascade)
}
```

### Document Relationships

```prisma
model document_relationships {
  id              Int       @id @default(autoincrement())
  source_doc_id   Int
  target_doc_id   Int
  relationship    String    // Type of relationship
  metadata        Json?     // Additional relationship metadata
  source_document documents @relation("SourceDocument", fields: [source_doc_id], references: [id], onDelete: Cascade)
  target_document documents @relation("TargetDocument", fields: [target_doc_id], references: [id], onDelete: Cascade)
}
```

### Farm-Specific Models

```prisma
model farm_fields {
  id            Int       @id @default(autoincrement())
  name          String
  location      String?
  size          Float?    // Size in acres/hectares
  soil_type     String?
  crop_history  Json?     // JSON array of past crops
  created_at    DateTime  @default(now())
  updated_at    DateTime  @updatedAt
}

model farm_crops {
  id            Int       @id @default(autoincrement())
  name          String
  variety       String?
  planting_date DateTime?
  harvest_date  DateTime?
  field_id      Int?
  status        String?
  notes         String?
  created_at    DateTime  @default(now())
  updated_at    DateTime  @updatedAt
}

model farm_equipment {
  id            Int       @id @default(autoincrement())
  name          String
  type          String?
  manufacturer  String?
  model         String?
  purchase_date DateTime?
  status        String?
  maintenance   Json?     // JSON array of maintenance records
  created_at    DateTime  @default(now())
  updated_at    DateTime  @updatedAt
}
```

## API Endpoints

### Base Metadata Endpoints

- `GET /api/metadata/documents/:id`: Get document metadata
- `PUT /api/metadata/documents/:id`: Update document metadata
- `POST /api/metadata/relationships`: Create document relationship
- `GET /api/metadata/documents/:id/related`: Get related documents
- `POST /api/metadata/documents/query`: Query documents by metadata

### Farm-Specific Endpoints

- `POST /api/metadata/farm/documents/:id/field/:fieldId`: Add field metadata to a document
- `POST /api/metadata/farm/documents/:id/crop/:cropId`: Add crop metadata to a document
- `POST /api/metadata/farm/documents/:id/equipment/:equipmentId`: Add equipment metadata to a document
- `GET /api/metadata/farm/fields/:fieldId/documents`: Find documents related to a field
- `GET /api/metadata/farm/crops/:cropId/documents`: Find documents related to a crop
- `POST /api/metadata/farm/relationships/seasonal`: Create a seasonal relationship between documents

## Integration with AnythingLLM

The Metadata System integrates with AnythingLLM by extending its document storage capabilities. It uses the same database as AnythingLLM but adds additional tables and fields to support rich metadata and document relationships.

## Integration with LibreChat

The Metadata System will be integrated with LibreChat through specialized MCP tools in Phase 4 of the implementation. These tools will allow LibreChat to access and manipulate the metadata through the API endpoints. 
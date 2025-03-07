# Farm Management System - Data Model

This document outlines the database schema for our agricultural knowledge management system, focusing on the extensions to AnythingLLM's existing data model.

## Core Agricultural Models

### Farm Fields

```prisma
model farm_fields {
  id            Int      @id @default(autoincrement())
  name          String
  acres         Float
  location      String?  // GeoJSON string
  boundaries    String?  // GeoJSON string
  soil_type     String?
  drainage      String?
  notes         String?
  created_at    DateTime @default(now())
  last_updated  DateTime @default(now())
  observations  farm_notes[]
  soil_tests    soil_tests[]
  crop_plans    crop_plans[]
}
```

### Farm Notes

```prisma
model farm_notes {
  id            Int      @id @default(autoincrement())
  title         String
  content       String
  type          String   // e.g., "field_observation", "price_quote", "soil_test", "weather", "equipment"
  tags          String?  // JSON string of tags
  field_id      Int?     // Optional reference to a specific field
  location      String?  // GeoJSON point if specific to a location
  images        String?  // JSON array of image paths
  weather_data  String?  // JSON string of weather conditions at time of note
  user_id       Int?
  workspace_id  Int?
  created_at    DateTime @default(now())
  last_updated  DateTime @default(now())
  users         users?   @relation(fields: [user_id], references: [id], onDelete: Cascade)
  workspace     workspaces? @relation(fields: [workspace_id], references: [id], onDelete: Cascade)
  field         farm_fields? @relation(fields: [field_id], references: [id])
  vectors       document_vectors[]
}
```

### Soil Tests

```prisma
model soil_tests {
  id            Int      @id @default(autoincrement())
  field_id      Int
  test_date     DateTime
  lab           String?
  results       String   // JSON string of test results
  recommendations String? // JSON string of recommendations
  created_at    DateTime @default(now())
  field         farm_fields @relation(fields: [field_id], references: [id])
  vectors       document_vectors[]
}
```

### Crop Plans

```prisma
model crop_plans {
  id            Int      @id @default(autoincrement())
  field_id      Int
  year          Int
  crop          String
  variety       String?
  seeding_rate  Float?
  fertilizer    String?  // JSON string of fertilizer plan
  chemicals     String?  // JSON string of chemical plan
  notes         String?
  created_at    DateTime @default(now())
  last_updated  DateTime @default(now())
  field         farm_fields @relation(fields: [field_id], references: [id])
  vectors       document_vectors[]
}
```

### Equipment Logs

```prisma
model equipment_logs {
  id            Int      @id @default(autoincrement())
  equipment     String
  operation     String
  field_id      Int?
  hours         Float?
  fuel          Float?
  notes         String?
  maintenance   Boolean  @default(false)
  created_at    DateTime @default(now())
  field         farm_fields? @relation(fields: [field_id], references: [id])
  vectors       document_vectors[]
}
```

### Weather Data

```prisma
model weather_data {
  id            Int      @id @default(autoincrement())
  date          DateTime
  location      String?  // GeoJSON point
  temperature   Float?
  precipitation Float?
  wind_speed    Float?
  wind_direction String?
  notes         String?
  created_at    DateTime @default(now())
  vectors       document_vectors[]
}
```

### Price Quotes

```prisma
model price_quotes {
  id            Int      @id @default(autoincrement())
  supplier      String
  product       String
  price         Float
  unit          String
  quantity      Float?
  valid_from    DateTime?
  valid_until   DateTime?
  notes         String?
  created_at    DateTime @default(now())
  vectors       document_vectors[]
}
```

## Vectorization Strategy

The system extends AnythingLLM's existing vectorization approach:

1. **Document Vectors Extension**

```prisma
model document_vectors {
  // Existing fields from AnythingLLM
  id            String   @id @default(uuid())
  docId         String
  vectorId      String
  workspaceId   String
  metadata      String?
  
  // New relationships for agricultural data
  farm_note_id  Int?
  soil_test_id  Int?
  crop_plan_id  Int?
  equipment_log_id Int?
  weather_data_id Int?
  price_quote_id Int?
  
  // Relationships
  farm_note     farm_notes? @relation(fields: [farm_note_id], references: [id], onDelete: Cascade)
  soil_test     soil_tests? @relation(fields: [soil_test_id], references: [id], onDelete: Cascade)
  crop_plan     crop_plans? @relation(fields: [crop_plan_id], references: [id], onDelete: Cascade)
  equipment_log equipment_logs? @relation(fields: [equipment_log_id], references: [id], onDelete: Cascade)
  weather_data  weather_data? @relation(fields: [weather_data_id], references: [id], onDelete: Cascade)
  price_quote   price_quotes? @relation(fields: [price_quote_id], references: [id], onDelete: Cascade)
}
```

## Data Relationships

The data model maintains relationships between different agricultural entities:

1. **Field-Centric Relationships**
   - Fields are linked to notes, soil tests, and crop plans
   - Equipment logs can be associated with specific fields
   - Weather data can be linked to field locations

2. **Temporal Relationships**
   - All entities include creation timestamps
   - Crop plans are associated with specific years
   - Soil tests and observations are dated for historical tracking

3. **Spatial Relationships**
   - Fields have boundaries stored as GeoJSON
   - Notes and observations can have specific locations within fields
   - Weather data includes location information

## Metadata Strategy

The system uses a consistent approach to metadata:

1. **JSON Storage for Complex Data**
   - Soil test results stored as structured JSON
   - Weather conditions captured as JSON objects
   - Field boundaries represented as GeoJSON

2. **Tagging System**
   - Notes can be tagged with multiple categories
   - Tags stored as JSON arrays
   - Common tag types include crop, issue, equipment, and action

3. **Contextual Metadata**
   - Weather conditions at time of observation
   - Growth stage information for crop observations
   - Equipment status for maintenance records

## Migration Strategy

To implement this data model in AnythingLLM:

1. Create a new migration in `server/prisma/migrations/`
2. Add the new models to `server/prisma/schema.prisma`
3. Update the Prisma client generation
4. Create API endpoints for the new models
5. Implement vectorization extensions for agricultural data 
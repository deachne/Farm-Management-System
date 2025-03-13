# Agricultural Data Model Design

This document outlines the data model design for the farm management extension to AnythingLLM, with a focus on balancing structured data capture with AI-driven extraction.

## Core Principles

1. **AI-as-a-Service (AIaaS) Approach**
   - AI should reduce rather than increase structure and formality
   - Capture data naturally when possible, only impose structure when necessary
   - Minimize required fields and manual data entry

2. **Hybrid Data Capture**
   - Allow natural input through text, voice, photos
   - AI extracts structured data when possible
   - Suggest missing information rather than requiring it

3. **Progressive Structure**
   - Start with minimal structure for casual users
   - Add more structured options for power users
   - Scale complexity based on the importance of the data

## Field Entity Model

The Field entity is central to our agricultural extension, providing location context for observations, tasks, and analytics.

```javascript
// Conceptual schema - will be implemented in Prisma
Field {
  id: Integer (PK)
  name: String
  slug: String
  workspaceId: Integer (FK)
  
  // Basic Properties
  acres: Float
  cropType: String
  plantingDate: Date
  harvestDate: Date
  
  // Location Data
  boundaries: GeoJSON
  fieldViewId: String  // For Climate FieldView integration
  
  // Relationships
  observations: [Observation]
  soilTests: [SoilTest]
  tasks: [Task]
  applications: [Application]
  
  // Metadata
  createdAt: DateTime
  updatedAt: DateTime
}
```

## Observation Model

Observations represent the most flexible data type, capturing field conditions, crop status, and general notes.

```javascript
Observation {
  id: Integer (PK)
  fieldId: Integer (FK)
  userId: Integer (FK)
  
  // Core Content
  text: Text  // The raw, unstructured observation
  
  // AI-Extracted Structured Data (Optional)
  weatherConditions: JSON
  cropStage: String
  issuesDetected: [String]
  standingWater: Boolean
  soilConditions: String
  
  // Media
  photos: [String]  // File paths or URLs
  
  // Metadata
  observationDate: DateTime
  createdAt: DateTime
  updatedAt: DateTime
  
  // Relationships
  relatedTasks: [Task]
}
```

## Soil Test Model

Soil tests represent highly structured data that requires specific fields for analysis and comparison.

```javascript
SoilTest {
  id: Integer (PK)
  fieldId: Integer (FK)
  userId: Integer (FK)
  
  // Test Information
  testDate: DateTime
  labName: String
  sampleDepth: String
  sampleId: String
  
  // Soil Properties
  pH: Float
  organicMatter: Float
  cec: Float
  baseSaturation: Float
  
  // Nutrient Levels (ppm)
  nitrogen: Float
  phosphorus: Float
  potassium: Float
  calcium: Float
  magnesium: Float
  sulfur: Float
  zinc: Float
  manganese: Float
  boron: Float
  iron: Float
  copper: Float
  
  // Recommendations
  recommendations: Text
  
  // Attachments
  labReport: String  // File path or URL
  
  // Metadata
  createdAt: DateTime
  updatedAt: DateTime
}
```

## Task Model

Tasks represent actionable items that may be generated from observations or created directly.

```javascript
Task {
  id: Integer (PK)
  fieldId: Integer (FK)
  userId: Integer (FK)
  
  // Task Details
  title: String
  description: Text
  priority: Enum (Low, Medium, High)
  status: Enum (Pending, In Progress, Completed)
  
  // Scheduling
  dueDate: DateTime
  completedDate: DateTime
  
  // Categorization
  category: String  // Equipment, Field Work, Office, etc.
  
  // Relationships
  relatedObservations: [Observation]
  
  // Metadata
  createdAt: DateTime
  updatedAt: DateTime
}
```

## Application Record Model

Application records track inputs applied to fields, important for compliance and analysis.

```javascript
Application {
  id: Integer (PK)
  fieldId: Integer (FK)
  userId: Integer (FK)
  
  // Application Details
  applicationType: String  // Fertilizer, Herbicide, etc.
  productName: String
  rate: Float
  rateUnit: String
  totalAmount: Float
  
  // Timing
  applicationDate: DateTime
  
  // Conditions
  weatherConditions: JSON
  soilConditions: String
  
  // Equipment
  equipmentUsed: String
  
  // Metadata
  createdAt: DateTime
  updatedAt: DateTime
}
```

## Equipment Model

Equipment records track machinery and implements used on the farm.

```javascript
Equipment {
  id: Integer (PK)
  workspaceId: Integer (FK)
  
  // Basic Information
  name: String
  type: String
  make: String
  model: String
  year: Integer
  
  // Tracking
  purchaseDate: DateTime
  hoursOrMiles: Float
  
  // Maintenance
  lastServiceDate: DateTime
  nextServiceDue: DateTime
  maintenanceInterval: Float
  
  // Relationships
  maintenanceRecords: [MaintenanceRecord]
  
  // Metadata
  createdAt: DateTime
  updatedAt: DateTime
}
```

## Implementation Approach

### 1. AI-First Capture
- Allow users to enter observations in natural language
- AI extracts structured data from the text
- Store both the original text and the extracted data

Example:
```
User input: "Checked North 40 today. Standing water in NE corner, rest looks good. Corn at V3 stage, good color."

AI extraction:
{
  fieldId: "North 40",
  issuesDetected: ["Standing water"],
  issueLocation: "NE corner",
  cropStage: "V3",
  cropCondition: "good color"
}
```

### 2. Optional Form Enhancement
- AI identifies missing information and prompts for it
- "You mentioned standing water. How much of the field is affected?"
- Lightweight forms appear only when needed

### 3. Structured Forms for Critical Data
- Full forms for soil tests, application records
- Required fields for compliance and analysis
- Simplified UI with smart defaults and suggestions

## Integration with AnythingLLM

The agricultural data models will extend AnythingLLM's existing models:

1. **Workspace Extension**
   - Add farm-specific metadata to workspaces
   - Link fields to workspaces

2. **Document Enhancement**
   - Add agricultural document types
   - Enhance vectorization for farm terminology

3. **Chat Integration**
   - Enable field-specific queries
   - Support task creation from chat
   - Allow data entry through conversation 
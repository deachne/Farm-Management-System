# Field Test Integration

## Overview

This document outlines the integration of specialized field testing tools with our farm management system. Specifically, we focus on integrating two key testing applications:

1. **Microbiometer**: A soil microbial biomass measurement tool
2. **ATP Nutriscan**: A tissue analysis tool for nutrient levels

Both applications follow a similar workflow:
- Field sample collection
- Image capture of test results
- Cloud processing
- Report generation with visuals

Our integration strategy enables users to:
- Capture test results directly in our mobile app
- Import results from emails sent by these testing apps
- Process and analyze results with AnythingLLM
- View and compare results over time

## Integration Architecture

The integration follows this high-level architecture:

```
┌─────────────────────┐      ┌─────────────────────┐      ┌─────────────────────┐
│                     │      │                     │      │                     │
│  Field Test Apps    │─────▶│  Farm Management    │─────▶│    AnythingLLM      │
│  (External)         │      │  Mobile App (PWA)   │      │                     │
│                     │      │                     │      │                     │
└─────────────────────┘      └─────────────────────┘      └─────────────────────┘
         │                             │                            │
         │                             │                            │
         ▼                             ▼                            ▼
┌─────────────────────┐      ┌─────────────────────┐      ┌─────────────────────┐
│                     │      │                     │      │                     │
│  Email Results      │─────▶│  Local Storage      │─────▶│  Vector Database    │
│                     │      │  (IndexedDB)        │      │                     │
│                     │      │                     │      │                     │
└─────────────────────┘      └─────────────────────┘      └─────────────────────┘
```

## Integration Methods

### 1. Direct Camera Capture

Users can capture test results directly using our app's camera:

- Specialized UI with alignment guides for each test type
- Image optimization for field conditions
- Local storage for offline use
- Background sync when connectivity returns

### 2. Email Import

Results emailed from test apps can be imported:

- Email integration with permission-based access
- Parsing of structured data from emails
- Extraction of images and numerical results
- Association with specific fields and locations

### 3. Manual Entry

For situations where direct capture or email import isn't possible:

- Structured forms for manual data entry
- Validation against expected ranges
- Optional photo attachment

## Implementation Components

### Test Integration Manager

```javascript
// Test result integration manager
class TestIntegrationManager {
  constructor() {
    this.supportedTests = {
      'microbiometer': {
        name: 'Microbiometer',
        description: 'Soil microbial biomass measurement',
        resultTypes: ['image', 'numerical', 'report']
      },
      'atp-nutriscan': {
        name: 'ATP Nutriscan',
        description: 'Tissue analysis for nutrient levels',
        resultTypes: ['image', 'numerical', 'report']
      }
    };
  }
  
  // Launch external app or provide instructions
  launchTestApp(testType) {
    const testInfo = this.supportedTests[testType];
    
    if (!testInfo) {
      console.error(`Unsupported test type: ${testType}`);
      return false;
    }
    
    // Check if app is installed (if possible)
    if (this.isAppInstalled(testType)) {
      // Launch app via deep linking
      this.openAppWithDeepLink(testType);
    } else {
      // Show instructions for manual process
      this.showManualInstructions(testType);
    }
    
    return true;
  }
  
  // Import results from email or direct share
  async importTestResults(source, metadata) {
    switch (source) {
      case 'email':
        return await this.importFromEmail(metadata);
      case 'camera':
        return await this.importFromCamera(metadata);
      case 'file':
        return await this.importFromFile(metadata);
      default:
        console.error(`Unsupported import source: ${source}`);
        return null;
    }
  }
  
  // Process and store test results
  async processTestResults(results, fieldId, location) {
    // Create structured data from results
    const structuredData = this.parseTestResults(results);
    
    // Store in local database
    const storage = await getOfflineStorage();
    const id = await storage.saveTestResult({
      type: results.testType,
      fieldId: fieldId,
      location: location,
      timestamp: new Date().toISOString(),
      data: structuredData,
      rawData: results.rawData,
      images: results.images,
      synced: false
    });
    
    // If online, sync to server
    if (navigator.onLine) {
      const syncManager = new SyncManager(storage);
      await syncManager.syncTestResult(id);
    }
    
    return {
      success: true,
      id: id,
      data: structuredData
    };
  }
}
```

### Camera Integration for Test Capture

```javascript
// Add to CameraManager class
async captureTestResult(testType) {
  // Initialize camera if needed
  if (!this.stream) {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    
    if (!await this.initialize(video, canvas)) {
      return null;
    }
  }
  
  // Show specialized UI for test capture
  const imageData = await this.showTestCaptureUI(testType);
  
  if (!imageData) {
    return null;
  }
  
  // Process image based on test type
  return {
    testType: testType,
    image: imageData,
    timestamp: new Date().toISOString(),
    processed: false
  };
}

// Specialized UI for capturing test results
async showTestCaptureUI(testType) {
  return new Promise((resolve) => {
    // Create test capture UI
    const captureUI = document.createElement('div');
    captureUI.className = 'test-capture-ui';
    
    // Add video element with alignment guides
    const videoContainer = document.createElement('div');
    videoContainer.className = 'test-video-container';
    
    // Add alignment guides based on test type
    const guides = document.createElement('div');
    guides.className = `alignment-guides ${testType}`;
    videoContainer.appendChild(this.videoElement);
    videoContainer.appendChild(guides);
    captureUI.appendChild(videoContainer);
    
    // Add capture button
    const captureButton = document.createElement('button');
    captureButton.className = 'test-capture-button';
    captureButton.textContent = 'Capture Result';
    captureButton.addEventListener('click', async () => {
      const imageData = await this.captureAndOptimize();
      
      // Close UI
      this.stop();
      captureUI.remove();
      
      resolve(imageData);
    });
    captureUI.appendChild(captureButton);
    
    // Add cancel button
    const cancelButton = document.createElement('button');
    cancelButton.className = 'cancel-button';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
      this.stop();
      captureUI.remove();
      resolve(null);
    });
    captureUI.appendChild(cancelButton);
    
    // Add instructions
    const instructions = document.createElement('div');
    instructions.className = 'test-instructions';
    instructions.innerHTML = this.getTestInstructions(testType);
    captureUI.appendChild(instructions);
    
    // Add to document
    document.body.appendChild(captureUI);
  });
}
```

### Email Integration

```javascript
// Email integration for test results
class EmailIntegration {
  constructor() {
    this.emailPatterns = {
      'microbiometer': {
        subject: /Microbiometer Results/i,
        sender: /results@microbiometer.com/i
      },
      'atp-nutriscan': {
        subject: /ATP Nutriscan Report/i,
        sender: /reports@nutriscan.com/i
      }
    };
  }
  
  // Check if device has email access capability
  canAccessEmails() {
    // Check if running in a PWA context with permissions
    return 'Notification' in window && 
           'serviceWorker' in navigator &&
           'permissions' in navigator;
  }
  
  // Request email access permission
  async requestEmailAccess() {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }
  
  // Show email import UI
  showEmailImportUI() {
    return new Promise((resolve) => {
      // Create email import UI
      const importUI = document.createElement('div');
      importUI.className = 'email-import-ui';
      
      // Add instructions
      const instructions = document.createElement('div');
      instructions.className = 'email-instructions';
      instructions.innerHTML = `
        <h3>Import Test Results from Email</h3>
        <p>Please enter the email address where you received your test results:</p>
      `;
      importUI.appendChild(instructions);
      
      // Add email input
      const emailInput = document.createElement('input');
      emailInput.type = 'email';
      emailInput.placeholder = 'your@email.com';
      importUI.appendChild(emailInput);
      
      // Add import button
      const importButton = document.createElement('button');
      importButton.className = 'import-button';
      importButton.textContent = 'Check Emails';
      importButton.addEventListener('click', () => {
        const email = emailInput.value.trim();
        if (!email) {
          alert('Please enter a valid email address');
          return;
        }
        
        // Close UI
        importUI.remove();
        resolve(email);
      });
      importUI.appendChild(importButton);
      
      // Add cancel button
      const cancelButton = document.createElement('button');
      cancelButton.className = 'cancel-button';
      cancelButton.textContent = 'Cancel';
      cancelButton.addEventListener('click', () => {
        importUI.remove();
        resolve(null);
      });
      importUI.appendChild(cancelButton);
      
      // Add to document
      document.body.appendChild(importUI);
    });
  }
  
  // Process emails for test results (would require backend support)
  async processEmails(email) {
    // This would typically be handled by a backend service
    // For the PWA, we'd redirect to a server endpoint
    
    // Example implementation with backend API
    try {
      const response = await fetch('/api/email-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) {
        throw new Error('Failed to process emails');
      }
      
      const results = await response.json();
      return results;
    } catch (error) {
      console.error('Error processing emails:', error);
      return null;
    }
  }
}
```

### AnythingLLM Integration

```javascript
// AnythingLLM integration for test results
class TestResultProcessor {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }
  
  // Process test results with AnythingLLM
  async processWithAI(testResult) {
    try {
      // If offline, queue for later processing
      if (!navigator.onLine) {
        await this.queueForProcessing(testResult);
        return {
          success: true,
          status: 'queued',
          message: 'Test result will be processed when online'
        };
      }
      
      // Process with AnythingLLM
      const result = await this.apiClient.processTestResult({
        type: testResult.type,
        fieldId: testResult.fieldId,
        data: testResult.data,
        images: testResult.images.map(img => img.optimized),
        timestamp: testResult.timestamp
      });
      
      return {
        success: true,
        status: 'processed',
        insights: result.insights,
        recommendations: result.recommendations
      };
    } catch (error) {
      console.error('Error processing test result with AI:', error);
      
      // Queue for retry
      await this.queueForProcessing(testResult);
      
      return {
        success: false,
        status: 'error',
        message: error.message
      };
    }
  }
  
  // Queue for later processing
  async queueForProcessing(testResult) {
    const storage = await getOfflineStorage();
    await storage.addToProcessingQueue({
      type: 'test-result',
      data: testResult,
      timestamp: new Date().toISOString(),
      attempts: 0
    });
  }
  
  // Process image with vision model
  async processImageWithVision(imageData, testType) {
    try {
      // If offline, queue for later processing
      if (!navigator.onLine) {
        await this.queueImageForProcessing(imageData, testType);
        return {
          success: true,
          status: 'queued'
        };
      }
      
      // Process with vision model
      const result = await this.apiClient.processTestImage({
        image: imageData.optimized,
        testType: testType
      });
      
      return {
        success: true,
        status: 'processed',
        data: result.data
      };
    } catch (error) {
      console.error('Error processing image with vision model:', error);
      
      // Queue for retry
      await this.queueImageForProcessing(imageData, testType);
      
      return {
        success: false,
        status: 'error',
        message: error.message
      };
    }
  }
}
```

### User Interface Components

```javascript
// Test integration UI component
class TestIntegrationUI {
  constructor(testManager, cameraManager, emailIntegration) {
    this.testManager = testManager;
    this.cameraManager = cameraManager;
    this.emailIntegration = emailIntegration;
  }
  
  // Render test selection UI
  renderTestSelector(container) {
    container.innerHTML = '';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'test-header';
    header.innerHTML = `
      <h2>Field Test Integration</h2>
      <p>Select a test type to capture or import results</p>
    `;
    container.appendChild(header);
    
    // Create test options
    const options = document.createElement('div');
    options.className = 'test-options';
    
    // Add Microbiometer option
    const microbiometerOption = this.createTestOption(
      'microbiometer',
      'Microbiometer',
      'Soil microbial biomass measurement',
      'microbiometer-icon.png'
    );
    options.appendChild(microbiometerOption);
    
    // Add ATP Nutriscan option
    const nutriscanOption = this.createTestOption(
      'atp-nutriscan',
      'ATP Nutriscan',
      'Tissue analysis for nutrient levels',
      'nutriscan-icon.png'
    );
    options.appendChild(nutriscanOption);
    
    container.appendChild(options);
    
    // Create import section
    const importSection = document.createElement('div');
    importSection.className = 'import-section';
    importSection.innerHTML = `
      <h3>Import Existing Results</h3>
      <p>Import test results from email or files</p>
    `;
    
    // Add import buttons
    const importButtons = document.createElement('div');
    importButtons.className = 'import-buttons';
    
    // Email import button
    const emailButton = document.createElement('button');
    emailButton.className = 'email-import-button';
    emailButton.innerHTML = '<i class="email-icon"></i> Import from Email';
    emailButton.addEventListener('click', () => this.handleEmailImport());
    importButtons.appendChild(emailButton);
    
    // File import button
    const fileButton = document.createElement('button');
    fileButton.className = 'file-import-button';
    fileButton.innerHTML = '<i class="file-icon"></i> Import from File';
    fileButton.addEventListener('click', () => this.handleFileImport());
    importButtons.appendChild(fileButton);
    
    importSection.appendChild(importButtons);
    container.appendChild(importSection);
  }
}
```

## Data Models

### Test Result Model

```javascript
/**
 * Test Result Data Model
 * 
 * {
 *   id: string,                // Unique identifier
 *   type: string,              // 'microbiometer' or 'atp-nutriscan'
 *   fieldId: string,           // Associated field ID
 *   location: {                // GPS location
 *     latitude: number,
 *     longitude: number,
 *     accuracy: number
 *   },
 *   timestamp: string,         // ISO date string
 *   data: {                    // Structured test data
 *     // For Microbiometer
 *     microbialBiomass: number,
 *     organicMatter: number,
 *     microbeRatio: number,
 *     
 *     // For ATP Nutriscan
 *     nutrientLevels: {
 *       nitrogen: number,
 *       phosphorus: number,
 *       potassium: number,
 *       // Other nutrients...
 *     }
 *   },
 *   images: [{                 // Test result images
 *     original: string,        // Original image data URL
 *     optimized: string,       // Optimized image URL
 *     width: number,
 *     height: number,
 *     size: number
 *   }],
 *   synced: boolean,           // Whether synced to server
 *   insights: {                // AI-generated insights
 *     summary: string,
 *     recommendations: string[],
 *     comparisons: object
 *   }
 * }
 */
```

## Integration with AnythingLLM

The test results are integrated with AnythingLLM in several ways:

1. **Data Extraction**: AnythingLLM processes test result images to extract numerical data
2. **Contextual Analysis**: Results are analyzed in the context of:
   - Historical data for the same field
   - Seasonal patterns
   - Crop requirements
   - Recent field activities
3. **Recommendation Generation**: Based on test results, AnythingLLM generates:
   - Specific management recommendations
   - Explanations of results in plain language
   - Suggestions for follow-up actions
4. **Knowledge Integration**: Test results become part of the farm's knowledge base:
   - Vectorized for semantic search
   - Linked to relevant field observations
   - Incorporated into field history

## Implementation Plan

### Phase 1: Foundation (Weeks 1-2)

1. **Basic Integration Framework**
   - Implement test result data models
   - Create storage mechanisms for test data
   - Build basic UI components

2. **Camera Capture Implementation**
   - Develop specialized camera UI for test capture
   - Implement image optimization for test cards
   - Create basic result extraction

### Phase 2: Enhanced Features (Weeks 3-4)

1. **Email Integration**
   - Implement backend for email processing
   - Create email import UI
   - Build result extraction from emails

2. **AnythingLLM Integration**
   - Develop API endpoints for test processing
   - Implement vision model integration
   - Create recommendation generation

### Phase 3: Refinement (Weeks 5-6)

1. **Result Visualization**
   - Build visualization components for test results
   - Implement historical comparison views
   - Create field mapping of test locations

2. **Mobile Optimization**
   - Optimize for field use
   - Implement offline capabilities
   - Enhance touch interactions

## Conclusion

Integrating specialized field testing tools like Microbiometer and ATP Nutriscan with our farm management system provides significant value by:

1. **Centralizing Data**: All test results are stored in one system
2. **Providing Context**: Tests are associated with specific fields and locations
3. **Enabling Analysis**: AnythingLLM can analyze results in context
4. **Generating Insights**: AI-powered recommendations based on test results

This integration leverages our browser-based mobile app's capabilities while connecting with specialized testing tools, creating a comprehensive system for field data collection and analysis. 
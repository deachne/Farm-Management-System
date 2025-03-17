/**
 * Document Processing Example
 * 
 * This script demonstrates how to use the BizzyPerson document processing pipeline.
 */

const fs = require('fs');
const path = require('path');
const bizzy = require('../core');

/**
 * Process a text document
 */
async function processTextDocument() {
  try {
    console.log('Processing text document example...');
    
    // Create a sample text document
    const content = `# Field Observation Report
    
Date: 2023-03-15
Field: North Field
Crop: Corn
Growth Stage: V4

## Observations

The corn plants are showing good growth with an average height of 12 inches.
Some minor signs of nitrogen deficiency in the lower leaves.
No significant pest pressure observed.

## Recommendations

1. Apply 50 lbs/acre of nitrogen fertilizer within the next week.
2. Monitor for corn borer activity as plants enter V5 stage.
3. Schedule irrigation if no rainfall in the next 5 days.

## Notes

Soil moisture levels are adequate but beginning to decrease.
Weather forecast shows possibility of rain in 7-10 days.`;
    
    // Create document object
    const document = {
      id: 'example-doc-1',
      filename: 'field-observation.txt',
      buffer: Buffer.from(content),
      metadata: {
        source: 'example'
      }
    };
    
    // Initialize BizzyPerson platform
    await bizzy.initialize();
    
    // Process document
    const result = await bizzy.processDocument(document, 'example-workspace', 'farmer');
    
    // Print results
    console.log('\nDocument Processing Results:');
    console.log('---------------------------');
    console.log('Document Type:', result.document.type);
    console.log('Metadata:', JSON.stringify(result.metadata, null, 2));
    console.log('Number of Chunks:', result.chunks.length);
    console.log('Number of Vectors:', result.vectors.length);
    
    // Print agricultural context if available
    if (result.document.agriculturalContext) {
      console.log('\nAgricultural Context:');
      console.log('--------------------');
      console.log(JSON.stringify(result.document.agriculturalContext, null, 2));
    }
    
    // Print first chunk
    console.log('\nFirst Chunk:');
    console.log('-----------');
    console.log('Text:', result.chunks[0].text);
    console.log('Metadata:', JSON.stringify(result.chunks[0].metadata, null, 2));
    
    console.log('\nDocument processing example completed successfully!');
  } catch (error) {
    console.error('Error in document processing example:', error);
  }
}

/**
 * Process a soil test document
 */
async function processSoilTestDocument() {
  try {
    console.log('\nProcessing soil test document example...');
    
    // Create a sample soil test document
    const content = `SOIL TEST REPORT
    
Field: North Field
Sample Date: 2023-03-10
Lab: AgriTest Labs

RESULTS:

pH: 6.5
Organic Matter: 3.2%

Nutrients (ppm):
Nitrogen (N): 15
Phosphorus (P): 25
Potassium (K): 180
Calcium (Ca): 1500
Magnesium (Mg): 200
Sulfur (S): 12

Micronutrients (ppm):
Zinc (Zn): 2.5
Manganese (Mn): 15
Iron (Fe): 25
Copper (Cu): 1.2
Boron (B): 0.8

RECOMMENDATIONS:

Based on these results and your planned crop (Corn), we recommend:
- Nitrogen: 150 lbs/acre
- Phosphorus: 50 lbs/acre
- Potassium: 30 lbs/acre
- Consider lime application to raise pH slightly`;
    
    // Create document object
    const document = {
      id: 'example-doc-2',
      filename: 'soil-test-report.txt',
      buffer: Buffer.from(content),
      metadata: {
        source: 'example',
        type: 'soil_test'
      }
    };
    
    // Process document
    const result = await bizzy.processDocument(document, 'example-workspace', 'farmer');
    
    // Print results
    console.log('\nSoil Test Processing Results:');
    console.log('----------------------------');
    console.log('Document Type:', result.document.type);
    console.log('Metadata:', JSON.stringify(result.metadata, null, 2));
    
    // Print structured data if available
    if (result.document.structuredData) {
      console.log('\nStructured Soil Test Data:');
      console.log('------------------------');
      console.log(JSON.stringify(result.document.structuredData, null, 2));
    }
    
    console.log('\nSoil test document processing example completed successfully!');
  } catch (error) {
    console.error('Error in soil test document processing example:', error);
  }
}

/**
 * Run the examples
 */
async function runExamples() {
  try {
    // Process text document
    await processTextDocument();
    
    // Process soil test document
    await processSoilTestDocument();
    
    console.log('\nAll examples completed successfully!');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run the examples if this file is executed directly
if (require.main === module) {
  runExamples();
}

module.exports = {
  processTextDocument,
  processSoilTestDocument,
  runExamples
}; 
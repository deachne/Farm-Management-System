/**
 * Field Data Model
 * Represents a farm field with its properties and methods
 */

class Field {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.acres = data.acres || 0;
    this.location = data.location || { lat: 0, lng: 0 };
    this.boundaries = data.boundaries || [];
    this.soilType = data.soilType || '';
    this.currentCrop = data.currentCrop || null;
    this.cropHistory = data.cropHistory || [];
    this.soilTests = data.soilTests || [];
    this.notes = data.notes || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Calculate field perimeter in feet
  calculatePerimeter() {
    if (!this.boundaries || this.boundaries.length < 3) {
      return 0;
    }

    let perimeter = 0;
    for (let i = 0; i < this.boundaries.length; i++) {
      const point1 = this.boundaries[i];
      const point2 = this.boundaries[(i + 1) % this.boundaries.length];
      perimeter += this.calculateDistance(point1, point2);
    }

    return perimeter;
  }

  // Calculate distance between two points in feet
  calculateDistance(point1, point2) {
    const R = 20902231; // Earth radius in feet
    const dLat = this.toRadians(point2.lat - point1.lat);
    const dLng = this.toRadians(point2.lng - point1.lng);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(point1.lat)) * Math.cos(this.toRadians(point2.lat)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Convert degrees to radians
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Add a soil test to the field
  addSoilTest(soilTest) {
    this.soilTests.push({
      ...soilTest,
      date: soilTest.date || new Date()
    });
    this.updatedAt = new Date();
    return this;
  }

  // Add a note to the field
  addNote(note) {
    this.notes.push({
      text: note,
      date: new Date()
    });
    this.updatedAt = new Date();
    return this;
  }

  // Set the current crop
  setCurrentCrop(crop) {
    // Add the previous crop to history if it exists
    if (this.currentCrop) {
      this.cropHistory.push({
        crop: this.currentCrop,
        startDate: this.currentCrop.plantDate,
        endDate: new Date()
      });
    }

    this.currentCrop = {
      ...crop,
      plantDate: crop.plantDate || new Date()
    };
    this.updatedAt = new Date();
    return this;
  }

  // Get the most recent soil test
  getLatestSoilTest() {
    if (!this.soilTests.length) {
      return null;
    }
    
    return this.soilTests.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    )[0];
  }

  // Calculate estimated yield based on crop and field conditions
  calculateEstimatedYield() {
    if (!this.currentCrop) {
      return 0;
    }

    // This would be a more complex calculation in a real system
    // taking into account soil conditions, weather, etc.
    const baseYield = this.currentCrop.expectedYield || 0;
    const soilFactor = this.soilQualityFactor();
    
    return baseYield * soilFactor * this.acres;
  }

  // Calculate a soil quality factor based on soil tests
  soilQualityFactor() {
    const latestSoilTest = this.getLatestSoilTest();
    if (!latestSoilTest) {
      return 1.0; // Default factor
    }

    // This would be a more complex calculation in a real system
    // based on pH, nutrients, etc.
    return 1.0;
  }

  // Serialize the field to JSON
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      acres: this.acres,
      location: this.location,
      boundaries: this.boundaries,
      soilType: this.soilType,
      currentCrop: this.currentCrop,
      cropHistory: this.cropHistory,
      soilTests: this.soilTests,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// Field schema for validation
const fieldSchema = {
  type: 'object',
  required: ['name', 'acres'],
  properties: {
    id: { type: ['string', 'null'] },
    name: { type: 'string' },
    acres: { type: 'number', minimum: 0 },
    location: {
      type: 'object',
      properties: {
        lat: { type: 'number' },
        lng: { type: 'number' }
      }
    },
    boundaries: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          lat: { type: 'number' },
          lng: { type: 'number' }
        }
      }
    },
    soilType: { type: 'string' },
    currentCrop: { type: ['object', 'null'] },
    cropHistory: { type: 'array' },
    soilTests: { type: 'array' },
    notes: { type: 'array' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};

module.exports = {
  name: 'field',
  schema: fieldSchema,
  model: Field
}; 